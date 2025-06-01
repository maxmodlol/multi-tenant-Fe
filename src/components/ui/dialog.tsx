"use client";
import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** extra classes to apply to the modal panel */
  className?: string;
  /** extra inline styles to merge on the modal panel */
  style?: React.CSSProperties;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, className = "", style = {}, children }: DialogProps) {
  const modalRoot = typeof document !== "undefined" ? document.getElementById("modal-root") : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!open || !modalRoot) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onOpenChange(false)}
    >
      {/* backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />

      {/* panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={className}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "38rem",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "1rem",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
          padding: "2rem",
          ...style,
        }}
      >
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

interface SectionProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DialogHeader({ children, className = "", style = {} }: SectionProps) {
  return (
    <div className={`${className} mb-4 flex justify-between items-center`} style={style}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className = "", style = {} }: SectionProps) {
  return (
    <h2 className={`${className} text-lg font-semibold`} style={style}>
      {children}
    </h2>
  );
}

export function DialogContent({ children, className = "", style = {} }: SectionProps) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = "", style = {} }: SectionProps) {
  return (
    <div className={`${className} mt-6 flex justify-end space-x-2`} style={style}>
      {children}
    </div>
  );
}
