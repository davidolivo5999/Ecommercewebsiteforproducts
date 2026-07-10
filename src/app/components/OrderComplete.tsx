import { useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { CheckCircle2 } from "lucide-react";

export function OrderComplete() {
  const { clearCart } = useCart();

  // Customer only lands here after Square redirects back post-payment.
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 md:px-12 py-24 flex flex-col items-center text-center">
      <CheckCircle2 className="w-12 h-12 mb-6 text-accent" />
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
        Order Confirmed
      </p>
      <h1 className="font-display text-4xl mb-4">Thank you for your order</h1>
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed mb-10">
        Your payment was received. A receipt has been sent to your email, and
        we'll be in touch as soon as your order ships.
      </p>
      <Link
        to="/shop"
        className="border border-foreground px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
