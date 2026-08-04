"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import ContactForm from "./ContactForm";

const ModalContext = createContext<{ open: () => void; close: () => void }>({
  open: () => {},
  close: () => {},
});

export const useContactModal = () => useContext(ModalContext);

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Auto-open the enquiry popup shortly after the preloader finishes.
  // Fires once per page load (event-driven, with a timed fallback).
  useEffect(() => {
    let opened = false;
    let openTimer: ReturnType<typeof setTimeout>;
    const trigger = () => {
      if (opened) return;
      opened = true;
      openTimer = setTimeout(() => setIsOpen(true), 900);
    };
    window.addEventListener("ssbw:loaded", trigger, { once: true });
    // Fallback in case the loader was already gone before we mounted
    const fallback = setTimeout(trigger, 5000);
    return () => {
      window.removeEventListener("ssbw:loaded", trigger);
      clearTimeout(fallback);
      clearTimeout(openTimer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <ModalContext.Provider value={{ open, close }}>
      {children}

      {isOpen && (
        <div
          className="modal-backdrop flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Book a free counselling session"
        >
          <div
            className="modal-card skeu-panel relative w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tricolour-bar h-1.5 w-full" aria-hidden />
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper-2 text-ink shadow-[var(--shadow-raised)] transition hover:text-saffron-600"
            >
              ✕
            </button>

            <div className="max-h-[90vh] overflow-y-auto p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Image src="/logo-black.png" alt="" width={44} height={44} className="h-10 w-10 object-contain" />
                <div>
                  <p className="font-display text-xl font-extrabold uppercase leading-none tracking-wide gold-text">
                    Book Free Counselling
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                    Talk to a mentor, not a salesperson
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm leading-snug text-ink-soft">
                New batches open every month — seats are limited. Share your details and
                we&apos;ll map your entry &amp; timeline, free of cost.
              </p>

              <div className="mt-4">
                <ContactForm compact />
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
