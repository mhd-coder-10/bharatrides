import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Briefcase } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Briefcase className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Careers</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Join our team and help revolutionize vehicle rentals in India.
          </p>
          <p className="text-muted-foreground">
            We're always looking for talented individuals. Check back soon for open positions.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
