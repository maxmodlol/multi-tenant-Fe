import React, { useState } from "react";
import BlogCard from "@explore/components/BlogCard";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@explore/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { BlogCardData } from "@explore/types/blogs";

export default function BlogCardWithActions({
  blog,
  type,
}: {
  blog: BlogCardData;
  type: "grid" | "related";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        {/* this wrapper now spans the full card */}
        <BlogCard blog={blog} type={type} />

        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            aria-label="More actions"
            className="
              absolute top-2 left-2 z-20
              bg-white dark:bg-gray-800
              rounded-full
              opacity-0 group-hover:opacity-100 transition-opacity
              focus:outline-none focus:ring-2 focus:ring-indigo-500
            "
          >
            <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="z-30 w-32">
          <DropdownMenuItem
            onClick={() => {
              /* edit */
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              /* delete */
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
