import React, { useState, useRef } from "react";
import { X, Edit2 } from "lucide-react";
import Image from "next/image";

interface FileUploadProps {
  label: string;
  optional?: boolean;
  supportedFormats?: string;
  maxFiles?: number;
  onFilesChange?: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  optional = false,
  supportedFormats = "PNG, JPEG, JPG",
  maxFiles = 3,
  onFilesChange,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setError("");
    const fileArray = Array.from(files);

    if (uploadedFiles.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      return;
    }

    const validFiles = fileArray.filter((file) => {
      const isValid = file.type.startsWith("image/");
      if (!isValid) {
        setError(`Invalid file type: ${file.name}`);
      }
      return isValid;
    });

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

        if (!file.type.startsWith("image/")) {
          setError("Invalid file type");
          return;
        }

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

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {optional && <span className="text-gray-400"> (Optional)</span>}
      </label>

      {uploadedFiles.length === 0 ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`border-2 border-dashed rounded-xl p-8 text-center bg-white transition-colors cursor-pointer ${
            dragActive
              ? "border-[#FAB75B] bg-[#FAB75B]/5"
              : "border-gray-300 hover:border-[#FAB75B]"
          }`}
        >
          <Image
            src="/icons/upload-icon.svg"
            alt="Upload icon"
            width={40}
            height={40}
            className="mx-auto mb-2"
          />{" "}
          <p className="text-sm text-gray-600">
            Drop your image here, or{" "}
            <span className="text-[#FAB75B] font-medium">Browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Supports {supportedFormats}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square border-2 border-gray-300 rounded-xl overflow-hidden bg-white group"
              >
                {" "}
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Edit image"
                  >
                    <Edit2 size={16} className="text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    title="Delete image"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {uploadedFiles.length < maxFiles && (
            <div
              onClick={handleBrowseClick}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-white hover:border-[#FAB75B] transition-colors cursor-pointer"
            >
              <Image
                src="/icons/upload-icon.svg"
                alt="Upload icon"
                width={40}
                height={40}
                className="mx-auto mb-2"
              />{" "}
              <p className="text-xs text-gray-600">
                <span className="text-[#FAB75B] font-medium">Add more</span> (
                {uploadedFiles.length}/{maxFiles})
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};
