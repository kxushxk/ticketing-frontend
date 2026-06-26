import { useToast } from "../context/useToast";

const styles: Record<string, string> = {
  success: "bg-success text-white",
  error: "bg-earth text-white",
  info: "bg-primary text-white",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${styles[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 rounded p-0.5 opacity-70 hover:opacity-100"
          >
            âœ•
          </button>
        </div>
      ))}
    </div>
  );
}
