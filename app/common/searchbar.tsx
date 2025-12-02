"use client";

import React, { useRef } from "react";
import { TextInput } from "@cooperateDesign";
import { useKeyboardOffset } from "./useKeyboardOffset";
import clsx from "clsx";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isModalOpen: boolean;
};

export default function SearchBar({ searchQuery, setSearchQuery, isModalOpen }: Props) {
  const keyboardHeight = useKeyboardOffset();
  const keyboardOpen = keyboardHeight > 0;
  const inputRef = useRef<HTMLInputElement>(null);

  //
  // MODE 1 — STICKY (Tastatur zu)
  //
  const stickyStyle: React.CSSProperties = {
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: "85%",
    maxWidth: "420px",
    zIndex: 20,
  };

  //
  // MODE 2 — FIXED (Tastatur offen)
  //
  const fixedStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    margin: "0 auto",
    width: "85%",
    maxWidth: "420px",
    bottom: keyboardHeight,
    zIndex: 9999,
  };

  //
  // Android & iOS → zuverlässig zum Top scrollen
  //
  const handleFocus = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
      inputRef.current?.scrollIntoView({ block: "start" });
    }, 60); // iOS braucht Delay wegen Keyboard-Animation
  };

  return (
    <div
      style={keyboardOpen ? fixedStyle : stickyStyle}
      className={clsx(isModalOpen && "hidden")}
    >
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
