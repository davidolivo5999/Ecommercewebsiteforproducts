import { Instagram, Mail } from "lucide-react";
import { Link } from "react-router";
import logo from "@/imports/logo.jpg";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <img src={logo} alt="Voluble Boutique" className="h-16 w-auto object-contain" style={{ mixBlendMode: "multiply" }} />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fine jewelry for every day. Thoughtfully sourced, made to endure.
            </p>
            <div className="flex gap-4 pt-1">
              <a
                href="https://www.instagram.com/volubleboutique/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="mailto:hello@volubleboutique.com"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium">Shop</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {["Rings", "Necklaces", "Earrings", "Bracelets"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${cat}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/shop" className="hover:text-foreground transition-colors">
                  All Jewelry
                </Link>
              </li>
            </ul>
          </div>

          {/* Service */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium">Service</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {["Contact Us", "Shipping & Returns", "Ring Sizing Guide", "Care Instructions"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-foreground transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter teaser */}
          <div className="space-y-4">
            <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium">Stay in Touch</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              New arrivals, behind-the-scenes, and early access — straight to your inbox.
            </p>
            <a
              href="https://www.instagram.com/volubleboutique/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-accent transition-colors"
            >
              @volubleboutique
            </a>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
          <span>© {new Date().getFullYear()} Voluble Boutique. All rights reserved.</span>
          <Link to="/admin" className="hover:text-foreground transition-colors opacity-50 hover:opacity-100">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
