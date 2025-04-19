"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import BlogHero from "@explore/components/BlogHero";
import PaginationBar from "@explore/components/PaginationBar";
import BlogPages from "@explore/components/BlogPages";
import RelatedBlogs from "@explore/components/RelatedBlogs";
import { useSingleBlog } from "@explore/lib/useSingleBlog";
import BlogFooterMeta from "@explore/components/BlogFooterMeta";

export default function BlogDetailPage() {
  const { id } = useParams();
  const blogId = Array.isArray(id) ? id[0] : id;
  const { data: blog, isLoading, error } = useSingleBlog(blogId!);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = blog?.pages.length || 1;

  if (isLoading) return <div>Loading...</div>;
  if (error || !blog) return <div>Not found</div>;

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <BlogHero blog={blog} />

      <div className="max-w-3xl mx-auto px-4">
        <BlogFooterMeta url={url} author={blog.author} createdAt={blog.createdAt} />

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <BlogPages pages={blog.pages} currentPage={currentPage} />

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <BlogFooterMeta url={url} author={blog.author} createdAt={blog.createdAt} />
      </div>

      <RelatedBlogs currentBlog={blog} />
    </div>
  );
}
