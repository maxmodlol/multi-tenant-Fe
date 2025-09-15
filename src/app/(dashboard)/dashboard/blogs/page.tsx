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
import { useTenants } from "@/src/hooks/dashboard/useTenants";
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
import { MoreHorizontal, Search, Filter, X } from "lucide-react";
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
  const [tenantFilter, setTenantFilter] = useState("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useMemo(() => search.trim(), [search]);
  const tableRef = useRef<HTMLDivElement>(null);

  // Get tenants for admin filter
  const { data: tenants = [] } = useTenants();
  const isAdmin = session?.user?.role === "ADMIN";

  // Compute final tenant filter
  const finalTenantFilter = isAdmin ? tenantFilter : session?.user?.tenant;

  // Move all hooks to the top
  const { data, isError, isLoading } = useDashboardBlogs({
    tenant: finalTenantFilter,
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

  return (
    <div dir="rtl" className="space-y-4 text-right text-sm">
      {/* — Top Bar */}
      <div className="flex flex-col gap-4 bg-background-secondary/60 border border-border-secondary rounded-lg p-4 sm:p-6">
        {/* Search and Filters Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary w-4 h-4" />
            <Input
              placeholder="البحث في المدونات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 text-sm bg-background-primary border-border-secondary focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border-border-secondary hover:bg-background-secondary/80"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">الفلاتر</span>
              <span className="sm:hidden">فلترة</span>
            </Button>

            {/* Add Blog Button */}
            {session.user.role !== "ADMIN" && (
              <Button
                className="px-3 sm:px-4 py-2 text-sm bg-background-brand-solid text-text-primary-brand hover:bg-background-brand-solid-hover transition-colors"
                onClick={() => router.push("/dashboard/blogs/editor/new")}
              >
                <span className="hidden sm:inline">إضافة مدونة</span>
                <span className="sm:hidden">إضافة</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border-secondary">
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">الحالة</label>
              <Select value={statusFilter} onChange={setStatusFilter} placeholder="كل الحالات">
                <Select.Item value="all">كل الحالات</Select.Item>
                {Object.values(BlogStatus).map((s) => (
                  <Select.Item key={s} value={s}>
                    {s.replace("_", " ")}
                  </Select.Item>
                ))}
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">التصنيف</label>
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="كل التصنيفات"
              >
                <Select.Item value="all">كل التصنيفات</Select.Item>
                {categories.map((c) => (
                  <Select.Item key={c.value} value={c.label}>
                    {c.label}
                  </Select.Item>
                ))}
              </Select>
            </div>

            {/* Tenant Filter - Only for Admin */}
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">النطاق الفرعي</label>
                <Select value={tenantFilter} onChange={setTenantFilter} placeholder="كل النطاقات">
                  <Select.Item value="all">كل النطاقات</Select.Item>
                  {tenants.map((tenant) => (
                    <Select.Item key={tenant.id} value={tenant.domain}>
                      {tenant.domain}
                    </Select.Item>
                  ))}
                </Select>
              </div>
            )}

            {/* Clear Filters */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">إعادة تعيين</label>
              <Button
                variant="outline"
                onClick={() => {
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setTenantFilter("all");
                  setSearch("");
                }}
                className="w-full text-sm"
              >
                مسح الفلاتر
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* — Table */}
      <div
        ref={tableRef}
        className="relative overflow-visible rounded-lg border border-border-secondary bg-background-secondary"
      >
        {/* Desktop Table */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-background-primary/40">
                {[
                  "الإجراءات",
                  "الاسم",
                  "الوصف",
                  "التصنيف",
                  "الحالة",
                  "تاريخ الإضافة",
                  "المؤلف",
                ].map((h) => (
                  <TableHead key={h} className="px-2 py-1 text-xs font-semibold text-text-primary">
                    {h}
                  </TableHead>
                ))}
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
                  <TableCell colSpan={7} className="py-20 text-center text-text-tertiary">
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
                          className={`flex items-center justify-center h-8 w-8 rounded-full border transition-colors ${
                            openMenuFor === b.id
                              ? "border-brand-600 bg-brand-50 text-brand-600 dark:bg-brand-900/20"
                              : "border-border-secondary hover:bg-background-secondary text-text-tertiary hover:text-text-primary"
                          }`}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                        {openMenuFor === b.id && (
                          <div className="absolute right-0 mt-0 w-32 flex flex-col rounded-lg border border-border-secondary bg-background-primary shadow-lg z-50">
                            <Button
                              variant={"ghost"}
                              onClick={() => {
                                setPreviewId(b.id);
                                setOpenMenuFor(null);
                              }}
                              className="text-right px-3 py-2 hover:bg-background-secondary/50 text-text-primary"
                            >
                              عرض
                            </Button>
                            <Button
                              variant={"ghost"}
                              onClick={() => {
                                router.push(`/dashboard/blogs/editor/${b.id}`);
                                setOpenMenuFor(null);
                              }}
                              className="text-right px-3 py-2 hover:bg-background-secondary/50 text-text-primary"
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
                              className="text-right px-3 py-2 hover:bg-background-secondary/50 text-red-600 hover:text-red-700"
                            >
                              حذف
                            </Button>
                            {(b.status == BlogStatus.READY_TO_PUBLISH ||
                              b.status == BlogStatus.PENDING_REAPPROVAL) && (
                              <Button
                                variant={"ghost"}
                                onClick={() =>
                                  approveMut.mutate(
                                    { id: b.id, tenant: (b as any).tenant },
                                    {
                                      onSuccess: () => toast.success("تم النشر"),
                                      onError: (e) => toast.error((e as Error).message),
                                    },
                                  )
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
                                  declineMut.mutate(
                                    { id: b.id, tenant: (b as any).tenant },
                                    {
                                      onSuccess: () => toast.success("تم الرفض"),
                                      onError: (e) => toast.error((e as Error).message),
                                    },
                                  )
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
                      <TableCell className="px-2 py-1 whitespace-nowrap text-text-primary font-medium">
                        {b.title}
                      </TableCell>

                      {/* Description */}
                      <TableCell className="px-2 py-1">
                        <div className="truncate max-w-[8rem] text-xs text-text-tertiary">
                          {b.description ?? ""}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="px-2 py-1">
                        <Tag variant="outline" className="text-xs">
                          {primaryCat}
                        </Tag>
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
                      <TableCell className="px-2 py-1 whitespace-nowrap text-text-tertiary text-xs">
                        {format(new Date(b.createdAt), "MMM d, yyyy")}
                      </TableCell>

                      {/* Author */}
                      <TableCell className="px-2 py-1 whitespace-nowrap text-text-tertiary text-xs">
                        {b.author?.name}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3 p-4">
          {/* loading spinner */}
          {isLoading && (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          )}

          {/* no data */}
          {!isLoading && data?.blogs.length === 0 && (
            <div className="py-20 text-center text-text-tertiary">لا توجد مدونات لعرضها.</div>
          )}

          {/* actual cards */}
          {!isLoading &&
            data?.blogs.map((b) => {
              const primaryCat = b.categories[0]?.name ?? "—";
              return (
                <div
                  key={b.id}
                  className="bg-background-primary border border-border-secondary rounded-lg p-4 space-y-3 hover:bg-background-primary/80 transition-colors"
                >
                  {/* Header with title and actions */}
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-sm text-text-primary flex-1 pr-2">{b.title}</h3>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMenuFor(openMenuFor === b.id ? null : b.id)}
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                      {openMenuFor === b.id && (
                        <div className="absolute right-0 mt-1 w-32 flex flex-col rounded-lg border border-border-secondary bg-background-primary shadow-lg z-50">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setPreviewId(b.id);
                              setOpenMenuFor(null);
                            }}
                            className="text-right px-3 py-2 hover:bg-gray-100"
                          >
                            عرض
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              router.push(`/dashboard/blogs/editor/${b.id}`);
                              setOpenMenuFor(null);
                            }}
                            className="text-right px-3 py-2 hover:bg-gray-100"
                          >
                            تعديل
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
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
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                approveMut.mutate(
                                  { id: b.id, tenant: (b as any).tenant },
                                  {
                                    onSuccess: () => toast.success("تم النشر"),
                                    onError: (e) => toast.error((e as Error).message),
                                  },
                                )
                              }
                              className="text-right px-3 py-2 hover:bg-gray-100"
                            >
                              نشر
                            </Button>
                          )}
                          {b.status !== BlogStatus.ACCEPTED && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                declineMut.mutate(
                                  { id: b.id, tenant: (b as any).tenant },
                                  {
                                    onSuccess: () => toast.success("تم الرفض"),
                                    onError: (e) => toast.error((e as Error).message),
                                  },
                                )
                              }
                              className="text-right px-3 py-2 hover:bg-gray-100"
                            >
                              رفض
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {b.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">{b.description}</p>
                  )}

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Tag variant="outline">{primaryCat}</Tag>
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
                    <span className="text-gray-500">
                      {format(new Date(b.createdAt), "MMM d, yyyy")}
                    </span>
                    {b.author?.name && <span className="text-gray-500">• {b.author.name}</span>}
                    {isAdmin && (b as any).tenant && (
                      <span className="text-blue-600 font-medium">• {(b as any).tenant}</span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
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
