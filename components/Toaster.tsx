"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

let listeners: ((toast: ToastItem) => void)[] = [];
let idCounter = 0;

// Call this from anywhere in a client component instead of alert().
// Example: toast("Listing saved", "success")
export function toast(message: string, type: ToastType = "info") {
  const item: ToastItem = { id: ++idCounter, message, type };
  listeners.forEach((listener) => listener(item));
}

// Mounted once in app/layout.tsx. Renders whatever toast() sends.
export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    function handle(item: ToastItem) {
      setToasts((prev) => [...prev, item]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== item.id));
      }, 3500);
    }

    listeners.push(handle);

    return () => {
      listeners = listeners.filter((l) => l !== handle);
    };
  }, []);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto min-w-[260px] max-w-sm px-5 py-4 rounded-xl shadow-lg border text-sm font-medium ${
            t.type === "success"
              ? "bg-green-600/90 border-green-400/40 text-white"
              : t.type === "error"
              ? "bg-red-600/90 border-red-400/40 text-white"
              : "bg-[#1c1c2e] border-white/10 text-white"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
