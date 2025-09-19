"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
}

export default function LogoImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/logo.svg",
}: LogoImageProps) {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      // If fallback also fails, hide the image
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setHasError(false);
  };

  // If both original and fallback failed, show a placeholder
  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Logo</span>
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      priority
      unoptimized={currentSrc.endsWith(".svg")}
    />
  );
}
