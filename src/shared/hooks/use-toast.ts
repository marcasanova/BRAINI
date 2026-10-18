import { toast as sonnerToast } from "sonner";
import { playSound } from "@/shared/lib/sound";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
};

function toast({ title, description, variant }: ToastProps) {
  const message = String(title ?? description ?? "");
  const opts = title && description ? { description: String(description) } : undefined;

  if (variant === "destructive") {
    playSound("error");
    return sonnerToast.error(message, opts);
  }
  playSound("success");
  return sonnerToast(message, opts);
}

function useToast() {
  return {
    toasts: [],
    toast,
    dismiss: () => {},
  };
}

export { useToast, toast };
