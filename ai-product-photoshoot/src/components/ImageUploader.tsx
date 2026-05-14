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
    <div className="surface-elevated p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">
            Reference photo <span className="font-normal text-slate-500">(optional)</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            For the before/after slider — describe the product in the prompt.
          </p>
        </div>
        {imagePreviewUrl && imageMeta && (
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-slate-400">
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
        className={`relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-3 text-center transition-colors duration-200 ${
          isDragging
            ? "border-cyan-400 bg-cyan-500/5"
            : "border-white/10 hover:border-white/25 hover:bg-white/[0.03]"
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
          <div className="relative h-56 w-full">
            <img
              src={imagePreviewUrl}
              alt="Product preview"
              className="h-full w-full rounded-lg object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute right-1.5 top-1.5 rounded-full bg-slate-950/80 p-1.5 text-white transition-colors hover:bg-rose-600"
              aria-label="Remove image"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-950/60 opacity-0 transition-opacity duration-200 hover:opacity-100">
              <span className="text-sm font-semibold text-white">Click or drag to replace</span>
            </div>
          </div>
        ) : (
          <div className="flex h-52 flex-col items-center justify-center gap-2 text-slate-500">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5">
              <UploadIcon className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-200">Drop a product photo here</p>
            <p className="text-[11px]">PNG, JPG, WebP · up to 15MB</p>
          </div>
        )}
      </div>
      {localError && (
        <p className="mt-2 text-xs text-rose-300">{localError}</p>
      )}
    </div>
  );
};
