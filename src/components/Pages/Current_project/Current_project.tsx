import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";


import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import { deleteProject, listProjects } from "../roboticsService";

export default function CurrentProjects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
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
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name || "",
      intro: project.intro || "",
      pre_version: project.pre_version || "",
      pre_dimension: project.pre_dimension || "",
      pre_functionality: project.pre_functionality || "",
      new_version: project.new_version || "",
      new_dimension: project.new_dimension || "",
      new_functionality: project.new_functionality || "",
      current_progress: project.current_progress || "",
      project_process: project.project_process || "",
      service: project.service || "",
      our_robot_include: project.our_robot_include || "",
      requirement: project.requirement || "",
      feature: project.feature || "",
    });
    setImagePreviews(
      project.image
        ? [{ src: `https://lunarsenterprises.com:7001${project.image}`, file: null }]
        : []
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

  const mapToFormData = (data, cp_id = null) => {
    const fd = new FormData();
    if (cp_id) fd.append("cp_id", cp_id);

    Object.entries(data).forEach(([k, v]) => fd.append(k, v || ""));
    if (imagePreviews[0]?.file) {
      fd.append("image", imagePreviews[0].file);
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
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div key={p.cp_id} className="bg-white shadow rounded-lg p-4">
            <img
              src={p.image ? `https://lunarsenterprises.com:7001${p.image}` : "/default-placeholder.png"}
              alt={p.name}
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="text-lg font-semibold mt-2">{p.name}</h3>
            <p className="text-sm text-gray-600">{p.intro}</p>
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
        title={editingProject ? "Edit Project" : "Add Project"}
        size="lg"
      >
        <div className="space-y-4">
          {[
            "name","intro","pre_version","pre_dimension","pre_functionality",
            "new_version","new_dimension","new_functionality",
            "current_progress","project_process","service",
            "our_robot_include","requirement","feature"
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">{field}</label>
              <input
                type="text"
                value={formData[field] || ""}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
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
                <img src={imagePreviews[0].src} alt="Preview" className="w-32 h-32 object-cover rounded" />
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

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : editingProject ? "Update" : "Add"} Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
