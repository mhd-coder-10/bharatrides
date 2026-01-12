import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Car, Bike, Users, IndianRupee, TrendingUp, Calendar,
  Menu, X, Search, Bell, LogOut, Home, Settings,
  BarChart3, FileText, CircleDollarSign, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { vehicles as defaultVehicles } from '@/data/vehicles';
import AddVehicleForm from '@/components/admin/AddVehicleForm';
import { Vehicle } from '@/types/vehicle';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const stats = [
  { title: 'Total Vehicles', value: '1,247', change: '+12%', icon: Car, color: 'text-primary' },
  { title: 'Active Bookings', value: '89', change: '+5%', icon: Calendar, color: 'text-secondary' },
  { title: 'Total Users', value: '3,456', change: '+18%', icon: Users, color: 'text-success' },
  { title: 'Revenue (Month)', value: '₹4.5L', change: '+22%', icon: IndianRupee, color: 'text-primary' },
];

const recentBookings = [
  { id: 'BK001', customer: 'Rahul Sharma', vehicle: 'Swift Dzire', date: '2024-01-15', status: 'confirmed', amount: 3000 },
  { id: 'BK002', customer: 'Priya Patel', vehicle: 'Royal Enfield', date: '2024-01-15', status: 'pending', amount: 1600 },
  { id: 'BK003', customer: 'Amit Kumar', vehicle: 'Honda City', date: '2024-01-14', status: 'completed', amount: 5000 },
  { id: 'BK004', customer: 'Sneha Reddy', vehicle: 'Hyundai Creta', date: '2024-01-14', status: 'confirmed', amount: 6000 },
  { id: 'BK005', customer: 'Vikram Singh', vehicle: 'KTM Duke 390', date: '2024-01-13', status: 'cancelled', amount: 2400 },
];

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/admin' },
  { icon: Car, label: 'Vehicles', href: '/admin/vehicles' },
  { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: CircleDollarSign, label: 'Payments', href: '/admin/payments' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
  { icon: FileText, label: 'Documents', href: '/admin/documents' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/auth');
    }
  }, [user, isLoading, isAdmin, navigate]);

  useEffect(() => {
    // Load custom vehicles from localStorage and merge with default
    const customVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
    setAllVehicles([...defaultVehicles, ...customVehicles]);
  }, []);

  const refreshVehicles = () => {
    const customVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
    setAllVehicles([...defaultVehicles, ...customVehicles]);
    setAddVehicleOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
    navigate('/');
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

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Car className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold">
            Bharat<span className="text-sidebar-primary">Rides</span>
          </span>
          <button 
            className="lg:hidden ml-auto p-2"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                item.label === 'Dashboard' 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-10 w-64"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            </Button>
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 space-y-6">
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
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">ID</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Vehicle</th>
                        <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right py-3 text-sm font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-border last:border-0">
                          <td className="py-4 text-sm font-medium">{booking.id}</td>
                          <td className="py-4 text-sm">{booking.customer}</td>
                          <td className="py-4 text-sm text-muted-foreground">{booking.vehicle}</td>
                          <td className="py-4">{getStatusBadge(booking.status)}</td>
                          <td className="py-4 text-sm text-right font-medium">₹{booking.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Booking
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Add Customer
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
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
                      <div className="p-2 rounded-lg bg-destructive/10">
                        <Car className="h-5 w-5 text-destructive" />
                      </div>
                      <span className="text-sm">Under Maintenance</span>
                    </div>
                    <span className="font-semibold">3</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
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
