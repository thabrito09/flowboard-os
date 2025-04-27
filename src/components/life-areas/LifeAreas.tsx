import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Palette, BookOpen, Dumbbell, Sparkles, Briefcase, PiggyBank } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import MindArea from './areas/MindArea';
import CreationArea from './areas/CreationArea';
import LearningArea from './areas/LearningArea';
import BodyEnergyArea from './areas/BodyEnergyArea';
import FaithPurposeArea from './areas/FaithPurposeArea';
import WorkArea from './areas/WorkArea';
import FinanceArea from './areas/FinanceArea';

export type LifeAreaTab = 'mind' | 'creation' | 'learning' | 'body' | 'faith' | 'work' | 'finances';

export default function LifeAreas() {
  const { userId } = useParams<{ userId: string }>();
  const { userData } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('section') as LifeAreaTab || 'mind';
  const [activeTab, setActiveTab] = useState<LifeAreaTab>(initialTab);
  
  // Early return if userId doesn't match current user
  if (!userId || !userData?.id || userId !== userData.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Acesso não autorizado.</p>
      </div>
    );
  }
  
  interface AreaConfig {
    id: LifeAreaTab;
    name: string;
    icon: JSX.Element;
  }
  
  const areas: AreaConfig[] = [
    { id: 'mind', name: 'Mente', icon: <Brain className="h-4 w-4" /> },
    { id: 'creation', name: 'Criação', icon: <Palette className="h-4 w-4" /> },
    { id: 'learning', name: 'Aprendizado', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'body', name: 'Corpo', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'faith', name: 'Fé & Propósito', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'work', name: 'Trabalho', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'finances', name: 'Finanças', icon: <PiggyBank className="h-4 w-4" /> },
  ];
  
  const handleTabChange = (value: LifeAreaTab) => {
    setActiveTab(value);
    setSearchParams({ section: value });
  };
  
  const renderAreaContent = (areaId: LifeAreaTab) => {
    switch (areaId) {
      case 'mind':
        return <MindArea userId={userId} />;
      case 'creation':
        return <CreationArea userId={userId} />;
      case 'learning':
        return <LearningArea userId={userId} />;
      case 'body':
        return <BodyEnergyArea userId={userId} />;
      case 'faith':
        return <FaithPurposeArea userId={userId} />;
      case 'work':
        return <WorkArea userId={userId} />;
      case 'finances':
        return <FinanceArea userId={userId} />;
      default:
        return <MindArea userId={userId} />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Áreas da Vida</h1>
        <p className="text-muted-foreground">
          Gerencie e desenvolva as diferentes áreas da sua vida.
        </p>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={(value) => handleTabChange(value as LifeAreaTab)}
        className="space-y-4"
      >
        <div className="overflow-auto pb-2">
          <TabsList className="inline-flex h-10 items-center bg-muted p-1 rounded-md">
            {areas.map(area => (
              <TabsTrigger
                key={area.id}
                value={area.id}
                className="h-8 px-3 gap-1.5"
              >
                {area.icon}
                <span className="hidden sm:inline-block">{area.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {areas.map(area => (
          <TabsContent key={area.id} value={area.id} className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
            {renderAreaContent(area.id)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}