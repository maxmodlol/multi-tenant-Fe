"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import {
  useApproveBlog,
  useDeclineBlog,
  useDeleteBlog,
} from "@/src/hooks/dashboard/mutations/useBlogMutations";
import { useDashboardBlogs } from "@/src/hooks/dashboard/useDashboardBlogs";
import { BlogStatus } from "@explore/types/blogs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@explore/components/ui/table";
import { Input } from "@explore/components/ui/input";
import { Select } from "@explore/components/ui/select";
import { Button } from "@explore/components/ui/button";
import Tag from "@explore/components/ui/tag";
import { MoreHorizontal } from "lucide-react";
import { toast } from "react-hot-toast";
import PreviewBlogModal from "../../_components/PreviewBlogModal";
import { Spinner } from "@/src/components/ui/spinner";
import { Category } from "@/src/types/category";
import { useRouter } from "next/navigation";

export default function BlogsPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  const url = typeof window !== "undefined" ? new URL(window.location.href) : null;
  const seedTenant = url?.searchParams.get("tenant") || undefined;

  // Move all hooks to the top before any conditional returns
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  const debouncedSearch = useMemo(() => search.trim(), [search]);
  const tableRef = useRef<HTMLDivElement>(null);

  // Compute tenant filter
  const tenantFilter =
    session?.user?.role === "ADMIN" ? seedTenant || "all" : session?.user?.tenant;

  // Move all hooks to the top
  const { data, isError, isLoading } = useDashboardBlogs({
    tenant: tenantFilter,
    page,
    limit: 9,
    search: debouncedSearch || undefined,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    status: statusFilter === "all" ? undefined : (statusFilter as BlogStatus),
  });

  const approveMut = useApproveBlog();
  const declineMut = useDeclineBlog();
  const deleteMut = useDeleteBlog();

  useEffect(() => {
    function onClickOutside(evt: MouseEvent) {
      if (openMenuFor && tableRef.current && !tableRef.current.contains(evt.target as Node)) {
        setOpenMenuFor(null);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [openMenuFor]);

  // wait for auth
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

  // only now compute tenant
  // Admin sees "all" blogs across tenants; publisher sees tenant blogs; editor is redirected
  if (session.user.role === "EDITOR") {
    return <div className="p-4 text-center">غير مصرح</div>;
  }

  const categories =
    data?.blogs
      .flatMap((b) => b.categories)
      .reduce<Category[]>((acc, c) => {
        if (!acc.find((x) => x.id === c.id)) acc.push(c);
        return acc;
      }, [])
      .map((c) => ({ value: c.id, label: c.name })) ?? [];
  if (isError) return <div className="p-4 text-center">حدث خطأ أثناء جلب البيانات.</div>;
  if (data?.blogs.length === 0)
    return <div className="p-4 text-center">لا توجد مدونات لعرضها.</div>;
  return (
    <div dir="rtl" className="space-y-4 text-right text-sm">
      {/* — Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-background-secondary/60 border border-border-secondary rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="كل الحالات"
            className="w-36 text-xs"
          >
            <Select.Item value="all">كل الحالات</Select.Item>
            {Object.values(BlogStatus).map((s) => (
              <Select.Item key={s} value={s}>
                {s.replace("_", " ")}
              </Select.Item>
            ))}
          </Select>

          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="كل التصنيفات"
            className="w-36 text-xs"
          >
            <Select.Item value="all">كل التصنيفات</Select.Item>
            {categories.map((c) => (
              <Select.Item key={c.value} value={c.label}>
                {c.label}
              </Select.Item>
            ))}
          </Select>

          <Input
            placeholder="بحث…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 text-xs bg-background-primary border-border-secondary"
          />
        </div>

        {session.user.role !== "ADMIN" && (
          <Button
            className="px-3 py-1 text-xs bg-background-brand-solid text-text-primary-brand hover:bg-background-brand-solid-hover"
            onClick={() => router.push("/dashboard/blogs/editor/new")}
          >
            إضافة مدونة
          </Button>
        )}
      </div>

      {/* — Table */}
      <div
        ref={tableRef}
        className="relative overflow-visible rounded-lg border border-border-secondary bg-background-secondary"
      >
        <Table>
          <TableHeader>
            <TableRow>
              {["الإجراءات", "الاسم", "الوصف", "التصنيف", "الحالة", "تاريخ الإضافة", "المؤلف"].map(
                (h) => (
                  <TableHead key={h} className="px-2 py-1 text-xs">
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* loading spinner */}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="py-16">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* no data */}
            {!isLoading && data?.blogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-20 text-center text-gray-500">
                  لا توجد مدونات لعرضها.
                </TableCell>
              </TableRow>
            )}

            {/* actual rows */}
            {!isLoading &&
              data?.blogs.map((b) => {
                const primaryCat = b.categories[0]?.name ?? "—";
                return (
                  <TableRow key={b.id}>
                    {/* Actions */}
                    <TableCell className="px-2 py-1  relative overflow-visible">
                      <Button
                        variant={"ghost"}
                        onClick={() => setOpenMenuFor(openMenuFor === b.id ? null : b.id)}
                        className={`flex items-center justify-center h-8 w-8 rounded-full border ${
                          openMenuFor === b.id
                            ? "border-brand-600 bg-red-50 text-red-600"
                            : "border-gray-300 hover:bg-gray-100 text-gray-600"
                        }`}
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                      {openMenuFor === b.id && (
                        <div className="absolute  right-0 mt-0 w-32 flex flex-col rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              setPreviewId(b.id);
                              setOpenMenuFor(null);
                            }}
                            className="text-right px-3 py-2 hover:bg-gray-100"
                          >
                            عرض
                          </Button>
                          <Button
                            variant={"ghost"}
                            onClick={() => {
                              router.push(`/dashboard/blogs/editor/${b.id}`);
                              setOpenMenuFor(null);
                            }}
                            className="text-right px-3 py-2 hover:bg-gray-100"
                          >
                            تعديل
                          </Button>
                          <Button
                            variant={"ghost"}
                            onClick={() =>
                              deleteMut.mutate(b.id, {
                                onSuccess: () => toast.success("تم الحذف"),
                                onError: (e) => toast.error((e as Error).message),
                              })
                            }
                            className="text-right px-3 py-2 hover:bg-gray-100"
                          >
                            حذف
                          </Button>
                          {(b.status == BlogStatus.READY_TO_PUBLISH ||
                            b.status == BlogStatus.PENDING_REAPPROVAL) && (
                            <Button
                              variant={"ghost"}
                              onClick={() =>
                                approveMut.mutate(b.id, {
                                  onSuccess: () => toast.success("تم النشر"),
                                  onError: (e) => toast.error((e as Error).message),
                                })
                              }
                              className="text-right px-3 py-2 hover:bg-gray-100"
                            >
                              نشر
                            </Button>
                          )}
                          {b.status !== BlogStatus.ACCEPTED && (
                            <Button
                              variant={"ghost"}
                              onClick={() =>
                                declineMut.mutate(b.id, {
                                  onSuccess: () => toast.success("تم الرفض"),
                                  onError: (e) => toast.error((e as Error).message),
                                })
                              }
                              className="text-right px-3 py-2 hover:bg-gray-100"
                            >
                              رفض
                            </Button>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* Title */}
                    <TableCell className="px-2 py-1 whitespace-nowrap">{b.title}</TableCell>

                    {/* Description */}
                    <TableCell className="px-2 py-1">
                      <div className="truncate max-w-[8rem] text-xs">{b.description ?? ""}</div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="px-2 py-1">
                      <Tag variant="outline">{primaryCat}</Tag>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-2 py-1">
                      <Tag
                        variant={
                          b.status === BlogStatus.ACCEPTED
                            ? "solid"
                            : b.status === BlogStatus.DRAFTED
                              ? "ghost"
                              : "destructive"
                        }
                      >
                        {b.status.replace("_", " ")}
                      </Tag>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="px-2 py-1 whitespace-nowrap">
                      {format(new Date(b.createdAt), "MMM d, yyyy")}
                    </TableCell>

                    {/* Author */}
                    <TableCell className="px-2 py-1 whitespace-nowrap">{b.author?.name}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* — Pagination */}
      <div className="flex justify-center items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-2 py-1 text-xs"
        >
          السابق
        </Button>
        <span className="text-xs">
          صفحة {page} من {data?.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page === data?.totalPages}
          onClick={() => setPage((p) => Math.min(data?.totalPages ?? 1, p + 1))}
          className="px-2 py-1 text-xs"
        >
          التالي
        </Button>
      </div>

      {/* — Preview Modal */}
      {previewId && <PreviewBlogModal blogId={previewId} onClose={() => setPreviewId(null)} />}
    </div>
  );
}
