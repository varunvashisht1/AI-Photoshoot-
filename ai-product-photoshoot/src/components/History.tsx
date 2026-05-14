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
    <div className="bg-gray-800/50 rounded-lg p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-300 flex items-center gap-2">
          <HistoryIcon className="w-5 h-5 text-cyan-400" />
          Recent
          <span className="text-xs text-gray-500 font-normal">({items.length})</span>
        </h2>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {items.map((it) => (
          <div key={it.id} className="relative group rounded-md overflow-hidden bg-gray-900">
            <button
              onClick={() => onSelect(it)}
              className="block w-full aspect-square"
              title={it.prompt}
            >
              <img
                src={it.thumbnail}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(it.id);
              }}
              className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Delete"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
