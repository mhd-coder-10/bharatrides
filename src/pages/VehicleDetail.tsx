import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getVehicleById, vehicles } from '@/data/vehicles';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Star, MapPin, Fuel, Users, Gauge, Calendar, 
  Shield, CheckCircle, Phone, ArrowLeft, Clock,
  Cog, IndianRupee
} from 'lucide-react';

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const vehicle = getVehicleById(id || '');
  
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Vehicle not found</h1>
            <Link to="/vehicles">
              <Button>
                <ArrowLeft className="h-4 w-4" />
                Back to Vehicles
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const subtotal = vehicle.pricePerDay * days;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  const similarVehicles = vehicles
    .filter(v => v.type === vehicle.type && v.id !== vehicle.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <span className="text-muted-foreground">/</span>
              <Link to="/vehicles" className="text-muted-foreground hover:text-foreground transition-colors">Vehicles</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">{vehicle.name}</span>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-card">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={vehicle.type === 'car' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
                    {vehicle.type === 'car' ? 'Car' : 'Bike'}
                  </Badge>
                </div>
              </div>

              {/* Title & Rating */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider">{vehicle.brand}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{vehicle.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-secondary text-secondary" />
                    <span className="font-semibold">{vehicle.rating}</span>
                    <span className="text-muted-foreground">({vehicle.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    {vehicle.location}
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Vehicle Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {vehicle.seats && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-muted">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Seats</p>
                          <p className="font-semibold">{vehicle.seats} Persons</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-muted">
                        <Fuel className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                        <p className="font-semibold capitalize">{vehicle.fuelType}</p>
                      </div>
                    </div>
                    {vehicle.transmission && (
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-muted">
                          <Cog className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Transmission</p>
                          <p className="font-semibold capitalize">{vehicle.transmission}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-muted">
                        <Gauge className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mileage</p>
                        <p className="font-semibold">{vehicle.mileage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-muted">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p className="font-semibold">{vehicle.year}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vehicle.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rental Policies */}
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Rental Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Insurance Included</p>
                      <p className="text-sm text-muted-foreground">Comprehensive insurance coverage for peace of mind</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">24/7 Roadside Assistance</p>
                      <p className="text-sm text-muted-foreground">Help is just a call away, anytime, anywhere</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <IndianRupee className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Security Deposit</p>
                      <p className="text-sm text-muted-foreground">Refundable deposit of ₹5,000 required at pickup</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Sidebar */}
            <div>
              <Card className="sticky top-24 border-0 shadow-elevated">
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-foreground">₹{vehicle.pricePerDay.toLocaleString()}</span>
                      <span className="text-muted-foreground">/day</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ₹{vehicle.pricePerHour}/hour
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="pickup">Pick-up Date</Label>
                      <Input
                        id="pickup"
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="return">Return Date</Label>
                      <Input
                        id="return"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={pickupDate || new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-border pt-4 mb-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">₹{vehicle.pricePerDay} × {days} day{days > 1 ? 's' : ''}</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>₹{serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Book Now
                  </Button>

                  <div className="mt-4 text-center">
                    <a href="tel:+919876543210" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="h-4 w-4" />
                      Need help? Call us
                    </a>
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Free cancellation within 24 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Vehicles */}
          {similarVehicles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Similar Vehicles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarVehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
