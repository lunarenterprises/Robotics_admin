import React, { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Bot, X } from "lucide-react";
import Swal from "sweetalert2";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import {
  addRobot,
  deleteRobot,
  editRobot,
  listRobots,
} from "./roboticsService";

// Utility: fetch image URL -> File object
async function urlToFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

export default function Robots() {
  const [robots, setRobots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRobot, setEditingRobot] = useState(null);
  const [formData, setFormData] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]); // {id, src, file, isNew}
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    try {
      const { data } = await listRobots();
      const robotsArray = Array.isArray(data.list) ? data.list : [];

      const mappedRobots = robotsArray.map((r) => ({
        ...r,
        name: r.p_name,
        price: r.p_price,
        currency: r.currency || "",
        category: r.category || "pricing",
        industries: [],
        image: r.productimages?.[0]?.pi_image
          ? `https://lunarsenterprises.com:7001${r.productimages[0].pi_image}`
          : null,
      }));

      setRobots(mappedRobots);
    } catch (err) {
      console.error("Error fetching robots", err);
      setRobots([]);
    }
  };

  const filteredRobots = robots.filter((robot) => {
    const matchesSearch =
      robot.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (robot.industries || []).some((i) =>
        i.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesSearch;
  });

  const handleAdd = () => {
    setEditingRobot(null);
    setFormData({});
    setImagePreviews([]);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = async (robot) => {
    setEditingRobot(robot);
    setFormData({
      name: robot.p_name || "",
      rating: robot.p_rating || "",
      short_description: robot.p_short_descrption || "",
      description: robot.p_descrption || "",
      price: robot.p_price || "",
      discount_price: robot.p_discount_price || "",
      discount: robot.p_discount || "",
      highlights: robot.p_highlights || "",
      product_used_places: robot.p_product_used_places || "",
      dimensions: robot.p_dimensions || "",
      max_speed: robot.p_max_speed || "",
      battery_life: robot.p_battery_life || "",
      charging_time: robot.p_charging_time || "",
      sensors: robot.p_sensors || "",
      connectivity: robot.p_connectivity || "",
      material: robot.p_material || "",
      images: [],
    });

    // convert existing images into File objects
    const previews = await Promise.all(
      (robot.productimages || []).map(async (img, index) => {
        const url = `https://lunarsenterprises.com:7001${img.pi_image}`;
        const file = await urlToFile(url, `image_${img.pi_id}_${index}.jpg`);
        return {
          id: img.pi_id,
          src: url,
          file,
          isNew: false,
        };
      })
    );

    setImagePreviews(previews.length ? previews : []);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (p_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This robot will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteRobot(p_id);
        await fetchRobots();
        Swal.fire("Deleted!", "The robot has been deleted.", "success");
      } catch (err) {
        console.error("Delete failed", err);
        Swal.fire("Error!", "Failed to delete the robot.", "error");
      }
    }
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file) => ({
        id: null,
        src: URL.createObjectURL(file),
        file,
        isNew: true,
      }));
      setImagePreviews((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = "Name is required.";
    if (!formData.short_description?.trim())
      newErrors.short_description = "Short description is required.";
    if (!formData.description?.trim())
      newErrors.description = "Description is required.";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Valid price is required.";
    if (formData.discount_price && isNaN(formData.discount_price))
      newErrors.discount_price = "Discount price must be a number.";
    if (formData.rating && (isNaN(formData.rating) || formData.rating > 5))
      newErrors.rating = "Rating must be between 0 and 5.";
    if (imagePreviews.length === 0)
      newErrors.images = "At least one image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapToApiPayload = (data, p_id = null) => {
    const formDataToSend = new FormData();
    if (p_id) formDataToSend.append("p_id", String(p_id));

    // text fields
    formDataToSend.append("name", data.name || "");
    formDataToSend.append("rating", String(parseFloat(data.rating) || 0));
    formDataToSend.append("short_description", data.short_description || "");
    formDataToSend.append("description", data.description || "");
    formDataToSend.append("price", String(parseFloat(data.price) || 0));
    formDataToSend.append(
      "discount_price",
      String(parseFloat(data.discount_price) || 0)
    );
    formDataToSend.append("discount", data.discount || "");
    formDataToSend.append(
      "highlights",
      (data.highlights || "").split(",").map((s) => s.trim()).join(",")
    );
    formDataToSend.append(
      "product_used_places",
      (data.product_used_places || "").split(",").map((s) => s.trim()).join(",")
    );
    formDataToSend.append("dimensions", data.dimensions || "");
    formDataToSend.append("max_speed", data.max_speed || "");
    formDataToSend.append("battery_life", data.battery_life || "");
    formDataToSend.append("charging_time", data.charging_time || "");
    formDataToSend.append(
      "sensors",
      (data.sensors || "").split(",").map((s) => s.trim()).join(",")
    );
    formDataToSend.append("connectivity", data.connectivity || "");
    formDataToSend.append("material", data.material || "");

    // ✅ Send images: existing (id:binary) + new
    imagePreviews.forEach((img) => {
      if (img.isNew && img.file instanceof File) {
        formDataToSend.append("image", img.file);
      } else if (img.id && img.file instanceof File) {
        formDataToSend.append(img.id.toString(), img.file);
      }
    });

    return formDataToSend;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = mapToApiPayload(formData, editingRobot?.p_id);
      if (editingRobot) {
        await editRobot(payload);
        Swal.fire("Updated!", "Robot updated successfully!", "success");
      } else {
        await addRobot(payload);
        Swal.fire("Added!", "Robot added successfully!", "success");
      }
      setIsModalOpen(false);
      fetchRobots();
    } catch (err) {
      console.error("Save failed", err);
      Swal.fire("Error!", "Failed to save robot.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      pricing: "bg-green-100 text-green-800",
      quote: "bg-blue-100 text-blue-800",
      rental: "bg-purple-100 text-purple-800",
    };
    return badges[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Robots Management</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Robot
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search robots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRobots.map((robot) => (
          <div
            key={robot.p_id}
            className="bg-white rounded-lg shadow hover:shadow-md"
          >
            <img
              src={
                robot.productimages?.[0]?.pi_image
                  ? `https://lunarsenterprises.com:7001${robot.productimages[0].pi_image}`
                  : "/default-placeholder.png"
              }
              alt={robot.p_name}
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{robot.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadge(
                    robot.category
                  )}`}
                >
                  {robot.category}
                </span>
              </div>
              {robot.price && (
                <p className="text-lg font-semibold text-blue-600">
                  {robot.price} {robot.currency}
                </p>
              )}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleEdit(robot)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(robot.p_id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRobots.length === 0 && (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium">No robots found</h3>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRobot ? "Edit Robot" : "Add Robot"}
        size="lg"
      >
        <div className="space-y-4">
          {[
            { key: "name", label: "Name" },
            { key: "rating", label: "Rating" },
            { key: "short_description", label: "Short Description" },
            { key: "description", label: "Description" },
            { key: "price", label: "Price" },
            { key: "discount_price", label: "Discount Price" },
            { key: "discount", label: "Discount" },
            { key: "highlights", label: "Highlights (comma separated)" },
            { key: "product_used_places", label: "Used Places (comma separated)" },
            { key: "dimensions", label: "Dimensions" },
            { key: "max_speed", label: "Max Speed" },
            { key: "battery_life", label: "Battery Life" },
            { key: "charging_time", label: "Charging Time" },
            { key: "sensors", label: "Sensors (comma separated)" },
            { key: "connectivity", label: "Connectivity" },
            { key: "material", label: "Material" },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              <input
                type="text"
                value={formData[field.key] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field.key]: e.target.value })
                }
                className={`w-full px-3 py-2 border rounded-md ${
                  errors[field.key] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors[field.key] && (
                <p className="text-sm text-red-500 mt-1">{errors[field.key]}</p>
              )}
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.images ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.images && (
              <p className="text-sm text-red-500 mt-1">{errors.images}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              {imagePreviews.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.src}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                  {!img.isNew && (
                    <p className="absolute bottom-0 left-0 text-[10px] bg-gray-700 text-white px-1 rounded">
                      ID: {img.id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading
                ? "Saving..."
                : editingRobot
                ? "Update"
                : "Add"}{" "}
              Robot
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
