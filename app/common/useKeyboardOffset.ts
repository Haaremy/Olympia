// app/common/useKeyboardOffset.ts
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Keyboard, KeyboardInfo } from "@capacitor/keyboard";

// Typ für das Rückgabeobjekt von addListener
type ListenerHandle = {
  remove: () => void;
};

export function useKeyboardOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let showSub: ListenerHandle | null = null;
    let hideSub: ListenerHandle | null = null;

    // --- NATIVE CAPACITOR APP ---
    if (Capacitor.isNativePlatform()) {
      Keyboard.addListener("keyboardWillShow", (info: KeyboardInfo) => {
        setOffset(info.keyboardHeight ?? 0);
      }).then((sub) => (showSub = sub));

      Keyboard.addListener("keyboardWillHide", () => {
        setOffset(0);
      }).then((sub) => (hideSub = sub));

      return () => {
        showSub?.remove();
        hideSub?.remove();
      };
    }

    // --- BROWSER FALLBACK ---
    const viewport = window.visualViewport;
    if (!viewport) return;

    const handler = () => {
      const diff = window.innerHeight - viewport.height;

      if (diff > 150) {
        setOffset(diff);
      } else {
        setOffset(0);
      }
    };

    viewport.addEventListener("resize", handler);
    viewport.addEventListener("scroll", handler);

    handler();

    return () => {
      viewport.removeEventListener("resize", handler);
      viewport.removeEventListener("scroll", handler);
    };
  }, []);

  return offset;
}
