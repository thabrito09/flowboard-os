import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import { useUser } from '@/contexts/UserContext';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Compass, 
  FolderKanban, 
  BarChart3,
  Calendar,
  Settings,
  Sun,
  Moon,
  LogOut,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import * as auth from '@/lib/auth';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const { userData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!userData?.id) return null;
  
  const menuItems = [
    { id: 'dashboard', path: `/dashboard/${userData.id}`, label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'mentor', path: `/mentor/${userData.id}`, label: 'Mentor Interno', icon: <MessageSquareText className="h-5 w-5" /> },
    { id: 'areas', path: `/areas/${userData.id}`, label: 'Áreas da Vida', icon: <Compass className="h-5 w-5" /> },
    { id: 'space', path: `/space/${userData.id}`, label: 'Meu Espaço', icon: <FolderKanban className="h-5 w-5" /> },
    { id: 'journey', path: `/journey/${userData.id}`, label: 'Minha Jornada', icon: <BarChart3 className="h-5 w-5" /> },
    { id: 'calendar', path: `/calendar/${userData.id}`, label: 'Agenda', icon: <Calendar className="h-5 w-5" /> }
  ];

  const getCurrentView = () => {
    const path = location.pathname;
    const view = menuItems.find(item => path.startsWith(item.path));
    return view ? view.id : 'dashboard';
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Calculate XP progress percentage
  const xpProgress = (userData.xp / userData.xpToNextLevel) * 100;
  
  return (
    <div className="flex flex-col h-full w-64 md:w-72 border-r border-border bg-card">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="flex justify-end p-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3">
            <span className="text-primary-foreground font-bold">F</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Flowboard OS</h1>
            <div className="text-xs text-muted-foreground">Evolução Pessoal</div>
          </div>
        </div>
        
        {/* User XP and Level Display */}
        <div className="mb-6 px-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Nível {userData.level}</span>
            <span className="text-xs text-muted-foreground">{userData.xp}/{userData.xpToNextLevel} XP</span>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>
        
        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={getCurrentView() === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start px-3 py-6 h-auto ${
                getCurrentView() === item.id ? 'font-medium' : ''
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* Bottom Settings Area */}
      <div className="shrink-0 p-4 border-t border-border space-y-2">
        <div className="flex justify-between items-center px-3 mb-2">
          <div className="flex items-center">
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 mr-2" />
            ) : (
              <Sun className="h-4 w-4 mr-2" />
            )}
            <span className="text-sm">Tema {theme === 'dark' ? 'Escuro' : 'Claro'}</span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start px-3 py-2"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="text-sm">Configurações</span>
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start px-3 py-2 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span className="text-sm">Sair</span>
        </Button>
      </div>
    </div>
  );
}