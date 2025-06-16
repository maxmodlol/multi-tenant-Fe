"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCreateBlog, usePublishBlog } from "@/src/hooks/dashboard/mutations/useBlogMutations";
import { BlogEditorForm } from "../../../../_components/BlogEditorForm";
import { useSession } from "next-auth/react";
import { CreateBlogInput } from "@/src/types/blogs";

export default function CreateBlogPage() {
  // fetch your categories for the multi-select

  return <BlogEditorForm />;
}
