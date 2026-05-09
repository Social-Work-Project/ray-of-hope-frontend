"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

export type ActionItem = {
  label: string;
  icon: string;
  color: string;
  fn: () => void;
};

interface ActionsMenuProps {
  actions: ActionItem[];
}

export function ActionsMenu({ actions }: ActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position the dropdown relative to the button
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 44 * actions.length + 12; // approx height
    const spaceBelow = window.innerHeight - rect.bottom;
    const top =
      spaceBelow < menuHeight + 8
        ? rect.top + window.scrollY - menuHeight - 4   // flip upward
        : rect.bottom + window.scrollY + 4;
    // Align right edge of menu with right edge of button
    const left = rect.right + window.scrollX - 130;
    setCoords({ top, left });
  }, [actions.length]);

  const handleOpen = () => {
    updatePosition();
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on scroll / resize
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-gray-100"
        style={{ color: "var(--gray-400)" }}
        aria-label="Actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[9999] bg-white rounded-xl shadow-xl border py-1.5"
            style={{
              top: coords.top,
              left: coords.left,
              minWidth: 130,
              borderColor: "var(--gray-100)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            {actions.map((a) => (
              <button
                key={a.label}
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  a.fn();
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all hover:bg-gray-50 text-left"
                style={{ color: a.color }}
              >
                <span>{a.icon}</span>
                <span className="font-medium">{a.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}