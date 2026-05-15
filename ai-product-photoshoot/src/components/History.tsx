import React from "react";
import type { HistoryItem } from "../utils/storage";
import { HistoryIcon, TrashIcon } from "./icons";

interface HistoryProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ items, onSelect, onDelete, onClear }) => {
  if (!items.length) return null;

  return (
    <div className="surface-elevated p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-100">
          <HistoryIcon className="h-4 w-4 text-cyan-300" />
          Recent
          <span className="font-mono text-[11px] font-normal text-slate-500">
            {items.length}
          </span>
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-slate-400 transition-colors hover:text-rose-400"
        >
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {items.map((it) => (
          <div
            key={it.id}
            className="group relative overflow-hidden rounded-lg border border-white/5 bg-slate-950 transition-all hover:border-white/20"
          >
            <button
              onClick={() => onSelect(it)}
              className="block aspect-square w-full"
              title={it.prompt}
            >
              <img
                src={it.thumbnail}
                alt=""
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-2 text-left text-[10px] leading-tight text-slate-200">
                  {it.prompt}
                </p>
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(it.id);
              }}
              className="absolute right-1 top-1 rounded bg-slate-950/80 p-1 text-white opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100"
              aria-label="Delete"
            >
              <TrashIcon className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
