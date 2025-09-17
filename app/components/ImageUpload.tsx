import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

type ImageUploadProps = {
  onFileSelect: (file: File | null) => void;
  onImageUploaded: (imageUrl: string | null) => void;
  selectedFile: File | null;
  initialImageUrl?: string | null;
  onUploadingChange?: (isUploading: boolean) => void;
  disabled?: boolean;
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  onImageUploaded,
  selectedFile,
  initialImageUrl,
  onUploadingChange,
  disabled,
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(initialImageUrl ?? null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  // Keep the parent informed about upload state changes
  const updateUploadingState = useCallback(
    (value: boolean) => {
      setIsUploading(value);
      onUploadingChange?.(value);
    },
    [onUploadingChange]
  );

  // Maintain a stable preview URL for the selected file
  useEffect(() => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setLocalPreviewUrl(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }

    setLocalPreviewUrl(null);
    return undefined;
  }, [selectedFile]);

  useEffect(() => {
    setUploadedImageUrl(initialImageUrl ?? null);
  }, [initialImageUrl]);

  const clearFileSelection = useCallback(() => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onFileSelect]);

  const resetState = useCallback(() => {
    setUploadedImageUrl(null);
    onImageUploaded(null);
  }, [onImageUploaded]);

  const uploadFile = useCallback(
    async (file: File) => {
      updateUploadingState(true);
      setUploadError(null);
      setUploadedImageUrl(null);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("https://imageplustexttoimage.mcp-ui-flows-nanobanana.workers.dev/api/upload", {
          method: "POST",
          body: formData,
        });

        const payload = await response
          .json()
          .catch(() => ({}) as { error?: string; imageUrl?: string; success?: boolean });

        if (!response.ok) {
          const errorMessage = (payload as { error?: string }).error ?? t.errorFailedToUpload;
          throw new Error(errorMessage);
        }

        const data = payload as { imageUrl?: string; success?: boolean };
        if (!data.imageUrl) {
          throw new Error(t.errorFailedToUpload);
        }

        setUploadedImageUrl(data.imageUrl);
        onImageUploaded(data.imageUrl);
      } catch (error) {
        const fallback = error instanceof Error ? error.message : t.imageUploadError;
        setUploadError(fallback);
        resetState();
        clearFileSelection();
      } finally {
        updateUploadingState(false);
      }
    },
    [clearFileSelection, onImageUploaded, resetState, t.errorFailedToUpload, t.imageUploadError, updateUploadingState]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || isUploading) return;
      const file = event.currentTarget.files?.[0] ?? null;
      onFileSelect(file);

      if (file) {
        void uploadFile(file);
      } else {
        resetState();
        setUploadError(null);
      }
    },
    [disabled, isUploading, onFileSelect, resetState, uploadFile]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    if (disabled || isUploading) return;
    event.preventDefault();
  }, [disabled, isUploading]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      if (disabled || isUploading) return;
      event.preventDefault();
      const file = event.dataTransfer.files?.[0] ?? null;

      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
        void uploadFile(file);

        if (fileInputRef.current) {
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInputRef.current.files = dt.files;
        }
      }
    },
    [disabled, isUploading, onFileSelect, uploadFile]
  );

  const statusMessage = useMemo(() => {
    if (isUploading) {
      return `${t.imageUploading}`;
    }
    if (selectedFile) {
      return `${t.imageSelected}: ${selectedFile.name}`;
    }
    return t.imageUploadInstruction;
  }, [isUploading, selectedFile, t.imageSelected, t.imageUploadInstruction, t.imageUploading]);

  const isBusy = disabled || isUploading;

  return (
    <div>
      <div
        className={`border border-dashed border-unfocused-border-color rounded-geist p-geist text-sm transition-colors duration-150 ease-in-out bg-background text-foreground ${
          isBusy ? "opacity-70" : "hover:border-focused-border-color"
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label className="cursor-pointer block" htmlFor="imageFile">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="text-2xl">📁</div>
            <p>{statusMessage}</p>
            {isUploading ? <div className="text-xs text-subtitle">{t.imageUploading}</div> : null}
            {uploadError ? <div className="text-xs text-red-500">{uploadError}</div> : null}
            {uploadedImageUrl ? (
              <div className="text-xs text-green-600">{t.imageUploadSuccess}</div>
            ) : null}
          </div>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="imageFile"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isBusy}
        />
      </div>
      {localPreviewUrl ? (
        <div className="mt-3">
          <img src={localPreviewUrl} alt="Preview" className="max-h-48 rounded-geist object-cover" />
        </div>
      ) : null}
      {!localPreviewUrl && uploadedImageUrl ? (
        <div className="mt-3">
          <img src={uploadedImageUrl} alt="Uploaded preview" className="max-h-48 rounded-geist object-cover" />
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;
