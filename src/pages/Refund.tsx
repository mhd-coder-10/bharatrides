import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Refund = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1>Refund Policy</h1>
          <p className="lead">
            Our refund policy ensures fair treatment for all our customers.
          </p>

          <h2>Eligible Refunds</h2>
          <ul>
            <li>Cancellations made 24+ hours before pickup: Full refund</li>
            <li>Cancellations within 24 hours: 75% refund</li>
            <li>Vehicle unavailability on our end: Full refund + 10% credit</li>
            <li>Early vehicle return: Partial refund for unused days</li>
          </ul>

          <h2>Security Deposit Refund</h2>
          <p>
            Security deposits are refunded within 3-5 business days after vehicle inspection, provided there are no damages or violations.
          </p>

          <h2>Refund Timeline</h2>
          <ul>
            <li>Credit/Debit Cards: 5-7 business days</li>
            <li>UPI: 2-3 business days</li>
            <li>Net Banking: 5-7 business days</li>
          </ul>

          <h2>Non-Refundable Items</h2>
          <ul>
            <li>No-show bookings</li>
            <li>Fuel charges</li>
            <li>Traffic violations and fines</li>
            <li>Damage charges</li>
          </ul>

          <h2>Dispute Resolution</h2>
          <p>
            If you believe a refund has been incorrectly processed, please contact us at refunds@bharatrides.com within 30 days.
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

export default Refund;
