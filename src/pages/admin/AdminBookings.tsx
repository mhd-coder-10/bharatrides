import { Calendar } from 'lucide-react';

export default function AdminBookings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Bookings Management</h1>
      </div>
      <p className="text-muted-foreground">View and manage all bookings.</p>
      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        Booking management features coming soon...
      </div>
    </div>
  );
}
