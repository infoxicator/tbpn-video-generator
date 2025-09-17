import { useMemo } from "react";

type LanguageStrings = {
  imageUploadLabel: string;
  imageUploading: string;
  imageSelected: string;
  imageUploadInstruction: string;
  imageUploadSuccess: string;
  errorFailedToUpload: string;
  imageUploadError: string;
};

const defaultStrings: LanguageStrings = {
  imageUploadLabel: "Profile image",
  imageUploading: "Uploading image...",
  imageSelected: "Selected",
  imageUploadInstruction: "Drag and drop or click to choose an image",
  imageUploadSuccess: "Image uploaded successfully",
  errorFailedToUpload: "Failed to upload image",
  imageUploadError: "Image upload failed",
};

export function useLanguage() {
  const t = useMemo(() => defaultStrings, []);
  return { t };
}

export type { LanguageStrings };
