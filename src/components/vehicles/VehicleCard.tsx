import { Link } from 'react-router-dom';
import { Vehicle } from '@/types/vehicle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Fuel, Users, Gauge } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={vehicle.type === 'car' ? 'default' : 'secondary'} className="font-medium">
            {vehicle.type === 'car' ? 'Car' : 'Bike'}
          </Badge>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star className="h-4 w-4 fill-secondary text-secondary" />
          <span className="text-sm font-semibold">{vehicle.rating}</span>
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <p className="text-lg font-bold text-foreground">
            ₹{vehicle.pricePerDay.toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground">/day</span>
          </p>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{vehicle.brand}</p>
          <h3 className="text-lg font-bold text-foreground">{vehicle.name}</h3>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{vehicle.location}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          {vehicle.seats && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{vehicle.seats} Seats</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{vehicle.mileage}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/vehicles/${vehicle.id}`} className="flex-1">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          <Link to={`/vehicles/${vehicle.id}?book=true`} className="flex-1">
            <Button className="w-full">Book Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
