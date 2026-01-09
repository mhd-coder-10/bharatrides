import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, Users, Award, Target, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Every vehicle is verified, insured, and maintained to the highest standards.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'We prioritize your experience with 24/7 support and hassle-free bookings.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Premium vehicles from trusted brands with regular maintenance checks.',
  },
  {
    icon: Target,
    title: 'Best Value',
    description: 'Competitive pricing with no hidden charges. Transparent billing always.',
  },
];

const milestones = [
  { year: '2019', title: 'Founded', description: 'Started with 50 vehicles in Mumbai' },
  { year: '2020', title: 'Expansion', description: 'Expanded to 10 major cities' },
  { year: '2022', title: '10K Users', description: 'Crossed 10,000 happy customers' },
  { year: '2024', title: '1000+ Vehicles', description: 'Now operating in 50+ cities' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-primary py-20">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                Driving India's Dreams, One Ride at a Time
              </h1>
              <p className="text-xl text-primary-foreground/80">
                BharatRides is India's trusted vehicle rental platform, connecting travelers with quality cars and bikes across 50+ cities.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                  Our Story
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  From a Small Idea to India's Growing Rental Platform
                </h2>
                <p className="text-muted-foreground mb-4">
                  BharatRides was born from a simple observation: renting a vehicle in India shouldn't be complicated. In 2019, our founders experienced the frustration of opaque pricing, unreliable vehicles, and poor customer service in the rental industry.
                </p>
                <p className="text-muted-foreground mb-6">
                  We set out to change that. Starting with just 50 vehicles in Mumbai, we built a platform focused on transparency, quality, and customer experience. Today, we serve thousands of customers across India with a fleet of 1000+ verified vehicles.
                </p>
                <Link to="/vehicles">
                  <Button size="lg">
                    Browse Our Fleet
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop&q=80"
                  alt="Road trip in India"
                  className="rounded-2xl shadow-elevated"
                />
                <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-xl shadow-card">
                  <p className="text-3xl font-bold">50+</p>
                  <p className="text-sm">Cities Covered</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                What Drives Us
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="border-0 shadow-card text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
                Our Journey
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Milestones
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {milestone.year}
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-8">
                      <h3 className="text-xl font-bold text-foreground">{milestone.title}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 hero-gradient">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of satisfied customers who trust BharatRides for their travel needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/vehicles">
                <Button variant="hero" size="xl">
                  Browse Vehicles
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="hero-outline" size="xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
