export const dynamic = "force-dynamic"; // 👈 always run per request
export const revalidate = 60;
import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import { blogService } from "@explore/services/blogService";
import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const blog = await blogService.getBlogById(params.id);
  if (!blog) return { title: "Not Found – مدونة الموقع" };
  const description = blog.description || "أفضل المدونة التقنيّة بالعربيّ";

  return {
    title: blog.title,
    description, // ← meta name="description"
    openGraph: {
      type: "article",
      locale: "ar_AR",
      siteName: "مدونة الموقع",
      title: blog.title,
      description, // ← og:description
      images: blog.coverPhoto ? [{ url: blog.coverPhoto }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description, // ← twitter:description
      images: blog.coverPhoto ? [blog.coverPhoto] : [],
    },
  };
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const blog = await blogService.getBlogById(params.id);
  if (!blog) return <div>Not Found</div>;

  // sanitize-html options that allow Tiptap’s output:
  const cleanOptions: sanitizeHtml.IOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "u",
      "figure",
      "figcaption",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      // images need src, alt, style for responsive
      img: ["src", "alt", "width", "height", "loading", "style"],
      a: ["href", "name", "target", "rel"],
      span: ["style"],
      figure: ["class", "style"],
      figcaption: ["class", "style"],
      // if you ever use data- attributes:
      "*": ["data-align", "class"],
    },
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
  };

  const cleanPages = blog.pages.map((p) => ({
    ...p,
    content: sanitizeHtml(p.content, cleanOptions),
  }));

  return (
    <BlogDetailClient
      blog={{
        ...blog,
        pages: cleanPages,
      }}
    />
  );
}
