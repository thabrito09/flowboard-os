import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, CheckCircle, Clock, PlusCircle, MoveHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'inProgress' | 'done';
  project: string;
  dueDate?: string;
};

type KanbanColumn = {
  id: 'todo' | 'inProgress' | 'done';
  title: string;
  tasks: Task[];
  color: string;
};

export default function WorkArea() {
  const [newTask, setNewTask] = useState('');
  
  // Sample tasks
  const initialTasks: Task[] = [
    { 
      id: '1', 
      title: 'Finalizar proposta para cliente', 
      priority: 'high',
      status: 'todo',
      project: 'Projeto A'
    },
    { 
      id: '2', 
      title: 'Criar wireframes para nova interface', 
      priority: 'medium',
      status: 'inProgress',
      project: 'Projeto B',
      dueDate: '2025-07-15'
    },
    { 
      id: '3', 
      title: 'Reunião com equipe de design', 
      priority: 'high',
      status: 'todo',
      project: 'Projeto A',
      dueDate: '2025-07-10'
    },
    { 
      id: '4', 
      title: 'Revisar documentação técnica', 
      priority: 'low',
      status: 'inProgress',
      project: 'Projeto C'
    },
    { 
      id: '5', 
      title: 'Atualizar site do cliente', 
      priority: 'medium',
      status: 'done',
      project: 'Projeto B'
    },
  ];
  
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      priority: 'medium',
      status: 'todo',
      project: 'Novo Projeto'
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };
  
  // Kanban board columns
  const columns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'A Fazer',
      tasks: tasks.filter(task => task.status === 'todo'),
      color: 'bg-blue-500',
    },
    {
      id: 'inProgress',
      title: 'Em Progresso',
      tasks: tasks.filter(task => task.status === 'inProgress'),
      color: 'bg-amber-500',
    },
    {
      id: 'done',
      title: 'Concluído',
      tasks: tasks.filter(task => task.status === 'done'),
      color: 'bg-green-500',
    },
  ];
  
  // Priority tasks
  const priorityTasks = tasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban" className="flex items-center gap-1.5">
            <MoveHorizontal className="h-4 w-4" />
            <span>Kanban</span>
          </TabsTrigger>
          <TabsTrigger value="priority" className="flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4" />
            <span>Prioridades</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Kanban Board Tab */}
        <TabsContent value="kanban" className="space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="Adicionar nova tarefa..." 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleAddTask}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col h-full">
                <div className={cn(
                  "px-3 py-2 rounded-t-md flex items-center justify-between",
                  column.id === 'todo' ? 'bg-blue-500/10' : 
                  column.id === 'inProgress' ? 'bg-amber-500/10' : 
                  'bg-green-500/10'
                )}>
                  <h3 className="font-medium flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", column.color)}></div>
                    {column.title}
                  </h3>
                  <Badge variant="outline">{column.tasks.length}</Badge>
                </div>
                <div className="flex-1 border rounded-b-md p-2 bg-muted/20 min-h-[300px]">
                  <div className="space-y-2">
                    {column.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 bg-card rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge 
                            variant="outline"
                            className={cn(
                              task.priority === 'high' ? 'border-red-500 text-red-500' :
                              task.priority === 'medium' ? 'border-amber-500 text-amber-500' :
                              'border-blue-500 text-blue-500'
                            )}
                          >
                            {task.priority === 'high' ? 'Alta' : 
                             task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{task.project}</span>
                          {task.dueDate && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.dueDate}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {column.tasks.length === 0 && (
                      <div className="h-full flex items-center justify-center p-4 text-center text-muted-foreground text-sm">
                        Nenhuma tarefa
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Priority Tasks Tab */}
        <TabsContent value="priority" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Tarefas Prioritárias
              </CardTitle>
              <CardDescription>Foque nestas tarefas primeiro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priorityTasks.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    Nenhuma tarefa prioritária no momento.
                  </p>
                ) : (
                  priorityTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "p-4 border rounded-md flex items-center justify-between",
                        task.priority === 'high' ? 'border-l-4 border-l-red-500' :
                        task.priority === 'medium' ? 'border-l-4 border-l-amber-500' :
                        'border-l-4 border-l-blue-500'
                      )}
                    >
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.project}</p>
                      </div>
                      <Button size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Concluir
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground italic">
                Cada tarefa concluída gera 20 XP.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}