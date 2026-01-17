import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Car, Bike, Zap, Shield, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Slide {
  id: number;
  type: 'vehicle' | 'promo';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge?: string;
  cta: {
    text: string;
    link: string;
  };
  features?: { icon: React.ElementType; text: string }[];
}

const slides: Slide[] = [
  {
    id: 1,
    type: 'promo',
    title: 'Explore India Your Way',
    subtitle: 'Premium Vehicle Rentals',
    description: 'Rent cars, bikes & scooters at the best prices. Verified vehicles, 24/7 support, and hassle-free booking.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&auto=format&fit=crop&q=80',
    badge: 'Special Offer',
    cta: { text: 'Browse Vehicles', link: '/vehicles' },
    features: [
      { icon: Shield, text: 'Fully Insured' },
      { icon: Clock, text: '24/7 Support' },
      { icon: MapPin, text: '50+ Cities' },
    ],
  },
  {
    id: 2,
    type: 'vehicle',
    title: 'Luxury Sedan Collection',
    subtitle: 'Cars for Every Journey',
    description: 'From compact sedans to premium SUVs, find the perfect car for business trips, family vacations, or weekend getaways.',
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&auto=format&fit=crop&q=80',
    badge: 'Top Rated',
    cta: { text: 'View Cars', link: '/vehicles?type=car' },
    features: [
      { icon: Car, text: 'AC Vehicles' },
      { icon: Shield, text: 'GPS Tracking' },
      { icon: Zap, text: 'Fuel Efficient' },
    ],
  },
  {
    id: 3,
    type: 'vehicle',
    title: 'Two-Wheeler Freedom',
    subtitle: 'Bikes & Scooters',
    description: 'Beat the traffic with our range of bikes and scooters. Perfect for city commutes and weekend rides.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&auto=format&fit=crop&q=80',
    badge: 'Popular',
    cta: { text: 'View Bikes', link: '/vehicles?type=bike' },
    features: [
      { icon: Bike, text: 'Well Maintained' },
      { icon: Zap, text: 'Great Mileage' },
      { icon: Shield, text: 'Helmet Included' },
    ],
  },
  {
    id: 4,
    type: 'promo',
    title: 'Weekend Special',
    subtitle: 'Flat 20% Off',
    description: 'Book any vehicle for the weekend and get an instant 20% discount. Limited time offer!',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920&auto=format&fit=crop&q=80',
    badge: 'Limited Time',
    cta: { text: 'Book Now', link: '/vehicles' },
    features: [
      { icon: Zap, text: '20% Off' },
      { icon: Clock, text: 'Weekend Only' },
      { icon: Shield, text: 'Free Cancellation' },
    ],
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const nextSlide = useCallback(() => {
    setDirection('right');
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection('left');
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden">
      {/* Background Images */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-in-out",
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          {/* Badge */}
          {slide.badge && (
            <Badge 
              className={cn(
                "text-sm px-4 py-1.5 transition-all duration-500",
                direction === 'right' ? 'animate-slide-in-right' : 'animate-fade-in'
              )}
              variant="secondary"
            >
              {slide.badge}
            </Badge>
          )}

          {/* Subtitle */}
          <p 
            className={cn(
              "text-sm sm:text-base text-primary font-medium uppercase tracking-wider transition-all duration-500 delay-100",
              "animate-fade-in"
            )}
          >
            {slide.subtitle}
          </p>

          {/* Title */}
          <h1 
            className={cn(
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight transition-all duration-500 delay-150",
              "animate-fade-in"
            )}
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p 
            className={cn(
              "text-base sm:text-lg text-muted-foreground max-w-xl transition-all duration-500 delay-200",
              "animate-fade-in"
            )}
          >
            {slide.description}
          </p>

          {/* Features */}
          {slide.features && (
            <div className="flex flex-wrap gap-4 pt-2">
              {slide.features.map((feature, index) => (
                <div
                  key={feature.text}
                  className={cn(
                    "flex items-center gap-2 text-sm text-muted-foreground transition-all duration-500",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${250 + index * 50}ms` }}
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button asChild size="lg" className="text-base px-8">
              <Link to={slide.cta.link}>{slide.cta.text}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-background transition-all hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-background transition-all hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 sm:h-2.5 rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-8 sm:w-10 bg-primary"
                : "w-2 sm:w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
