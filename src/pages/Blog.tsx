import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BookOpen } from 'lucide-react';

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Stories, tips, and insights about travel and vehicle rentals.
          </p>
          <p className="text-muted-foreground">
            Coming soon! We're working on exciting content for you.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
