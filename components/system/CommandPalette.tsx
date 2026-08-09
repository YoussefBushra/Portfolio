"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { navNodes, profile } from "@/content/profile";
import { track } from "@/lib/analytics";

interface Command {
  id: string;
  label: string;
  hint: string;
  group: string;
  keywords: string;
  run: () => void;
}

export const OPEN_PALETTE_EVENT = "yb:open-palette";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", id === "hero" ? " " : `#${id}`);
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { setTheme, resolvedTheme } = useTheme();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    setCopied(false);
  }, []);

  const openPalette = useCallback((source: string) => {
    setOpen(true);
    track("command_palette_open", { source });
  }, []);

  const commands: Command[] = useMemo(() => {
    const nav: Command[] = [
      {
        id: "goto-top",
        label: "Go to top",
        hint: "hero",
        group: "Navigate",
        keywords: "home top hero start",
        run: () => scrollToId("hero"),
      },
      ...navNodes.map((n) => ({
        id: `goto-${n.id}`,
        label: `Go to ${n.label}`,
        hint: n.service,
        group: "Navigate",
        keywords: `${n.label} ${n.service} ${n.id}`,
        run: () => scrollToId(n.id),
      })),
    ];

    const actions: Command[] = [
      {
        id: "toggle-theme",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
        hint: "theme",
        group: "Actions",
        keywords: "theme dark light mode toggle appearance",
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "download-cv",
        label: "Download CV (PDF)",
        hint: "résumé",
        group: "Actions",
        keywords: "cv resume download pdf",
        run: () => {
          track("cv_download", { from: "palette" });
          const a = document.createElement("a");
          a.href = "/Youssef_Bushra_Fouad_CV.pdf";
          a.download = "";
          a.click();
        },
      },
      {
        id: "copy-email",
        label: "Copy email address",
        hint: profile.email,
        group: "Actions",
        keywords: "copy email mail address contact",
        run: () => {
          navigator.clipboard?.writeText(profile.email).catch(() => {});
          setCopied(true);
        },
      },
    ];

    const links: Command[] = profile.socials.map((s) => ({
      id: `open-${s.label}`,
      label: `Open ${s.label}`,
      hint: s.handle,
      group: "Links",
      keywords: `${s.label} ${s.handle} open link`,
      run: () => {
        track("social_click", { label: s.label, from: "palette" });
        if (s.href.startsWith("http")) window.open(s.href, "_blank", "noopener");
        else window.location.href = s.href;
      },
    }));

    return [...nav, ...actions, ...links];
  }, [resolvedTheme, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [query, commands]);

  // global open shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          const next = !v;
          if (next) track("command_palette_open", { source: "shortcut" });
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    const onEvent = () => openPalette("button");
    window.addEventListener(OPEN_PALETTE_EVENT, onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onEvent);
    };
  }, [openPalette]);

  // focus input + lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const runCommand = (cmd: Command) => {
    track("command_run", { command: cmd.id });
    cmd.run();
    if (cmd.id !== "copy-email" && cmd.id !== "toggle-theme") close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[active];
      if (cmd) runCommand(cmd);
    }
  };

  // keep active item in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          onKeyDown={onKeyDown}
        >
          <div
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-node"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span className="font-mono text-xs text-accent-2" aria-hidden="true">
                &gt;_
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, sections, links…"
                aria-label="Search commands"
                className="w-full bg-transparent py-4 text-sm text-text outline-none placeholder:text-faint"
              />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint sm:inline">
                esc
              </kbd>
            </div>

            <ul ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center font-mono text-xs text-faint">
                  no matching commands
                </li>
              ) : (
                filtered.map((cmd, i) => {
                  const showGroup = cmd.group !== lastGroup;
                  lastGroup = cmd.group;
                  return (
                    <li key={cmd.id}>
                      {showGroup ? (
                        <div className="mono-label px-3 pb-1 pt-3">{cmd.group}</div>
                      ) : null}
                      <button
                        type="button"
                        data-idx={i}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => runCommand(cmd)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          i === active
                            ? "bg-accent/10 text-accent"
                            : "text-text hover:bg-surface-2/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              i === active ? "bg-accent" : "bg-border"
                            }`}
                          />
                          {cmd.id === "copy-email" && copied
                            ? "Copied to clipboard ✓"
                            : cmd.label}
                        </span>
                        <span className="truncate font-mono text-[11px] text-faint">
                          {cmd.hint}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="flex items-center justify-between border-t border-border px-4 py-2.5 font-mono text-[10px] text-faint">
              <span className="flex gap-3">
                <span>↑↓ navigate</span>
                <span>↵ run</span>
              </span>
              <span>{profile.name}</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
