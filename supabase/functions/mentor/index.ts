import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookRequest {
  userId: string;
  message: string;
}

interface WebhookResponse {
  response: string;
  suggestedMission?: {
    title: string;
    xpReward: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, message }: WebhookRequest = await req.json();

    if (!userId || !message) {
      throw new Error('Campos obrigatórios ausentes');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('Perfil não encontrado');
    }

    const response = await processMessage(message, profile);

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function processMessage(message: string, profile: any): Promise<WebhookResponse> {
  const lowercaseMessage = message.toLowerCase();
  
  // Detect emotional state and intent
  if (isNegativeEmotion(lowercaseMessage)) {
    return generateEmotionalSupportResponse(profile.name);
  }
  
  if (isGoalRelated(lowercaseMessage)) {
    return generateGoalResponse(profile.name, message);
  }
  
  if (isMotivationNeeded(lowercaseMessage)) {
    return generateMotivationalResponse(profile.name);
  }
  
  if (isReflective(lowercaseMessage)) {
    return generateReflectiveResponse(profile.name);
  }
  
  return generateDefaultResponse(profile.name);
}

function isNegativeEmotion(message: string): boolean {
  const negativeWords = [
    'triste', 'ansioso', 'preocupado', 'medo', 'difícil', 'perdido',
    'cansado', 'frustrado', 'desanimado', 'sozinho', 'angustiado',
    'desmotivado', 'confuso', 'inseguro', 'dúvida', 'incerteza'
  ];
  return negativeWords.some(word => message.includes(word));
}

function isGoalRelated(message: string): boolean {
  const goalWords = [
    'objetivo', 'meta', 'quero', 'planejar', 'alcançar', 'sonho',
    'futuro', 'realizar', 'conquistar', 'conseguir', 'pretendo',
    'desejo', 'ambição', 'plano', 'projeto'
  ];
  return goalWords.some(word => message.includes(word));
}

function isMotivationNeeded(message: string): boolean {
  const motivationWords = [
    'motivação', 'força', 'ajuda', 'preciso', 'animo', 'inspiração',
    'não consigo', 'difícil', 'complicado', 'desafio', 'obstáculo',
    'bloqueio', 'empacado', 'travado', 'estagnado'
  ];
  return motivationWords.some(word => message.includes(word));
}

function isReflective(message: string): boolean {
  const reflectiveWords = [
    'pensar', 'refletir', 'dúvida', 'escolha', 'decisão', 'caminho',
    'sentido', 'propósito', 'significado', 'direção', 'valores',
    'essência', 'identidade', 'missão', 'filosofia'
  ];
  return reflectiveWords.some(word => message.includes(word));
}

function generateEmotionalSupportResponse(name: string): WebhookResponse {
  const responses = [
    {
      response: `${name}, eu entendo completamente o que você está sentindo. Às vezes a jornada parece difícil, mas lembre-se: você tem uma força interior incrível. Que tal darmos um pequeno passo positivo juntos? Mesmo nas dificuldades, cada movimento adiante é uma vitória.`,
      suggestedMission: {
        title: "Fazer algo que te traz alegria hoje",
        xpReward: 50
      }
    },
    {
      response: `Estou aqui com você, ${name}. Suas emoções são válidas e importantes. Respire fundo... Você já superou tantos desafios antes, e este momento também vai passar. Vamos transformar essa energia em algo construtivo?`,
      suggestedMission: {
        title: "Praticar 10 minutos de autocuidado",
        xpReward: 50
      }
    },
    {
      response: `${name}, obrigado por compartilhar seus sentimentos comigo. Sua honestidade é o primeiro passo para a transformação. Às vezes precisamos abraçar nossas vulnerabilidades para encontrar nossa verdadeira força. O que acha de começarmos uma pequena mudança?`,
      suggestedMission: {
        title: "Escrever 3 qualidades suas que admira",
        xpReward: 50
      }
    }
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateGoalResponse(name: string, message: string): WebhookResponse {
  const responses = [
    {
      response: `Que incrível ver você pensando em objetivos, ${name}! Seus sonhos são sementes de realização. Vamos transformar essa inspiração em ação? Lembre-se: cada pequeno passo é uma vitória no caminho do seu objetivo maior.`,
      suggestedMission: {
        title: extractGoalFromMessage(message),
        xpReward: 50
      }
    },
    {
      response: `${name}, adorei sua iniciativa! Quando definimos metas claras, o universo conspira a nosso favor. Vamos criar um plano estruturado para transformar esse sonho em realidade? Comece com um pequeno passo hoje.`,
      suggestedMission: {
        title: `Criar plano de ação para: ${extractGoalFromMessage(message)}`,
        xpReward: 50
      }
    }
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateMotivationalResponse(name: string): WebhookResponse {
  const responses = [
    {
      response: `${name}, você é muito mais forte do que imagina! Cada desafio que enfrentamos é uma oportunidade de crescimento. Sua jornada é única e especial. Vamos começar com uma pequena vitória hoje? Às vezes, tudo que precisamos é dar o primeiro passo.`,
      suggestedMission: {
        title: "Completar uma tarefa importante hoje",
        xpReward: 50
      }
    },
    {
      response: `Querido(a) ${name}, saiba que a motivação é como uma chama: às vezes diminui, mas nunca se apaga. Você tem um potencial incrível dentro de si. Vamos transformar essa energia em ação? Comece pequeno, mas comece agora.`,
      suggestedMission: {
        title: "Dar o primeiro passo em algo importante",
        xpReward: 50
      }
    }
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateReflectiveResponse(name: string): WebhookResponse {
  const responses = [
    {
      response: `${name}, que momento precioso de reflexão! É nesses momentos de introspecção que encontramos nossas verdades mais profundas. Suas questões mostram uma busca genuína por crescimento. Vamos explorar esses pensamentos juntos?`,
      suggestedMission: {
        title: "Escrever suas reflexões por 15 minutos",
        xpReward: 50
      }
    },
    {
      response: `Que bom ver você mergulhando em reflexões profundas, ${name}. É através desse autoconhecimento que encontramos nosso verdadeiro caminho. Suas perguntas são sementes de transformação. Vamos organizar esses pensamentos?`,
      suggestedMission: {
        title: "Criar um mapa mental de seus objetivos",
        xpReward: 50
      }
    }
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateDefaultResponse(name: string): WebhookResponse {
  const responses = [
    {
      response: `${name}, estou aqui para caminhar ao seu lado nessa jornada de evolução. Como posso ajudar você a dar o próximo passo em sua transformação pessoal?`
    },
    {
      response: `Que bom ter você aqui, ${name}! Cada conversa nossa é uma oportunidade de crescimento. O que está em seu coração hoje?`
    },
    {
      response: `${name}, sua presença é especial. Estou aqui para apoiar sua jornada de desenvolvimento. Compartilhe seus pensamentos comigo.`
    }
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function extractGoalFromMessage(message: string): string {
  const goalIndicators = ['quero', 'preciso', 'vou', 'desejo', 'objetivo', 'meta', 'sonho'];
  const words = message.split(' ');
  
  let startIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (goalIndicators.includes(words[i].toLowerCase())) {
      startIndex = i + 1;
      break;
    }
  }
  
  if (startIndex === -1) {
    return "Definir próximo objetivo";
  }
  
  const goalWords = words.slice(startIndex, startIndex + 5);
  return goalWords.join(' ').trim() || "Definir próximo objetivo";
}