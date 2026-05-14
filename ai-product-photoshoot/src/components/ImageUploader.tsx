import React, { useCallback, useRef, useState } from "react";
import { CloseIcon, UploadIcon } from "./icons";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onClear: () => void;
  imagePreviewUrl: string | null;
  imageMeta?: { width: number; height: number; sizeKb: number } | null;
}

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = ["image/png", "image/jpeg", "image/webp"];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  onClear,
  imagePreviewUrl,
  imageMeta,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const acceptFile = useCallback(
    (file: File) => {
      setLocalError(null);
      if (!ALLOWED.includes(file.type)) {
        setLocalError("Unsupported file type. Use PNG, JPG or WebP.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setLocalError("Image is larger than 15MB.");
        return;
      }
      onImageUpload(file);
    },
    [onImageUpload],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) acceptFile(file);
    event.target.value = "";
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) acceptFile(file);
    },
    [acceptFile],
  );

  return (
    <div className="bg-gray-800/50 rounded-lg p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-300">Product Image</h2>
        {imagePreviewUrl && imageMeta && (
          <span className="text-xs text-gray-500">
            {imageMeta.width}×{imageMeta.height} · {imageMeta.sizeKb}KB
          </span>
        )}
      </div>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-colors duration-300 ${
          isDragging
            ? "bg-gray-700 border-cyan-400"
            : "border-gray-600 hover:border-gray-500 hover:bg-gray-800"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {imagePreviewUrl ? (
          <div className="relative w-full h-56">
            <img
              src={imagePreviewUrl}
              alt="Product preview"
              className="rounded-md object-contain w-full h-full"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              aria-label="Remove image"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md">
              <span className="text-white font-semibold text-sm">Click or drag to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-56 text-gray-500">
            <UploadIcon className="w-12 h-12 mb-2" />
            <p className="font-semibold text-gray-300">Click or drop an image</p>
            <p className="text-xs mt-1">PNG, JPG or WebP · up to 15MB</p>
            <p className="text-xs mt-1 text-gray-600">
              Best results: clean background, product centered
            </p>
          </div>
        )}
      </div>
      {localError && (
        <p className="mt-2 text-xs text-red-400">{localError}</p>
      )}
    </div>
  );
};
