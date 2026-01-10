export type VehicleType = 'car' | 'bike' | 'activa';

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'cng';

export type TransmissionType = 'manual' | 'automatic';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: VehicleType;
  image: string;
  pricePerDay: number;
  pricePerHour: number;
  seats?: number;
  fuelType: FuelType;
  transmission?: TransmissionType;
  rating: number;
  reviewCount: number;
  available: boolean;
  location: string;
  features: string[];
  year: number;
  mileage: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
}
