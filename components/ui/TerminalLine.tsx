"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  /** ms per character */
  speed?: number;
  /** Delay before typing begins. */
  delay?: number;
  /** Show a blinking caret while idle/typing. */
  caret?: boolean;
  /** Plays only when in view. */
  whileInView?: boolean;
  /** Once visible, never re-trigger. */
  once?: boolean;
  className?: string;
  prompt?: string;
  caretClassName?: string;
};

export function TerminalLine({
  text,
  speed = 22,
  delay = 0,
  caret = true,
  whileInView = false,
  once = true,
  className,
  prompt = "> ",
  caretClassName,
}: Props) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    let running = true;
    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    const start = () => {
      if (startedRef.current && once) return;
      startedRef.current = true;
      setShown("");
      setDone(false);
      timeoutId = window.setTimeout(() => {
        let i = 0;
        intervalId = window.setInterval(() => {
          if (!running) return;
          i++;
          setShown(text.slice(0, i));
          if (i >= text.length) {
            window.clearInterval(intervalId);
            setDone(true);
          }
        }, speed);
      }, delay);
    };

    if (!whileInView) {
      start();
    } else {
      const el = ref.current;
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              start();
              if (once) obs.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return () => {
        running = false;
        if (timeoutId) clearTimeout(timeoutId);
        if (intervalId) clearInterval(intervalId);
        obs.disconnect();
      };
    }

    return () => {
      running = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay, whileInView, once]);

  return (
    <div
      ref={ref}
      className={cn(
        "font-mono text-[12px] text-[var(--color-mid)] whitespace-pre",
        className
      )}
    >
      <span className="text-[var(--color-accent)] mr-1">{prompt}</span>
      {shown}
      {caret && (
        <span
          aria-hidden
          className={cn(
            "ml-0.5 inline-block h-3 w-1.5 align-[-2px]",
            done ? "bg-[var(--color-accent)]" : "bg-[var(--color-hi)]",
            caretClassName
          )}
          style={{ animation: "nocz-blink 0.85s steps(1) infinite" }}
        />
      )}
    </div>
  );
}
