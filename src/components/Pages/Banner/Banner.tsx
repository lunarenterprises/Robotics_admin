import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";
import Button from "../../UI/Button";
import Modal from "../../UI/Modal";




export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{ image?: File; video?: File }>({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch banners list
// Update Banner type
type Banner = {
  id: string;
  image?: string;
  video?: string;
  text:string;
};

  const bannerTypes = [
    { value: "home", label: "Home Page Banner" },
    { value: "ProductandServiceBanner", label: "Product and Service Banner" },
   
  ];

// Fetch banners list
const fetchBanners = async () => {
  setLoading(true);
  try {
    const res = await axios.post(
      "https://lunarsenterprises.com:7001/robotics/list/banner"
    );

    if (res.data?.result && Array.isArray(res.data.list)) {
      const mapped = res.data.list.map((item: any) => ({
        id: String(item.b_id),
        image:
          item.b_type === "image"
            ? `https://lunarsenterprises.com:7001${item.b_file}`
            : undefined,
        video:
          item.b_type === "video"
            ? `https://lunarsenterprises.com:7001${item.b_file}`
            : undefined,
      }));
      setBanners(mapped);
    } else {
      setBanners([]);
    }
  } catch (err) {
    console.error("Error fetching banners:", err);
    Swal.fire("Error", "Failed to load banners", "error");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchBanners();
  }, []);

  // Add banner
  const handleSave = async () => {
    if (!formData.image && !formData.video) {
      Swal.fire("Error", "Please upload an image or video", "error");
      return;
    }

    const payload = new FormData();
    if (formData.image) payload.append("image", formData.image);
    if (formData.video) payload.append("video", formData.video);
  payload.append("page_name", formData.type);
    setSubmitting(true);
    try {
      await axios.post(
        "https://lunarsenterprises.com:7001/robotics/add/banner",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Swal.fire("Success", "Banner added successfully", "success");
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      console.error("Add banner error:", err);
      Swal.fire("Error", "Failed to add banner", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete banner
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the banner",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "https://lunarsenterprises.com:7001/robotics/delete/banner",
            { banner_id: id }
          );
          Swal.fire("Deleted!", "The banner has been deleted.", "success");
          fetchBanners();
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire("Error", "Failed to delete banner", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Banners Management</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Loader */}
      {loading ? (
        <p className="text-center text-gray-500">Loading banners...</p>
      ) : banners.length === 0 ? (
        <p className="text-center text-gray-500">No banners found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-lg shadow p-2 relative"
            >
              {banner.image && (
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-full h-48 object-cover rounded"
                />
              )}
              {banner.video && (
                <video
                  src={banner.video}
                  controls
                  className="w-full h-48 object-cover rounded"
                />
              )}

              <button
                onClick={() => handleDelete(banner.id)}
                className="absolute top-5 right-5 p-1 bg-white rounded-full shadow hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Banner"
        size="md"
      >
        <div className="space-y-4">

             <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banner Type
            </label>
            <select
              value={formData.type || ""}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">-- Select Banner Type --</option>
              {bannerTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.files?.[0] })
              }
              className="w-full border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setFormData({ ...formData, video: e.target.files?.[0] })
              }
              className="w-full border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : "Add Banner"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
