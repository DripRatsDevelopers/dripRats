import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p>
            At Driprats, your privacy is our priority. We are committed to
            safeguarding your personal information.
          </p>
          <h2 className="text-xl font-semibold">Information Collection</h2>
          <p>
            We collect your name, email, phone number, address, and order
            details to process and deliver your purchases.
          </p>
          <h2 className="text-xl font-semibold">How We Use Your Data</h2>
          <p>
            Your data is used strictly for order processing, delivery, customer
            support, and analytics. We do not share or sell your data.
          </p>
          <h2 className="text-xl font-semibold">Data Security</h2>
          <p>We use secure servers and encryption to keep your data safe.</p>
          <h2 className="text-xl font-semibold">Policy Updates</h2>
          <p>
            Any changes to this policy will be reflected here. Please review
            periodically.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
