import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Dumbbell, Utensils, TrendingUp, PlusCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer 
} from 'recharts';

export default function BodyEnergyArea() {
  // Sample workout data
  const workouts = [
    { id: 1, name: 'Treino A: Peito e Tríceps', day: 'Segunda', completed: true },
    { id: 2, name: 'Treino B: Costas e Bíceps', day: 'Quarta', completed: false },
    { id: 3, name: 'Treino C: Pernas e Core', day: 'Sexta', completed: false },
    { id: 4, name: 'Cardio HIIT', day: 'Terça e Quinta', completed: false },
  ];
  
  // Sample nutrition data
  const mealPlan = [
    { meal: 'Café da manhã', foods: 'Ovos mexidos, aveia, frutas, café' },
    { meal: 'Lanche da manhã', foods: 'Iogurte com granola e mel' },
    { meal: 'Almoço', foods: 'Proteína magra, arroz integral, legumes' },
    { meal: 'Lanche da tarde', foods: 'Shake proteico ou frutas' },
    { meal: 'Jantar', foods: 'Peixe ou frango, vegetais, batata doce' },
  ];
  
  // Sample progress data for the chart
  const progressData = [
    { name: 'Semana 1', peso: 80, energia: 50 },
    { name: 'Semana 2', peso: 79, energia: 65 },
    { name: 'Semana 3', peso: 78.5, energia: 70 },
    { name: 'Semana 4', peso: 78, energia: 75 },
    { name: 'Semana 5', peso: 77, energia: 85 },
    { name: 'Semana 6', peso: 76.5, energia: 90 },
  ];
  
  return (
    <div className="space-y-6">
      {/* Main Tabs */}
      <Tabs defaultValue="workouts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workouts" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span>Treinos</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span>Nutrição</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Progresso</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Workouts Tab */}
        <TabsContent value="workouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano de Treinos</CardTitle>
              <CardDescription>Seu programa de exercícios semanal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox checked={workout.completed} />
                      <div>
                        <p className="font-medium">{workout.name}</p>
                        <p className="text-sm text-muted-foreground">{workout.day}</p>
                      </div>
                    </div>
                    <Button size="sm">Ver</Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" />
                Adicionar Novo Treino
              </Button>
            </CardFooter>
          </Card>
          
          {/* Workout Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Treino</CardTitle>
              <CardDescription>Treino A: Peito e Tríceps</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exercício</TableHead>
                    <TableHead>Séries</TableHead>
                    <TableHead>Repetições</TableHead>
                    <TableHead>Carga</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Supino Reto</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>8-12</TableCell>
                    <TableCell>70kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Crucifixo</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>12-15</TableCell>
                    <TableCell>16kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tríceps Corda</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>12-15</TableCell>
                    <TableCell>25kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tríceps Francês</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>10-12</TableCell>
                    <TableCell>15kg</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plano Alimentar</CardTitle>
              <CardDescription>Refeições diárias recomendadas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Refeição</TableHead>
                    <TableHead>Alimentos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mealPlan.map((meal, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{meal.meal}</TableCell>
                      <TableCell>{meal.foods}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="space-y-2 w-full">
                <h4 className="text-sm font-medium">Considerações:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Beba pelo menos 2L de água por dia</li>
                  <li>• Evite alimentos processados</li>
                  <li>• Consumir 1.8g de proteína por kg de peso corporal</li>
                </ul>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Evolução</CardTitle>
              <CardDescription>Acompanhe seu progresso ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={progressData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="peso" fill="hsl(var(--chart-1))" name="Peso (kg)" />
                    <Bar yAxisId="right" dataKey="energia" fill="hsl(var(--chart-2))" name="Energia (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Registrar Nova Medida</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}