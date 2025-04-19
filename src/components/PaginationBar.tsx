"use client";

import { ChevronDown } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationBar({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mt-6">
      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border px-4 py-1.5 text-sm bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:opacity-80 transition disabled:opacity-50"
        >
          السابق
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border px-4 py-1.5 text-sm bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:opacity-80 transition disabled:opacity-50"
        >
          التالي
        </button>
      </div>

      {/* Dropdown page selector */}
      <div className="relative">
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          className="appearance-none px-4 py-1.5 pr-10 rounded-md border text-sm border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-black text-gray-700 dark:text-gray-800"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <option key={pageNum} value={pageNum}>
              الصفحة {pageNum} من {totalPages}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
