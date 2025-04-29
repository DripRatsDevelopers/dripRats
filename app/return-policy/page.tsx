import { Card, CardContent } from "@/components/ui/card";

export default function ReturnPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">Return Policy</h1>
          <p>
            We accept returns only in the event the product is damaged upon
            delivery.
          </p>
          <h2 className="text-xl font-semibold">Eligibility</h2>
          <p>
            If your item arrives damaged, please contact us within 48 hours of
            delivery with clear images of the damage.
          </p>
          <h2 className="text-xl font-semibold">Process</h2>
          <p>
            Once verified, we will initiate a replacement. Products must be
            returned unused and in original packaging.
          </p>
          <h2 className="text-xl font-semibold">Non-returnable Items</h2>
          <p>
            Items without damage, or returns requested beyond 48 hours of
            delivery, will not be accepted.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
