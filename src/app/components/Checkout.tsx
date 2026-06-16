import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const FREE_SHIPPING_THRESHOLD = 150;

export function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 12;
  const orderTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Order placed — thank you!");
    clearCart();
    navigate("/");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="px-6 md:px-12 py-12">
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
        Almost There
      </p>
      <h1 className="font-display text-4xl mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact */}
            <section className="space-y-5">
              <h2 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground border-b border-border pb-3">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[10px] tracking-[0.2em] uppercase">
                    First Name
                  </Label>
                  <Input id="firstName" required className="rounded-none h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[10px] tracking-[0.2em] uppercase">
                    Last Name
                  </Label>
                  <Input id="lastName" required className="rounded-none h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] tracking-[0.2em] uppercase">
                  Email
                </Label>
                <Input id="email" type="email" required className="rounded-none h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] tracking-[0.2em] uppercase">
                  Phone
                </Label>
                <Input id="phone" type="tel" required className="rounded-none h-11" />
              </div>
            </section>

            {/* Shipping */}
            <section className="space-y-5">
              <h2 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground border-b border-border pb-3">
                Shipping Address
              </h2>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[10px] tracking-[0.2em] uppercase">
                  Street Address
                </Label>
                <Input id="address" required className="rounded-none h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apartment" className="text-[10px] tracking-[0.2em] uppercase">
                  Apt / Suite (optional)
                </Label>
                <Input id="apartment" className="rounded-none h-11" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-[10px] tracking-[0.2em] uppercase">
                    City
                  </Label>
                  <Input id="city" required className="rounded-none h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-[10px] tracking-[0.2em] uppercase">
                    State
                  </Label>
                  <Input id="state" required className="rounded-none h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-[10px] tracking-[0.2em] uppercase">
                    ZIP
                  </Label>
                  <Input id="zip" required className="rounded-none h-11" />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="space-y-5">
              <h2 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground border-b border-border pb-3">
                Payment Information
              </h2>
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-[10px] tracking-[0.2em] uppercase">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  required
                  className="rounded-none h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-[10px] tracking-[0.2em] uppercase">
                    Expiry
                  </Label>
                  <Input id="expiry" placeholder="MM/YY" required className="rounded-none h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-[10px] tracking-[0.2em] uppercase">
                    CVV
                  </Label>
                  <Input id="cvv" placeholder="123" required className="rounded-none h-11" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="size-3" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </section>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-none tracking-widest uppercase text-xs h-12"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Place Order · $${orderTotal.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 border border-border bg-card p-6 space-y-5">
            <h2 className="font-display text-xl">Your Order</h2>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="flex gap-3"
                >
                  <div className="w-14 h-16 overflow-hidden bg-muted shrink-0">
                    <ImageWithFallback
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-display truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    {item.selectedSize && (
                      <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs text-muted-foreground">Metal: {item.selectedColor}</p>
                    )}
                  </div>
                  <p className="text-sm whitespace-nowrap">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-accent">Complimentary</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
