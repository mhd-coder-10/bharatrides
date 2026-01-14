import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Car, Bike, User, ArrowLeft, Loader2, CalendarCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Booking {
  id: string;
  vehicle_id: string;
  vehicle_name: string;
  vehicle_type: string;
  pickup_date: string;
  return_date: string;
  pickup_area: string;
  drop_area: string;
  with_driver: boolean;
  total_price: number;
  status: string;
  created_at: string;
}

export default function MyBookings() {
  const { user, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBookings(data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your vehicle bookings</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="py-16 text-center">
                <CalendarCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No bookings yet</h2>
                <p className="text-muted-foreground mb-6">Start exploring our vehicles and make your first booking!</p>
                <Link to="/vehicles">
                  <Button>Browse Vehicles</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-0 shadow-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          {booking.vehicle_type === 'car' ? (
                            <Car className="h-5 w-5 text-primary" />
                          ) : (
                            <Bike className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{booking.vehicle_name}</CardTitle>
                          <p className="text-sm text-muted-foreground capitalize">{booking.vehicle_type}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(new Date(booking.pickup_date), 'dd MMM yyyy')} - {format(new Date(booking.return_date), 'dd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{booking.pickup_area} → {booking.drop_area}</span>
                        </div>
                        {booking.with_driver && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>With Driver</span>
                          </div>
                        )}
                      </div>
                      <div className="sm:text-right">
                        <p className="text-2xl font-bold text-foreground">₹{booking.total_price.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Booked on {format(new Date(booking.created_at), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}