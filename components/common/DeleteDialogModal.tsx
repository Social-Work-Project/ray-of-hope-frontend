import React, { FC, useEffect } from "react";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  isOpen,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item?",
  itemName,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-2 text-gray-600">
          {description}
        </p>

        {itemName && (
          <p className="mt-1 text-sm text-red-500 font-medium">
            {itemName}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;