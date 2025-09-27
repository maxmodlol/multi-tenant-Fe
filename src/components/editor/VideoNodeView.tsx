import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/core";
import { useState } from "react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { Label } from "@explore/components/ui/label";
import { Edit, Trash2, Play, ExternalLink, Maximize2 } from "lucide-react";

export const VideoNodeView = ({ node, updateAttributes, deleteNode }: NodeViewProps) => {
  const [isEditing, setIsEditing] = useState(!node.attrs.src);
  const [src, setSrc] = useState(node.attrs.src || "");
  const [title, setTitle] = useState(node.attrs.title || "");
  const [width, setWidth] = useState(node.attrs.width || "100%");
  const [height, setHeight] = useState(node.attrs.height || "315");

  const handleSave = () => {
    updateAttributes({
      src,
      title: title || "Video",
      width,
      height,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (node.attrs.src) {
      setIsEditing(false);
    } else {
      deleteNode();
    }
  };

  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  const isVimeo = src.includes("vimeo.com");
  const isDirectVideo = src.match(/\.(mp4|webm|ogg|avi|mov)$/i);
  const isIframeUrl = src.includes("embed") || src.includes("iframe") || src.includes("player");

  const getEmbedUrl = () => {
    if (isYouTube) {
      // Extract video ID from YouTube URL
      const videoId = src.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      )?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    if (isVimeo) {
      // Extract video ID from Vimeo URL
      const videoId = src.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    if (isIframeUrl) {
      // If it's already an embed URL, use it directly
      return src;
    }
    return null;
  };

  const embedUrl = getEmbedUrl();

  if (isEditing) {
    return (
      <NodeViewWrapper className="video-editor">
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <Label htmlFor="video-src">Video URL</Label>
              <Input
                id="video-src"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="Enter YouTube, Vimeo, iframe embed URL, or direct video URL"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                Supports YouTube, Vimeo, any iframe embed URL, or direct video files (MP4, WebM,
                etc.)
              </p>
            </div>
            <div>
              <Label htmlFor="video-title">Title (optional)</Label>
              <Input
                id="video-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Size Presets</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setWidth("100%");
                    setHeight("315");
                  }}
                >
                  Standard (100% × 315)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setWidth("100%");
                    setHeight("400");
                  }}
                >
                  Large (100% × 400)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setWidth("800px");
                    setHeight("450px");
                  }}
                >
                  Fixed (800 × 450)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setWidth("50%");
                    setHeight("250");
                  }}
                >
                  Small (50% × 250)
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="video-width">Width</Label>
                <Input
                  id="video-width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="100% or 800px"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., 100%, 800px, 50vw</p>
              </div>
              <div>
                <Label htmlFor="video-height">Height</Label>
                <Input
                  id="video-height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="315 or 400px"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">e.g., 315, 400px, 50vh</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="video-wrapper">
      <div className="relative group">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
           {embedUrl ? (
             <iframe
               src={embedUrl}
               title={title || "Video"}
               width={width}
               height={height}
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
               style={{ width: width, height: height }}
             />
           ) : isDirectVideo ? (
             <video 
               src={src} 
               controls 
               width={width} 
               height={height} 
               style={{ width: width, height: height }}
             >
               Your browser does not support the video tag.
             </video>
          ) : (
            <div className="bg-gray-100 p-8 text-center">
              <Play className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Invalid video URL</p>
            </div>
          )}
        </div>

        {/* Edit controls - show on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <Button size="sm" onClick={() => setIsEditing(true)} className="h-8 w-8 p-0" title="Edit video (URL, title, size)">
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={deleteNode} className="h-8 w-8 p-0" title="Delete video">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Size indicator */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Maximize2 className="w-3 h-3" />
            {width} × {height}
          </div>
        </div>

        {/* Video title */}
        {title && <div className="mt-2 text-sm text-gray-600 text-center">{title}</div>}
      </div>
    </NodeViewWrapper>
  );
};
