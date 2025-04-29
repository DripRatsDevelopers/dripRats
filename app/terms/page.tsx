import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  const supportEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Terms & Conditions</h1>
          <p>
            By accessing our website or purchasing our products, you agree to
            the terms listed here. Please read them carefully before placing an
            order.
          </p>
          <ul className="list-disc ml-5 space-y-2">
            <li>Products are subject to availability.</li>
            <li>Returns are accepted within 7 days of delivery.</li>
            <li>We reserve the right to update our policies at any time.</li>
          </ul>
          <p>
            For complete details or enquiries, contact us at
            {supportEmail}.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
