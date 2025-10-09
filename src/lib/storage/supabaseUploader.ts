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
