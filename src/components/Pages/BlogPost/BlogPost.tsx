import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";
import axios from "axios";
import Swal from "sweetalert2";

type BlogContent = {
  bc_id?: number; // existing content
  heading: string;
  content: string;
};

type Blog = {
  id: string;
  title: string;
  description: string;
  image: string;
  date?: string;
  status?: string;
  blog_contents?: BlogContent[];
  category_tags?: string;
};

export default function BlogPost() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<Partial<Blog>>({
    blog_contents: [{ heading: "", content: "" }],
    category_tags: "",
  });
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const payload = { type: "blog" };
    try {
      const res = await axios.post(
        "https://lunarsenterprises.com:7001/robotics/list/blog",
        payload
      );
      if (res.data?.result && Array.isArray(res.data.list)) {
        const mapped: Blog[] = res.data.list.map((item: any) => ({
          id: String(item.bl_id),
          title: item.bl_title,
          description: item.bl_description,
          image: item.bl_image
            ? `https://lunarsenterprises.com:7001${item.bl_image}`
            : "",
          date: item.bl_date,
          status: item.bl_status,
          category_tags: item.bl_category_tags || "",
          blog_contents: Array.isArray(item.blog_content)
            ? item.blog_content.map((bc: any) => ({
                bc_id: bc.bc_id,
                heading: bc.bc_heading,
                content: bc.bc_content,
              }))
            : [],
        }));
        setBlogs(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    }
  };

  const filtered = blogs.filter((b) =>
    `${b.title} `.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditing(null);
    setFormData({
      title: "",
      description: "",
      blog_contents: [{ heading: "", content: "" }],
      category_tags: "",
    });
    setFile(null);
    setPreview("");
    setIsModalOpen(true);
  };

  const handleEdit = (b: Blog) => {
    setEditing(b);
    setFormData({
      ...b,
      blog_contents: b.blog_contents || [{ heading: "", content: "" }],
      category_tags: b.category_tags || "",
    });
    setPreview(b.image || "");
    setFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteBlog = (id: string) => {
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

  const handleDeleteContent = async (idx: number, bc_id?: number) => {
    if (bc_id) {
      // Existing content, call API
      Swal.fire({
        title: "Are you sure?",
        text: "This section will be deleted permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.post(
              "https://lunarsenterprises.com:7001/robotics/delete/blog_content",
              { bc_id }
            );
            const updated = [...(formData.blog_contents || [])];
            updated.splice(idx, 1);
            setFormData({ ...formData, blog_contents: updated });
            Swal.fire("Deleted!", "Section deleted successfully.", "success");
          } catch (err) {
            console.error(err);
            Swal.fire("Error!", "Failed to delete section.", "error");
          }
        }
      });
    } else {
      // New section, remove locally
      const updated = [...(formData.blog_contents || [])];
      updated.splice(idx, 1);
      setFormData({ ...formData, blog_contents: updated });
    }
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
    if (!formData.title) return;
    if (!editing && !file) {
      Swal.fire(
        "Validation Error",
        "Image is required for new blogs.",
        "warning"
      );
      return;
    }

    setLoading(true);
    const fd = new FormData();
    if (editing) fd.append("bl_id", editing.id);

    fd.append("type", "blog");
    fd.append("title", formData.title!);
    fd.append("description", formData.description || "");
    fd.append("category_tags", formData.category_tags || "");

    fd.append("blog_contents", JSON.stringify(formData.blog_contents || []));

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
        <h1 className="text-2xl font-bold">Blog Post</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Blog Post
        </Button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search blogs..."
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
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-4 py-2">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="h-12 w-12 object-cover rounded border"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">{b.title}</td>
                <td className="px-4 py-2">{b.category_tags}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(b)}
                    className="p-1 text-gray-500 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(b.id)}
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
        title={editing ? "Edit Blog" : "Add Blog"}
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
          <textarea
            placeholder="Description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Category Tags"
            value={formData.category_tags || ""}
            onChange={(e) =>
              setFormData({ ...formData, category_tags: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          {/* Blog Contents */}
          <div className="space-y-3">
            <h3 className="font-semibold">Blog Contents</h3>
            {formData.blog_contents?.map((c, idx) => (
              <div
                key={idx}
                className="border p-3 rounded space-y-2 flex flex-col"
              >
                <div className="flex justify-between items-center">
                  <span>Section {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteContent(idx, c.bc_id)}
                    className="text-red-500 font-bold"
                  >
                    Delete
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Heading"
                  value={c.heading}
                  onChange={(e) => {
                    const updated = [...(formData.blog_contents || [])];
                    updated[idx].heading = e.target.value;
                    setFormData({ ...formData, blog_contents: updated });
                  }}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Content"
                  value={c.content}
                  onChange={(e) => {
                    const updated = [...(formData.blog_contents || [])];
                    updated[idx].content = e.target.value;
                    setFormData({ ...formData, blog_contents: updated });
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
            <Button
              onClick={() =>
                setFormData({
                  ...formData,
                  blog_contents: [
                    ...(formData.blog_contents || []),
                    { heading: "", content: "" },
                  ],
                })
              }
            >
              + Add Section
            </Button>
          </div>

          {/* Image Upload */}
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
