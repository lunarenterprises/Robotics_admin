import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import axios from "axios";
import Swal from "sweetalert2";

type Blog = {
  id: string;
  title: string;
  description: string;
  bl_category_tags:string;
  image: string;
  date?: string;
   file_type?: string;  
  status?: string;
};

export default function Behindscenes() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({});
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {


    const payload ={
      type:'behind_the_scenes'
    }
    try {
      const res = await axios.post(
        "https://lunarsenterprises.com:7001/robotics/list/blog",payload
      );
      if (res.data?.result && Array.isArray(res.data.list)) {
      const mapped: Blog[] = res.data.list.map((item: any) => ({
  id: String(item.bl_id),
  title: item.bl_title,
  description: item.bl_description,
  bl_category_tags: item.bl_category_tags,
  image: item.bl_image ? `https://lunarsenterprises.com:7001${item.bl_image}` : "",
  file_type: item.bl_file_type,   // <-- add this
  date: item.bl_date,
  status: item.bl_status,
}));

        setBlogs(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  const filtered = blogs.filter((b) =>
    `${b.title} `
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditing(null);
    setFormData({
      title: "",
      description: "",
      
      bl_category_tags:""
    });
    setFile(null);
    setPreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (b: Blog) => {
    setEditing(b);
    setFormData(b);
    setPreview(b.image || "");
    setFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This blog will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "https://lunarsenterprises.com:7001/robotics/delete/blog",
            { bl_id: id }
          );
          setBlogs((prev) => prev.filter((b) => b.id !== id));
          Swal.fire("Deleted!", "The blog has been deleted.", "success");
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error!", "Failed to delete blog.", "error");
        }
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async () => {
    if (!formData.title ) return;

    setLoading(true);
    const fd = new FormData();
    if (editing) fd.append("bl_id", editing.id);

     fd.append("type" ,"behind_the_scenes" || "");

    fd.append("title", formData.title!);
    fd.append("description", formData.description || "");
    fd.append("category_tags", formData.bl_category_tags || "");


    if (file) {
      fd.append("image", file);
    }

    try {
      if (editing) {
        await axios.post(
          "https://lunarsenterprises.com:7001/robotics/edit/blog",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          "https://lunarsenterprises.com:7001/robotics/add/blog",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      fetchBlogs();
      setIsModalOpen(false);
      setFile(null);
    } catch (err) {
      console.error("Error saving blog:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Behind scenes </h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Behind Scenes
        </Button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search Case Study..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category Tags</th>


              
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t">
          <td className="px-4 py-2">
  {b.file_type === "image" ? (
    <img
      src={b.image}
      alt={b.title}
      className="h-12 w-12 object-cover rounded border"
    />
  ) : b.file_type === "mp4" || b.file_type === "video" ? (
    <video
      src={b.image}
      className="h-12 w-12 object-cover rounded border"
      controls
    />
  ) : (
    <div className="h-12 w-12 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
      N/A
    </div>
  )}
</td>

                <td className="px-4 py-2">{b.title}</td>
                <td className="px-4 py-2">{b.bl_category_tags}</td>

                <td className="px-4 py-2 max-w-xs truncate">{b.description}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editing ? "Edit Behind Scenes" : "Add Behind Scenes"}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

               <input
            type="text"
            placeholder="Category Tags (Seperation with comma)"
            value={formData.bl_category_tags || ""}
            onChange={(e) =>
              setFormData({ ...formData, bl_category_tags: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <textarea
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          {/* <input
            type="text"
            placeholder="Client Name"
            value={formData.client_name || ""}
            onChange={(e) =>
              setFormData({ ...formData, client_name: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          /> */}
          {/* <input
            type="text"
            placeholder="Client Location"
            value={formData.client_location || ""}
            onChange={(e) =>
              setFormData({ ...formData, client_location: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          /> */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-full object-cover rounded"
            />
          )}

          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
