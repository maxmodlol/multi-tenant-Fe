import BlogEditorPage from "../[id]/page";

// app/(dashboard)/blog/new/page.tsx
export default function NewBlogPage() {
  return <BlogEditorPage />; // no need for useParams()
}
