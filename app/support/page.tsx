import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Support</h1>
          <p>
            Need help? Our support team is here to assist you with your
            questions or concerns.
          </p>
          <p>
            Contact us at{" "}
            <a
              href="mailto:support@driprats.com"
              className="text-primary underline"
            >
              support@driprats.com
            </a>
          </p>
          <p>Response time: within 24 hours (Mon–Sat)</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="q1">
              <AccordionTrigger>How long does delivery take?</AccordionTrigger>
              <AccordionContent>
                Most orders are delivered within 5–7 business days across India.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q2">
              <AccordionTrigger>
                Can I return or exchange a product?
              </AccordionTrigger>
              <AccordionContent>
                Yes, returns are accepted within 7 days of delivery. Please make
                sure the product is unused and in its original packaging.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q3">
              <AccordionTrigger>How can I track my order?</AccordionTrigger>
              <AccordionContent>
                After your order is shipped, you’ll receive a tracking link via
                email and SMS.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="q4">
              <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
              <AccordionContent>
                Currently, we only ship within India. International shipping
                will be introduced soon.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
