"use client";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { Badge } from "@/components/ui";
import { toast } from "sonner";
import AdminGuard from "@/components/Admin/AdminGuard";
import TestimonialModal from "@/components/Admin/TestimonialModal";
import { AdminService } from "@/services/adminService";
import { TestimonialsResponse } from "@/types";
import { Trash2 } from "lucide-react";
import DeleteConfirmModal from "@/components/common/DeleteDialogModal";

export default function AdminTestimonialsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialsResponse[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<TestimonialsResponse | null>(null);
  const [selectedTestimonialId, setSelectedTestimonialId] =
    useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await AdminService.getAllTestimonials();
      setTestimonials(res.data.results || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedTestimonial(null);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await AdminService.deleteTestimonial(id);
      setTestimonials(testimonials.filter((e) => e.reference_id !== id));
      toast.success("Event deleted!");
    } catch (error) {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedTestimonialId("");
    }
  };

  const handleAddNew = () => {
    setSelectedTestimonial(null);
    setOpenModal(true);
  };

  const handleEdit = (testimonial: TestimonialsResponse) => {
    setSelectedTestimonial(testimonial);
    setOpenModal(true);
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedTestimonial) {
        await AdminService.patchTestimonial(
          selectedTestimonial.reference_id,
          data,
        );
        toast.success("Testimonial Updated!");
      } else {
        await AdminService.createTestimonial(data);
        toast.success("Testimonial Created!");
      }
      handleClose();
      fetchTestimonials();
    } catch (error) {
      toast.error("Failed to save event. Please try again.");
    }
  };

  const handlePublishUnpublish = async (data: TestimonialsResponse) => {
    try {
      await AdminService.patchTestimonial(data.reference_id, {
        ...data,
        is_active: !data.is_active,
      });
      toast.success(
        `Testimonial status changed to ${!data.is_active ? "Published" : "Draft"}`,
      );
      fetchTestimonials()
    } catch (err) {
      toast.error("Error changing status of testimonial. Try Again!");
    }
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1">
          <div
            className="bg-white border-b px-8 py-4 sticky top-0 z-10"
            style={{ borderColor: "var(--gray-100)" }}
          >
            <h2 className="font-bold text-lg" style={{ color: "var(--navy)" }}>
              Testimonials Manager
            </h2>
          </div>
          <div className="p-8">
            <div
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
              style={{ borderColor: "var(--gray-100)" }}
            >
              <div
                className="px-5 py-4 border-b flex justify-between items-center"
                style={{ borderColor: "var(--gray-100)" }}
              >
                <h3
                  className="font-bold text-sm"
                  style={{ color: "var(--navy)" }}
                >
                  All Testimonials ({testimonials.length})
                </h3>
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-(--blue) text-white cursor-pointer hover:bg-blue-800/80 transition-all"
                >
                  + Add Testimonial
                </button>
              </div>
              {testimonials.length === 0 ? (
                <>
                  <p className="text-lg flex justify-center p-2">
                    No Data to show. Add Testimonials to view here !
                  </p>
                </>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "var(--gray-50)" }}>
                      {["Name", "Role", "Preview", "Status", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wider"
                            style={{ color: "var(--gray-400)" }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((t) => (
                      <tr
                        key={t.reference_id}
                        className="border-t hover:bg-gray-50 transition-colors"
                        style={{ borderColor: "var(--gray-100)" }}
                      >
                        <td
                          className="px-5 py-3 font-medium whitespace-nowrap"
                          style={{ color: "var(--text)" }}
                        >
                          {t.name}
                        </td>
                        <td
                          className="px-5 py-3"
                          style={{ color: "var(--gray-600)" }}
                        >
                          {t.role}
                        </td>
                        <td
                          className="px-5 py-3"
                          style={{
                            color: "var(--gray-600)",
                            maxWidth: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.message}
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant={t.is_active ? "green" : "yellow"}>
                            {t.is_active ? "Pushblished" : "Draft"}
                          </Badge>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <button
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-50 cursor-pointer"
                              style={{
                                borderColor: "var(--sky)",
                                color: "var(--sky)",
                              }}
                              onClick={() => handlePublishUnpublish(t)}
                            >
                              {t.is_active ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              onClick={() => handleEdit(t)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all hover:bg-blue-800/70 cursor-pointer"
                              style={{
                                borderColor: "var(--gray-200)",
                                color: "var(--gray-800)",
                              }}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                setSelectedTestimonialId(t.reference_id);
                                setShowDeleteModal(true);
                              }}
                              className="px-2 py-1.5 rounded-lg border transition-all hover:bg-red-700/50 cursor-pointer"
                            >
                              {" "}
                              <Trash2 className="w-6 h-6" />{" "}
                            </button>

                            <DeleteConfirmModal
                              isOpen={showDeleteModal}
                              onClose={() => setShowDeleteModal(false)}
                              onConfirm={() =>
                                handleDelete(selectedTestimonialId)
                              }
                              title="Confirm Deletion"
                              description={`Are you sure you want to delete the testimonial of "${t.name}"? This action cannot be undone.`}
                              isLoading={loading}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {openModal && (
            <TestimonialModal
              isOpen={openModal}
              onClose={handleClose}
              onSave={handleSave}
              testimonial={selectedTestimonial}
            />
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
