import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import axios from "axios";
import Swal from "sweetalert2";

type Testimonial = {
  id: string;
  name: string;
  company: string;
  rating: number;
  description: string;
  image: string;
};

function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // loader state

  // Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.post(
        "https://lunarsenterprises.com:7001/robotics/list/testimonial"
      );
      if (res.data?.result && Array.isArray(res.data.list)) {
        const mapped: Testimonial[] = res.data.list.map((item: any) => ({
          id: String(item.t_id),
          name: item.t_name,
          company: item.t_company,
          rating: item.t_rating,
          description: item.t_description,
          image: item.t_image
            ? `https://lunarsenterprises.com:7001${item.t_image}`
            : "",
        }));
        setTestimonials(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    }
  };

  const filtered = testimonials.filter((t) =>
    `${t.name} ${t.company}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditing(null);
    setFormData({
      name: "",
      company: "",
      rating: 0,
      description: "",
      image: "",
    });
    setFile(null);
    setPreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setFormData(t);
    setPreview(t.image || "");
    setFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "https://lunarsenterprises.com:7001/robotics/delete/testimonial",
            { testimonial_id: id }
          );
          setTestimonials((prev) => prev.filter((t) => t.id !== id));
          Swal.fire("Deleted!", "The testimonial has been deleted.", "success");
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error!", "Failed to delete testimonial.", "error");
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
    if (!formData.name || !formData.company) return;

    setLoading(true); // start loader

    const fd = new FormData();
    fd.append("name", formData.name!);
    fd.append("company", formData.company!);
    fd.append("rating", String(formData.rating!));
    fd.append("description", formData.description || "");
    if (file) {
      fd.append("image", file);
    }

    try {
      if (editing) {
        fd.append("t_id", editing.id);
        await axios.post(
          "https://lunarsenterprises.com:7001/robotics/edit/testimonial",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          "https://lunarsenterprises.com:7001/robotics/add/testimonial",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      fetchTestimonials();
      setIsModalOpen(false);
      setFile(null);
      window.location.reload();

    } catch (err) {
      console.error("Error saving testimonial:", err);
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* List */}
    {/* List */}
<div className="overflow-x-auto">
  <table className="min-w-full bg-white border rounded shadow">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-4 py-2 text-left">Image</th>
        <th className="px-4 py-2 text-left">Name</th>
        <th className="px-4 py-2 text-left">Company</th>
        <th className="px-4 py-2 text-left">Rating</th>
        <th className="px-4 py-2 text-left">Description</th>
        <th className="px-4 py-2 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((t) => (
        <tr key={t.id} className="border-t">
          <td className="px-4 py-2">
            {t.image ? (
              <img
                src={t.image}
                alt={t.name}
                className="h-12 w-12 object-cover rounded-full border"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                N/A
              </div>
            )}
          </td>
     <td className="px-4 py-2 whitespace-nowrap">{t.name}</td>

          <td className="px-4 py-2 whitespace-nowrap truncate">{t.company}</td>
          <td className="px-4 py-2 whitespace-nowrap text-center">⭐ {t.rating}</td>
          <td className="px-4 py-2 max-w-xs truncate">{t.description}</td>
          <td className="px-4 py-2 text-right space-x-2">
            <button
              onClick={() => handleEdit(t)}
              className="p-1 text-gray-500 hover:text-blue-600"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(t.id)}
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
        title={editing ? "Edit Testimonial" : "Add Testimonial"}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Company"
            value={formData.company || ""}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={formData.rating || ""}
            min={1}
            max={5}
            onChange={(e) =>
              setFormData({ ...formData, rating: Number(e.target.value) })
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

export default Testimonials;
