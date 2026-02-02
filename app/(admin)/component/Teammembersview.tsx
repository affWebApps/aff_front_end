/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, ArrowLeft, Save, Plus, User } from "lucide-react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  created_at: string;
}

const TeamMembersView = () => {
  const [currentView, setCurrentView] = useState<"list" | "create" | "edit">(
    "list"
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "HOSELITA IKOLI",
      role: "President and CEO",
      imageUrl: "/team/hoselita.jpg",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "SAMUEL IKOLI",
      role: "CTO and Managing Director",
      imageUrl: "/team/samuel.jpg",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "ANGEL IKOLI",
      role: "Managing Director",
      imageUrl: "/team/angel.jpg",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "MIETEI IKOLI",
      role: "Managing Director",
      imageUrl: "/team/mietei.jpg",
      created_at: new Date().toISOString(),
    },
  ]);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    imageUrl: "",
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    memberId: "",
    memberName: "",
  });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCardClick = (memberId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member) {
      setCurrentMember(member);
      setFormData({
        name: member.name,
        role: member.role,
        imageUrl: member.imageUrl,
      });
      setCurrentView("edit");
    }
  };

  const handleBack = () => {
    setCurrentView("list");
    setCurrentMember(null);
  };

  const handleCreateNew = () => {
    setFormData({
      name: "",
      role: "",
      imageUrl: "",
    });
    setCurrentMember(null);
    setCurrentView("create");
  };

  const handleSave = async () => {
    try {
      if (currentView === "create") {
        const newMember: TeamMember = {
          id: Date.now().toString(),
          name: formData.name,
          role: formData.role,
          imageUrl: formData.imageUrl,
          created_at: new Date().toISOString(),
        };
        setTeamMembers([...teamMembers, newMember]);
        showSnackbar("Team member added successfully!", "success");
      } else if (currentView === "edit" && currentMember) {
        setTeamMembers(
          teamMembers.map((member) =>
            member.id === currentMember.id ? { ...member, ...formData } : member
          )
        );
        showSnackbar("Team member updated successfully!", "success");
      }

      handleBack();
    } catch (error) {
      console.error("Save failed:", error);
      showSnackbar("Failed to save team member. Please try again.", "error");
    }
  };

  const handleDelete = (memberId: string, memberName: string) => {
    setDeleteModal({ open: true, memberId, memberName });
  };

  const confirmDelete = () => {
    try {
      setTeamMembers(teamMembers.filter((m) => m.id !== deleteModal.memberId));
      showSnackbar("Team member deleted successfully!", "success");
      setDeleteModal({ open: false, memberId: "", memberName: "" });
    } catch (error) {
      console.error("Delete failed:", error);
      showSnackbar("Failed to delete team member. Please try again.", "error");
      setDeleteModal({ open: false, memberId: "", memberName: "" });
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, memberId: "", memberName: "" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === "list" ? (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>

              <div className="flex justify-between items-center mb-8">
                <div>
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-medium text-gray-900 mb-1"
                  >
                    Team Members
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-gray-600 text-sm"
                  >
                    Manage your team profiles and roles
                  </motion.p>
                </div>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateNew}
                  className="px-6 py-2.5 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Member
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer shadow-sm"
                    onClick={() => handleCardClick(member.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={40} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {member.role}
                      </p>
                      <div className="flex gap-2 justify-center w-full pt-4 border-t border-gray-100">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(member.id);
                          }}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(member.id, member.name);
                          }}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 size={18} className="text-gray-600" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm"
            >
              <div className="p-6 border-b border-gray-200">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back to Team Members</span>
                </button>

                <h2 className="text-2xl font-bold text-gray-900">
                  {currentView === "create"
                    ? "Add New Team Member"
                    : "Edit Team Member"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {currentView === "create"
                    ? "Fill in the details to add a new team member"
                    : "Update the team member information"}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter full name..."
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Position *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="e.g., Managing Director, CTO..."
                  />
                </div>

                {/* Profile Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="Enter image URL..."
                  />
                  {formData.imageUrl && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Preview:</p>
                      <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBack}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={!formData.name || !formData.role}
                    className="px-6 py-2.5 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {currentView === "create" ? "Add Member" : "Update Member"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModal.open}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
          Delete Team Member
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to remove{" "}
            <strong>&quot;{deleteModal.memberName}&quot;</strong> from the team?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              color: "gray",
              borderColor: "#d1d5db",
              "&:hover": {
                borderColor: "#9ca3af",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              backgroundColor: "#ef4444",
              "&:hover": {
                backgroundColor: "#dc2626",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TeamMembersView;
