"use client";

import { ChevronDown } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationBar({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <nav
      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 mt-6"
      aria-label="تنقل بين صفحات المقال"
    >
      {/* Prev / Next */}
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="الصفحة السابقة"
          className="rounded-md border px-4 py-1.5 text-sm bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:opacity-80 transition disabled:opacity-50"
        >
          السابق
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="الصفحة التالية"
          className="rounded-md border px-4 py-1.5 text-sm bg-white dark:bg-black border-gray-300 dark:border-gray-700 hover:opacity-80 transition disabled:opacity-50"
        >
          التالي
        </button>
      </div>

      {/* Select */}
      <div className="relative">
        <label htmlFor="page-select" className="sr-only">
          اختر الصفحة
        </label>
        <select
          id="page-select"
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
          aria-label="اختر رقم الصفحة"
          className="appearance-none px-4 py-1.5 pr-10 rounded-md border text-sm border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-black text-gray-700 dark:text-gray-800"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <option key={pageNum} value={pageNum}>
              الصفحة {pageNum} من {totalPages}
            </option>
          ))}
        </select>
        <ChevronDown
          className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </nav>
  );
}
