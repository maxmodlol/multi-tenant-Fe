"use client";

import React, { useEffect, useState, useMemo } from "react";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTenants } from "@/src/hooks/dashboard/useTenants"; // your admin‐only endpoint
import { useDashboardBlogs } from "@/src/hooks/dashboard/useDashboardBlogs";
import { useCategories } from "@/src/hooks/public/useCategories";
import { Input } from "@explore/components/ui/input";
import { Select } from "@/src/components/ui/select";
import { Button } from "@explore/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@explore/components/ui/toggle-group";
import { List, LayoutGrid } from "lucide-react";
import { Spinner } from "@/src/components/ui/spinner";
import { BlogStatus } from "@/src/types/blogs";
import BlogCardWithActions from "../../_components/BlogCardWithActions";

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Drafted", value: "DRAFTED" },
  { label: "Ready to Publish", value: "READY_TO_PUBLISH" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Declined", value: "DECLINED" },
];

export default function MyBlogPage() {
  const { data: session } = useSession();
  const user = session?.user as { role: string; tenant: string } | undefined;
  const { data: allTenants = [] } = useTenants();

  const [tenantFilter, setTenantFilter] = useState(
    user?.role.toLowerCase() === "admin" ? "all" : user?.tenant || "",
  );

  // other filters…
  const [search, setSearch] = useState("");
  const [debSearch, setDebSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // debounce
  const debouncer = useMemo(
    () =>
      debounce((val: string) => {
        setDebSearch(val);
        setPage(1);
      }, 300),
    [],
  );
  useEffect(() => {
    debouncer(search);
  }, [search, debouncer]);

  // fetch
  const { data, isLoading, isError } = useDashboardBlogs({
    tenant: tenantFilter,
    page,
    limit: 9,
    search: debSearch || undefined,
    category: category || undefined,
    status: status === "" ? undefined : (status as BlogStatus),
  });
  const { data: cats = [] } = useCategories();

  const blogs = data?.blogs ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Blog</h1>
          <p className="text-sm text-gray-500">Add and manage your blogs effectively.</p>
        </div>
        <Link href="/dashboard/blogs/editor/new">
          <Button variant="primary">Add new blog</Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-nowrap items-center space-x-4 bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg shadow-sm overflow-visible">
        {" "}
        {/* Tenant (admin only) */}
        {user?.role.toLowerCase() === "admin" && (
          <Select
            value={tenantFilter}
            onChange={(v) => {
              setTenantFilter(v);
              setPage(1);
            }}
            className="w-48"
          >
            <Select.Item value="all">All tenants</Select.Item>
            {allTenants.map((t) => (
              <Select.Item key={t.domain} value={t.domain}>
                {t.domain}
              </Select.Item>
            ))}
          </Select>
        )}
        {/* Search */}
        <Input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] h-10 rounded-full px-4 mx-2"
        />
        {/* Category */}
        <Select
          value={category}
          onChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          className="w-48"
        >
          <Select.Item value="">All categories</Select.Item>
          {cats.map((c) => (
            <Select.Item key={c.id} value={c.name}>
              {c.name}
            </Select.Item>
          ))}
        </Select>
        {/* Status */}
        <Select
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          className="w-48"
        >
          {STATUS_OPTIONS.map((opt) => (
            <Select.Item key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Item>
          ))}
        </Select>
        {/* View Toggle */}
        <ToggleGroup value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "list")}>
          <ToggleGroupItem value="list">
            <List size={18} />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid">
            <LayoutGrid size={18} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">Error loading blogs.</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-500">You haven’t created any blogs yet.</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => (
            <BlogCardWithActions key={b.id} blog={b} type="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((b) => (
            <BlogCardWithActions key={b.id} blog={b} type="grid" />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2  ">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Button
              key={idx}
              variant={page === idx + 1 ? "primary" : "outline"}
              onClick={() => setPage(idx + 1)}
              className="mx-1"
            >
              {idx + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
