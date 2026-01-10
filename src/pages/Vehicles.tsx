import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { vehicles } from '@/data/vehicles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Car, Bike, Filter, Search, X, Building2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VehicleType, FuelType } from '@/types/vehicle';

const fuelTypes: FuelType[] = ['petrol', 'diesel', 'electric', 'cng'];

// Get unique brands from vehicles
const brands = [...new Set(vehicles.map(v => v.brand))];

export default function VehiclesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [vehicleType, setVehicleType] = useState<VehicleType | 'all'>(
    (searchParams.get('type') as VehicleType) || 'all'
  );
  const [selectedBrand, setSelectedBrand] = useState<string | 'all'>(
    searchParams.get('brand') || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedFuels, setSelectedFuels] = useState<FuelType[]>([]);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('rating');

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Filter by type
    if (vehicleType !== 'all') {
      result = result.filter(v => v.type === vehicleType);
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
  }, [vehicleType, selectedBrand, searchQuery, priceRange, selectedFuels, sortBy]);

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
    if (brand === 'all') {
      searchParams.delete('brand');
    } else {
      searchParams.set('brand', brand);
    }
    setSearchParams(searchParams);
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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Vehicle Type */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Vehicle Type</Label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All', icon: null },
            { value: 'car', label: 'Cars', icon: Car },
            { value: 'bike', label: 'Bikes', icon: Bike },
            { value: 'scooter', label: 'Scooters', icon: Zap },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeChange(type.value as VehicleType | 'all')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                vehicleType === type.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {type.icon && <type.icon className="h-4 w-4" />}
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Brand / Company</Label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleBrandChange('all')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              selectedBrand === 'all'
                ? "bg-secondary text-secondary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandChange(brand)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                selectedBrand === brand
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}/day
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
        <Label className="text-sm font-semibold mb-3 block">Fuel Type</Label>
        <div className="space-y-2">
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

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        <X className="h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-primary py-12">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
              {selectedBrand !== 'all' 
                ? `${selectedBrand} Vehicles` 
                : vehicleType === 'all' 
                  ? 'All Vehicles' 
                  : vehicleType === 'car' 
                    ? 'Cars' 
                    : vehicleType === 'scooter'
                      ? 'Scooters / Activa'
                      : 'Bikes'}
            </h1>
            <p className="text-primary-foreground/80">
              {filteredVehicles.length} vehicles available for rent
            </p>
          </div>
        </div>

        {/* Quick Category & Brand Section */}
        <div className="border-b border-border bg-card">
          <div className="container py-4">
            {/* Vehicle Type Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Car className="h-4 w-4" /> Category:
              </span>
              {[
                { value: 'all', label: 'All', icon: null },
                { value: 'car', label: 'Cars', icon: Car },
                { value: 'bike', label: 'Bikes', icon: Bike },
                { value: 'scooter', label: 'Scooters / Activa', icon: Zap },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={vehicleType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTypeChange(type.value as VehicleType | 'all')}
                  className="gap-2"
                >
                  {type.icon && <type.icon className="h-4 w-4" />}
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Brand Quick Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Brand:
              </span>
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
        </div>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl p-6 shadow-card">
                <h2 className="text-lg font-bold mb-6">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search & Sort Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, brand, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="h-12 px-4 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden h-12">
                      <Filter className="h-5 w-5" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results Grid */}
              {filteredVehicles.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                  <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
