import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserMissions, useMissionMutation, useCreateMission } from '@/lib/queries';
import { useNotifications } from '@/lib/notifications';
import FirstMissionPopup from '@/components/ui/first-mission-popup';
import XPReward from '@/components/ui/xp-reward';
import XPProgress from '@/components/ui/xp-progress';

export default function DailyMissions() {
  const { userData } = useUser();
  const [animatingTask, setAnimatingTask] = useState<string | null>(null);
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [showFirstMissionPopup, setShowFirstMissionPopup] = useState(false);
  const [showXPReward, setShowXPReward] = useState(false);
  const [previousXP, setPreviousXP] = useState(userData?.xp || 0);
  const notifications = useNotifications();
  
  if (!userData?.id) {
    return <div className="flex justify-center py-8">Carregando dados do usuário...</div>;
  }
  
  const { data: missions = [], isLoading } = useUserMissions(userData.id);
  const missionMutation = useMissionMutation();
  const createMissionMutation = useCreateMission();
  
  const handleTaskToggle = async (id: string, currentStatus: boolean) => {
    setAnimatingTask(id);
    
    try {
      // Store current XP before update
      setPreviousXP(userData.xp);
      
      await missionMutation.mutateAsync({ missionId: id, isCompleted: !currentStatus });
      
      if (!currentStatus) {
        // Check if this is the first completed mission
        const completedMissions = missions.filter(m => m.is_completed);
        if (completedMissions.length === 0) {
          setShowFirstMissionPopup(true);
        } else {
          setShowXPReward(true);
        }
      }
      
      // Check if all missions are completed
      const allMissions = await useUserMissions(userData.id).data;
      if (allMissions?.every(m => m.is_completed)) {
        notifications.show(notifications.mission.allCompleted());
      }
    } catch (error) {
      notifications.show({
        title: "Erro ao atualizar missão",
        description: "Tente novamente mais tarde",
        type: "warning",
      });
    } finally {
      setTimeout(() => {
        setAnimatingTask(null);
      }, 600);
    }
  };
  
  const handleAddMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionTitle.trim() || !userData.id) return;
    
    try {
      await createMissionMutation.mutateAsync({
        userId: userData.id,
        title: newMissionTitle,
      });
      
      setNewMissionTitle('');
      notifications.show({
        title: "Missão criada!",
        description: "Nova missão adicionada com sucesso",
        type: "success",
      });
    } catch (error) {
      notifications.show({
        title: "Erro ao criar missão",
        description: "Tente novamente mais tarde",
        type: "warning",
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Carregando missões...</div>;
  }
  
  const completedCount = missions?.filter(mission => mission.is_completed).length ?? 0;
  const totalCount = missions?.length ?? 0;
  
  return (
    <div className="space-y-5">
      <FirstMissionPopup 
        show={showFirstMissionPopup}
        onClose={() => setShowFirstMissionPopup(false)}
      />
      
      <XPReward
        show={showXPReward}
        amount={50}
        onComplete={() => setShowXPReward(false)}
      />
      
      <form onSubmit={handleAddMission} className="flex gap-2">
        <Input
          placeholder="Nova missão..."
          value={newMissionTitle}
          onChange={(e) => setNewMissionTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </form>
      
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="px-3 py-1">
          {completedCount}/{totalCount} Concluídas
        </Badge>
        
        {completedCount === totalCount && totalCount > 0 && (
          <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1">
            <Check className="h-3 w-3 mr-1" /> Todas completas!
          </Badge>
        )}
      </div>
      
      {/* XP Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">XP: {userData.xp}</span>
          <span className="text-muted-foreground">Próximo nível: {userData.xpToNextLevel}</span>
        </div>
        <XPProgress 
          value={(userData.xp / userData.xpToNextLevel) * 100}
          previousValue={(previousXP / userData.xpToNextLevel) * 100}
        />
      </div>
    
      <div className="space-y-4">
        {missions?.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Nenhuma missão encontrada. Adicione sua primeira missão!
          </div>
        ) : (
          missions?.map((mission) => (
            <div 
              key={mission.id}
              className={cn(
                "flex items-start space-x-3 p-3 rounded-md transition-all duration-300",
                mission.is_completed ? "bg-muted/50" : "bg-card",
                animatingTask === mission.id ? "scale-105" : ""
              )}
            >
              <Checkbox
                checked={mission.is_completed}
                onCheckedChange={() => handleTaskToggle(mission.id, mission.is_completed)}
                className={cn(
                  "mt-0.5 transition-all duration-500",
                  mission.is_completed ? "bg-primary border-primary" : "",
                  animatingTask === mission.id ? "scale-125" : ""
                )}
              />
              <div className="flex-1">
                <p className={cn(
                  "font-medium transition-all duration-300",
                  mission.is_completed ? "text-muted-foreground line-through" : ""
                )}>
                  {mission.title}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <p className="text-xs text-muted-foreground italic">
        Cada missão concluída concede 50 XP.
      </p>
    </div>
  );
}