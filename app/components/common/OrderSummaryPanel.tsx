"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { cn, useMediaQuery } from "@/lib/utils";
import { CartType } from "@/types/Cart";
import Image from "next/image";

type Props = {
  products: CartType[];
  productStocksMap?: Record<string, number>;
};

export const OrderSummaryPanel = ({ products, productStocksMap }: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const subtotal = products.reduce(
    (sum, item) => sum + item.Price * item.quantity,
    0
  );

  const renderItems = () =>
    products.map((item) => {
      const availableQuantity = productStocksMap?.[item.id] || 0;

      const isOutOfStock =
        productStocksMap && (!availableQuantity || availableQuantity === 0);
      const limited = availableQuantity <= 10 && availableQuantity > 0;

      return (
        <Card
          key={item.id}
          className="p-3 flex flex-row gap-4 items-center md:[w-fit-content]"
        >
          <Image
            src={item.ImageUrls?.[0]}
            alt={item.Name}
            width={64}
            height={64}
            className="rounded-md object-cover w-16 h-16"
          />
          <div className="flex-1">
            <div className="text-sm font-medium">{item.Name}</div>
            <div className="text-sm text-muted-foreground">
              ₹{item.Price} × {item.quantity}
            </div>

            {isOutOfStock ? (
              <div className="text-red-500 text-xs mt-1">Out of stock</div>
            ) : limited ? (
              <div className="text-yellow-600 text-xs mt-1">
                Only {availableQuantity} left
              </div>
            ) : null}
          </div>
        </Card>
      );
    });

  const content = (
    <div className={cn("space-y-4", isMobile ? "p-2" : "")}>
      {renderItems()}
      <div className="font-semibold text-right text-base">
        Subtotal: ₹{subtotal}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Accordion type="single" collapsible className="bg-white dark:bg-black ">
        <AccordionItem value="order">
          <AccordionTrigger className="px-4 py-3 bg-secondary ">
            Order Summary
          </AccordionTrigger>
          <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <div className="sticky top-24 w-full max-w-sm ml-auto bg-secondary rounded-md p-3">
      <h2 className="text-lg font-semibold mb-3">Order Summary</h2>
      {content}
    </div>
  );
};
