import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Book = {
  id: string;
  title: string;
  author: string;
  progress: number;
  category: string;
  status: 'reading' | 'completed' | 'to-read';
};

export default function LearningArea() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [books, setBooks] = useState<Book[]>([
    { 
      id: '1', 
      title: 'Atomic Habits', 
      author: 'James Clear', 
      progress: 75, 
      category: 'Produtividade',
      status: 'reading'
    },
    { 
      id: '2', 
      title: 'Deep Work', 
      author: 'Cal Newport', 
      progress: 100, 
      category: 'Produtividade',
      status: 'completed'
    },
    { 
      id: '3', 
      title: 'The Psychology of Money', 
      author: 'Morgan Housel', 
      progress: 30, 
      category: 'Finanças',
      status: 'reading'
    },
    { 
      id: '4', 
      title: 'Thinking, Fast and Slow', 
      author: 'Daniel Kahneman', 
      progress: 0, 
      category: 'Psicologia',
      status: 'to-read'
    },
  ]);
  
  // Filter books based on search query
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group books by status
  const readingBooks = filteredBooks.filter(book => book.status === 'reading');
  const completedBooks = filteredBooks.filter(book => book.status === 'completed');
  const toReadBooks = filteredBooks.filter(book => book.status === 'to-read');
  
  return (
    <div className="space-y-6">
      {/* Book Registration and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar livros..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Livro
        </Button>
      </div>
      
      {/* Current Reading */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Leituras Atuais
          </CardTitle>
          <CardDescription>Livros em andamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {readingBooks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum livro em andamento.
              </p>
            ) : (
              readingBooks.map(book => (
                <div key={book.id} className="flex flex-col gap-2 p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                    </div>
                    <Badge variant="outline">{book.category}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Progresso</span>
                      <span className="text-xs font-medium">{book.progress}%</span>
                    </div>
                    <Progress value={book.progress} className="h-2" />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" variant="outline">Atualizar</Button>
                    <Button size="sm">Continuar</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Reading List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Books To Read */}
        <Card>
          <CardHeader>
            <CardTitle>Para Ler</CardTitle>
            <CardDescription>Lista de livros para ler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {toReadBooks.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum livro na fila.
                </p>
              ) : (
                toReadBooks.map(book => (
                  <div key={book.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <Button size="sm" variant="outline">Iniciar</Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar à Lista
            </Button>
          </CardFooter>
        </Card>
        
        {/* Completed Books */}
        <Card>
          <CardHeader>
            <CardTitle>Completados</CardTitle>
            <CardDescription>Livros já lidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedBooks.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum livro concluído.
                </p>
              ) : (
                completedBooks.map(book => (
                  <div key={book.id} className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                    <Badge className="bg-green-600 hover:bg-green-700">100%</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Anotações e Insights</CardTitle>
          <CardDescription>Registre aprendizados importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Registre suas anotações e insights aqui..."
            className="min-h-[150px]"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Salvar como Rascunho</Button>
          <Button>Salvar Anotações</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
