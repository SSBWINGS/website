"use client";

import { useEffect, useState } from "react";

/** Types each word out, holds it, deletes it, moves to the next — the hero's
 *  animated line. Shared by the hero and its admin preview. */
export function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (!words.length) return;
    const w = words[i % words.length];
    const delay = del ? 45 : text === w ? 1700 : 95;
    const t = setTimeout(() => {
      if (!del && text === w) setDel(true);
      else if (del && text === "") { setDel(false); setI((n) => (n + 1) % words.length); }
      else setText(w.slice(0, text.length + (del ? -1 : 1)));
    }, delay);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}
