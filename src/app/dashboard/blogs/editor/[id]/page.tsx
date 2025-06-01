// app/blogs/editor/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useCreateBlog, usePublishBlog } from "@explore/lib/useBlogMutations";
import { BlogEditorForm } from "../../../_components/BlogEditorForm";
import { useSession } from "next-auth/react";
import { CreateBlogInput } from "@/src/types/blogs";

export default function CreateBlogPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // fetch your categories for the multi-select
  const categories: any[] = [];
  const createMutation = useCreateBlog();
  const publishMutation = usePublishBlog();

  const onSaveDraft = async (input: CreateBlogInput) => {
    await createMutation.mutateAsync(input);
    router.push("/dashboard"); // or wherever
  };

  const onPublish = async (input: CreateBlogInput) => {
    // 1) create the blog
    const newBlog = await createMutation.mutateAsync(input);
    // 2) bump it to READY_TO_PUBLISH
    await publishMutation.mutateAsync(newBlog.id);
    router.push("/dashboard");
  };

  return <BlogEditorForm categories={categories} onSave={onSaveDraft} onPublish={onPublish} />;
}
