"use client";

import React from "react";
import { TextInput } from "@cooperateDesign";
import clsx from "clsx";
import { useKeyboardOffset } from "../useKeyboardOffset";

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  isModalOpen,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  isModalOpen: boolean;
}) {
  const offset = useKeyboardOffset();
  const keyboardVisible = offset > 0;

  return (
    <div
      className={clsx(
        isModalOpen ? "hidden" : "block",
        "fixed left-1/2 -translate-x-1/2 z-[9999] w-[85%] sm:w-[50%] lg:w-[25%] max-w-md transition-all duration-150"
      )}
      style={{
        bottom: keyboardVisible ? 0 : 20,
        transform: keyboardVisible ? `translateY(-${offset}px)` : "translateY(0)",
      }}
    >
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          // scroll to top but keep searchbar fixed
          setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 10);
        }}
        className="px-6 py-3 shadow-xl rounded-xl bg-white dark:bg-gray-700"
      />
    </div>
  );
}
