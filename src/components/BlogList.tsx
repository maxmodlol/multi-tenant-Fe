"use client";
import { useRef, useState } from "react";
import BlogCard from "./BlogCard";
import { useBlogs } from "@/src/hooks/public/useBlogs";
import { useCategories } from "@/src/hooks/public/useCategories";
import clsx from "clsx";
import Pagination from "./ui/Pagination";
import { Button } from "./ui/button";
import { Blog } from "../types/blogs";
import { Category } from "../types/category";

interface BlogsListProps {
  initialBlogs: Blog[];
  initialTotalPages: number;
  initialCategories: Category[];
  initialCategory?: string;
}

export default function BlogsList({
  initialBlogs,
  initialTotalPages,
  initialCategories,
  initialCategory,
}: BlogsListProps) {
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? "all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 11; // 9 regular + 2 wide

  // 1) Categories query + fallback
  const categoriesQuery = useCategories({
    initialData: initialCategories,
  });
  const categories = categoriesQuery.data ?? initialCategories;

  // 2) Blogs query + fallback
  const { data: blogsResponse } = useBlogs(activeCategory, currentPage, pageSize, {
    // initialData lines up with BlogsResponse
    initialData:
      activeCategory === (initialCategory ?? "all") && currentPage === 1
        ? {
            blogs: initialBlogs,
            totalPages: initialTotalPages,
            totalBlogs: initialBlogs.length,
          }
        : undefined,
  });

  const blogs = blogsResponse?.blogs || initialBlogs;
  const totalPages = blogsResponse?.totalPages || initialTotalPages;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  // Drag-to-scroll for categories row (desktop + mobile)
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = categoriesScrollRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    container.setPointerCapture(e.pointerId);
    startXRef.current = e.clientX;
    scrollLeftRef.current = container.scrollLeft;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = categoriesScrollRef.current;
    if (!container || !isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    container.scrollLeft = scrollLeftRef.current - dx;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = categoriesScrollRef.current;
    if (!container) return;
    isDraggingRef.current = false;
    try {
      container.releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Category Filters */}
      <div
        ref={categoriesScrollRef}
        className="flex gap-3 overflow-x-auto pb-2 rtl:flex-row select-none cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Button
          variant="primary"
          onClick={() => handleCategoryChange("all")}
          className={clsx(
            "px-4 py-2 rounded-lg font-semibold whitespace-nowrap",
            activeCategory === "all" ? "bg-red-500 text-text-white" : "bg-gray-100 text-gray-800",
          )}
        >
          جميع التصنيفات
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.name)}
            className={clsx(
              "px-4 py-2 rounded-lg font-semibold whitespace-nowrap",
              activeCategory === cat.name
                ? "bg-red-500 text-text-white"
                : "bg-gray-100 text-gray-800",
            )}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Blogs Grid (equal height cards) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-stretch">
        {blogs.slice(0, 9).map((blog) => (
          <BlogCard key={blog.id} blog={blog} type="grid" />
        ))}
      </div>

      {/* Wide Blog Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 items-stretch">
        {blogs.slice(9).map((blog) => (
          <BlogCard key={blog.id} blog={blog} type="grid" />
        ))}
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
