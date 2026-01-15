import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Car, Bike, Users, IndianRupee, TrendingUp, Calendar,
  FileText, Plus, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { vehicles as defaultVehicles } from '@/data/vehicles';
import AddVehicleForm from '@/components/admin/AddVehicleForm';
import { Vehicle } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Booking {
  id: string;
  vehicle_name: string;
  email: string;
  status: string;
  total_price: number;
  created_at: string;
}

export default function AdminDashboardContent() {
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [bookingStats, setBookingStats] = useState({ total: 0, active: 0, revenue: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const customVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
    setAllVehicles([...defaultVehicles, ...customVehicles]);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('id, vehicle_name, email, status, total_price, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) throw bookingsError;
      setRecentBookings(bookingsData || []);

      // Fetch all bookings for stats
      const { data: allBookings, error: allBookingsError } = await supabase
        .from('bookings')
        .select('status, total_price');

      if (allBookingsError) throw allBookingsError;

      const activeBookings = (allBookings || []).filter(b => 
        b.status === 'confirmed' || b.status === 'pending'
      ).length;
      const totalRevenue = (allBookings || [])
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.total_price || 0), 0);

      setBookingStats({
        total: allBookings?.length || 0,
        active: activeBookings,
        revenue: totalRevenue
      });

      // Fetch customer count
      const { count, error: profilesError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (profilesError) throw profilesError;
      setTotalCustomers(count || 0);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshVehicles = () => {
    const customVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
    setAllVehicles([...defaultVehicles, ...customVehicles]);
    setAddVehicleOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      confirmed: { variant: 'default', label: 'Confirmed' },
      pending: { variant: 'secondary', label: 'Pending' },
      completed: { variant: 'outline', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatRevenue = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  };

  const stats = [
    { title: 'Total Vehicles', value: allVehicles.length.toString(), change: '+12%', icon: Car, color: 'text-primary' },
    { title: 'Active Bookings', value: bookingStats.active.toString(), change: '+5%', icon: Calendar, color: 'text-secondary' },
    { title: 'Total Customers', value: totalCustomers.toString(), change: '+18%', icon: Users, color: 'text-success' },
    { title: 'Revenue', value: formatRevenue(bookingStats.revenue), change: '+22%', icon: IndianRupee, color: 'text-primary' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-3 rounded-xl bg-muted", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="flex items-center text-sm text-success font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2 border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/bookings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No bookings yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Vehicle</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 text-sm font-medium text-muted-foreground">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border last:border-0">
                        <td className="py-4 text-sm font-medium">{booking.vehicle_name}</td>
                        <td className="py-4 text-sm text-muted-foreground">{booking.email}</td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {format(new Date(booking.created_at), 'dd MMM')}
                        </td>
                        <td className="py-4">{getStatusBadge(booking.status)}</td>
                        <td className="py-4 text-sm text-right font-medium">₹{booking.total_price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Vehicle Summary */}
        <div className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => setAddVehicleOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Vehicle
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/bookings">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Bookings
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/customers">
                  <Users className="h-4 w-4 mr-2" />
                  View Customers
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/admin/reports">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Vehicle Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm">Cars Available</span>
                </div>
                <span className="font-semibold">{allVehicles.filter(v => v.type === 'car').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Bike className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="text-sm">Bikes Available</span>
                </div>
                <span className="font-semibold">{allVehicles.filter(v => v.type === 'bike').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Bike className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-sm">Scooters Available</span>
                </div>
                <span className="font-semibold">{allVehicles.filter(v => v.type === 'activa').length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <AddVehicleForm 
            onSuccess={refreshVehicles} 
            onCancel={() => setAddVehicleOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}