// Collection of motivational quotes
export const quotes = [
  {
    text: "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
    author: "Robert Collier"
  },
  {
    text: "A disciplina é a ponte entre metas e realizações.",
    author: "Jim Rohn"
  },
  {
    text: "O maior prazer da vida é fazer o que as pessoas dizem que você não é capaz.",
    author: "Walter Bagehot"
  },
  {
    text: "Não espere por circunstâncias ideais. Crie-as.",
    author: "George Bernard Shaw"
  },
  {
    text: "A persistência é o caminho do êxito.",
    author: "Charles Chaplin"
  },
  {
    text: "O sucesso normalmente vem para quem está ocupado demais para procurar por ele.",
    author: "Henry David Thoreau"
  },
  {
    text: "A excelência não é um ato, mas um hábito.",
    author: "Aristóteles"
  },
  {
    text: "Quanto maior o obstáculo, maior a glória em superá-lo.",
    author: "Molière"
  },
  {
    text: "O segredo para progredir é começar.",
    author: "Mark Twain"
  },
  {
    text: "Sua única limitação é aquela que você impõe em sua própria mente.",
    author: "Napoleon Hill"
  },
  {
    text: "O pessimista vê dificuldade em cada oportunidade. O otimista vê oportunidade em cada dificuldade.",
    author: "Winston Churchill"
  },
  {
    text: "Não é sobre ter tempo, é sobre fazer tempo.",
    author: "Autor Desconhecido"
  },
  {
    text: "A jornada de mil milhas começa com um único passo.",
    author: "Lao Tzu"
  },
  {
    text: "O que você faz hoje pode melhorar todos os seus amanhãs.",
    author: "Ralph Marston"
  },
  {
    text: "Acredite que você pode e você está no meio do caminho.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Sua vida não fica melhor por acaso, fica melhor por mudança.",
    author: "Jim Rohn"
  },
  {
    text: "O segredo da mudança é focar toda sua energia não em lutar contra o antigo, mas em construir o novo.",
    author: "Sócrates"
  },
  {
    text: "Grandes mentes discutem ideias. Mentes medianas discutem eventos. Mentes pequenas discutem pessoas.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "O único lugar onde sucesso vem antes do trabalho é no dicionário.",
    author: "Vidal Sassoon"
  },
  {
    text: "Não conte os dias, faça os dias contarem.",
    author: "Muhammad Ali"
  }
];

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}