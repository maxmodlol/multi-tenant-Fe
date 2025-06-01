"use client";
import { Blog } from "@explore/types/blogs";
import BlogHero from "@explore/components/BlogHero";
import BlogFooterMeta from "@explore/components/BlogFooterMeta";
import PaginationBar from "@explore/components/PaginationBar";
import BlogPages from "@explore/components/BlogPages";
import RelatedBlogs from "@explore/components/RelatedBlogs";
import React from "react";

export default function BlogDetailClient({ blog }: { blog: Blog }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const [page, setPage] = React.useState(1);
  const total = blog.pages.length;

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <BlogHero blog={blog} />

      <div className="max-w-3xl mx-auto px-4">
        <BlogFooterMeta url={url} author={blog.author} createdAt={blog.createdAt} />

        <PaginationBar currentPage={page} totalPages={total} onPageChange={setPage} />
        <BlogPages pages={blog.pages} currentPage={page} />
        <PaginationBar currentPage={page} totalPages={total} onPageChange={setPage} />
        <BlogFooterMeta url={url} author={blog.author} createdAt={blog.createdAt} />
      </div>

      <RelatedBlogs currentBlog={blog} />
    </div>
  );
}
