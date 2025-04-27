import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateRoute, useUpdateRoute, type RoutePhase, calculateRouteProgress } from '@/lib/queries/routes';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, CheckCircle2, Circle, GripVertical } from 'lucide-react';
import RoutePhaseEditor from './RoutePhaseEditor';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import Achievement from '@/components/ui/achievement';

interface PersonalRouteProps {
  userId: string;
  route?: {
    id: string;
    goal: string;
    phases: RoutePhase[];
  };
}

function SortablePhase({ phase, phaseIndex, onUpdate, onToggleTask }: {
  phase: RoutePhase;
  phaseIndex: number;
  onUpdate: (phaseIndex: number, updatedPhase: RoutePhase) => void;
  onToggleTask: (phaseIndex: number, taskIndex: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: phase.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className={phase.completed ? 'bg-muted/50' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div {...attributes} {...listeners} className="cursor-grab">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {phase.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    {phase.name}
                  </CardTitle>
                </div>
                <RoutePhaseEditor
                  phase={phase}
                  onSave={(updatedPhase) => onUpdate(phaseIndex, updatedPhase)}
                />
              </div>
              {phase.description && (
                <CardDescription>{phase.description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {phase.checklist.map((task, taskIndex) => (
              <div
                key={task.id}
                className="flex items-start gap-2"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(phaseIndex, taskIndex)}
                />
                <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <Progress 
              value={calculateProgress([phase])} 
              className="h-1"
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PersonalRoute({ userId, route }: PersonalRouteProps) {
  const [newGoal, setNewGoal] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);
  const createRoute = useCreateRoute();
  const updateRoute = useUpdateRoute();
  const { toast } = useToast();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    
    try {
      await createRoute.mutateAsync({
        userId,
        goal: newGoal,
      });
      
      setNewGoal('');
      toast({
        title: "Rota criada!",
        description: "Sua jornada personalizada foi criada com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar rota",
        description: "Não foi possível criar sua rota. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleTask = async (phaseIndex: number, taskIndex: number) => {
    if (!route) return;
    
    const newPhases = [...route.phases];
    const phase = newPhases[phaseIndex];
    const task = phase.checklist[taskIndex];
    
    const wasCompleted = phase.completed;
    task.completed = !task.completed;
    
    // Check if all tasks in phase are completed
    phase.completed = phase.checklist.every(task => task.completed);
    
    try {
      await updateRoute.mutateAsync({
        routeId: route.id,
        phases: newPhases,
      });
      
      if (phase.completed && !wasCompleted) {
        setShowAchievement(true);
        toast({
          title: "Fase concluída!",
          description: "Parabéns por completar mais uma etapa da sua jornada!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar a tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdatePhase = async (phaseIndex: number, updatedPhase: RoutePhase) => {
    if (!route) return;
    
    const newPhases = [...route.phases];
    newPhases[phaseIndex] = updatedPhase;
    
    try {
      await updateRoute.mutateAsync({
        routeId: route.id,
        phases: newPhases,
      });
      
      toast({
        title: "Fase atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar fase",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !route) return;
    
    const oldIndex = route.phases.findIndex(p => p.id === active.id);
    const newIndex = route.phases.findIndex(p => p.id === over.id);
    
    if (oldIndex === newIndex) return;
    
    const newPhases = [...route.phases];
    const [movedPhase] = newPhases.splice(oldIndex, 1);
    newPhases.splice(newIndex, 0, movedPhase);
    
    try {
      await updateRoute.mutateAsync({
        routeId: route.id,
        phases: newPhases,
      });
    } catch (error) {
      toast({
        title: "Erro ao reordenar fases",
        description: "Não foi possível salvar a nova ordem. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const calculateProgress = (phases: RoutePhase[]): number => {
    const totalTasks = phases.reduce((sum, phase) => sum + phase.checklist.length, 0);
    const completedTasks = phases.reduce((sum, phase) => 
      sum + phase.checklist.filter(task => task.completed).length, 0
    );
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };
  
  if (!route) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Rota</CardTitle>
          <CardDescription>
            Defina um objetivo pessoal e criaremos uma rota personalizada para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateRoute} className="space-y-4">
            <Input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Ex: Quero abrir minha empresa"
            />
            <Button type="submit" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar Rota
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }
  
  const progress = calculateProgress(route.phases);
  
  return (
    <div className="space-y-6">
      <Achievement 
        show={showAchievement} 
        onComplete={() => setShowAchievement(false)}
        type="phase"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>{route.goal}</CardTitle>
          <CardDescription>
            Progresso total: {progress}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
      
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={route.phases.map(phase => phase.id)}
          strategy={verticalListSortingStrategy}
        >
          {route.phases.map((phase, phaseIndex) => (
            <SortablePhase
              key={phase.id}
              phase={phase}
              phaseIndex={phaseIndex}
              onUpdate={handleUpdatePhase}
              onToggleTask={handleToggleTask}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
