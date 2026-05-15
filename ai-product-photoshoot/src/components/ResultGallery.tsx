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
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/5">
          <ImageIcon className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">
          Your generated images will appear here
        </h3>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Pick a model, choose a scene, write a prompt, then hit{" "}
          <span className="font-semibold text-slate-300">Generate</span>.
        </p>
      </div>
    );
  }

  const current = imageUrls[Math.min(selected, imageUrls.length - 1)];

  return (
    <div className="flex w-full flex-col items-center gap-4 animate-slide-up">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-base font-semibold text-slate-100">
          Result{imageUrls.length > 1 ? `s · ${imageUrls.length}` : ""}
        </h2>
        <div className="flex items-center gap-1.5">
          {originalUrl && (
            <button
              onClick={() => setCompare((c) => !c)}
              className={`btn-ghost px-2.5 py-1.5 text-xs ${
                compare ? "border-cyan-400 bg-cyan-500/10 text-cyan-200" : ""
              }`}
            >
              <CompareIcon className="h-4 w-4" />
              Compare
            </button>
          )}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={busy}
              className="btn-ghost px-2.5 py-1.5 text-xs"
            >
              <RefreshIcon className="h-4 w-4" />
              Regenerate
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        {compare && originalUrl ? (
          <CompareSlider beforeUrl={originalUrl} afterUrl={current} />
        ) : (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-soft">
            <img
              src={current}
              alt="Generated product scene"
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </div>

      {imageUrls.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                i === selected
                  ? "border-cyan-400 ring-2 ring-cyan-400/40"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <img src={url} alt={`Variation ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => download(current, selected)}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-soft transition-all hover:bg-emerald-400 hover:shadow-glow"
      >
        <DownloadIcon className="h-4 w-4" />
        Download PNG
      </button>
    </div>
  );
};
