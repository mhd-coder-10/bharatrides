import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="lead">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly, including name, email, phone number, driving license details, and payment information.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To process and manage your bookings</li>
            <li>To communicate with you about your rentals</li>
            <li>To improve our services</li>
            <li>To send promotional offers (with your consent)</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal information. Payment data is encrypted and processed through secure payment gateways.
          </p>

          <h2>Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with service providers who assist in our operations, subject to confidentiality agreements.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. Contact us at privacy@bharatrides.com for any requests.
          </p>

          <h2>Cookies</h2>
          <p>
            We use cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
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

export default Privacy;
