import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive";
};

function toast({ title, description, variant }: ToastProps) {
  const message = String(title ?? description ?? "");
  const opts = title && description ? { description: String(description) } : undefined;

  if (variant === "destructive") {
    return sonnerToast.error(message, opts);
  }
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
