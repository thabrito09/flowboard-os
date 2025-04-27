import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

export function useAppNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useUser();
  
  const navigateWithTransition = (path: string) => {
    // Add a class to trigger exit animation
    document.body.classList.add('page-transition');
    
    // Wait for animation
    setTimeout(() => {
      navigate(path);
      
      // Remove class after navigation
      requestAnimationFrame(() => {
        document.body.classList.remove('page-transition');
      });
    }, 150);
  };
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/mentor')) return 'Mentor Interno';
    if (path.includes('/areas')) return 'Áreas da Vida';
    if (path.includes('/space')) return 'Meu Espaço';
    if (path.includes('/journey')) return 'Minha Jornada';
    if (path.includes('/calendar')) return 'Agenda';
    if (path.includes('/settings')) return 'Configurações';
    return 'Flowboard OS';
  };
  
  return {
    navigateWithTransition,
    getPageTitle,
    currentPath: location.pathname,
    isAuthenticated: !!userData?.id,
  };
}