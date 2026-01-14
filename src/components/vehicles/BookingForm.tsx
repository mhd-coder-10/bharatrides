import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Phone, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Vehicle } from '@/types/vehicle';
import { z } from 'zod';

const bookingSchema = z.object({
  mobileNumber: z.string().min(10, 'Mobile number must be at least 10 digits').max(15, 'Mobile number is too long').regex(/^[0-9+\-\s]+$/, 'Invalid mobile number format'),
  email: z.string().email('Invalid email address'),
  pickupDate: z.string().min(1, 'Pick-up date is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  pickupArea: z.string().min(2, 'Pick-up area is required').max(100, 'Pick-up area is too long'),
  dropArea: z.string().min(2, 'Drop area is required').max(100, 'Drop area is too long'),
  withDriver: z.boolean(),
});

interface BookingFormProps {
  vehicle: Vehicle;
}

export function BookingForm({ vehicle }: BookingFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: '',
    email: user?.email || '',
    pickupDate: '',
    returnDate: '',
    pickupArea: '',
    dropArea: '',
    withDriver: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 1;
    const start = new Date(formData.pickupDate);
    const end = new Date(formData.returnDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = calculateDays();
  const driverFee = formData.withDriver ? 500 * days : 0;
  const subtotal = vehicle.pricePerDay * days;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee + driverFee;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      bookingSchema.parse(formData);
      
      // Additional date validation
      const pickupDate = new Date(formData.pickupDate);
      const returnDate = new Date(formData.returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (pickupDate < today) {
        setErrors({ pickupDate: 'Pick-up date cannot be in the past' });
        return false;
      }
      
      if (returnDate <= pickupDate) {
        setErrors({ returnDate: 'Return date must be after pick-up date' });
        return false;
      }
      
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to book a vehicle",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        vehicle_id: vehicle.id,
        vehicle_name: vehicle.name,
        vehicle_type: vehicle.type,
        mobile_number: formData.mobileNumber,
        email: formData.email,
        pickup_date: formData.pickupDate,
        return_date: formData.returnDate,
        pickup_area: formData.pickupArea,
        drop_area: formData.dropArea,
        with_driver: formData.withDriver,
        total_price: total,
        status: 'pending',
      });

      if (error) throw error;

      toast({
        title: "Booking Successful! 🎉",
        description: `Your ${vehicle.name} has been booked. We'll contact you shortly.`,
      });

      navigate('/my-bookings');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-24 border-0 shadow-elevated">
      <CardContent className="p-6">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <span className="text-3xl font-bold text-foreground">₹{vehicle.pricePerDay.toLocaleString()}</span>
            <span className="text-muted-foreground">/day</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ₹{vehicle.pricePerHour}/hour
          </span>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <Input
              id="mobileNumber"
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
              className={`mt-1 ${errors.mobileNumber ? 'border-destructive' : ''}`}
            />
            {errors.mobileNumber && <p className="text-xs text-destructive mt-1">{errors.mobileNumber}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pickup">Pick-up Date *</Label>
              <Input
                id="pickup"
                type="date"
                value={formData.pickupDate}
                onChange={(e) => handleInputChange('pickupDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`mt-1 ${errors.pickupDate ? 'border-destructive' : ''}`}
              />
              {errors.pickupDate && <p className="text-xs text-destructive mt-1">{errors.pickupDate}</p>}
            </div>
            <div>
              <Label htmlFor="return">Return Date *</Label>
              <Input
                id="return"
                type="date"
                value={formData.returnDate}
                onChange={(e) => handleInputChange('returnDate', e.target.value)}
                min={formData.pickupDate || new Date().toISOString().split('T')[0]}
                className={`mt-1 ${errors.returnDate ? 'border-destructive' : ''}`}
              />
              {errors.returnDate && <p className="text-xs text-destructive mt-1">{errors.returnDate}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="pickupArea">Pick-up Area *</Label>
            <Input
              id="pickupArea"
              type="text"
              placeholder="Enter pick-up location"
              value={formData.pickupArea}
              onChange={(e) => handleInputChange('pickupArea', e.target.value)}
              className={`mt-1 ${errors.pickupArea ? 'border-destructive' : ''}`}
            />
            {errors.pickupArea && <p className="text-xs text-destructive mt-1">{errors.pickupArea}</p>}
          </div>

          <div>
            <Label htmlFor="dropArea">Drop Area *</Label>
            <Input
              id="dropArea"
              type="text"
              placeholder="Enter drop-off location"
              value={formData.dropArea}
              onChange={(e) => handleInputChange('dropArea', e.target.value)}
              className={`mt-1 ${errors.dropArea ? 'border-destructive' : ''}`}
            />
            {errors.dropArea && <p className="text-xs text-destructive mt-1">{errors.dropArea}</p>}
          </div>

          <div>
            <Label className="mb-2 block">Driver Option *</Label>
            <RadioGroup
              value={formData.withDriver ? 'with' : 'without'}
              onValueChange={(value) => handleInputChange('withDriver', value === 'with')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="without" id="without-driver" />
                <Label htmlFor="without-driver" className="cursor-pointer">Without Driver</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="with" id="with-driver" />
                <Label htmlFor="with-driver" className="cursor-pointer">With Driver (+₹500/day)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-border pt-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">₹{vehicle.pricePerDay} × {days} day{days > 1 ? 's' : ''}</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          {formData.withDriver && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Driver fee ({days} day{days > 1 ? 's' : ''})</span>
              <span>₹{driverFee.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service fee</span>
            <span>₹{serviceFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Book Now'
          )}
        </Button>

        <div className="mt-4 text-center">
          <a href="tel:+919876543210" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="h-4 w-4" />
            Need help? Call us
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span>Free cancellation within 24 hours</span>
        </div>
      </CardContent>
    </Card>
  );
}