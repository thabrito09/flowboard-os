import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useNotifications } from '@/lib/notifications';
import BlockList from './BlockList';

export default function MySpace() {
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useUser();
  const notifications = useNotifications();
  
  // Inactivity notification
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        notifications.show(notifications.space.inactive());
      }, 5 * 60 * 1000); // 5 minutes
    };
    
    // Reset timer on user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    
    // Start initial timer
    resetTimer();
    
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [notifications]);
  
  if (!userId || !userData?.id || userId !== userData.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Acesso não autorizado.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Espaço</h1>
        <p className="text-muted-foreground">
          Organize suas ideias, notas e listas livremente.
        </p>
      </div>
      
      <BlockList userId={userId} />
    </div>
  );
}