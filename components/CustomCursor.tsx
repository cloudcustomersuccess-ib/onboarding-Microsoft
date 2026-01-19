"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

const canListen = (query: MediaQueryList, handler: () => void) => {
  if (query.addEventListener) {
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }
  query.addListener(handler);
  return () => query.removeListener(handler);
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const noHover = window.matchMedia("(hover: none)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const evaluate = () => {
      const shouldDisable =
        coarsePointer.matches || noHover.matches || reduceMotion.matches;
      setEnabled(!shouldDisable);
    };

    evaluate();

    const removers = [
      canListen(coarsePointer, evaluate),
      canListen(noHover, evaluate),
      canListen(reduceMotion, evaluate),
    ];

    return () => {
      removers.forEach((remove) => remove());
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    let frame = 0;
    const handleMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      if (frame) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      });
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <div ref={cursorRef} className={styles.cursor} aria-hidden="true" />;
}
