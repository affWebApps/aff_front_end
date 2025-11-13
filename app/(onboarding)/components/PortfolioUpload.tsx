import React, { useState, useRef } from "react";
import {  X, Edit2 } from "lucide-react";
import Image from "next/image";

interface PortfolioUploadProps {
  title: string;
  subtitle: string;
  maxImages?: number;
  onFilesChange?: (files: File[]) => void;
}

export const PortfolioUpload: React.FC<PortfolioUploadProps> = ({
  title,
  subtitle,
  maxImages = 3,
  onFilesChange,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setError(`Invalid file type: ${file.name}`);
      return false;
    }

    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      setError(`File too large: ${file.name}. Max size is 5MB`);
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setError("");
    const fileArray = Array.from(files);

    if (uploadedFiles.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = fileArray.filter((file) => validateFile(file));

    if (validFiles.length === 0) return;

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));

    const updatedFiles = [...uploadedFiles, ...validFiles];
    const updatedPreviews = [...previewUrls, ...newPreviewUrls];

    setUploadedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);

    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDelete = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);

    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);

    setUploadedFiles(updatedFiles);
    setPreviewUrls(updatedPreviews);
    setError("");

    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  const handleEdit = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];

        if (!validateFile(file)) return;

        URL.revokeObjectURL(previewUrls[index]);

        const newPreviewUrl = URL.createObjectURL(file);

        const updatedFiles = [...uploadedFiles];
        const updatedPreviews = [...previewUrls];

        updatedFiles[index] = file;
        updatedPreviews[index] = newPreviewUrl;

        setUploadedFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);
        setError("");

        if (onFilesChange) {
          onFilesChange(updatedFiles);
        }
      }
    };
    input.click();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSlotClick = (index: number) => {
    if (previewUrls[index]) return; 
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="header-large mb-3">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Image Upload
          </h3>
          <p className="text-sm text-gray-600">
            1–{maxImages} images (JPG, PNG) Max 5MB each.
          </p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`border-2 border-dashed rounded-xl p-12 text-center bg-white transition-colors cursor-pointer mb-6 ${
            dragActive
              ? "border-[#FAB75B] bg-[#FAB75B]/5"
              : "border-gray-300 hover:border-[#FAB75B]"
          }`}
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">

                <Image
                  src="/icons/upload-icon.svg"
                  alt="Upload icon"
                  width={40}
                  height={40}
                  className="mx-auto mb-2"
                />          </div>
          <p className="text-gray-600 mb-1">Drop your image here</p>
          <p className="text-gray-600">or</p>
          <p className="text-[#8B6F47] font-medium">Browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {[...Array(maxImages)].map((_, idx) => (
            <div
              key={idx}
              className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-[#FAB75B] transition-colors relative overflow-hidden group"
              onClick={() => !previewUrls[idx] && handleSlotClick(idx)}
            >
              {previewUrls[idx] ? (
                <>
                  <Image
                    src={previewUrls[idx]}
                    alt={`Portfolio ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(idx);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Edit image"
                    >
                      <Edit2 size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(idx);
                      }}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="Delete image"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                </>
              ) : (
                <span className="text-gray-400 text-4xl">+</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
