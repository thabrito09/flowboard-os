import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { getThemeStageFromLevel } from '@/lib/theme';

export type NotificationType = 'success' | 'info' | 'warning' | 'achievement';

interface NotificationOptions {
  title: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Get theme-based styles for notifications
function getNotificationStyles(type: NotificationType, userLevel: number) {
  const themeStage = getThemeStageFromLevel(userLevel);
  
  const baseStyles = {
    success: 'bg-green-50 border-green-200 dark:bg-green-900/20',
    info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20',
    warning: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20',
    achievement: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20',
  };
  
  return `${baseStyles[type]} ${themeStage === 'master' ? 'animate-sparkle' : ''}`;
}

// Show notification with theme-aware styling
export function showNotification(options: NotificationOptions, userId?: string) {
  const { title, description, type = 'info', duration = 5000, action } = options;
  const { toast } = useToast();
  
  // Request permission for system notifications if not already granted
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  // Show system notification if permitted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: description,
      icon: '/favicon.ico',
    });
  }
  
  // Show toast notification
  toast({
    title,
    description,
    duration,
    className: getNotificationStyles(type, userId ? parseInt(userId) : 1),
    action: action && {
      label: action.label,
      onClick: action.onClick,
    },
  });
}

// Mission notifications
export const missionNotifications = {
  completed: () => ({
    title: 'Missão concluída!',
    description: 'Você ganhou XP para sua evolução!',
    type: 'success' as const,
  }),
  
  allCompleted: () => ({
    title: 'Parabéns!',
    description: 'Você concluiu todas as missões de hoje. Continue avançando!',
    type: 'achievement' as const,
  }),
};

// Focus timer notifications
export const timerNotifications = {
  almostDone: () => ({
    title: 'Você está quase lá!',
    description: 'Só mais 5 minutos para concluir seu foco máximo!',
    type: 'info' as const,
  }),
  
  completed: () => ({
    title: 'Foco finalizado!',
    description: 'Hora de registrar sua conquista no Meu Espaço ou na sua Rota!',
    type: 'success' as const,
  }),
};

// Route notifications
export const routeNotifications = {
  taskCompleted: () => ({
    title: 'Missão da fase conquistada!',
    description: 'Você está avançando na sua Rota!',
    type: 'success' as const,
  }),
  
  phaseCompleted: () => ({
    title: 'Fase completa!',
    description: 'Prepare-se para o próximo nível da sua jornada.',
    type: 'achievement' as const,
  }),
};

// Space notifications
export const spaceNotifications = {
  inactive: () => ({
    title: 'Vamos lá!',
    description: 'Cada pequena ação aproxima você da sua evolução.',
    type: 'info' as const,
  }),
};

// Hook for easy notification access
export function useNotifications() {
  const { userData } = useUser();
  const { toast } = useToast();
  
  return {
    show: (options: NotificationOptions) => showNotification(options, userData?.id),
    mission: missionNotifications,
    timer: timerNotifications,
    route: routeNotifications,
    space: spaceNotifications,
  };
}