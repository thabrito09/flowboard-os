import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLoadingState } from '@/lib/hooks/use-loading-state';
import * as auth from '@/lib/auth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { isLoading, error, execute } = useLoadingState({
    errorMessage: "Erro ao fazer login",
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    execute(auth.signIn(email, password), {
      onSuccess: ({ user, profile }) => {
        if (!user?.id) {
          throw new Error('Erro ao recuperar dados do usuário');
        }

        if (!profile?.active) {
          throw new Error('Conta desativada. Entre em contato com o suporte.');
        }

        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo de volta, ${profile.name || 'usuário'}!`,
        });

        navigate(`/dashboard/${user.id}`, { replace: true });
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-[#1E1E1E]">Entrar</h2>
        <p className="text-sm text-[#666666]">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive" className="animate-in fade-in-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[#1E1E1E]">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white border-[#AAAAAA] focus:border-[#E44332] focus:ring-[#E44332]/20"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[#1E1E1E]">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="bg-white border-[#AAAAAA] focus:border-[#E44332] focus:ring-[#E44332]/20"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-[#E44332] hover:bg-[#C33A2A] transition-all duration-300 hover:scale-[1.02] h-12 text-lg font-medium" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Entrando...</span>
            </div>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </div>
  );
}