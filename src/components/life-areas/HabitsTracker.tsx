import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useHabits, useCreateHabit, useLogHabit, type Habit } from '@/lib/queries/habits';
import { useToast } from '@/hooks/use-toast';
import { Plus, Flame, Trophy, Calendar } from 'lucide-react';

interface HabitsTrackerProps {
  userId: string;
  areaId: string;
}

const DAYS_OF_WEEK = [
  { value: 'sun', label: 'Dom' },
  { value: 'mon', label: 'Seg' },
  { value: 'tue', label: 'Ter' },
  { value: 'wed', label: 'Qua' },
  { value: 'thu', label: 'Qui' },
  { value: 'fri', label: 'Sex' },
  { value: 'sat', label: 'Sáb' },
];

export default function HabitsTracker({ userId, areaId }: HabitsTrackerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: [] as string[],
  });
  
  const { data: habits = [], isLoading } = useHabits(userId, areaId);
  const createHabit = useCreateHabit();
  const logHabit = useLogHabit();
  const { toast } = useToast();
  
  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.name.trim() || newHabit.frequency.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e selecione os dias da semana",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createHabit.mutateAsync({
        userId,
        areaId,
        name: newHabit.name,
        description: newHabit.description,
        frequency: newHabit.frequency,
      });
      
      setIsDialogOpen(false);
      setNewHabit({ name: '', description: '', frequency: [] });
      
      toast({
        title: "Hábito criado",
        description: "Seu novo hábito foi adicionado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao criar hábito",
        description: "Não foi possível criar o hábito. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogHabit = async (habit: Habit) => {
    try {
      await logHabit.mutateAsync({
        habitId: habit.id,
      });
      
      toast({
        title: "Hábito registrado",
        description: "Continue mantendo a consistência!",
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar hábito",
        description: "Não foi possível registrar. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Carregando hábitos...</div>;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Hábitos</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Hábito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Hábito</DialogTitle>
              <DialogDescription>
                Defina um novo hábito para desenvolver nesta área
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Hábito</Label>
                <Input
                  id="name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="Ex: Meditar 10 minutos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Detalhes sobre o hábito..."
                />
              </div>
              <div className="space-y-2">
                <Label>Frequência</Label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.value} className="flex items-center gap-1.5">
                      <Checkbox
                        id={day.value}
                        checked={newHabit.frequency.includes(day.value)}
                        onCheckedChange={(checked) => {
                          setNewHabit({
                            ...newHabit,
                            frequency: checked
                              ? [...newHabit.frequency, day.value]
                              : newHabit.frequency.filter(d => d !== day.value),
                          });
                        }}
                      />
                      <Label htmlFor={day.value}>{day.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Criar Hábito</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => (
          <Card key={habit.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{habit.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Flame className="h-4 w-4" />
                    {habit.streak}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Trophy className="h-4 w-4" />
                    {habit.total_completions}
                  </Badge>
                </div>
              </CardTitle>
              {habit.description && (
                <CardDescription>{habit.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex gap-1">
                  {DAYS_OF_WEEK.map((day) => (
                    <Badge
                      key={day.value}
                      variant={habit.frequency.includes(day.value) ? "default" : "outline"}
                      className="w-8 justify-center"
                    >
                      {day.label[0]}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLogHabit(habit)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Registrar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {habits.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Nenhum hábito criado. Comece adicionando um novo hábito!
          </div>
        )}
      </div>
    </div>
  );
}