// app/common/useKeyboardOffset.ts
import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { Keyboard, PluginListenerHandle } from "@capacitor/keyboard";

export function useKeyboardOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let showSub: PluginListenerHandle | undefined;
    let hideSub: PluginListenerHandle | undefined;

    // --- NATIVE CAPACITOR APP ---
    if (Capacitor.isNativePlatform()) {
      // async Listener setzen
      Keyboard.addListener("keyboardWillShow", (info) => {
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
