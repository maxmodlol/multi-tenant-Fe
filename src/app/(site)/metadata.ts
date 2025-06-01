// src/app/(site)/metadata.ts

export const siteMetadata = {
  title: "الموارد والرؤى — مدونة الموقع",
  description: "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح.",
  alternates: {
    canonical: "https://yourdomain.com/",
  },
  openGraph: {
    type: "website",
    locale: "ar_AR",
    siteName: "مدونة الموقع",
    title: "الموارد والرؤى — مدونة الموقع",
    description: "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح.",
    url: "https://yourdomain.com/",
    images: [
      {
        url: "https://yourdomain.com/path/to/first-blog-image.jpg",
        width: 1200,
        height: 600,
        alt: "صورة لموارد الموقع",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "الموارد والرؤى — مدونة الموقع",
    description: "أحدث أخبار الصناعة، المقالات، الإرشادات، والنصائح.",
    images: ["https://yourdomain.com/path/to/first-blog-image.jpg"],
  },
} as const;
