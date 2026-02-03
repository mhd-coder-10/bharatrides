import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1>Cancellation Policy</h1>
          <p className="lead">
            We understand that plans can change. Here's our cancellation policy for vehicle rentals.
          </p>

          <h2>Free Cancellation</h2>
          <p>
            Cancellations made 24 hours or more before the scheduled pickup time are eligible for a full refund.
          </p>

          <h2>Late Cancellation</h2>
          <p>
            Cancellations made within 24 hours of the scheduled pickup time will incur a cancellation fee of 25% of the total booking amount.
          </p>

          <h2>No-Show</h2>
          <p>
            If you fail to pick up the vehicle without prior cancellation, you will be charged 50% of the total booking amount.
          </p>

          <h2>Refund Process</h2>
          <p>
            Refunds are processed within 5-7 business days to the original payment method used during booking.
          </p>

          <h2>Contact Us</h2>
          <p>
            For any questions regarding cancellations, please contact our support team at support@bharatrides.com or call +91 98765 43210.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CancellationPolicy;
