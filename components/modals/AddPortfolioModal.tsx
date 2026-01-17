/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/Button";
import { X, Upload, Star, AlertCircle } from "lucide-react";
import { portfolioService, Portfolio } from "@/services/portfolioService";
import { usePortfolioStore } from "@/store/portfolioStore";

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMode?: boolean;
  portfolioToEdit?: Portfolio | null;
  onSaved?: () => void;
}

interface ImagePreview {
  id?: string;
  file?: File;
  preview: string;
  isPrimary: boolean;
  isExisting: boolean;
}

export default function AddPortfolioModal({
  isOpen,
  onClose,
  editMode = false,
  portfolioToEdit = null,
  onSaved,
}: AddPortfolioModalProps) {
  const { fetchPortfolio } = usePortfolioStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && editMode && portfolioToEdit) {
      setTitle(portfolioToEdit.title);
      setDescription(portfolioToEdit.description);

      const existingImages: ImagePreview[] =
        portfolioToEdit.Image?.map((img) => ({
          id: img.id,
          preview: img.image_url,
          isPrimary: img.is_primary,
          isExisting: true,
        })) || [];

      setImages(existingImages);
      setImagesToDelete([]);
    }
  }, [isOpen, editMode, portfolioToEdit]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImagePreview[] = Array.from(files).map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && index === 0,
      isExisting: false,
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];

    if (imageToRemove.isExisting && imageToRemove.id) {
      setImagesToDelete([...imagesToDelete, imageToRemove.id]);
    }

    const newImages = images.filter((_, i) => i !== index);

    if (imageToRemove.isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }

    setImages(newImages);
  };

  const setPrimaryImage = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please enter a project title");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a project description");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let portfolioId: string;

      if (editMode && portfolioToEdit) {
        // UPDATE MODE
        console.log("Updating portfolio:", portfolioToEdit.id);

        // Update portfolio details
        await portfolioService.updatePortfolio(portfolioToEdit.id, {
          title: title.trim(),
          description: description.trim(),
        });

        portfolioId = portfolioToEdit.id;

        // Delete marked images
        for (const imageId of imagesToDelete) {
          await portfolioService.deletePortfolioImage(imageId);
        }

        console.log("Portfolio updated successfully");
      } else {
        // CREATE MODE
        console.log("Creating new portfolio");

        const portfolioData = await portfolioService.createPortfolio({
          title: title.trim(),
          description: description.trim(),
        });

        portfolioId = portfolioData.id;
        console.log("Portfolio created:", portfolioData);
      }

      // Upload new images (only those with file property)
      const newImages = images.filter((img) => img.file);
      for (const image of newImages) {
        await portfolioService.uploadPortfolioImage(
          portfolioId,
          image.file!,
          image.isPrimary
        );
      }

      console.log("All images processed successfully");

      if (onSaved) {
        await onSaved();
      } else {
        await fetchPortfolio();
        resetForm();
        onClose();
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to save portfolio:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          `Failed to ${
            editMode ? "update" : "create"
          } portfolio. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImages([]);
    setImagesToDelete([]);
    setError(null);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={editMode ? "Edit portfolio" : "Add new portfolio"}
      subtitle={
        editMode
          ? "Update your portfolio information"
          : "All fields are required unless otherwise indicated"
      }
      maxWidth="md"
    >
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project title
          </label>
          <input
            type="text"
            placeholder="Enter a quick title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] disabled:bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project description
          </label>
          <textarea
            placeholder="Briefly describe the project"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] resize-none disabled:bg-gray-100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Upload{" "}
            <span className="text-gray-400 text-xs">(PNG, JPG or SVG)</span>
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Drop your image here</p>
              <label className="text-sm text-[#FAB75B] font-medium cursor-pointer hover:text-amber-600">
                Browse
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {images.map((image, idx) => (
                <div key={idx} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.preview}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    onClick={() => removeImage(idx)}
                    disabled={isSubmitting}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-[#FAB75B] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Primary
                    </div>
                  )}

                  {!image.isPrimary && (
                    <button
                      onClick={() => setPrimaryImage(idx)}
                      disabled={isSubmitting}
                      className="absolute bottom-2 left-2 right-2 bg-white/90 text-gray-700 text-xs py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      Set as Primary
                    </button>
                  )}

                  {image.isExisting && (
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                      Saved
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {imagesToDelete.length > 0 && (
            <p className="text-xs text-red-600 mt-2">
              {imagesToDelete.length} image(s) will be deleted
            </p>
          )}
        </div>

        <Button
          variant="default"
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting
            ? editMode
              ? "Updating..."
              : "Publishing..."
            : editMode
            ? "Update Portfolio"
            : "Publish"}
        </Button>
      </div>
    </BaseModal>
  );
}
