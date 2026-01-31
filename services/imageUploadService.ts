/* eslint-disable @typescript-eslint/no-explicit-any */
// services/imageUploadService.ts
import { uploadFileToSupabase } from "@/lib/storageService";

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "uploads";

// ============================================
// TYPES & INTERFACES
// ============================================

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface ImageUploadOptions {
  file: File;
  folder?: string;
  onProgress?: (status: UploadStatus) => void;
}

export interface ImageUploadResult {
  publicUrl: string;
  path: string;
}

export interface MultipleImageUploadOptions {
  file: File;
  metadata?: Record<string, any>;
}

export interface MultipleImageUploadResult {
  publicUrl: string;
  path: string;
  metadata?: Record<string, any>;
}

// ============================================
// IMAGE UPLOAD SERVICE
// ============================================

export const imageUploadService = {
  /**
   * Upload a single image (for avatars, profile pictures, etc.)
   * Uploads immediately when called
   * @param options - Upload configuration
   * @returns Upload result with public URL and path
   */
  uploadSingleImage: async ({
    file,
    folder = "public",
    onProgress,
  }: ImageUploadOptions): Promise<ImageUploadResult> => {
    try {
      console.log(`📤 Uploading single image: ${file.name}`);
      onProgress?.("uploading");

      const result = await uploadFileToSupabase({
        file,
        bucket: bucketName,
        folder,
      });

      if (!result.publicUrl) {
        throw new Error("Upload succeeded but no public URL returned");
      }

      console.log(`✅ Image uploaded successfully: ${result.publicUrl}`);
      onProgress?.("success");

      return {
        publicUrl: result.publicUrl,
        path: result.path,
      };
    } catch (error) {
      console.error(`❌ Failed to upload image: ${file.name}`, error);
      onProgress?.("error");
      throw new Error(
        `Failed to upload ${file.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  /**
   * Upload multiple images in batch (for portfolio, galleries, etc.)
   * Uploads all images sequentially when called
   * @param images - Array of images with optional metadata
   * @param folder - Folder path in storage bucket
   * @param onProgress - Progress callback with index and status
   * @returns Array of upload results with metadata
   */
  uploadMultipleImages: async (
    images: MultipleImageUploadOptions[],
    folder: string = "public",
    onProgress?: (index: number, status: UploadStatus) => void
  ): Promise<MultipleImageUploadResult[]> => {
    const uploadedImages: MultipleImageUploadResult[] = [];

    console.log(`📤 Uploading ${images.length} images...`);

    for (let i = 0; i < images.length; i++) {
      const { file, metadata } = images[i];

      try {
        console.log(
          `⬆️ Uploading image ${i + 1}/${images.length}: ${file.name}`
        );
        onProgress?.(i, "uploading");

        const result = await uploadFileToSupabase({
          file,
          bucket: bucketName,
          folder,
        });

        if (!result.publicUrl) {
          throw new Error("Upload succeeded but no public URL returned");
        }

        uploadedImages.push({
          publicUrl: result.publicUrl,
          path: result.path,
          metadata,
        });

        console.log(`✅ Image ${i + 1} uploaded: ${result.publicUrl}`);
        onProgress?.(i, "success");
      } catch (error) {
        console.error(
          `❌ Failed to upload image ${i + 1}: ${file.name}`,
          error
        );
        onProgress?.(i, "error");
        throw new Error(
          `Failed to upload ${file.name}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    console.log(`✅ All ${uploadedImages.length} images uploaded successfully`);
    return uploadedImages;
  },

  /**
   * Validate image file before upload
   * @param file - File to validate
   * @param maxSizeMB - Maximum file size in MB (default: 5MB)
   * @returns Validation result
   */
  validateImage: (
    file: File,
    maxSizeMB: number = 5
  ): { valid: boolean; error?: string } => {
    // Check file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          "Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG are allowed.",
      };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit.`,
      };
    }

    return { valid: true };
  },

  /**
   * Validate multiple images
   * @param files - Files to validate
   * @param maxSizeMB - Maximum file size in MB (default: 5MB)
   * @returns Object with valid files and errors
   */
  validateMultipleImages: (
    files: File[],
    maxSizeMB: number = 5
  ): {
    validFiles: File[];
    errors: { file: string; error: string }[];
  } => {
    const validFiles: File[] = [];
    const errors: { file: string; error: string }[] = [];

    files.forEach((file) => {
      const validation = imageUploadService.validateImage(file, maxSizeMB);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push({
          file: file.name,
          error: validation.error || "Unknown error",
        });
      }
    });

    return { validFiles, errors };
  },
};
