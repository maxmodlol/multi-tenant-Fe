import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { VideoNodeView } from "./VideoNodeView";

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; title?: string }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: "video",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "315",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video]",
      },
      {
        tag: "video",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const el = element as HTMLVideoElement;
          return {
            src: el.src,
            title: el.title,
            width: el.width || "100%",
            height: el.height || "315",
          };
        },
      },
      {
        tag: "iframe",
        getAttrs: (element) => {
          if (typeof element === "string") return false;
          const el = element as HTMLIFrameElement;
          // Only parse iframes that look like video embeds
          if (
            el.src &&
            (el.src.includes("youtube.com/embed") ||
              el.src.includes("vimeo.com/video") ||
              el.src.includes("player"))
          ) {
            return {
              src: el.src,
              title: el.title,
              width: el.width || "100%",
              height: el.height || "315",
            };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, title, width, height } = HTMLAttributes;

    // Check if it's a YouTube/Vimeo URL or direct video
    const isYouTube = src && (src.includes("youtube.com") || src.includes("youtu.be"));
    const isVimeo = src && src.includes("vimeo.com");
    const isDirectVideo = src && src.match(/\.(mp4|webm|ogg|avi|mov)$/i);
    const isIframeUrl =
      src && (src.includes("embed") || src.includes("iframe") || src.includes("player"));

    if (isYouTube || isVimeo || isIframeUrl) {
      // Generate embed URL for YouTube/Vimeo
      let embedUrl = src;
      if (isYouTube) {
        const videoId = src.match(
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        )?.[1];
        embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : src;
      } else if (isVimeo) {
        const videoId = src.match(/vimeo\.com\/(\d+)/)?.[1];
        embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}` : src;
      }

      return [
        "div",
        {
          class: "video-container",
          style: `width: ${width || "100%"}; height: ${height || "315"}; margin: 20px 0;`,
        },
        [
          "iframe",
          {
            src: embedUrl,
            title: title || "Video",
            width: "100%",
            height: "100%",
            frameborder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: true,
            style: "width: 100%; height: 100%; border-radius: 8px;",
          },
        ],
      ];
    } else if (isDirectVideo) {
      return [
        "div",
        {
          class: "video-container",
          style: `width: ${width || "100%"}; height: ${height || "315"}; margin: 20px 0;`,
        },
        [
          "video",
          {
            src,
            title: title || "Video",
            width: "100%",
            height: "100%",
            controls: true,
            style: "width: 100%; height: 100%; border-radius: 8px;",
          },
          "Your browser does not support the video tag.",
        ],
      ];
    } else {
      // Fallback for invalid URLs
      return [
        "div",
        {
          class: "video-container",
          style:
            "background: #f0f0f0; padding: 20px; text-align: center; border: 1px solid #ccc; margin: 20px 0; border-radius: 8px;",
        },
        "Invalid video URL",
      ];
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  },

  addCommands() {
    return {
      setVideo:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
