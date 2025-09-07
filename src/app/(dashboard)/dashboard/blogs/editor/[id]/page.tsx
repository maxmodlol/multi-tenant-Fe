"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/src/components/ui/spinner";
import { BlogEditorForm } from "../../../../_components/BlogEditorForm";
import { useDashboardBlogById } from "@/src/hooks/dashboard/mutations/useBlogMutations";

export default function BlogEditorPage() {
  const { id } = useParams();
  const blogId = id as string;
  const isNew = blogId === "new";

  const { data: session, status } = useSession();

  const { data: blog, isLoading, isError } = useDashboardBlogById(blogId);

  if (status === "loading") {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (status !== "authenticated") {
    return <div className="p-4 text-center">غير مصرح</div>;
  }

  if (!isNew && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isNew && isError) {
    return <div className="p-4 text-center">فشل في تحميل بيانات المدونة</div>;
  }

  return <BlogEditorForm initialData={isNew ? undefined : blog} />;
}
