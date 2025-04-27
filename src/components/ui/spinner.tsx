import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  message?: string;
  className?: string;
}

export default function Spinner({ message, className }: SpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}