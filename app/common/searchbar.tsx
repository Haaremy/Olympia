"use client";

import React from "react";
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

  // FIXED MODE → bei sichtbarer Tastatur
  const styleFixed: React.CSSProperties = {
    position: "fixed",
    left: "50%",
    transform: `translateX(-50%) translateY(-${offset}px)`,
    bottom: 0,
    zIndex: 9999,
  };

  // STICKY MODE → normal im Layout
  const styleSticky: React.CSSProperties = {
    position: "sticky",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,
  };

  return (
    <div
      className={clsx(
        isModalOpen && "hidden",
        "w-[85%] sm:w-[50%] lg:w-[25%] max-w-md transition-all duration-200"
      )}
      style={keyboardVisible ? styleFixed : styleSticky}
    >
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="px-6 py-3 shadow-xl rounded-xl bg-white dark:bg-gray-700"
      />
    </div>
  );
}
