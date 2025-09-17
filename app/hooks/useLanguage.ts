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
  imageUploadLabel: "GLAMOUR SHOT",
  imageUploading: "POLISHING PIXELS...",
  imageSelected: "LOCKED IN",
  imageUploadInstruction: "DRAG A HEROIC HEADSHOT HERE OR CLICK TO BROWSE",
  imageUploadSuccess: "GLAM SHOT LANDED",
  errorFailedToUpload: "OUR UPLOAD GOBLINS TRIPPED—TRY AGAIN",
  imageUploadError: "THE GLAMOUR SHOT REFUSED TO UPLOAD",
};

export function useLanguage() {
  const t = useMemo(() => defaultStrings, []);
  return { t };
}

export type { LanguageStrings };
