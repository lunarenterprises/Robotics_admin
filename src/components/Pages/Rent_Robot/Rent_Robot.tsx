import React, { useState, useEffect } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import Modal from "../../UI/Modal";
import Button from "../../UI/Button";

export default function Rent_Robot() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingContact, setViewingContact] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(20); // Number of contacts per page

  const BASE_URL = "https://lunarsenterprises.com:7001/robotics";

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/list/rent`);
      if (res.data?.result) {
        setContacts(res.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  // Delete contact
  const handleDelete = async (rn_id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This Rent Quote will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.post(`${BASE_URL}/delete/rent`, { rn_id });
          if (res.data?.result) {
            Swal.fire("Deleted!", "Rent Quote has been deleted.", "success");
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
      (c.rn_name?.toLowerCase() || "").includes(search) ||
      (c.rn_email?.toLowerCase() || "").includes(search) ||
      (c.rn_mobile?.toString() || "").includes(search) ||
      (c.rn_message?.toLowerCase() || "").includes(search)
    );
  });

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rent Quote Messages</h1>
        <p className="text-gray-500">Total: {contacts.length}</p>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search Rent Quote..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
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
                  Robot Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentContacts.map((contact) => (
                <tr key={contact.rn_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-nowrap">
                    {contact.rn_name} {contact.c_last_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.rn_email}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.p_name}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.rn_mobile}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium flex justify-end space-x-2">
                    <button
                      onClick={() => handleView(contact)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact.rn_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentContacts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    No Rent Quote found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-1 mt-4">
          {/* Previous button */}
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            &laquo;
          </button>

          {/* Page numbers with ellipsis */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }
            return null;
          })}

          {/* Next button */}
          <button
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            &raquo;
          </button>
        </div>
      )}

      {/* View Modal */}
      {viewingContact && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Rent Quote Details"
          size="lg"
        >
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {viewingContact.rn_name}{" "}
              {viewingContact.c_last_name}
            </p>
            <p>
              <strong>Email:</strong> {viewingContact.rn_email}
            </p>

            <p>
              <strong>Robot:</strong> {viewingContact.p_name}
            </p>

            <p>
              <strong>Phone:</strong> {viewingContact.rn_mobile}
            </p>
            <p>
              <strong>Quantity:</strong> {viewingContact.rn_quantity}
            </p>
            <p>
              <strong>Purpose:</strong> {viewingContact.rn_purpose}
            </p>
            <p>
              <strong>Message:</strong> {viewingContact.rn_message}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
