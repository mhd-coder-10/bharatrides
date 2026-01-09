import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { getFeaturedVehicles } from '@/data/vehicles';
import { ArrowRight } from 'lucide-react';

export function FeaturedVehicles() {
  const vehicles = getFeaturedVehicles();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-3">
              Top Picks
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Vehicles
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Hand-picked vehicles with top ratings and excellent reviews from our customers across India.
            </p>
          </div>
          <Link to="/vehicles">
            <Button variant="outline" size="lg">
              View All Vehicles
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
