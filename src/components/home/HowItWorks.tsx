import { Search, Car, Calendar, KeyRound } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search & Choose',
    description: 'Browse our wide collection and select the perfect vehicle for your needs.',
  },
  {
    icon: Calendar,
    title: 'Book Online',
    description: 'Choose your dates, add extras, and complete your booking in minutes.',
  },
  {
    icon: KeyRound,
    title: 'Get the Keys',
    description: 'Pick up from our location or get doorstep delivery. Simple KYC verification.',
  },
  {
    icon: Car,
    title: 'Hit the Road',
    description: 'Enjoy your ride! 24/7 roadside assistance available throughout your trip.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-3">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Rent a vehicle in 4 simple steps. No hidden charges, no complicated paperwork.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              {/* Step Number & Icon */}
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-muted mb-6 shadow-soft">
                <step.icon className="h-10 w-10 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-secondary text-secondary-foreground text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
