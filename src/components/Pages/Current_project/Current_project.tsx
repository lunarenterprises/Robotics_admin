import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";

import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import { addProject, deleteProject, editProject, listProjects } from "../roboticsService";

export default function CurrentProjects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await listProjects();
      setProjects(Array.isArray(data.list) ? data.list : []);
    } catch (err) {
      console.error("Fetch error", err);
      setProjects([]);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({});
    setImagePreviews([]);
    setNewImage(null);
    setNewImagePreview(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.cp_name || "",
      intro: project.cp_intro || "",
      pre_version: project.cp_pre_version || "",
      pre_dimension: project.cp_pre_dimension || "",
      pre_functionality: project.cp_pre_functionality || "",
      new_version: project.cp_New_version || "",
      new_dimension: project.cp_new_dimension || "",
      new_functionality: project.cp_new_functionality || "",
      current_progress: project.cp_current_progress || "",
      project_process: project.cp_process || "",
      service: project.cp_service || "",
      our_robot_include: project.cp_our_robot_include || "",
      requirement: project.cp_requirement || "",
      feature: project.cp_feature || "",
    });
    setImagePreviews(
      project.cp_image
        ? [{ src: `https://lunarsenterprises.com:7001${project.cp_image}`, file: null }]
        : []
    );
    setNewImage(null);
    setNewImagePreview(
      project.cp_new_image ? `https://lunarsenterprises.com:7001${project.cp_new_image}` : null
    );
    setIsModalOpen(true);
  };

  const handleDelete = async (cp_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      try {
        await deleteProject(cp_id);
        await fetchProjects();
        Swal.fire("Deleted!", "Project deleted successfully!", "success");
      } catch {
        Swal.fire("Error!", "Delete failed", "error");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files?.length) {
      const file = files[0];
      setImagePreviews([{ src: URL.createObjectURL(file), file }]);
    }
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const mapToFormData = (data, cp_id = null) => {
    const fd = new FormData();
    if (cp_id) fd.append("cp_id", cp_id);

    Object.entries(data).forEach(([k, v]) => fd.append(k, v || ""));

    if (imagePreviews[0]?.file) {
      fd.append("image", imagePreviews[0].file); // old image
    }
    if (newImage) {
      fd.append("newproject", newImage); // new image
    }

    return fd;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = mapToFormData(formData, editingProject?.cp_id);
      if (editingProject) {
        await editProject(payload);
        Swal.fire("Updated!", "Project updated successfully!", "success");
      } else {
        await addProject(payload);
        Swal.fire("Added!", "Project added successfully!", "success");
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Save error", err);
      Swal.fire("Error!", "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Current Projects</h1>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" /> Add Current Project
        </Button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.cp_id} className="bg-white shadow rounded-lg p-4">
            <img
              src={
                p.cp_image
                  ? `https://lunarsenterprises.com:7001${p.cp_image}`
                  : "/default-placeholder.png"
              }
              alt={p.cp_name}
              className="h-40 w-full object-cover rounded"
            />
            {p.cp_new_image && (
              <img
                src={`https://lunarsenterprises.com:7001${p.cp_new_image}`}
                alt="New"
                className="h-40 w-full object-cover rounded mt-2"
              />
            )}
            <h3 className="text-lg font-semibold mt-2">{p.cp_name}</h3>
            <p className="text-sm text-gray-600">{p.cp_intro}</p>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => handleEdit(p)} className="text-blue-600">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(p.cp_id)} className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? "Edit Project" : "Add Current Project"}
        size="lg"
      >
        <div className="space-y-4">
          {[
            { key: "name", label: "Name" },
            { key: "intro", label: "Intro" },
            { key: "pre_version", label: "Pre version" },
            { key: "pre_dimension", label: "Pre dimension" },
            { key: "pre_functionality", label: "Pre functionality" },
            { key: "new_version", label: "New version" },
            { key: "new_dimension", label: "New dimension" },
            { key: "new_functionality", label: "New functionality" },
            { key: "current_progress", label: "Current progress" },
            { key: "project_process", label: "Project process" },
            { key: "service", label: "Service" },
            { key: "our_robot_include", label: "Our robot include" },
            { key: "requirement", label: "Requirement" },
            { key: "feature", label: "Feature" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <input
                type="text"
                value={formData[field.key] || ""}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}

          {/* Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreviews[0] && (
              <div className="mt-2 relative">
                <img
                  src={imagePreviews[0].src}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setImagePreviews([])}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* New Image */}
          <div>
            <label className="block text-sm font-medium mb-1">New Image</label>
            <input type="file" accept="image/*" onChange={handleNewImageChange} />
            {newImagePreview && (
              <div className="mt-2 relative">
                <img
                  src={newImagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setNewImage(null);
                    setNewImagePreview(null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : editingProject ? "Update" : "Add"} Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
