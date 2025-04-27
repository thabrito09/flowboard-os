import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface RoutePhase {
  id: string;
  name: string;
  description?: string;
  goal?: {
    type: 'text' | 'number';
    value: string | number;
  };
  checklist: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  completed: boolean;
}

export interface UserRoute {
  id: string;
  user_id: string;
  goal: string;
  phases: RoutePhase[];
  created_at: string;
  updated_at: string;
}

export function calculateRouteProgress(phases: RoutePhase[]): number {
  const totalTasks = phases.reduce((sum, phase) => sum + phase.checklist.length, 0);
  const completedTasks = phases.reduce((sum, phase) => 
    sum + phase.checklist.filter(task => task.completed).length, 0
  );
  return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
}

export function useUserRoutes(userId: string) {
  return useQuery({
    queryKey: ['user-routes', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_routes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as UserRoute[];
    },
    enabled: !!userId,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      goal 
    }: { 
      userId: string;
      goal: string;
    }) => {
      // Generate initial phases based on the goal
      const phases = generateInitialPhases(goal);
      
      const { data, error } = await supabase
        .from('user_routes')
        .insert({
          user_id: userId,
          goal,
          phases,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-routes'] });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      routeId, 
      phases 
    }: { 
      routeId: string;
      phases: RoutePhase[];
    }) => {
      const { data, error } = await supabase
        .from('user_routes')
        .update({ phases })
        .eq('id', routeId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-routes'] });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (routeId: string) => {
      const { error } = await supabase
        .from('user_routes')
        .delete()
        .eq('id', routeId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-routes'] });
    },
  });
}

function generateInitialPhases(goal: string): RoutePhase[] {
  const phases: RoutePhase[] = [
    {
      id: crypto.randomUUID(),
      name: 'Preparação',
      description: 'Fase inicial de planejamento e organização',
      checklist: [
        {
          id: crypto.randomUUID(),
          text: 'Definir objetivos específicos',
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          text: 'Pesquisar recursos necessários',
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          text: 'Criar cronograma inicial',
          completed: false,
        },
      ],
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      name: 'Execução',
      description: 'Fase de implementação das ações planejadas',
      checklist: [
        {
          id: crypto.randomUUID(),
          text: 'Iniciar primeiras ações',
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          text: 'Monitorar progresso',
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          text: 'Ajustar estratégias conforme necessário',
          completed: false,
        },
      ],
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      name: 'Consolidação',
      description: 'Fase de fortalecimento e expansão',
      checklist: [
        {
          id: crypto.randomUUID(),
          text: 'Avaliar resultados iniciais',
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          text: 'Identificar pontos de melhoria',
          completed: false,
        },
        {
          id: crypto.randomUUID(),
          text: 'Estabelecer próximos passos',
          completed: false,
        },
      ],
      completed: false,
    },
  ];

  // Add goal-specific checklist items
  if (goal.toLowerCase().includes('empresa')) {
    phases[0].checklist.push(
      {
        id: crypto.randomUUID(),
        text: 'Pesquisar mercado',
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Desenvolver plano de negócios',
        completed: false,
      }
    );
  } else if (goal.toLowerCase().includes('maratona')) {
    phases[0].checklist.push(
      {
        id: crypto.randomUUID(),
        text: 'Criar plano de treino',
        completed: false,
      },
      {
        id: crypto.randomUUID(),
        text: 'Agendar check-up médico',
        completed: false,
      }
    );
  }

  return phases;
}