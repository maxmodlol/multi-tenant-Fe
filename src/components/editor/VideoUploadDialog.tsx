import { useState, useRef } from "react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { Label } from "@explore/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@explore/components/ui/dialog";
import { Video, Upload, FileVideo, X } from "lucide-react";

interface VideoUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { src: string; title: string; width: string; height: string }) => void;
  onUpload: (file: File) => Promise<string>;
  isUploading?: boolean;
}

export function VideoUploadDialog({
  isOpen,
  onClose,
  onConfirm,
  onUpload,
  isUploading = false,
}: VideoUploadDialogProps) {
  const [title, setTitle] = useState("");
  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("315");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const url = await onUpload(selectedFile);
      setUploadedUrl(url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) return;

    onConfirm({
      src: uploadedUrl,
      title: title.trim() || selectedFile?.name || "Video",
      width,
      height,
    });

    // Reset form
    setTitle("");
    setWidth("100%");
    setHeight("315");
    setSelectedFile(null);
    setUploadedUrl(null);
    onClose();
  };

  const handlePreset = (preset: { width: string; height: string }) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Video
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Upload a video file from your computer</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <Label>Video File *</Label>
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileVideo className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to select video file</p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports MP4, WebM, OGG, AVI, MOV (max 100MB)
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadedUrl(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {!uploadedUrl && (
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full mt-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                )}
                {uploadedUrl && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                    ✅ Video uploaded successfully
                  </div>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Video Title */}
          <div className="space-y-2">
            <Label htmlFor="video-title">Video Title (optional)</Label>
            <Input
              id="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={selectedFile?.name || "Enter a title for this video"}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!uploadedUrl}>
              <Video className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
