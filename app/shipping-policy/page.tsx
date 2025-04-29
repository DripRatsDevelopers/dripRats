import { Card, CardContent } from "@/components/ui/card";

export default function ShippingPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Shipping Policy</h1>
          <p>
            We strive to ship all orders within 3-6 business days. Delivery
            times may vary depending on your location.
          </p>
          <h2 className="text-xl font-semibold">Shipping Methods</h2>
          <p>
            We use reliable courier partners to ensure timely and safe delivery.
            Tracking details are provided once the order ships.
          </p>
          <h2 className="text-xl font-semibold">Shipping Charges</h2>
          <p>
            Shipping fees are calculated at checkout. We may offer free shipping
            based on eligibility.
          </p>
          <h2 className="text-xl font-semibold">Delays</h2>
          <p>
            While we aim to deliver on time, external factors such as weather,
            strikes, or courier issues may cause delays.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
