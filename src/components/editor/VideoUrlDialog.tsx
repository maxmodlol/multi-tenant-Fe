import { useState } from "react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { Label } from "@explore/components/ui/label";
import { Textarea } from "@explore/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@explore/components/ui/dialog";
import { Video, Link, Upload, Youtube, Play } from "lucide-react";

interface VideoUrlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { src: string; title: string; width: string; height: string }) => void;
}

export function VideoUrlDialog({ isOpen, onClose, onConfirm }: VideoUrlDialogProps) {
  const [src, setSrc] = useState("");
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("315");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!src.trim()) return;

    onConfirm({
      src: src.trim(),
      title: title.trim() || "Video",
      width,
      height,
    });

    // Reset form
    setSrc("");
    setTitle("");
    setWidth("100%");
    setHeight("315");
    onClose();
  };

  const handlePreset = (preset: { width: string; height: string }) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");
  const isVimeo = src.includes("vimeo.com");
  const isDirectVideo = src.match(/\.(mp4|webm|ogg|avi|mov)$/i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Add Video
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Embed a video from YouTube, Vimeo, or any other source
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Video URL Input */}
          <div className="space-y-2">
            <Label htmlFor="video-url">Video URL *</Label>
            <div className="relative">
              <Input
                id="video-url"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="pr-10"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isYouTube && <Youtube className="w-4 h-4 text-red-500" />}
                {isVimeo && <Play className="w-4 h-4 text-blue-500" />}
                {isDirectVideo && <Video className="w-4 h-4 text-green-500" />}
                {!isYouTube && !isVimeo && !isDirectVideo && src && (
                  <Link className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Supports YouTube, Vimeo, direct video files, or any iframe embed URL
            </p>
          </div>

          {/* Video Title */}
          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title (optional)</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for this video"
            />
          </div>

          {/* Size Presets */}
          <div className="space-y-2">
            <Label>Size Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset({ width: "100%", height: "315" })}
                className="text-xs"
              >
                Standard (100% × 315)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset({ width: "100%", height: "400" })}
                className="text-xs"
              >
                Large (100% × 400)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset({ width: "800px", height: "450px" })}
                className="text-xs"
              >
                Fixed (800 × 450)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreset({ width: "50%", height: "250" })}
                className="text-xs"
              >
                Small (50% × 250)
              </Button>
            </div>
          </div>

          {/* Custom Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="video-width">Width</Label>
              <Input
                id="video-width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="100% or 800px"
              />
              <p className="text-xs text-gray-500">e.g., 100%, 800px, 50vw</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-height">Height</Label>
              <Input
                id="video-height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="315 or 400px"
              />
              <p className="text-xs text-gray-500">e.g., 315, 400px, 50vh</p>
            </div>
          </div>

          {/* Preview */}
          {src && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {isYouTube && (
                    <>
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span>YouTube Video</span>
                    </>
                  )}
                  {isVimeo && (
                    <>
                      <Play className="w-4 h-4 text-blue-500" />
                      <span>Vimeo Video</span>
                    </>
                  )}
                  {isDirectVideo && (
                    <>
                      <Video className="w-4 h-4 text-green-500" />
                      <span>Direct Video File</span>
                    </>
                  )}
                  {!isYouTube && !isVimeo && !isDirectVideo && (
                    <>
                      <Link className="w-4 h-4 text-gray-400" />
                      <span>Custom Embed</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Size: {width} × {height}
                  {title && ` • ${title}`}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!src.trim()}>
              <Video className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
