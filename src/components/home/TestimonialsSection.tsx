import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Excellent service! Rented a Swift Dzire for a weekend trip to Lonavala. Car was in perfect condition and the process was smooth. Will definitely use again!',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    location: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Best rental experience in India. The Royal Enfield I rented for my Rajasthan trip was well-maintained. Great customer support throughout.',
  },
  {
    id: 3,
    name: 'Arjun Reddy',
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    rating: 5,
    text: 'Affordable prices and premium vehicles. Rented a Creta for a family trip. The doorstep delivery option saved us so much time!',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Join thousands of satisfied customers who trust us for their travel needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-card">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-secondary/30 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>

                <p className="text-foreground mb-6">{testimonial.text}</p>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
