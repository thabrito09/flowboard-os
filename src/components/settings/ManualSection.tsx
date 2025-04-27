import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Target, Layout, MessageSquare, Compass, Star, PiggyBank, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManualCard {
  id: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

export default function ManualSection() {
  const [readCards, setReadCards] = useState<string[]>([]);
  
  const manualCards: ManualCard[] = [
    {
      id: 'xp',
      icon: <Brain className="h-5 w-5" />,
      title: 'Como ganhar XP?',
      description: 'Complete missões diárias, mantenha hábitos consistentes e evolua nas áreas da vida. Cada ação positiva contribui para seu crescimento no sistema. Missões diárias concedem 50 XP, e hábitos completados geram XP adicional.',
    },
    {
      id: 'million',
      icon: <PiggyBank className="h-5 w-5" />,
      title: 'Como montar sua Rota R$1M',
      description: 'A Rota R$1M é sua jornada para o primeiro milhão. Defina metas financeiras claras, acompanhe seu progresso e complete as fases. O sistema gera automaticamente um plano personalizado baseado em seus objetivos.',
    },
    {
      id: 'habits',
      icon: <Star className="h-5 w-5" />,
      title: 'Como criar hábitos diários',
      description: 'Em cada área da vida, você pode criar e acompanhar hábitos. Defina a frequência, mantenha sequências e ganhe XP por consistência. Quanto maior sua sequência, mais XP você ganha por hábito completado.',
    },
    {
      id: 'mentor',
      icon: <MessageSquare className="h-5 w-5" />,
      title: 'Como usar o Mentor Interno',
      description: 'O Mentor Interno é seu guia pessoal. Compartilhe desafios, dúvidas e reflexões para receber suporte emocional e sugestões práticas. Ele pode sugerir missões específicas baseadas em suas necessidades.',
    },
    {
      id: 'areas',
      icon: <Compass className="h-5 w-5" />,
      title: 'Como evoluir nas Áreas da Vida',
      description: 'Cada área (Mente, Criação, Aprendizado, Corpo, Fé, Trabalho e Finanças) possui ferramentas específicas. Complete objetivos, mantenha hábitos e acompanhe seu progresso em cada dimensão da sua vida.',
    },
    {
      id: 'space',
      icon: <Layout className="h-5 w-5" />,
      title: 'Como organizar seu Espaço',
      description: 'Seu espaço pessoal permite criar blocos de texto e checklists. Organize suas ideias, notas e tarefas livremente. Arraste e solte para reorganizar conforme sua preferência.',
    },
    {
      id: 'journey',
      icon: <Target className="h-5 w-5" />,
      title: 'Como criar sua Jornada',
      description: 'Defina um objetivo claro, divida em fases menores e crie checklists para cada etapa. O sistema ajuda a gerar um plano estruturado e acompanha seu progresso rumo aos seus objetivos.',
    },
    {
      id: 'calendar',
      icon: <Calendar className="h-5 w-5" />,
      title: 'Como usar a Agenda',
      description: 'Gerencie seus eventos e compromissos na agenda integrada. Crie eventos, defina lembretes e mantenha-se organizado. A agenda ajuda a visualizar suas atividades e manter o foco.',
    },
  ];
  
  const handleCardRead = (cardId: string) => {
    setReadCards(prev => [...prev, cardId]);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Manual de Uso</h2>
        <p className="text-muted-foreground">
          Aprenda a usar todas as funcionalidades do Flowboard OS
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {manualCards.map(card => {
          const isRead = readCards.includes(card.id);
          
          return (
            <Card 
              key={card.id}
              className={cn(
                "transition-all duration-200 border-none bg-gradient-to-br from-background to-muted/50",
                isRead ? "opacity-75" : "hover:shadow-md"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {card.icon}
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-base">
                  {card.description}
                </CardDescription>
                <Button
                  variant={isRead ? "outline" : "default"}
                  className="w-full"
                  onClick={() => handleCardRead(card.id)}
                  disabled={isRead}
                >
                  {isRead ? "Entendi ✓" : "Marcar como Lido"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}