'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/cooperateDesign";
import { useUI } from "./context/UIContext";

type UserInteractionProps = {
  username: string;
  onClose: () => void;
  onReport?: (reason: string) => void;
  onBlock?: () => void;
};

const UserInteraction: React.FC<UserInteractionProps> = ({
  username,
  onClose,
  onReport,
  onBlock,
}) => {
  const { setIsModalOpen } = useUI();
  const modalRef = useRef<HTMLDivElement>(null);
  const [showReportDropdown, setShowReportDropdown] = useState(false);

  const reportReasons = [
    "Username",
    "Profile picture",
    "Chat",
    "Spam",
    "Other",
  ];

  useEffect(() => {
    const modal = modalRef.current;
    setIsModalOpen(true);

    if (modal) {
      modal.focus();
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
    };
  }, [onClose, setIsModalOpen]);

  const handleReport = (reason: string) => {
    onReport?.(reason);
    setShowReportDropdown(false);
    onClose();
  };

  const handleBlock = () => {
    onBlock?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/20 dark:bg-black/30 backdrop-blur-sm z-50">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-lg w-96"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">@{username}</h2>
          <Button onClick={onClose}>X</Button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {/* Report */}
          <div className="relative">
            <Button
              variant="danger"
              onClick={() => setShowReportDropdown(!showReportDropdown)}
              className="w-full"
            >
              Melden
            </Button>

            {showReportDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md z-10">
                {reportReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReport(reason)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Block */}
          <Button
            variant="primary"
            onClick={handleBlock}
            className="w-full"
          >
            Blockieren
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInteraction;
