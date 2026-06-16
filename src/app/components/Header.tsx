import { Link } from "react-router";
import { ShoppingBag, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import logo from "@/imports/logo.jpg";

export function Header() {
  const { itemCount } = useCart();

  const navigation = [
    { name: "Rings", href: "/shop?category=Rings" },
    { name: "Necklaces", href: "/shop?category=Necklaces" },
    { name: "Earrings", href: "/shop?category=Earrings" },
    { name: "Bracelets", href: "/shop?category=Bracelets" },
    { name: "All Jewelry", href: "/shop" },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-accent text-white text-[10px] tracking-[0.2em] uppercase py-2 text-center font-light">
        Free shipping on orders over $150 · New arrivals every Friday
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="px-6 md:px-12">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-background">
                <Link to="/" className="block mb-8">
                  <img src={logo} alt="Voluble Boutique" className="h-14 w-auto object-contain" style={{ mixBlendMode: "multiply" }} />
                </Link>
                <nav className="flex flex-col gap-5">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img src={logo} alt="Voluble Boutique" className="h-14 w-auto object-contain" style={{ mixBlendMode: "multiply" }} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Cart */}
            <Link to="/cart" className="relative flex items-center gap-1">
              <ShoppingBag className="size-4" />
              {itemCount > 0 && (
                <span className="text-[10px] font-medium text-accent">{itemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
