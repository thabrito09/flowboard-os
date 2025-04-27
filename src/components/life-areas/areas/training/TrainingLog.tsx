import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Training {
  id: string;
  exercise_name: string;
  weight: number;
  reps: number;
  created_at: string;
}

interface TrainingLogProps {
  trainings: Training[];
  isLoading: boolean;
}

export default function TrainingLog({ trainings, isLoading }: TrainingLogProps) {
  if (isLoading) {
    return <div className="flex justify-center py-8">Carregando treinos...</div>;
  }
  
  if (trainings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum treino registrado. Comece adicionando seu primeiro treino!
      </div>
    );
  }
  
  // Group trainings by exercise to track progress
  const exerciseProgress = trainings.reduce((acc, training) => {
    if (!acc[training.exercise_name]) {
      acc[training.exercise_name] = [];
    }
    acc[training.exercise_name].push(training);
    return acc;
  }, {} as Record<string, Training[]>);
  
  // Calculate progress indicators
  const getProgress = (exercise: Training[]) => {
    if (exercise.length < 2) return null;
    
    const latest = exercise[exercise.length - 1];
    const previous = exercise[exercise.length - 2];
    
    const weightDiff = latest.weight - previous.weight;
    return {
      value: Math.abs(weightDiff),
      isPositive: weightDiff > 0,
    };
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Exercício</TableHead>
          <TableHead>Carga (kg)</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>Progresso</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trainings.map((training) => {
          const progress = getProgress(exerciseProgress[training.exercise_name]);
          
          return (
            <TableRow key={training.id}>
              <TableCell>
                {format(new Date(training.created_at), "dd 'de' MMM", { locale: ptBR })}
              </TableCell>
              <TableCell className="font-medium">{training.exercise_name}</TableCell>
              <TableCell>{training.weight}</TableCell>
              <TableCell>{training.reps}</TableCell>
              <TableCell>
                {progress && (
                  <div className={cn(
                    "flex items-center gap-1",
                    progress.isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {progress.isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{progress.value}kg</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}