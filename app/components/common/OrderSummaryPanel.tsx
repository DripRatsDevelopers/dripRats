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
import { Separator } from "@radix-ui/react-select";
import Image from "next/image";

type Props = {
  products: CartType[];
  productStocksMap?: Record<string, number>;
  subTotal: number;
  savings?: number;
};

export const OrderSummaryPanel = ({
  products,
  productStocksMap,
  subTotal,
  savings,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const totalAmount = (subTotal - (savings || 0)).toFixed(2);
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
    <div className={cn(isMobile ? "p-2" : "")}>
      <div className={cn("space-y-4", isMobile ? "p-2" : "")}>
        {renderItems()}
      </div>
      <div className="font-semibold flex items-center justify-between text-base px-2 py-1">
        <p>Subtotal:</p> ₹{subTotal}
      </div>
      {savings ? (
        <div className="font-semibold flex items-center justify-between text-green-600 px-2 py-1">
          <p>Savings:</p> ₹{savings.toFixed(2)}
        </div>
      ) : null}
      <div className="text-xs font-semibold flex items-center justify-between text-base px-2 py-1">
        <p> Shipping charges:</p>{" "}
        <i className="font-normal text-gray-500">Calculated in next step</i>
      </div>
      <Separator className="border" />
      {totalAmount ? (
        <div className="font-semibold flex items-center justify-between text-base px-2 py-1">
          <p>Grand total:</p> ₹{totalAmount}
        </div>
      ) : null}
    </div>
  );

  if (isMobile) {
    return (
      <Accordion type="single" collapsible className="bg-white dark:bg-black ">
        <AccordionItem value="order">
          <AccordionContent>{content}</AccordionContent>
          <AccordionTrigger className="px-4 py-3 bg-secondary ">
            Order Summary
          </AccordionTrigger>
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
