import { getSupabaseClient } from "./supabaseClient";

type UploadParams = {
  file: File;
  bucket?: string;
  folder?: string;
};

export type UploadResult = {
  path: string;
  publicUrl: string | null;
};

const defaultBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "public";

export const uploadFileToSupabase = async ({
  file,
  bucket = defaultBucket,
  folder,
}: UploadParams): Promise<UploadResult> => {
  const supabase = getSupabaseClient();

  const sanitizedName = file.name.replace(/\s+/g, "-");
  const uniqueName = `${Date.now()}-${sanitizedName}`;
  const objectPath = folder ? `${folder}/${uniqueName}` : uniqueName;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error", {
      bucket,
      objectPath,
      name: error.name,
      message: error.message,
      statusCode: (error as any)?.statusCode,
      cause: (error as any)?.cause,
    });
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(objectPath);
  console.log({
    path: objectPath,
    publicUrl: publicUrlData?.publicUrl ?? null,
  })
  return {
    path: objectPath,
    publicUrl: publicUrlData?.publicUrl ?? null,
  };
};
