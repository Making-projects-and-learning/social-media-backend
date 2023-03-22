/** Libraries */
import cloudinary from "cloudinary";

const deleteImage = async (imageUrl: string): Promise<boolean> => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  const publicId = imageUrl.split("/").pop()?.split(".")[0];
  if (!publicId) return false;

  const { result } = await cloudinary.v2.uploader.destroy(publicId, {
    invalidate: true,
  });

  return result === "ok" ? true : false;
};

export { deleteImage };
