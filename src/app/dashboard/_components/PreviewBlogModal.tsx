// app/dashboard/blogs/_components/PreviewBlogModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useDashboardBlogById } from "@explore/lib/useBlogMutations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@explore/components/ui/dialog";
import { Button } from "@explore/components/ui/button";
import Tag from "@explore/components/ui/tag";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Category } from "@/src/types/category";

export default function PreviewBlogModal({
  blogId,
  onClose,
}: {
  blogId: string;
  onClose: () => void;
}) {
  const { data: blog, isLoading } = useDashboardBlogById(blogId);
  const [currentPage, setCurrentPage] = useState(1);

  // reset to page 1 whenever we open a new blog
  useEffect(() => {
    if (blogId) setCurrentPage(1);
  }, [blogId]);

  if (isLoading || !blog) {
    return (
      <Dialog open={!!blogId} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl w-full h-[80vh] flex items-center justify-center">
          {isLoading && <Loader2 className="animate-spin h-10 w-10 text-gray-400" />}
        </DialogContent>
      </Dialog>
    );
  }

  const totalPages = blog.pages.length;
  const page = blog.pages.find((p: any) => p.pageNumber === currentPage)!;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 flex-shrink-0 border-b">
          <DialogTitle>{`Preview: ${blog.title}`}</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {blog.coverPhoto && (
            <div className="w-full h-64 relative rounded-lg overflow-hidden">
              <Image src={blog.coverPhoto} alt={blog.title} fill className="object-cover" />
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span>
              By <strong>{blog.author?.name}</strong>
            </span>
            <span>•</span>
            <span>{format(new Date(blog.createdAt), "MMM d, yyyy")}</span>
            {blog.categories.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2 flex-wrap">
                  {blog.categories.map((c: Category) => (
                    <Tag key={c.id} variant="outline">
                      {c.name}
                    </Tag>
                  ))}
                </div>
              </>
            )}
            {blog.tags && blog.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex gap-2 flex-wrap">
                  {blog.tags.map((t: any) => (
                    <Tag key={t} variant="solid">
                      {t.name}
                    </Tag>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Description */}
          {blog.description && (
            <div className="prose max-w-full">
              <p>{blog.description}</p>
            </div>
          )}

          {/* Single page */}
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">{`Page ${page.pageNumber}`}</h3>
            <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: page.content }} />
          </section>
        </div>

        {/* Footer with page nav + close */}
        <DialogFooter className="px-6 py-4 flex-shrink-0 border-t justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm">{`${currentPage} / ${totalPages}`}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
