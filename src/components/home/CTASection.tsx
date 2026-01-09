import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-16 md:py-24 hero-gradient relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-10 left-20 w-80 h-80 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
            Book your vehicle today and experience the freedom of exploring India on your own terms. 
            Special discounts for first-time users!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/vehicles">
              <Button variant="hero" size="xl">
                Browse Vehicles
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="tel:+919876543210">
              <Button variant="hero-outline" size="xl">
                <Phone className="h-5 w-5" />
                Call Us Now
              </Button>
            </a>
          </div>

          <p className="mt-8 text-sm text-primary-foreground/60">
            No credit card required • Free cancellation • Instant confirmation
          </p>
        </div>
      </div>
    </section>
  );
}
