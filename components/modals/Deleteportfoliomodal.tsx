"use client";
import React, { useState } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/Button";
import { AlertCircle, Trash2 } from "lucide-react";
import { portfolioService, Portfolio } from "@/services/portfolioService";

interface DeletePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio | null;
  onDeleted?: () => void;
}

export default function DeletePortfolioModal({
  isOpen,
  onClose,
  portfolio,
  onDeleted,
}: DeletePortfolioModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!portfolio) return;

    setIsDeleting(true);
    setError(null);

    try {
      await portfolioService.deletePortfolio();

      console.log("✅ Portfolio deleted successfully");

      if (onDeleted) {
        await onDeleted();
      }

      onClose();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to delete portfolio:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete portfolio. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!portfolio) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Portfolio"
      subtitle="This action cannot be undone"
      maxWidth="sm"
    >
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>

          <p className="text-center text-gray-700 mb-2">
            Are you sure you want to delete this portfolio?
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-900 mb-1">
              {portfolio.title}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2">
              {portfolio.description}
            </p>
            {portfolio.Image && portfolio.Image.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {portfolio.Image.length} image
                {portfolio.Image.length !== 1 ? "s" : ""} will be deleted
              </p>
            )}
          </div>

          <p className="text-sm text-gray-600 text-center">
            This will permanently delete this portfolio and all its images.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            size="large"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="large"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isDeleting ? "Deleting..." : "Delete Portfolio"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}
