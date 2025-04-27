import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiggyBank, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Plus, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cn } from '@/lib/utils';

type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
};

export default function FinanceArea() {
  // Sample transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      description: 'Salário',
      amount: 5000,
      date: '2025-07-01',
      category: 'Renda',
      type: 'income'
    },
    {
      id: '2',
      description: 'Aluguel',
      amount: 1200,
      date: '2025-07-05',
      category: 'Moradia',
      type: 'expense'
    },
    {
      id: '3',
      description: 'Supermercado',
      amount: 450,
      date: '2025-07-10',
      category: 'Alimentação',
      type: 'expense'
    },
    {
      id: '4',
      description: 'Freelance',
      amount: 800,
      date: '2025-07-15',
      category: 'Renda Extra',
      type: 'income'
    },
    {
      id: '5',
      description: 'Internet',
      amount: 120,
      date: '2025-07-12',
      category: 'Serviços',
      type: 'expense'
    },
  ];
  
  // Calculate financial summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netProfit = totalIncome - totalExpense;
  
  // Expense by category data for pie chart
  const expenseCategories = [
    { name: 'Moradia', value: 1200 },
    { name: 'Alimentação', value: 450 },
    { name: 'Serviços', value: 320 },
    { name: 'Transporte', value: 200 },
    { name: 'Lazer', value: 150 },
  ];
  
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  
  // Monthly progress data for line chart
  const monthlyData = [
    { month: 'Jan', income: 4800, expense: 3200 },
    { month: 'Fev', income: 4900, expense: 3300 },
    { month: 'Mar', income: 5100, expense: 3500 },
    { month: 'Abr', income: 5200, expense: 3400 },
    { month: 'Mai', income: 5300, expense: 3700 },
    { month: 'Jun', income: 5400, expense: 3200 },
    { month: 'Jul', income: 5800, expense: 3300 },
  ];
  
  // R$1M Goal data
  const millionGoal = {
    target: 1000000,
    current: 150000,
    percentage: 15,
    milestones: [
      { name: 'Primeiro $10K', completed: true },
      { name: 'Primeiros $50K', completed: true },
      { name: 'Primeiros $100K', completed: true },
      { name: 'Primeiros $250K', completed: false },
      { name: 'Primeiros $500K', completed: false },
      { name: 'Primeiro $1M', completed: false },
    ]
  };
  
  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Entrada Total</p>
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300">
                  R${totalIncome.toLocaleString()}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
                <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Saída Total</p>
                <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">
                  R${totalExpense.toLocaleString()}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Lucro Líquido</p>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  R${netProfit.toLocaleString()}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="goal">Meta R$1M</TabsTrigger>
        </TabsList>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              Receita
            </Button>
            <Button variant="outline" className="gap-1">
              <Minus className="h-4 w-4" />
              Despesa
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Histórico de receitas e despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-3 border rounded-md hover:bg-muted/10 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span 
                        className={cn(
                          "font-medium",
                          transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}
                      >
                        {transaction.type === 'income' ? '+' : '-'}R${transaction.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">
                Ver Todas as Transações
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Despesas por Categoria</CardTitle>
                <CardDescription>Distribuição dos seus gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal</CardTitle>
                <CardDescription>Receitas x Despesas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="var(--chart-2)" activeDot={{ r: 8 }} name="Receita" />
                      <Line type="monotone" dataKey="expense" stroke="var(--chart-1)" name="Despesa" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Million Goal Tab */}
        <TabsContent value="goal" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2 text-primary" />
                  Meta R$1M
                </CardTitle>
                <Badge variant="outline" className="font-mono">
                  {millionGoal.percentage}%
                </Badge>
              </div>
              <CardDescription>Seu caminho para o primeiro milhão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>R${millionGoal.current.toLocaleString()}</span>
                  <span>R${millionGoal.target.toLocaleString()}</span>
                </div>
                <Progress value={millionGoal.percentage} className="h-3" />
              </div>
              
              <div className="space-y-3">
                {millionGoal.milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "p-3 border rounded-md flex items-center gap-3",
                      milestone.completed ? "bg-muted/30" : ""
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center border-2",
                      milestone.completed 
                        ? "bg-green-100 border-green-500 text-green-500" 
                        : "border-muted-foreground"
                    )}>
                      {milestone.completed && <TrendingUp className="h-3 w-3" />}
                    </div>
                    <span className={cn(
                      "font-medium",
                      milestone.completed ? "line-through text-muted-foreground" : ""
                    )}>
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground italic">
                A jornada de mil milhas começa com um único passo.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
