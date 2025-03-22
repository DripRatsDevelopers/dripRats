"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalAmount } = useCart();
  const { moveToWishlist } = useWishlist();
  const router = useRouter();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-2 md:p-4 border rounded-lg shadow-sm"
              >
                <Image
                  src={item.ImageUrls[0]}
                  alt={item.Name}
                  className="w-30 h-30 object-cover rounded-lg"
                  width={300}
                  height={200}
                />
                <div className="flex-1">
                  <p className="font-semibold">{item.Name}</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    ₹{item.Price}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Delivers in 3-5 days
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 flex-col md:flex-row">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveToWishlist(item)}
                    title="Move to Wishlist"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    title="Remove from Cart"
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary - Right Section (only on md+ screens) */}
          <div className="md:w-1/3 p-4 bg-secondary rounded-lg shadow-lg h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-lg font-medium">
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <Button
              className="mt-4 w-full bg-primary text-primary-foreground"
              onClick={() => {
                router.push("/checkout");
              }}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
