// app/common/useKeyboardOffset.ts
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Keyboard } from "@capacitor/keyboard";

export function useKeyboardOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Typ für Listener, die .remove() haben
    type ListenerHandle = { remove: () => void };

    let showSub: ListenerHandle | undefined;
    let hideSub: ListenerHandle | undefined;

    // --- NATIVE CAPACITOR APP ---
    if (Capacitor.isNativePlatform()) {
      showSub = Keyboard.addListener("keyboardWillShow", (info) => {
        setOffset(info.keyboardHeight ?? 0);
      });

      hideSub = Keyboard.addListener("keyboardWillHide", () => {
        setOffset(0);
      });

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
