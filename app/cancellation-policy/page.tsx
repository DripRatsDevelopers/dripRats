import { Card, CardContent } from "@/components/ui/card";

export default function CancellationPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Cancellation Policy</h1>
          <p>
            Orders can only be cancelled before they are shipped. Once shipped,
            cancellations are not allowed.
          </p>
          <h2 className="text-xl font-semibold">Online Payments Only</h2>
          <p>
            We only support online payments. Cash on Delivery (COD) is not
            available.
          </p>
          <h2 className="text-xl font-semibold">How to Cancel</h2>
          <p>
            To request a cancellation, please contact us immediately after
            placing your order. If the item has not shipped, we will cancel and
            refund your order.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
