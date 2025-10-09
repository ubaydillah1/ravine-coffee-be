import { BadRequestError } from "../../utils/errors.js";
import supabase from "../supabase.js";

export const uploadToSupabase = async (
  file: Express.Multer.File,
  bucket: string
) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.buffer, { contentType: file.mimetype });

  if (error) throw new BadRequestError(error.message);

  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicData.publicUrl;
};

export const deleteFromSupabase = async (
  imageUrl: string,
  bucket: string
): Promise<void> => {
  try {
    if (!imageUrl) return;

    const encodedFileName = imageUrl.split("/").pop();
    if (!encodedFileName) return;

    const fileName = decodeURIComponent(encodedFileName);

    const { error } = await supabase.storage.from(bucket).remove([fileName]);
    if (error) {
      console.error("Delete error:", error.message);
    }
  } catch (err) {
    console.error("Error removing file:", err);
  }
};
