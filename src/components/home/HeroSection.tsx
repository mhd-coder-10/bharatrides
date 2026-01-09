import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Bike, MapPin, Calendar, Search, Shield, Clock, HeadphonesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  { icon: Shield, label: 'Verified Vehicles' },
  { icon: Clock, label: '24/7 Support' },
  { icon: HeadphonesIcon, label: 'Best Prices' },
];

export function HeroSection() {
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set('type', vehicleType);
    if (location) params.set('location', location);
    navigate(`/vehicles?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[90vh] hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container relative pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-up">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
            🚗 India's Most Trusted Vehicle Rental
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Rent Cars & Bikes
            <br />
            <span className="text-secondary">Across India</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Choose from 1000+ verified vehicles. Self-drive or with driver. Affordable rates, doorstep delivery, and 24/7 support.
          </p>
        </div>

        {/* Search Card */}
        <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-elevated p-6 md:p-8 animate-scale-in">
          {/* Vehicle Type Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setVehicleType('car')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all",
                vehicleType === 'car'
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Car className="h-5 w-5" />
              Cars
            </button>
            <button
              onClick={() => setVehicleType('bike')}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all",
                vehicleType === 'bike'
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Bike className="h-5 w-5" />
              Bikes
            </button>
          </div>

          {/* Search Fields */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pick-up Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="date"
                className="w-full h-14 pl-12 pr-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <Button size="xl" onClick={handleSearch} className="h-14">
              <Search className="h-5 w-5" />
              Search Vehicles
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
          {features.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2 text-primary-foreground/80">
              <feature.icon className="h-5 w-5 text-secondary" />
              <span className="text-sm font-medium">{feature.label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '1000+', label: 'Vehicles' },
            { value: '50+', label: 'Cities' },
            { value: '4.8★', label: 'Rating' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-secondary">{stat.value}</p>
              <p className="text-sm text-primary-foreground/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
