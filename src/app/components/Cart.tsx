import { Link } from "react-router";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

const FREE_SHIPPING_THRESHOLD = 150;

export function Cart() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 12;

  if (items.length === 0) {
    return (
      <div className="px-6 md:px-12 py-24 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <ShoppingBag className="size-10 mx-auto text-muted-foreground" strokeWidth={1} />
          <div className="space-y-2">
            <h2 className="font-display text-2xl">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground">
              Discover pieces made to be worn every day and kept forever.
            </p>
          </div>
          <Link to="/shop">
            <Button size="lg" className="rounded-none tracking-widest uppercase text-xs px-10">
              Browse Collection
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-12">
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
        Your Bag
      </p>
      <h1 className="font-display text-4xl mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-border">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
              className="flex gap-5 py-6"
            >
              <Link to={`/product/${item.product.id}`} className="shrink-0">
                <div className="w-20 h-24 overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-4 mb-1">
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      {item.product.category}
                    </p>
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="font-display text-base hover:text-accent transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.selectedSize && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Size: {item.selectedSize}
                      </p>
                    )}
                    {item.selectedColor && (
                      <p className="text-xs text-muted-foreground">
                        Metal: {item.selectedColor}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium whitespace-nowrap">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-border">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="size-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 border border-border p-6 space-y-5 bg-card">
            <h2 className="font-display text-xl">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
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
              <span>${(total + shipping).toFixed(2)}</span>
            </div>

            {total < FREE_SHIPPING_THRESHOLD && (
              <p className="text-xs text-muted-foreground text-center">
                Add ${(FREE_SHIPPING_THRESHOLD - total).toFixed(2)} more for complimentary shipping
              </p>
            )}

            <Link to="/checkout" className="block">
              <Button
                size="lg"
                className="w-full rounded-none tracking-widest uppercase text-xs h-11"
              >
                Proceed to Checkout
              </Button>
            </Link>

            <Link to="/shop" className="block">
              <Button
                variant="outline"
                className="w-full rounded-none tracking-widest uppercase text-xs h-11"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
