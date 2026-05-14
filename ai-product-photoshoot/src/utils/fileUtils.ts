export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(",")[1];
      if (base64String) resolve(base64String);
      else reject(new Error("Failed to extract base64 string from file."));
    };
    reader.onerror = (error) => reject(error);
  });
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));
    img.src = src;
  });

/**
 * Downscale a user-uploaded image so the longest edge is at most maxEdge px.
 * Keeps aspect ratio, re-encodes as JPEG at the given quality to keep payloads
 * small for the Gemini API. Returns a Blob that callers can read as base64.
 */
export const downscaleImage = async (
  file: File,
  maxEdge = 1536,
  quality = 0.92,
): Promise<{ blob: Blob; width: number; height: number; mimeType: string }> => {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Failed to read file."));
    r.readAsDataURL(file);
  });

  const img = await loadImage(dataUrl);
  const longest = Math.max(img.width, img.height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not supported.");
  ctx.drawImage(img, 0, 0, w, h);

  const outType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas encode failed."))),
      outType,
      outType === "image/jpeg" ? quality : undefined,
    ),
  );
  return { blob, width: w, height: h, mimeType: outType };
};

export const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(new Error("Failed to read blob."));
    r.readAsDataURL(blob);
  });

export const dataUrlFromBase64 = (base64: string, mimeType: string): string =>
  `data:${mimeType};base64,${base64}`;

/**
 * Render an image data URL into a small JPEG thumbnail used for history.
 */
export const makeThumbnail = async (
  dataUrl: string,
  maxEdge = 256,
): Promise<string> => {
  const img = await loadImage(dataUrl);
  const longest = Math.max(img.width, img.height);
  const scale = longest > maxEdge ? maxEdge / longest : 1;
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.78);
};
