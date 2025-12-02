"use client";

import React, { useRef } from "react";
import { TextInput } from "@cooperateDesign";
import clsx from "clsx";
import { useKeyboardOffsetStable } from "./useKeyboardOffset";

type Props = {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isModalOpen: boolean;
};

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  isModalOpen,
}: Props) {
  const keyboardHeight = useKeyboardOffsetStable();
  const inputRef = useRef<HTMLInputElement>(null);

  const isKeyboardOpen = keyboardHeight > 0;

  const style: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: "85%",
    maxWidth: "420px",
    bottom: isKeyboardOpen ? keyboardHeight : 16,
    zIndex: 9999,
    transition: "bottom 0.15s ease-out",
  };

  const handleFocus = () => {
    // iOS braucht minimalen Delay, sonst scrollt nichts
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }, 50);
  };

  return (
    <div
      className={clsx(!isModalOpen && "block", isModalOpen && "hidden")}
      style={style}
    >
      <TextInput
        ref={inputRef}
        placeholder="Search..."
        value={searchQuery}
        onFocus={handleFocus}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-6 py-3 shadow-xl rounded-xl bg-white dark:bg-gray-700 w-full"
      />
    </div>
  );
}
