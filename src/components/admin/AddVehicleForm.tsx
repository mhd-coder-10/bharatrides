import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Car, Bike, Loader2 } from 'lucide-react';
import VehicleImageUpload from './VehicleImageUpload';
import { createVehicleNotification } from '@/lib/vehicleNotifications';

const vehicleSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  brand: z.string().min(2, 'Brand must be at least 2 characters').max(50),
  type: z.enum(['car', 'bike']),
  pricePerDay: z.coerce.number().min(100, 'Minimum ₹100 per day'),
  pricePerHour: z.coerce.number().min(10, 'Minimum ₹10 per hour'),
  seats: z.coerce.number().min(1).max(10).optional(),
  fuelType: z.enum(['petrol', 'diesel', 'electric', 'cng']),
  transmission: z.enum(['manual', 'automatic']).optional(),
  location: z.string().min(3, 'Location is required').max(100),
  year: z.coerce.number().min(2015).max(new Date().getFullYear() + 1),
  mileage: z.string().min(2, 'Mileage is required'),
  features: z.string().min(2, 'Add at least one feature'),
  available: z.boolean().default(true),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface AddVehicleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddVehicleForm({ onSuccess, onCancel }: AddVehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: '',
      brand: '',
      type: 'car',
      pricePerDay: 1000,
      pricePerHour: 100,
      seats: 5,
      fuelType: 'petrol',
      transmission: 'manual',
      location: '',
      year: new Date().getFullYear(),
      mileage: '',
      features: '',
      available: true,
    },
  });

  const vehicleType = form.watch('type');

  const onSubmit = async (data: VehicleFormData) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert features string to array
      const featuresArray = data.features.split(',').map(f => f.trim()).filter(Boolean);
      
      const newVehicle = {
        id: Date.now().toString(),
        ...data,
        image: uploadedImages[0], // Main image
        images: uploadedImages, // All images
        features: featuresArray,
        rating: 5.0,
        reviewCount: 0,
      };
      
      // For now, we'll store in localStorage (will be replaced with database later)
      const existingVehicles = JSON.parse(localStorage.getItem('customVehicles') || '[]');
      localStorage.setItem('customVehicles', JSON.stringify([...existingVehicles, newVehicle]));
      
      // Create notification for vehicle addition
      await createVehicleNotification(data.name, data.brand, 'added');
      
      toast.success('Vehicle added successfully!', {
        description: `${data.brand} ${data.name} has been added to your fleet.`,
      });
      
      form.reset();
      setUploadedImages([]);
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to add vehicle', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Type Selection */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Type</FormLabel>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={field.value === 'car' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => field.onChange('car')}
                >
                  <Car className="h-4 w-4 mr-2" />
                  Car
                </Button>
                <Button
                  type="button"
                  variant={field.value === 'bike' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => field.onChange('bike')}
                >
                  <Bike className="h-4 w-4 mr-2" />
                  Bike
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Maruti Suzuki, Honda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Swift Dzire, Activa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload */}
        <VehicleImageUpload
          images={uploadedImages}
          onImagesChange={setUploadedImages}
          maxImages={5}
        />

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pricePerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Day (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1500" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricePerHour"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Hour (₹)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="cng">CNG</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {vehicleType === 'car' && (
            <>
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seats</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mileage</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 22 km/l or 312 km range" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mumbai, Maharashtra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Features */}
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features (comma separated)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="AC, Power Steering, Bluetooth, USB Charger" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Availability */}
        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <FormLabel className="text-base">Available for Rent</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Make this vehicle immediately available for booking
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding Vehicle...
              </>
            ) : (
              'Add Vehicle'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
