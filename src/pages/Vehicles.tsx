import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { vehicles as defaultVehicles } from '@/data/vehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Car, Bike, Search, X, Building2, Zap, Grid3X3, List, ChevronDown, SlidersHorizontal, Fuel, Star, MapPin, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VehicleType, FuelType, Vehicle } from '@/types/vehicle';

const fuelTypes: FuelType[] = ['petrol', 'diesel', 'electric', 'cng'];

type ViewMode = 'grid' | 'list';
type GridColumns = 2 | 3 | 4;

// Helper function to load all vehicles including custom ones from localStorage
const loadAllVehicles = (): Vehicle[] => {
  const customVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
  const deletedDefaults = JSON.parse(localStorage.getItem('deletedDefaultVehicles') || '[]');
  const editedDefaults = JSON.parse(localStorage.getItem('editedDefaultVehicles') || '{}');
  
  const activeDefaultVehicles = defaultVehicles
    .filter(v => !deletedDefaults.includes(v.id))
    .map(v => editedDefaults[v.id] ? { ...v, ...editedDefaults[v.id] } : v);
  
  return [...activeDefaultVehicles, ...customVehicles];
};

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  
  // Load vehicles on mount
  useEffect(() => {
    setAllVehicles(loadAllVehicles());
  }, []);

  // Get unique brands from loaded vehicles
  const brands = useMemo(() => [...new Set(allVehicles.map(v => v.brand))], [allVehicles]);
  
  const [vehicleType, setVehicleType] = useState<VehicleType | 'all'>(
    (searchParams.get('type') as VehicleType) || 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState<string | 'all'>(
    searchParams.get('brand') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Sync state with URL params when they change (e.g., from header navigation)
  useEffect(() => {
    const typeParam = searchParams.get('type') as VehicleType | null;
    const brandParam = searchParams.get('brand');
    
    setVehicleType(typeParam || 'all');
    setSelectedBrand(brandParam || 'all');
  }, [searchParams]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedFuels, setSelectedFuels] = useState<FuelType[]>([]);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('rating');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [gridColumns, setGridColumns] = useState<GridColumns>(3);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const filteredVehicles = useMemo(() => {
    let result = [...allVehicles];

    // STRICT type filtering - only exact matches
    if (vehicleType !== 'all') {
      result = result.filter(v => v.type.toLowerCase() === vehicleType.toLowerCase());
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      result = result.filter(v => v.brand === selectedBrand);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(v => 
        v.name.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query)
      );
    }

    // Filter by price
    result = result.filter(v => 
      v.pricePerDay >= priceRange[0] && v.pricePerDay <= priceRange[1]
    );

    // Filter by fuel type
    if (selectedFuels.length > 0) {
      result = result.filter(v => selectedFuels.includes(v.fuelType));
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        result.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [allVehicles, vehicleType, selectedBrand, searchQuery, priceRange, selectedFuels, sortBy]);

  const handleTypeChange = (type: VehicleType | 'all') => {
    setVehicleType(type);
    if (type === 'all') {
      searchParams.delete('type');
    } else {
      searchParams.set('type', type);
    }
    setSearchParams(searchParams);
  };

  const handleBrandChange = (brand: string | 'all') => {
    setSelectedBrand(brand);
    const newParams = new URLSearchParams(searchParams);
    if (brand === 'all') {
      newParams.delete('brand');
    } else {
      newParams.set('brand', brand);
      // Reset type filter to show all vehicles for the selected brand
      setVehicleType('all');
      newParams.delete('type');
    }
    setSearchParams(newParams);
  };

  const toggleFuel = (fuel: FuelType) => {
    setSelectedFuels(prev => 
      prev.includes(fuel) 
        ? prev.filter(f => f !== fuel)
        : [...prev, fuel]
    );
  };

  const clearFilters = () => {
    setVehicleType('all');
    setSelectedBrand('all');
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSelectedFuels([]);
    setSortBy('rating');
    setSearchParams({});
  };

  const activeFilterCount = [
    vehicleType !== 'all',
    selectedBrand !== 'all',
    selectedFuels.length > 0,
    priceRange[0] > 0 || priceRange[1] < 5000,
  ].filter(Boolean).length;

  // List View Card Component
  const VehicleListCard = ({ vehicle }: { vehicle: Vehicle }) => (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-xl border border-border hover:shadow-card transition-shadow">
      <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
        <img 
          src={vehicle.image} 
          alt={vehicle.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-lg text-foreground">{vehicle.name}</h3>
              <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {vehicle.rating}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {vehicle.location}
            </span>
            <span className="flex items-center gap-1 capitalize">
              <Fuel className="h-3 w-3" /> {vehicle.fuelType}
            </span>
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">₹{vehicle.pricePerDay}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <Button size="sm">View Details</Button>
        </div>
      </div>
    </div>
  );

  const getGridClass = () => {
    switch (gridColumns) {
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Compact Page Header */}
        <div className="bg-primary py-8">
          <div className="container">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
              {selectedBrand !== 'all' 
                ? `${selectedBrand} Vehicles` 
                : vehicleType === 'all' 
                  ? 'All Vehicles' 
                  : vehicleType === 'car' 
                    ? 'Cars' 
                    : vehicleType === 'activa'
                      ? 'Activa'
                      : 'Bikes'}
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {filteredVehicles.length} vehicles available for rent
            </p>
          </div>
        </div>

        <div className="container py-6">
          {/* Top Filter Bar */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <div className="bg-card rounded-xl border border-border p-4 mb-6">
              {/* Search + Controls Row */}
              <div className="flex flex-col lg:flex-row gap-4 mb-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, brand, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-11"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-11 px-4 rounded-lg border border-border bg-background text-foreground min-w-[160px]"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* View Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2.5 transition-colors",
                        viewMode === 'grid' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                      title="Grid view"
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2.5 transition-colors",
                        viewMode === 'list' ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      )}
                      title="List view"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>

                  {viewMode === 'grid' && (
                    <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
                      {[2, 3, 4].map((cols) => (
                        <button
                          key={cols}
                          onClick={() => setGridColumns(cols as GridColumns)}
                          className={cn(
                            "px-2.5 py-1.5 text-xs font-medium rounded transition-colors",
                            gridColumns === cols ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          )}
                        >
                          {cols}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Toggle Filters */}
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                        {activeFilterCount}
                      </Badge>
                    )}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
              </div>

              {/* Expandable Filters */}
              <CollapsibleContent className="space-y-4">
                <div className="h-px bg-border" />

                {/* Vehicle Type */}
                <div>
                  <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Car className="h-4 w-4" /> Vehicle Type
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { value: 'all', label: 'All', icon: null },
                      { value: 'car', label: 'Cars', icon: Car },
                      { value: 'bike', label: 'Bikes', icon: Bike },
                      { value: 'activa', label: 'Activa', icon: Zap },
                    ].map((type) => (
                      <Button
                        key={type.value}
                        variant={vehicleType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTypeChange(type.value as VehicleType | 'all')}
                        className="gap-1.5"
                      >
                        {type.icon && <type.icon className="h-4 w-4" />}
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Brand
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button
                      variant={selectedBrand === 'all' ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleBrandChange('all')}
                    >
                      All Brands
                    </Button>
                    {brands.map((brand) => (
                      <Button
                        key={brand}
                        variant={selectedBrand === brand ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => handleBrandChange(brand)}
                      >
                        {brand}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" /> Price: ₹{priceRange[0]} - ₹{priceRange[1]}/day
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={5000}
                      step={100}
                      className="mt-4"
                    />
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Fuel className="h-4 w-4" /> Fuel Type
                    </Label>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {fuelTypes.map((fuel) => (
                        <div key={fuel} className="flex items-center gap-2">
                          <Checkbox
                            id={fuel}
                            checked={selectedFuels.includes(fuel)}
                            onCheckedChange={() => toggleFuel(fuel)}
                          />
                          <label htmlFor={fuel} className="text-sm capitalize cursor-pointer">
                            {fuel}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive hover:text-destructive">
                      <X className="h-4 w-4 mr-1" />
                      Clear all filters
                    </Button>
                  </div>
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Results */}
          {filteredVehicles.length > 0 ? (
            viewMode === 'grid' ? (
              <div className={cn("grid gap-6", getGridClass())}>
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVehicles.map((vehicle) => (
                  <VehicleListCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No vehicles found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
