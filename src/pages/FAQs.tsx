import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What documents do I need to rent a vehicle?',
    answer: 'You need a valid driving license, government-issued ID proof (Aadhar/Passport), and a valid credit/debit card for security deposit.',
  },
  {
    question: 'What is the minimum age requirement?',
    answer: 'The minimum age to rent a vehicle is 21 years. You must have held a valid driving license for at least 1 year.',
  },
  {
    question: 'Can I cancel my booking?',
    answer: 'Yes, you can cancel your booking up to 24 hours before the pickup time for a full refund. Cancellations within 24 hours may incur charges.',
  },
  {
    question: 'Is fuel included in the rental price?',
    answer: 'Vehicles are provided with a full tank of fuel. You are expected to return the vehicle with the same fuel level.',
  },
  {
    question: 'What happens if I return the vehicle late?',
    answer: 'Late returns are charged on an hourly basis. If significantly late, you may be charged for an additional day.',
  },
  {
    question: 'Is insurance included?',
    answer: 'Basic insurance is included in all rentals. Additional comprehensive coverage options are available at checkout.',
  },
];

const FAQs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg mb-8 text-center">
            Find answers to common questions about our services.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
