import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseLoadingStateOptions {
  successMessage?: string;
  errorMessage?: string;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = useCallback(async <T>(
    promise: Promise<T>,
    {
      onSuccess,
      onError,
    }: {
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<T | undefined> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await promise;
      
      if (options.successMessage) {
        toast({
          title: "Sucesso",
          description: options.successMessage,
        });
      }
      
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      
      if (options.errorMessage) {
        toast({
          title: "Erro",
          description: options.errorMessage,
          variant: "destructive",
        });
      }
      
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [options.successMessage, options.errorMessage, toast]);

  return {
    isLoading,
    error,
    execute,
    setError,
  };
}