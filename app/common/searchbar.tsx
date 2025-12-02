"use client";

import React, { useRef } from "react";
import { TextInput } from "@cooperateDesign";
import clsx from "clsx";
import { useKeyboardOffset } from "./useKeyboardOffset";

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
  
  const offset = useKeyboardOffset();
  const keyboardVisible = offset > 0;
  const inputRef = useRef<HTMLInputElement>(null);

  // FIXED (Keyboard sichtbar)
  const styleFixed: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: "85%", 
    bottom: offset, 
    zIndex: 9999,
  };

  // STICKY (normal)
  const styleSticky: React.CSSProperties = {
    position: "sticky",
    left: 0,
    right: 0,
    marginLeft: "auto",
    marginRight: "auto",
    width: "85%",
    bottom: 16,
    zIndex: 20,
  };

  const handleFocus = () => {
    // Automatisch an den oberen Rand scrollen
    setTimeout(() => {
      inputRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }, 0);
  };

  return (
    <div
      className={clsx(
        isModalOpen && "hidden",
        "transition-all duration-200"
      )}
      style={keyboardVisible ? styleFixed : styleSticky}
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
