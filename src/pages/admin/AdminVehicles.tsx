import { useState, useEffect } from 'react';
import { Car, Bike, Plus, Pencil, Trash2, Search, Filter, Eye, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { vehicles as defaultVehicles } from '@/data/vehicles';
import AddVehicleForm from '@/components/admin/AddVehicleForm';
import EditVehicleForm from '@/components/admin/EditVehicleForm';
import { Vehicle } from '@/types/vehicle';
import { toast } from 'sonner';

export default function AdminVehicles() {
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [editVehicleOpen, setEditVehicleOpen] = useState(false);
  const [viewVehicleOpen, setViewVehicleOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    // Get custom vehicles
    const customVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
    // Get deleted default vehicle IDs
    const deletedDefaults = JSON.parse(localStorage.getItem('deletedDefaultVehicles') || '[]');
    // Get edited default vehicles
    const editedDefaults = JSON.parse(localStorage.getItem('editedDefaultVehicles') || '{}');
    
    // Filter out deleted default vehicles and apply edits
    const activeDefaultVehicles = defaultVehicles
      .filter(v => !deletedDefaults.includes(v.id))
      .map(v => editedDefaults[v.id] ? { ...v, ...editedDefaults[v.id] } : v);
    
    setAllVehicles([...activeDefaultVehicles, ...customVehicles]);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedVehicle) return;
    
    const isDefault = defaultVehicles.find(v => v.id === selectedVehicle.id);
    
    if (isDefault) {
      // Mark default vehicle as deleted
      const deletedDefaults = JSON.parse(localStorage.getItem('deletedDefaultVehicles') || '[]');
      deletedDefaults.push(selectedVehicle.id);
      localStorage.setItem('deletedDefaultVehicles', JSON.stringify(deletedDefaults));
    } else {
      // Remove custom vehicle
      const customVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
      const updatedCustomVehicles = customVehicles.filter((v: Vehicle) => v.id !== selectedVehicle.id);
      localStorage.setItem('customVehicles', JSON.stringify(updatedCustomVehicles));
    }
    
    loadVehicles();
    setDeleteDialogOpen(false);
    setSelectedVehicle(null);
    toast.success('Vehicle deleted successfully');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditVehicleOpen(true);
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setViewVehicleOpen(true);
  };

  const isDefaultVehicle = (vehicleId: string) => {
    return !!defaultVehicles.find(v => v.id === vehicleId);
  };

  const filteredVehicles = allVehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: allVehicles.length,
    cars: allVehicles.filter(v => v.type === 'car').length,
    bikes: allVehicles.filter(v => v.type === 'bike').length,
    activas: allVehicles.filter(v => v.type === 'activa').length,
    available: allVehicles.filter(v => v.available).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Vehicles Management</h1>
            <p className="text-muted-foreground">Manage your fleet of vehicles</p>
          </div>
        </div>
        <Button onClick={() => setAddVehicleOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Vehicles</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.cars}</div>
            <p className="text-sm text-muted-foreground">Cars</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{stats.bikes}</div>
            <p className="text-sm text-muted-foreground">Bikes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.activas}</div>
            <p className="text-sm text-muted-foreground">Activa</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="car">Cars</SelectItem>
            <SelectItem value="bike">Bikes</SelectItem>
            <SelectItem value="activa">Activa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vehicles Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price/Day</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="h-12 w-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.brand}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {vehicle.type === 'activa' ? 'Activa' : vehicle.type}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{vehicle.pricePerDay.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{vehicle.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{vehicle.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vehicle.available ? "default" : "secondary"}>
                      {vehicle.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Action
                          <MoreHorizontal className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewVehicle(vehicle)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteVehicle(vehicle)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredVehicles.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No vehicles found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>Add a new vehicle to your fleet</DialogDescription>
          </DialogHeader>
          <AddVehicleForm 
            onSuccess={() => {
              loadVehicles();
              setAddVehicleOpen(false);
            }} 
            onCancel={() => setAddVehicleOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={editVehicleOpen} onOpenChange={setEditVehicleOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Update vehicle information</DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <EditVehicleForm 
              vehicle={selectedVehicle}
              onSuccess={() => {
                loadVehicles();
                setEditVehicleOpen(false);
                setSelectedVehicle(null);
              }} 
              onCancel={() => {
                setEditVehicleOpen(false);
                setSelectedVehicle(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Vehicle Dialog */}
      <Dialog open={viewVehicleOpen} onOpenChange={setViewVehicleOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
            <DialogDescription>Complete vehicle information</DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img 
                  src={selectedVehicle.image} 
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedVehicle.brand} {selectedVehicle.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selectedVehicle.type === 'activa' ? 'Activa' : selectedVehicle.type}</p>
                </div>
                <Badge variant={selectedVehicle.available ? "default" : "secondary"}>
                  {selectedVehicle.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price per Day</p>
                  <p className="font-semibold">₹{selectedVehicle.pricePerDay.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price per Hour</p>
                  <p className="font-semibold">₹{selectedVehicle.pricePerHour.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Type</p>
                  <p className="font-semibold capitalize">{selectedVehicle.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold">{selectedVehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mileage</p>
                  <p className="font-semibold">{selectedVehicle.mileage}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold">{selectedVehicle.location}</p>
                </div>
                {selectedVehicle.seats && (
                  <div>
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-semibold">{selectedVehicle.seats}</p>
                  </div>
                )}
                {selectedVehicle.transmission && (
                  <div>
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-semibold capitalize">{selectedVehicle.transmission}</p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicle.features.map((feature, index) => (
                    <Badge key={index} variant="outline">{feature}</Badge>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex items-center gap-2">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">{selectedVehicle.rating}</span>
                <span className="text-sm text-muted-foreground">({selectedVehicle.reviewCount} reviews)</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedVehicle?.brand} {selectedVehicle?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedVehicle(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
