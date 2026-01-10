import { Link } from 'react-router-dom';
import { Car, Bike, Zap, Crown, ArrowRight, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  {
    id: 'cars',
    title: 'Cars',
    description: 'Sedans, SUVs, Hatchbacks & more',
    icon: Car,
    href: '/vehicles?type=car',
    count: '500+ vehicles',
    gradient: 'from-primary to-primary/80',
  },
  {
    id: 'bikes',
    title: 'Bikes',
    description: 'Superbikes, Cruisers & Sports',
    icon: Bike,
    href: '/vehicles?type=bike',
    count: '400+ vehicles',
    gradient: 'from-secondary to-secondary/80',
  },
  {
    id: 'activa',
    title: 'Activa',
    description: 'Ola, Ather, Honda Activa & more',
    icon: CircleDot,
    href: '/vehicles?type=activa',
    count: '200+ vehicles',
    gradient: 'from-accent to-accent/80',
  },
  {
    id: 'electric',
    title: 'Electric',
    description: 'Eco-friendly EVs',
    icon: Zap,
    href: '/vehicles?fuel=electric',
    count: '100+ vehicles',
    gradient: 'from-success to-success/80',
  },
  {
    id: 'premium',
    title: 'Premium',
    description: 'Luxury & Sports vehicles',
    icon: Crown,
    href: '/vehicles?premium=true',
    count: '50+ vehicles',
    gradient: 'from-foreground to-foreground/80',
  },
];

export function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            Browse By Category
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Find Your Perfect Ride
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            We have the largest collection of quality vehicles for every need and budget.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-6 text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-elevated",
                `bg-gradient-to-br ${category.gradient}`
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <category.icon className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-1">{category.title}</h3>
              <p className="text-primary-foreground/80 text-sm mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.count}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
