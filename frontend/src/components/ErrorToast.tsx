import React from "react";

interface ErrorToastProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorToast({ message, onDismiss }: ErrorToastProps): React.ReactElement | null {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 z-50 max-w-sm rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm text-red-100 shadow-2xl backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-red-300" />
        <div className="flex-1">
          <p className="font-semibold">Chat error</p>
          <p className="mt-1 leading-6">{message}</p>
        </div>
        <button type="button" onClick={onDismiss} className="text-red-200 transition hover:text-white">
          Dismiss
        </button>
      </div>
    </div>
  );
}
