# Flowboard OS

Sistema de Desenvolvimento Pessoal Gamificado

## Requisitos

- Node.js 18+
- npm 9+

## Configuração Local

1. Clone o repositório:
```bash
git clone <repository-url>
cd flowboard-os
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

6. Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## Build para Produção

1. Gere o build:
```bash
npm run build
```

2. Teste o build localmente:
```bash
npm run preview
```

## Estrutura do Projeto

- `/src` - Código fonte da aplicação
  - `/components` - Componentes React reutilizáveis
  - `/contexts` - Contextos React para gerenciamento de estado
  - `/lib` - Utilitários e funções auxiliares
  - `/pages` - Páginas da aplicação
  - `/hooks` - Custom hooks React
  - `/styles` - Estilos globais e temas

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Supabase
- React Query
- React Router

## Licença

Todos os direitos reservados.