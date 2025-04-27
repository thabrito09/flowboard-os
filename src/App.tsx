import { useState } from 'react';
import { ThemeProvider as ColorThemeProvider } from '@/components/theme-provider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import MobileHeader from '@/components/layout/MobileHeader';
import Dashboard from '@/components/dashboard/Dashboard';
import MentorChat from '@/components/mentor/MentorChat';
import LifeAreas from '@/components/life-areas/LifeAreas';
import MySpace from '@/components/my-space/MySpace';
import MyJourney from '@/components/journey/MyJourney';
import CalendarPage from '@/components/calendar/CalendarPage';
import SettingsPage from '@/components/settings/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import { Toaster } from '@/components/ui/toaster';
import { UserProvider, useUser } from '@/contexts/UserContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { userData } = useUser();

  if (!userData?.id) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { userData } = useUser();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-[80%] max-w-[300px] bg-background animate-in slide-in-from-left">
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="md:hidden">
          <MobileHeader 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />
        </div>
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Navigate to={`/dashboard/${userData?.id}`} replace />} />
            <Route path="/dashboard/:userId" element={<Dashboard />} />
            <Route path="/mentor/:userId" element={<MentorChat />} />
            <Route path="/areas/:userId" element={<LifeAreas />} />
            <Route path="/space/:userId" element={<MySpace />} />
            <Route path="/journey/:userId" element={<MyJourney />} />
            <Route path="/calendar/:userId" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ColorThemeProvider defaultTheme="light" storageKey="flowboard-theme">
        <UserProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AppContent />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </ThemeProvider>
        </UserProvider>
      </ColorThemeProvider>
    </Router>
  );
}

export default App;