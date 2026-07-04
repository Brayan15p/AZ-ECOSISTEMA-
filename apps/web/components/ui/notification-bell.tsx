"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import { INITIAL_NOTIFICATIONS, type NotificationItem } from "@/lib/mock-data";

/** Maqueta: las notificaciones viven en estado local, todavía sin Supabase. */
export function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={unread > 0 ? `${unread} notificaciones sin leer` : "Notificaciones"}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary"
      >
        <Bell size={17} />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-30 w-80 rounded-2xl border border-border bg-surface p-2 shadow-lg">
          <div className="px-2 py-1.5 text-footnote font-semibold text-text-primary">
            Notificaciones
          </div>
          <div className="flex max-h-80 flex-col gap-0.5 overflow-y-auto">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className={cn(
                  "flex flex-col gap-0.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-surface-sunken",
                  !n.read && "bg-surface-sunken/60",
                )}
              >
                <div className="flex items-center gap-2">
                  {!n.read ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  ) : (
                    <span className="h-1.5 w-1.5 shrink-0" />
                  )}
                  <span className="text-footnote font-semibold text-text-primary">
                    {n.title}
                  </span>
                </div>
                <span className="pl-3.5 text-caption1 text-text-secondary">
                  {n.body}
                </span>
                <span className="pl-3.5 text-caption2 text-text-tertiary">
                  {n.createdAt}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
