"use client";

import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "@cooperateDesign";
import { Keyboard } from "@capacitor/keyboard";
import type { PluginListenerHandle } from "@capacitor/core";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
};

export default function SearchBar({ searchQuery, setSearchQuery }: Props) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportOffset, setViewportOffset] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  //
  // 1. Native Keyboard Events (iOS & Android)
  //
  useEffect(() => {
    let showSub: PluginListenerHandle | undefined;
    let hideSub: PluginListenerHandle | undefined;

    const attach = async () => {
      showSub = await Keyboard.addListener("keyboardWillShow", (info) => {
        setKeyboardHeight(info.keyboardHeight ?? 0);
      });

      hideSub = await Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardHeight(0);
      });
    };

    attach();

    return () => {
      showSub?.remove();
      hideSub?.remove();
    };
  }, []);

  //
  // 2. iOS: VisualViewport Offset (wichtig beim Scrollen)
  //
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const updateOffset = () => {
      setViewportOffset(vv.offsetTop);
    };

    vv.addEventListener("resize", updateOffset);
    vv.addEventListener("scroll", updateOffset);
    updateOffset();

    return () => {
      vv.removeEventListener("resize", updateOffset);
      vv.removeEventListener("scroll", updateOffset);
    };
  }, []);

  //
  // 3. Immer zum Top scrollen, zuverlässig
  //
  const handleFocus = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
      inputRef.current?.scrollIntoView({ block: "start" });
    }, 80);
  };

  const keyboardOpen = keyboardHeight > 0;

  //
  // 4. Exakte, geräteunabhängige Positionierung
  //
  const style: React.CSSProperties = keyboardOpen
    ? {
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        width: "85%",
        zIndex: 9999,

        // The MAGIC:
        // iOS scrolls the *visual viewport*, so we add its offset
        bottom: keyboardHeight - viewportOffset + 10,
      }
    : {
        position: "sticky",
        bottom: 10,
        width: "85%",
        margin: "0 auto",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 30,
      };

  return (
    <div style={style}>
      <TextInput
        ref={inputRef}
        value={searchQuery}
        onFocus={handleFocus}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }}
        placeholder="Search..."
        className="px-6 py-3 shadow-xl rounded-xl bg-white dark:bg-gray-700 w-full"
      />

    </div>
  );
}
