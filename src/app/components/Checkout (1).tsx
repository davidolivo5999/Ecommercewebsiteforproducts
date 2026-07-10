import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { Lock, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { createCheckout } from "@/utils/api";

const FREE_SHIPPING_THRESHOLD = 150;

export function Checkout() {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 12;
  const orderTotal = total + shipping;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const url = await createCheckout(
        items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
      );
      // Cart is cleared on the order-complete page after payment.
      window.location.href = url;
    } catch (err: any) {
      toast.error(err?.message ?? "Could not start checkout — please try again");
      setIsProcessing(false);
    }
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
        {/* Payment */}
        <div className="lg:col-span-2">
          <div className="border border-border bg-card p-8 space-y-6">
            <h2 className="font-display text-xl">Secure Payment</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You'll be taken to our secure payment page powered by Square to
              enter your shipping address and payment details. Your card
              information is handled entirely by Square and never touches our
              servers.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              <span>Payments processed securely by Square</span>
            </div>
            <Button
              onClick={handlePay}
              disabled={isProcessing}
              className="w-full h-12 rounded-none text-[10px] tracking-[0.3em] uppercase"
            >
              <Lock className="w-3.5 h-3.5 mr-2" />
              {isProcessing
                ? "Preparing secure checkout..."
                : `Continue to Payment · $${orderTotal.toFixed(2)}`}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              You can review your order before paying.
            </p>
          </div>
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
