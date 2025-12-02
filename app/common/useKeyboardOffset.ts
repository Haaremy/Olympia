import { useEffect, useState } from "react";

export function useKeyboardOffset() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const handler = () => {
      const diff = window.innerHeight - vv.height;

      if (diff > 80) {
        // iOS benötigt offsetTop
        setHeight(diff + vv.offsetTop);
      } else {
        setHeight(0);
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

  return height;
}
