import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProgressRings from './ProgressRings';
import TrainingLog from './TrainingLog';
import { useTrainings, useCreateTraining } from '@/lib/queries/trainings';

interface TrainingAreaProps {
  userId: string;
}

export default function TrainingArea({ userId }: TrainingAreaProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTraining, setNewTraining] = useState({
    exerciseName: '',
    weight: '',
    reps: '',
  });
  
  const { data: trainings = [], isLoading } = useTrainings(userId);
  const createTraining = useCreateTraining();
  const { toast } = useToast();
  
  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTraining.exerciseName || !newTraining.weight || !newTraining.reps) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await createTraining.mutateAsync({
        userId,
        exerciseName: newTraining.exerciseName,
        weight: parseFloat(newTraining.weight),
        reps: parseInt(newTraining.reps),
      });
      
      setIsDialogOpen(false);
      setNewTraining({ exerciseName: '', weight: '', reps: '' });
      
      toast({
        title: "Treino registrado",
        description: "Seu treino foi salvo com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar treino",
        description: "Não foi possível salvar o treino. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Progress Rings */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso Diário</CardTitle>
          <CardDescription>Acompanhe seus objetivos diários</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressRings />
        </CardContent>
      </Card>
      
      {/* Training Log */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Meus Treinos</CardTitle>
              <CardDescription>Histórico de treinos</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Treino
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Registrar Treino</DialogTitle>
                  <DialogDescription>
                    Adicione os detalhes do seu treino
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTraining} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exerciseName">Nome do Exercício</Label>
                    <Input
                      id="exerciseName"
                      value={newTraining.exerciseName}
                      onChange={(e) => setNewTraining({ ...newTraining, exerciseName: e.target.value })}
                      placeholder="Ex: Supino Reto"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Carga (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="0"
                        step="0.5"
                        value={newTraining.weight}
                        onChange={(e) => setNewTraining({ ...newTraining, weight: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reps">Repetições</Label>
                      <Input
                        id="reps"
                        type="number"
                        min="1"
                        value={newTraining.reps}
                        onChange={(e) => setNewTraining({ ...newTraining, reps: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      <Dumbbell className="h-4 w-4 mr-2" />
                      Registrar Treino
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <TrainingLog trainings={trainings} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}