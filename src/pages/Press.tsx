import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Newspaper } from 'lucide-react';

const Press = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Newspaper className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Press</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Media resources and press releases from BharatRides.
          </p>
          <p className="text-muted-foreground">
            For media inquiries, please contact us at press@bharatrides.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Press;
