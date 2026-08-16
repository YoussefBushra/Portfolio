"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { navNodes, profile } from "@/content/profile";
import { track } from "@/lib/analytics";
import { CV_FILENAME, CV_PATH } from "@/lib/cv";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const reduce = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const commands: Command[] = useMemo(
    () => [
      {
        id: "goto-top",
        label: "Go to top",
        hint: "Start",
        group: "Navigate",
        keywords: "home top hero start",
        run: () => scrollToId("hero"),
      },
      ...navNodes.map((n) => ({
        id: `goto-${n.id}`,
        label: `Go to ${n.label}`,
        hint: n.label,
        group: "Navigate",
        keywords: `${n.label} ${n.id}`,
        run: () => scrollToId(n.id),
      })),
      {
        id: "download-cv",
        label: "Download CV",
        hint: "PDF",
        group: "Actions",
        keywords: "cv resume pdf download",
        run: () => {
          track("cv_download", { from: "palette" });
          const a = document.createElement("a");
          a.href = CV_PATH;
          a.download = CV_FILENAME;
          a.click();
        },
      },
      {
        id: "toggle-theme",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
        hint: "Theme",
        group: "Actions",
        keywords: "theme dark light mode appearance",
        run: () => {
          const next = resolvedTheme === "dark" ? "light" : "dark";
          track("theme_toggle", { to: next });
          setTheme(next);
        },
      },
      ...profile.socials.map((s) => ({
        id: `open-${s.label}`,
        label: `Open ${s.label}`,
        hint: s.handle,
        group: "Links",
        keywords: `${s.label} ${s.handle} profile`,
        run: () => {
          track("social_click", { label: s.label, from: "palette" });
          window.open(s.href, "_blank", "noreferrer,noopener");
        },
      })),
    ],
    [resolvedTheme, setTheme]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.keywords} ${c.group}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) track("command_palette_open", { source: "keyboard" });
          return !v;
        });
      }
      if (e.key === "Escape") close();
    };
    const onOpenEvent = () => {
      setOpen(true);
      track("command_palette_open", { source: "button" });
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    };
  }, [close]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  function runCommand(cmd: Command) {
    track("command_run", { command: cmd.id });
    cmd.run();
    if (cmd.id !== "toggle-theme") close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = results[active];
      if (cmd) runCommand(cmd);
    }
  }

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="w-full max-w-lg overflow-hidden rounded border border-line bg-surface shadow-2xl shadow-black/10"
          >
            <div className="border-b border-line px-4">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections and actions"
                aria-label="Search commands"
                className="w-full bg-transparent py-4 text-sm text-text outline-none placeholder:text-faint"
              />
            </div>

            {results.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted">
                No match for {`"${query}"`}. Try a section name.
              </p>
            ) : (
              <ul className="max-h-[50vh] overflow-y-auto py-2">
                {results.map((cmd, i) => {
                  const header = cmd.group !== lastGroup ? cmd.group : null;
                  lastGroup = cmd.group;
                  return (
                    <li key={cmd.id}>
                      {header ? (
                        <p className="px-4 pb-1 pt-3 font-mono text-[11px] text-faint">
                          {header}
                        </p>
                      ) : null}
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => runCommand(cmd)}
                        className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm transition-colors ${
                          i === active
                            ? "bg-surface-2 text-text"
                            : "text-muted hover:text-text"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={`h-[2px] w-3 ${
                              i === active ? "bg-accent" : "bg-line"
                            }`}
                            aria-hidden="true"
                          />
                          {cmd.label}
                        </span>
                        <span className="truncate font-mono text-[11px] text-faint">
                          {cmd.hint}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[11px] text-faint">
              <span>↑↓ move</span>
              <span>↵ run</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
