// app/dashboard/categories/page.tsx
import CategoriesClient from "./client";
import { fetchCategories } from "@explore/services/categoryService";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  // This runs on the server—returns Category[]
  const initialCategories = await fetchCategories();
  return <CategoriesClient initialCategories={initialCategories} />;
}
