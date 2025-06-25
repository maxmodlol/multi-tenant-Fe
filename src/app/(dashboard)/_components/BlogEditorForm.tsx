"use client";

import { useState, useCallback, KeyboardEvent, useEffect, ChangeEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BlockquoteExtension from "@tiptap/extension-blockquote";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import LinkExtension from "@tiptap/extension-link";

import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { Label } from "@explore/components/ui/label";
import { Select } from "@explore/components/ui/select";
import Tag from "@explore/components/ui/tag";
import {
  UploadCloud,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code as CodeIcon,
  List as BulletList,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  PenLine,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlignRight,
} from "lucide-react";
import { Quote } from "lucide-react";
import Heading from "@tiptap/extension-heading";
import ImageResize from "tiptap-extension-resize-image"; // ← our new extension

import { useUploadBlogImage } from "@/src/hooks/dashboard/mutations/useUploadMutations";
import {
  useCreateBlog,
  useUpdateBlog,
  usePublishBlog,
} from "@/src/hooks/dashboard/mutations/useBlogMutations";
import { useSession } from "next-auth/react";
import { BlogPage, BlogPageInput, BlogStatus, CreateBlogInput } from "@/src/types/blogs";
import { Category } from "@/src/types/category";
import { useCategories } from "@/src/hooks/public/useCategories";

export type BlogInput = {
  title: string;
  description?: string;
  coverPhoto?: string;
  categoryIds: string[];
  tags: string[];
  pages: { pageNumber: number; content: string }[];
};

export function BlogEditorForm({
  initialData,
}: {
  initialData?: {
    id: string;
    title: string;
    description?: string;
    coverPhoto?: string;
    categories: Category[];
    tags?: string[];
    pages: BlogPage[];
    status: BlogStatus;
  };
}) {
  const isEdit = Boolean(initialData);
  const session = useSession(); // Assuming you have a session hook to get user info

  const authorId = session?.data?.user.id!;
  const tenant = session?.data?.user?.tenant || "main"; // Default tenant if not set
  // Form state
  const {
    mutate: createBlog, // the function you call to fire the mutation
    isPending: isCreating, // boolean
    isError: createError, // boolean
    data: createdBlog, // Blog | undefined
  } = useCreateBlog();
  const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
  const { mutate: publishBlog, isPending: isPublishing } = usePublishBlog();
  const { data: categories = [], isPending: isCatsLoading, isError: catsError } = useCategories();

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [coverFile, setCoverFile] = useState<File | undefined>();
  const [coverPreview, setCoverPreview] = useState<string | undefined>(initialData?.coverPhoto);

  const [selectedCats, setSelectedCats] = useState(initialData?.categories || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [html, setHtml] = useState(initialData?.pages?.[0]?.content || "");

  // normalize to the minimal shape we need for inputs:
  const initialPages: BlogPageInput[] = initialData?.pages.map((p) => ({
    pageNumber: p.pageNumber,
    content: p.content,
  })) ?? [{ pageNumber: 1, content: "" }];

  const [pages, setPages] = useState<BlogPageInput[]>(initialPages);

  const [currentPage, setCurrentPage] = useState(0);

  // helper to update the current page’s content

  const [headingLevel, setHeadingLevel] = useState<"paragraph" | "h1" | "h2" | "h3" | "h4" | "h5">(
    "paragraph",
  );

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      BlockquoteExtension,
      TextStyle,
      Color,
      LinkExtension.configure({ openOnClick: false }),
      HorizontalRule,
      ImageResize.configure({
        inline: false,
        HTMLAttributes: {
          style: "max-width: 100%; height: auto;", // ensure responsiveness
        },
      }),
      Placeholder.configure({ placeholder: "Start writing…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3, 4, 5] }),
    ],
    content: html,
    editorProps: {
      attributes: {
        class:
          "pm-editor whitespace-break max-w-none" +
          "p-lg bg-background-primary " +
          "border border-gray-200 rounded-md " +
          "focus:outline-none focus:ring-3 focus:color-brand-400",
      },
    },
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
  });
  const saveCurrentPage = useCallback(
    (content: string) => {
      setPages((ps) => ps.map((p, i) => (i === currentPage ? { ...p, content } : p)));
    },
    [currentPage],
  );

  // 1) whenever you switch pages, first save the editor’s content, then load the next page
  const switchPage = useCallback(
    (newIndex: number) => {
      if (!editor) return;
      saveCurrentPage(editor.getHTML());
      setCurrentPage(newIndex);
    },
    [editor, saveCurrentPage],
  );
  useEffect(() => {
    if (!editor) return;
    const handler = ({ editor }: { editor: any }) => {
      saveCurrentPage(editor.getHTML());
    };
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, saveCurrentPage]);

  const uploadImageMutation = useUploadBlogImage();

  // Handlers
  const applyTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (tags.length < 3 && !tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput("");
    }
  };
  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t));
  const onCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    // immediately kick off upload so user gets real URL
    uploadImageMutation.mutate(file, {
      onSuccess(url) {
        setCoverPreview(url); // <-- now this is S3 URL, not blob
      },
      onError(err) {
        console.error("Cover upload failed", err);
      },
    });
  };

  const applyLink = () => {
    const url = prompt("Enter URL")?.trim();
    if (!url || !editor) return;
    const selEmpty = editor.state.selection.empty;
    if (selEmpty) {
      editor.chain().focus().insertContent(`<a href="${url}" target="_blank">${url}</a>`).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    }
  };
  const replaceImage = () => {
    if (!editor?.isActive("image")) return;
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = () => {
      const file = inp.files?.[0];
      if (!file || !editor) return;

      uploadImageMutation.mutate(file, {
        onSuccess(url) {
          editor.chain().focus().updateAttributes("image", { src: url }).run();
        },
        onError(err) {
          console.error("Upload failed:", err);
        },
      });
    };
    inp.click();
  };

  const addImage = () => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = () => {
      const file = inp.files?.[0];
      if (!file || !editor) return;

      uploadImageMutation.mutate(file, {
        onSuccess(url) {
          editor.chain().focus().setImage({ src: url }).run();
        },
        onError(err) {
          console.error("Upload failed:", err);
        },
      });
    };
    inp.click();
  };

  // After your useEditor() call:
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(pages[currentPage].content);
  }, [currentPage, pages, editor]);

  const handleSave = () => {
    // build a CreateBlogInput, not just your BlogInput
    const input: CreateBlogInput = {
      title,
      description,
      coverPhoto: coverPreview,
      categoryNames: selectedCats.map((c) => c.name),
      tags,
      pages,
      authorId,
      tenant,
    };

    if (isEdit) {
      updateBlog({ id: initialData!.id, dto: input }, { onSuccess: () => console.log("Updated!") });
    } else {
      createBlog(input, {
        onSuccess: (newBlog) => console.log("Created!", newBlog.id),
      });
    }
  };

  const handlePublish = () => {
    const input: CreateBlogInput = {
      title,
      description,
      coverPhoto: coverPreview,
      categoryNames: selectedCats.map((c) => c.name),
      tags,
      pages,
      authorId,
      tenant,
    };

    if (!isEdit) {
      createBlog(input, {
        onSuccess: (newBlog) => publishBlog({ id: newBlog.id, currentStatus: BlogStatus.DRAFTED }),
      });
    } else {
      updateBlog(
        { id: initialData!.id, dto: input },
        {
          onSuccess: () =>
            publishBlog({
              id: initialData!.id,
              currentStatus: initialData?.status || BlogStatus.ACCEPTED, // or use actual initialData.status
            }),
        },
      );
    }
  };

  return (
    <div className="bg-background-primary rounded-lg shadow-custom-1 p-lg space-y-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-display-md text-text-primary">
          {isEdit ? "Edit blog" : "Add new blog"}
        </h2>
        <div className="flex gap-md">
          <Button variant="outline" onClick={handleSave} disabled={isCreating || isUpdating}>
            {" "}
            Save as draft
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            Save & Publish
          </Button>{" "}
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div>
          <Label htmlFor="title">Blog name</Label>
          <Input
            id="title"
            placeholder="e.g. Website design"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label>Categories</Label>
          {isCatsLoading ? (
            <p>Loading categories…</p>
          ) : catsError ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            <Select
              value=""
              placeholder="Select category…"
              onChange={(val) => {
                const c = categories.find((x) => x.id === val);
                if (c && !selectedCats.find((s) => s.id === val)) {
                  setSelectedCats([...selectedCats, c]);
                }
              }}
              className="w-full"
            >
              {categories.map((cat) => (
                <Select.Item key={cat.id} value={cat.id}>
                  {cat.name}
                </Select.Item>
              ))}
            </Select>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedCats.map((c) => (
              <Tag
                key={c.id}
                variant="outline"
                onClick={() => setSelectedCats((sc) => sc.filter((x) => x.id !== c.id))}
              >
                {c.name} ×
              </Tag>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <Label>Tags (max 3)</Label>
          <div className="flex flex-wrap gap-2 mb-sm">
            {tags.map((t) => (
              <Tag key={t} variant="outline" onClick={() => removeTag(t)}>
                {t} ×
              </Tag>
            ))}
          </div>
          <Input
            placeholder="Add tag…"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={applyTag}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="desc">Short description</Label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description…"
            className="w-full h-24 rounded-md border border-border-secondary p-md text-text-primary placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="md:col-span-2">
          <Label>Blog photo</Label>
          <div className="relative border-2 border-dashed border-border-secondary rounded-md p-lg text-center">
            <div className="inline-flex items-center gap-xs text-foreground-secondary">
              <UploadCloud className="w-5 h-5" />
              <span>Click to upload or drag and drop</span>
            </div>
            <p className="mt-xs text-sm text-foreground-tertiary">
              SVG, PNG, JPG or GIF (max. 800×400px)
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={onCoverChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="mt-md mx-auto h-32 object-cover rounded"
              />
            )}
          </div>
        </div>
      </div>
      {/* ----- just above your toolbar JSX ----- */}
      <div className="flex items-center gap-2">
        {pages.map((pg, idx) => (
          <Button
            key={idx}
            variant={idx === currentPage ? "primary" : "outline"}
            onClick={() => switchPage(idx)}
          >
            Page {pg.pageNumber}
          </Button>
        ))}
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            setPages((p) => [
              ...p,
              {
                pageNumber: p.length + 1,
                content: "",
              } as BlogPageInput,
            ]);
            setCurrentPage(pages.length);
          }}
        >
          +
        </Button>
        <Button
          size="icon"
          variant="outline"
          disabled={pages.length === 1}
          onClick={() => {
            setPages((p) => p.filter((_, i) => i !== currentPage));
            setCurrentPage((i) => Math.max(0, i - 1));
          }}
        >
          −
        </Button>
      </div>

      {/* Toolbar */}
      <div className="bg-background-secondary-alt border border-border-secondary rounded-t-md p-sm flex flex-wrap gap-sm">
        {/* Undo/Redo */}
        <Button
          variant={editor?.can().undo() ? "ghost" : "outline"}
          size="icon"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.can().redo() ? "ghost" : "outline"}
          size="icon"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo className="w-4 h-4" />
        </Button>

        {/* Heading selector */}
        <Select
          value={headingLevel}
          onChange={(val) => {
            setHeadingLevel(val as any);
            if (!editor) return;
            if (val === "paragraph") {
              editor.chain().focus().setParagraph().run();
            } else {
              editor
                .chain()
                .focus()
                .setNode("heading", { level: parseInt(val) })
                .run();
            }
          }}
          className="w-28"
        >
          <Select.Item value="paragraph">Normal text</Select.Item>
          <Select.Item value="1">Heading 1</Select.Item>
          <Select.Item value="2">Heading 2</Select.Item>
          <Select.Item value="3">Heading 3</Select.Item>
        </Select>

        {/* Lists */}
        <Button
          variant={editor?.isActive("bulletList") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <BulletList className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive("orderedList") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        {/* Formatting */}
        <Button
          variant={editor?.isActive("bold") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive("italic") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive("underline") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive("strike") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive("code") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleCode().run()}
        >
          <CodeIcon className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive("blockquote") ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </Button>

        {/* Link */}
        <Button variant="ghost" size="icon" onClick={applyLink}>
          <LinkIcon className="w-4 h-4" />
        </Button>

        {/* Color */}
        <input
          type="color"
          onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
          className="w-8 h-8 p-0 border-none"
        />

        {/* Horizontal rule */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="w-4 h-4" />
          {/* Add a horizontal line */}
          <hr className="w-4 border-border-secondary" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setHardBreak().run()}
        >
          <PenLine className="w-4 h-4" />
        </Button>

        {/* Text align */}
        <Button
          variant={editor?.isActive({ textAlign: "left" }) ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive({ textAlign: "center" }) ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive({ textAlign: "right" }) ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          variant={editor?.isActive({ textAlign: "justify" }) ? "primary" : "ghost"}
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="w-4 h-4" />
        </Button>

        {/* Image */}
        {editor?.isActive("image") ? (
          <Button variant="ghost" size="icon" onClick={replaceImage} title="Replace image">
            <ImageIcon className="w-4 h-4 rotate-90" /> {/* e.g. rotate to indicate swap */}
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={addImage} title="Insert image">
            <ImageIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Editor */}
      <div className="border border-border-secondary rounded-b-md">
        <EditorContent
          editor={editor}
          className=" [&_ul]:list-disc [&_ol]:list-decimal p-lg text-text-primary"
        />
      </div>
    </div>
  );
}

export default BlogEditorForm;
