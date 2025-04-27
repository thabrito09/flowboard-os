import { useState } from 'react';
import { supabase } from '@/lib/supabase';  // Certifique-se de que o supabase.js está configurado corretamente

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      // Tente o login com email e senha usando Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message); // Exibe a mensagem de erro se falhar
      } else {
        // Se o login for bem-sucedido, redirecione para a página principal ou dashboard
        console.log('Usuário autenticado com sucesso');
        window.location.href = '/dashboard';  // Redireciona para o dashboard (pode ser alterado para outra página)
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setErrorMessage('Erro no login, tente novamente mais tarde.'); // Exibe uma mensagem genérica de erro
    } finally {
      setLoading(false); // Libera o botão de login novamente após o processamento
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Digite seu email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium">Senha</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Digite sua senha"
        />
      </div>

      {/* Exibe a mensagem de erro se houver */}
      {errorMessage && <div className="text-red-600 text-sm">{errorMessage}</div>}

      <button 
        type="submit" 
        className="w-full p-2 bg-red-600 text-white rounded-md" 
        disabled={loading}  // Desabilita o botão enquanto carrega
      >
        {loading ? 'Entrando...' : 'Entrar'}  {/* Exibe "Entrando..." durante o processamento */}
      </button>
    </form>
  );
};

export default AuthForm;
