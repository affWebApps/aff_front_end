"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  useTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
} from "@/hooks/useTeamMembers";
import { TeamMember, CreateTeamMemberData, UpdateTeamMemberData } from "@/services/teamMemberService";
import { imageUploadService } from "@/services/imageUploadService";

interface UsersViewProps {
  onBack: () => void;
}

const EMPTY_FORM: CreateTeamMemberData = {
  name: "",
  role: "",
  bio: "",
  photoUrl: "",
  displayOrder: 0,
  isActive: true,
};

export default function UsersView({ onBack }: UsersViewProps) {
  const { data: raw = [], isLoading, isError } = useTeamMembers();
  const members = [...raw].sort((a, b) => a.display_order - b.display_order);
  const createMember = useCreateTeamMember();
  const updateMember = useUpdateTeamMember();
  const deleteMember = useDeleteTeamMember();

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<CreateTeamMemberData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setPhotoUploadError("");
    setShowModal(true);
  };

  const openEdit = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio ?? "",
      photoUrl: member.photo_url ?? "",
      displayOrder: member.display_order,
      isActive: member.is_active,
    });
    setFormError("");
    setPhotoUploadError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setPhotoUploadError("");
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploadError("");

    const validation = imageUploadService.validateImage(file);
    if (!validation.valid) {
      setPhotoUploadError(validation.error || "Invalid image file.");
      return;
    }

    try {
      setPhotoUploading(true);
      const { publicUrl } = await imageUploadService.uploadSingleImage({
        file,
        folder: "public/team",
      });
      setForm((f) => ({ ...f, photoUrl: publicUrl }));
    } catch (err: unknown) {
      setPhotoUploadError(
        err instanceof Error ? err.message : "Failed to upload photo. Please try again."
      );
    } finally {
      setPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    let payload: CreateTeamMemberData | UpdateTeamMemberData;

    if (editingMember) {
      const diff: UpdateTeamMemberData = {};
      if (form.name !== editingMember.name) diff.name = form.name;
      if (form.role !== editingMember.role) diff.role = form.role;
      if ((form.bio || undefined) !== (editingMember.bio ?? undefined)) diff.bio = form.bio || undefined;
      if ((form.photoUrl || undefined) !== (editingMember.photo_url ?? undefined)) diff.photoUrl = form.photoUrl || undefined;
      if (form.displayOrder !== editingMember.display_order) diff.displayOrder = form.displayOrder;
      if (form.isActive !== editingMember.is_active) diff.isActive = form.isActive;
      payload = diff;
    } else {
      payload = {
        ...form,
        bio: form.bio || undefined,
        photoUrl: form.photoUrl || undefined,
      };
    }

    try {
      if (editingMember) {
        await updateMember.mutateAsync({ id: editingMember.id, data: payload });
      } else {
        await createMember.mutateAsync(payload as CreateTeamMemberData);
      }
      closeModal();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (status === 409) {
        setFormError("A team member with this name already exists.");
      } else {
        setFormError(message || "Something went wrong. Please try again.");
      }
    }
  };

  const handleDelete = async (member: TeamMember) => {
    if (!window.confirm(`Remove ${member.name} from the team?`)) return;
    await deleteMember.mutateAsync(member.id);
  };

  const isPending = createMember.isPending || updateMember.isPending;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 font-montserrat">Team Members</h1>
              <p className="text-gray-600">Manage your team profiles and roles</p>
            </div>
            <button
              onClick={openAdd}
              className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span>
              Add Member
            </button>
          </div>
        </div>

        {/* States */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-r-transparent" />
          </div>
        )}

        {isError && (
          <p className="text-center text-red-500 py-10">Failed to load team members.</p>
        )}

        {/* Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                      {member.photo_url ? (
                        <Image
                          src={member.photo_url}
                          alt={member.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-600">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-5 h-5 border-2 border-white rounded-full ${member.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center mb-1">
                  <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <p className="text-xs text-gray-400 mt-1">Order: {member.display_order}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100 mt-3">
                  <button
                    onClick={() => openEdit(member)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    disabled={deleteMember.isPending}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}

            {members.length === 0 && (
              <p className="col-span-4 text-center text-gray-400 py-10">No team members yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-5">
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Full name"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <input
                  required
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. Lead Designer"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  placeholder="Short bio (optional)"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                    {photoUploading ? (
                      <div className="w-5 h-5 animate-spin rounded-full border-2 border-amber-400 border-r-transparent" />
                    ) : form.photoUrl ? (
                      <Image
                        src={form.photoUrl}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                      </svg>
                    )}
                  </div>

                  {/* Picker button */}
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-colors ${photoUploading
                        ? "opacity-50 cursor-not-allowed bg-gray-50 text-gray-400"
                        : "hover:bg-gray-50 text-gray-700"
                        }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {photoUploading ? "Uploading…" : form.photoUrl ? "Change photo" : "Upload photo"}
                    </label>
                    <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, GIF, SVG · max 5 MB</p>
                  </div>
                </div>

                {photoUploadError && (
                  <p className="text-xs text-red-600 mt-2">{photoUploadError}</p>
                )}
              </div>

              {/* Display Order + Active */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="flex items-end pb-2 gap-2">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-amber-400"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || photoUploading}
                  className="flex-1 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white rounded-lg transition-colors font-medium disabled:opacity-60"
                >
                  {isPending ? "Saving…" : editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
