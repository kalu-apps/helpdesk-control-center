import { Loader2 } from "lucide-react";

interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2.5 w-full h-full min-h-[180px] select-none text-slate-500">
      <Loader2
        className="w-4 h-4 animate-spin text-slate-400"
        strokeWidth={2}
      />
      {message && (
        <span className="text-xs text-slate-500 font-medium">{message}</span>
      )}
    </div>
  );
}
