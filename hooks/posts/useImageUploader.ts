import { useUploadThing } from "@/utils/uploadthing";

export function useImageUploader() {
  const { startUpload, isUploading } = useUploadThing("storyImageUploader");

  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const res = await startUpload(files);
      return (res ?? []).map((f: any) => f.url);
    } catch (error) {
      console.error("Upload failed", error);
      return [];
    }
  };

  return {
    uploadImages,
    isUploading,
  };
}
