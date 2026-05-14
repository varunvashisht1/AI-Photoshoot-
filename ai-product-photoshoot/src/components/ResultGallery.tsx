import React, { useState } from "react";
import { CompareSlider } from "./CompareSlider";
import { CompareIcon, DownloadIcon, ImageIcon, RefreshIcon } from "./icons";

interface ResultGalleryProps {
  originalUrl: string | null;
  imageUrls: string[];
  onRegenerate?: () => void;
  busy?: boolean;
}

const download = (url: string, idx: number) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai-photoshoot-${Date.now()}-${idx + 1}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const ResultGallery: React.FC<ResultGalleryProps> = ({
  originalUrl,
  imageUrls,
  onRegenerate,
  busy,
}) => {
  const [selected, setSelected] = useState(0);
  const [compare, setCompare] = useState(false);

  if (imageUrls.length === 0) {
    return (
      <div className="text-center text-gray-500 flex flex-col items-center py-12">
        <ImageIcon className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold text-gray-400">
          Your generated images will appear here
        </h3>
        <p className="text-sm">Upload a product, pick a scene, and click Generate.</p>
      </div>
    );
  }

  const current = imageUrls[Math.min(selected, imageUrls.length - 1)];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold text-gray-300">
          Result{imageUrls.length > 1 ? `s (${imageUrls.length})` : ""}
        </h2>
        <div className="flex items-center gap-2">
          {originalUrl && (
            <button
              onClick={() => setCompare((c) => !c)}
              className={`text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                compare
                  ? "bg-cyan-600 text-white"
                  : "bg-gray-700/60 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <CompareIcon className="w-4 h-4" />
              Compare
            </button>
          )}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={busy}
              className="text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium bg-gray-700/60 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshIcon className="w-4 h-4" />
              Regenerate
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-md">
        {compare && originalUrl ? (
          <CompareSlider beforeUrl={originalUrl} afterUrl={current} />
        ) : (
          <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <img
              src={current}
              alt="Generated product scene"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>

      {imageUrls.length > 1 && (
        <div className="flex gap-2 flex-wrap justify-center">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                i === selected
                  ? "border-cyan-400 ring-2 ring-cyan-500/40"
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <img src={url} alt={`Variation ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => download(current, selected)}
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30"
      >
        <DownloadIcon className="w-5 h-5" />
        Download
      </button>
    </div>
  );
};
