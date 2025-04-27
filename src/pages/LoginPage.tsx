import { useState, useEffect } from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/ui/spinner';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F2]">
        <Spinner message="Verificando sessão..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8F6F2]">
      <div className="w-full max-w-md space-y-8 relative">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-[#E44332] to-[#C33A2A] bg-clip-text text-transparent">
            Flowboard OS
          </h1>
          <p className="text-xl font-medium text-[#1E1E1E]">
            Prepare-se para transformar sua vida
          </p>
          <p className="text-sm text-[#666666] font-medium">
            Sistema exclusivo para membros autorizados
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#E44332]/10 to-[#C33A2A]/10 rounded-2xl transform -rotate-1"></div>
          <div className="relative bg-white rounded-xl shadow-xl p-8">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}