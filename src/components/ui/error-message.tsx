import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorMessageProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function ErrorMessage({ message, action }: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
      {action && (
        <button 
          onClick={action.onClick}
          className="text-sm underline hover:no-underline ml-2"
        >
          {action.label}
        </button>
      )}
    </Alert>
  );
}