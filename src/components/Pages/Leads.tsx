import React, { useState, useEffect } from "react";
import { Search, Eye, Trash2, Mail, Phone } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

export default function ContactUsList() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingContact, setViewingContact] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const BASE_URL = "https://lunarsenterprises.com:7001/robotics";

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/list/contactus`);
      if (res.data?.result) {
        setContacts(res.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Delete contact
  const handleDelete = async (c_id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This contact will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(`${BASE_URL}/delete/contactus`, {
            c_id,
          });
          if (res.data?.result) {
            Swal.fire("Deleted!", "Contact has been deleted.", "success");
            fetchContacts();
          } else {
            Swal.fire("Error", res.data?.message || "Delete failed", "error");
          }
        } catch (err) {
          Swal.fire("Error", "Something went wrong", "error");
        }
      }
    });
  };

  // View details
  const handleView = (contact: any) => {
    setViewingContact(contact);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.c_first_name.toLowerCase().includes(search) ||
      c.c_last_name.toLowerCase().includes(search) ||
      c.c_email.toLowerCase().includes(search) ||
      c.c_phone.toString().includes(search) ||
      c.c_message.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact Us Messages</h1>
        <p className="text-gray-500">Total: {contacts.length}</p>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.c_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-nowrap">
                    {contact.c_first_name} {contact.c_last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.c_email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.c_phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                    {contact.c_message}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex justify-end space-x-2">
                    <button
                      onClick={() => handleView(contact)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.c_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewingContact && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Contact Details"
          size="lg"
        >
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {viewingContact.c_first_name}{" "}
              {viewingContact.c_last_name}
            </p>
            <p>
              <strong>Email:</strong> {viewingContact.c_email}
            </p>
            <p>
              <strong>Phone:</strong> {viewingContact.c_phone}
            </p>
            <p>
              <strong>Message:</strong> {viewingContact.c_message}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
              <Button variant="primary" className="ml-2">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
