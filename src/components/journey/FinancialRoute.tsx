import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp } from 'lucide-react';

interface FinancialRouteProps {
  userId: string;
}

export default function FinancialRoute({ userId }: FinancialRouteProps) {
  // Sample financial milestones data
  const milestones = [
    { id: 1, name: 'Fundo de Emergência', target: 15000, current: 15000, completed: true },
    { id: 2, name: 'Primeiros R$50K', target: 50000, current: 50000, completed: true },
    { id: 3, name: 'Primeiro R$100K', target: 100000, current: 85000, completed: false },
    { id: 4, name: 'Caminho para R$250K', target: 250000, current: 85000, completed: false },
    { id: 5, name: 'Meio Milhão R$500K', target: 500000, current: 85000, completed: false },
    { id: 6, name: 'Primeiro Milhão R$1M', target: 1000000, current: 85000, completed: false },
  ];

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const totalProgress = calculateProgress(85000, 1000000);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Coins className="h-5 w-5 mr-2 text-primary" />
              Meta R$1M
            </CardTitle>
            <Badge variant="outline" className="font-mono">
              {totalProgress}%
            </Badge>
          </div>
          <CardDescription>Seu caminho para o primeiro milhão</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>R$85.000</span>
              <span>R$1.000.000</span>
            </div>
            <Progress value={totalProgress} className="h-3" />
          </div>

          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id}
                className={`p-3 border rounded-md flex items-center gap-3 ${
                  milestone.completed ? "bg-muted/30" : ""
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  milestone.completed 
                    ? "bg-green-100 border-green-500 text-green-500" 
                    : "border-muted-foreground"
                }`}>
                  {milestone.completed && <TrendingUp className="h-3 w-3" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${
                      milestone.completed ? "line-through text-muted-foreground" : ""
                    }`}>
                      {milestone.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {calculateProgress(milestone.current, milestone.target)}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateProgress(milestone.current, milestone.target)} 
                    className="h-1 mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dicas para Alcançar R$1M</CardTitle>
          <CardDescription>Estratégias comprovadas para crescimento financeiro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">1. Investimento Consistente</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Mantenha um plano regular de investimentos, independente do valor inicial.
              </p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">2. Diversificação</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Distribua seus investimentos em diferentes classes de ativos.
              </p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">3. Renda Passiva</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Desenvolva fontes de renda que não dependam do seu tempo.
              </p>
            </div>
            <div className="p-3 border rounded-md">
              <h4 className="font-medium">4. Educação Financeira</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Invista em conhecimento para tomar melhores decisões financeiras.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
