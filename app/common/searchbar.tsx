"use client";

import React, { useEffect, useRef, useState } from "react";
import { TextInput } from "@cooperateDesign";
import { Keyboard, KeyboardInfo } from "@capacitor/keyboard";
import type { PluginListenerHandle } from '@capacitor/core';


type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
};

export default function SearchBar({ searchQuery, setSearchQuery }: Props) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let showHandler: PluginListenerHandle;
    let hideHandler: PluginListenerHandle;

    const attach = async () => {
      showHandler = await Keyboard.addListener(
        "keyboardWillShow",
        (info: KeyboardInfo) => {
          setKeyboardHeight(info.keyboardHeight ?? 0);
        }
      );

      hideHandler = await Keyboard.addListener("keyboardWillHide", () => {
        setKeyboardHeight(0);
      });
    };

    attach();

    return () => {
      showHandler?.remove();
      hideHandler?.remove();
    };
  }, []);

  const keyboardOpen = keyboardHeight > 0;

  const handleFocus = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
      inputRef.current?.scrollIntoView({ block: "start" });
    }, 60);
  };

  const stickyStyle: React.CSSProperties = {
    position: "sticky",
    bottom: 0,
    paddingBottom: "env(safe-area-inset-bottom)",
    width: "85%",
    margin: "0 auto",
    zIndex: 30,
  };

  const fixedStyle: React.CSSProperties = {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: keyboardHeight,
    width: "85%",
    zIndex: 9999,
  };

  return (
    <div style={keyboardOpen ? fixedStyle : stickyStyle}>
      <TextInput
        ref={inputRef}
        value={searchQuery}
        onFocus={handleFocus}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="px-6 py-3 shadow-xl rounded-xl bg-white dark:bg-gray-700 w-full"
      />
    </div>
  );
}
