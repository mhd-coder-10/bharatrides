import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { CalendarCheck, Clock, MapPin, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Sample bookings data - replace with real data from database
const sampleBookings = [
  {
    id: '1',
    vehicleName: 'Honda City',
    vehicleType: 'car',
    startDate: '2026-01-15',
    endDate: '2026-01-18',
    pickupLocation: 'Mumbai Airport',
    status: 'upcoming',
    totalAmount: 4500,
  },
  {
    id: '2',
    vehicleName: 'Royal Enfield Classic 350',
    vehicleType: 'bike',
    startDate: '2026-01-10',
    endDate: '2026-01-12',
    pickupLocation: 'Pune Station',
    status: 'completed',
    totalAmount: 1200,
  },
  {
    id: '3',
    vehicleName: 'Honda Activa 6G',
    vehicleType: 'activa',
    startDate: '2026-01-05',
    endDate: '2026-01-06',
    pickupLocation: 'Bangalore Central',
    status: 'cancelled',
    totalAmount: 400,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'upcoming':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>;
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function MyBookings() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground mt-2">View and manage your vehicle reservations</p>
        </div>

        {sampleBookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CalendarCheck className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't made any bookings yet. Start exploring our vehicles!
              </p>
              <Button onClick={() => window.location.href = '/vehicles'}>
                Browse Vehicles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sampleBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {booking.vehicleName}
                  </CardTitle>
                  {getStatusBadge(booking.status)}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.pickupLocation}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">₹{booking.totalAmount}</span>
                    </div>
                  </div>
                  {booking.status === 'upcoming' && (
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">Modify Booking</Button>
                      <Button variant="destructive" size="sm">Cancel Booking</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
