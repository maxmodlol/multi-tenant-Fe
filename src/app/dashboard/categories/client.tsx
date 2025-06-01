// app/dashboard/categories/client.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useCategories } from "@explore/lib/useCategories";
import { useCreateCategory, useDeleteCategory } from "@explore/lib/useCategoryMutations";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@explore/components/ui/table";
import { Checkbox } from "@explore/components/ui/checkbox";
import { Button } from "@explore/components/ui/button";
import Tag from "@explore/components/ui/tag";
import AddCategoryModal from "../_components/AddCategoryModal";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@explore/components/ui/dialog";
import { Category } from "@/src/types/category";

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [addOpen, setAddOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);

  const { data: categories = initialCategories } = useCategories();
  const createCat = useCreateCategory();
  const deleteCat = useDeleteCategory();

  const canAdd = categories.length < 8;

  const handleDelete = () => {
    if (!toDelete) return;
    deleteCat.mutate(toDelete.id, {
      onSuccess: () => {
        toast.success(`Category “${toDelete.name}” deleted.`);
        setToDelete(null);
      },
      onError: (err: any) => {
        toast.error("Delete failed: " + (err?.message ?? ""));
        setToDelete(null);
      },
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Add and manage your blog categories effectively.
          </p>
        </div>
        <Button
          onClick={() => {
            if (canAdd) setAddOpen(true);
            else toast.error("You can’t have more than 8 categories.");
          }}
        >
          Add category
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-lg border  border-gray-300 bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Date added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Tag variant="outline">{cat.name}</Tag>
                </TableCell>
                <TableCell>{format(new Date(cat.createdAt), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => setToDelete(cat)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Modal */}
      <AddCategoryModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={({ name }) => {
          createCat.mutate(
            { name },
            {
              onSuccess: () => {
                toast.success(`Category “${name}” added.`);
                setAddOpen(false);
              },
              onError: () => {
                toast.error("Add failed: Category Name is Duplicated ");
              },
            },
          );
        }}
      />

      {/* Delete Confirmation */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="mt-2">
            Are you sure you want to delete <strong>{toDelete?.name}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" className="mx-1 " onClick={() => setToDelete(null)}>
              Cancel
            </Button>
            <Button variant="primary" className="mx-1" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
