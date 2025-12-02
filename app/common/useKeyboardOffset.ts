import { useState, useEffect } from "react";

export function useKeyboardOffsetStable() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handler = () => {
      const viewportHeight = vv.height;
      const layoutHeight = window.innerHeight;

      const diff = layoutHeight - viewportHeight;

      if (diff > 80) {
        // echte Tastaturhöhe
        setKeyboardHeight(diff + (vv.offsetTop || 0));
      } else {
        setKeyboardHeight(0);
      }
    };

    vv.addEventListener("resize", handler);
    vv.addEventListener("scroll", handler);

    handler();

    return () => {
      vv.removeEventListener("resize", handler);
      vv.removeEventListener("scroll", handler);
    };
  }, []);

  return keyboardHeight;
}
