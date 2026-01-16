import { useEffect, useState } from 'react';
import { Users, Loader2, Mail, Calendar, Eye, Search, Pencil, Trash2, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

interface CustomerBooking {
  id: string;
  vehicle_name: string;
  pickup_date: string;
  return_date: string;
  status: string;
  total_price: number;
}

export default function AdminCustomers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Profile | null>(null);
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerBookings = async (userId: string) => {
    setLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, vehicle_name, pickup_date, return_date, status, total_price')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomerBookings(data || []);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleViewCustomer = (customer: Profile) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
    fetchCustomerBookings(customer.user_id);
  };

  const handleEditCustomer = (customer: Profile) => {
    setSelectedCustomer(customer);
    setEditFormData({
      full_name: customer.full_name || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomer = (customer: Profile) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const saveCustomerEdit = async () => {
    if (!selectedCustomer) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editFormData.full_name,
          phone: editFormData.phone,
          address: editFormData.address,
        })
        .eq('id', selectedCustomer.id);

      if (error) throw error;

      setProfiles(prev => 
        prev.map(p => p.id === selectedCustomer.id ? { 
          ...p, 
          full_name: editFormData.full_name,
          phone: editFormData.phone,
          address: editFormData.address,
        } : p)
      );

      toast({
        title: "Customer Updated",
        description: "Customer details have been updated successfully",
      });

      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    toast({
      title: "Cannot Delete",
      description: "Customer profiles cannot be deleted from here. The user must delete their own account.",
      variant: "destructive",
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchQuery.toLowerCase();
    return (
      profile.email?.toLowerCase().includes(searchLower) ||
      profile.full_name?.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Customers Management</h1>
          <p className="text-muted-foreground">View and manage customer accounts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{profiles.length}</div>
            <p className="text-sm text-muted-foreground">Total Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {profiles.filter(p => {
                const date = new Date(p.created_at);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-sm text-muted-foreground">New This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {profiles.filter(p => p.full_name).length}
            </div>
            <p className="text-sm text-muted-foreground">Complete Profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Customers Table */}
      {filteredProfiles.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No customers found</h2>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search' : 'No customers have signed up yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {profile.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt={profile.full_name || 'User'} 
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary font-semibold">
                              {(profile.full_name || profile.email || 'U')[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{profile.full_name || 'Not provided'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profile.email || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{format(new Date(profile.created_at), 'dd MMM yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewCustomer(profile)}
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCustomer(profile)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCustomer(profile)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* View Customer Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View customer information and booking history
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {selectedCustomer.avatar_url ? (
                    <img 
                      src={selectedCustomer.avatar_url} 
                      alt={selectedCustomer.full_name || 'User'} 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary text-2xl font-semibold">
                      {(selectedCustomer.full_name || selectedCustomer.email || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCustomer.full_name || 'Not provided'}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.phone || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedCustomer.address || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Member since {format(new Date(selectedCustomer.created_at), 'dd MMMM yyyy')}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Booking History</h4>
                {loadingBookings ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : customerBookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {customerBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div>
                          <p className="text-sm font-medium">{booking.vehicle_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.pickup_date), 'dd MMM')} - {format(new Date(booking.return_date), 'dd MMM yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status)}
                          <p className="text-sm font-medium mt-1">₹{booking.total_price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer details
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editFormData.address}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveCustomerEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Customer accounts are managed through authentication. You can view and edit customer details, but deletion must be done by the user themselves or through the authentication system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCustomer(null)}>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
