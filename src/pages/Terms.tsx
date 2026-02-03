import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="lead">
            Please read these terms carefully before using our services.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using BharatRides, you accept and agree to be bound by these Terms of Service and our Privacy Policy.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 21 years old and hold a valid driving license to rent a vehicle from us. Additional age restrictions may apply for certain vehicle categories.
          </p>

          <h2>3. Booking and Payment</h2>
          <p>
            All bookings are subject to vehicle availability. Payment is required at the time of booking. We accept major credit/debit cards and UPI payments.
          </p>

          <h2>4. Vehicle Use</h2>
          <p>
            Vehicles must be used in accordance with all applicable laws. Prohibited uses include racing, off-road driving (unless specifically permitted), and any illegal activities.
          </p>

          <h2>5. Insurance and Liability</h2>
          <p>
            Basic insurance is included in all rentals. You are responsible for any damage not covered by insurance, including damage due to negligence or violation of rental terms.
          </p>

          <h2>6. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: February 2026
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
