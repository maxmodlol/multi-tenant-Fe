"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

// Options for triggering a toast
export type ToastOptions = {
  title: string;
  description?: string;
  duration?: number; // ms
};

type Toast = ToastOptions & { id: string };

// Context type
type ToastContextType = {
  toast: (opts: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Provider component to wrap your app
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((opts: ToastOptions) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...opts, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, opts.duration ?? 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col space-y-3 pointer-events-none">
          {toasts.map(({ id, title, description }) => (
            <div
              key={id}
              className="pointer-events-auto bg-gray-300 text-white px-5 py-3 rounded-2xl shadow-xl max-w-sm w-auto flex items-start space-x-4"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{title}</p>
                {description && <p className="mt-1 text-xs opacity-90 truncate">{description}</p>}
              </div>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== id))}
                className="p-1  rounded-full hover:bg-brand-primary-dark"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

// Hook for consuming
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx.toast;
}
