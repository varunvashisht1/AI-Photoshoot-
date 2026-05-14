import React, { useCallback, useRef, useState } from "react";

interface CompareSliderProps {
  beforeUrl: string;
  afterUrl: string;
  className?: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  beforeUrl,
  afterUrl,
  className,
}) => {
  const [pct, setPct] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={ref}
      className={`relative w-full aspect-square overflow-hidden rounded-lg bg-gray-900 select-none touch-none ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={afterUrl}
        alt="Generated"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${pct}%` }}
      >
        <img
          src={beforeUrl}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ width: `${100 * (100 / Math.max(pct, 0.01))}%`, maxWidth: "none" }}
          draggable={false}
        />
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow"
        style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
      />
      <div
        className="absolute top-1/2 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold text-sm cursor-ew-resize"
        style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
      >
        ⇔
      </div>
      <span className="absolute top-2 left-2 text-xs font-medium bg-black/60 text-white px-2 py-0.5 rounded">
        Original
      </span>
      <span className="absolute top-2 right-2 text-xs font-medium bg-cyan-600/80 text-white px-2 py-0.5 rounded">
        AI
      </span>
    </div>
  );
};
