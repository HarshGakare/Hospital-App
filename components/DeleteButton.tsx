"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface DeleteButtonProps {
  action: (id: string) => Promise<void>;
  id: string;
  label?: string;
}

export default function DeleteButton({ action, id, label = "item" }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      try {
        await action(id);
        toast.success(`${label} deleted`);
      } catch {
        toast.error(`Failed to delete ${label}`);
      }
      setConfirming(false);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        confirming ? "bg-red-600 text-white" : "bg-red-50 text-red-600 hover:bg-red-100"
      }`}
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {confirming ? "Confirm?" : "Delete"}
    </button>
  );
}
