import { Link } from "react-router";
import { useProducts } from "../context/ProductsContext";
import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

import img2077 from "@/imports/IMG_2077.jpg";
import img2079 from "@/imports/IMG_2079.jpg";
import img2081 from "@/imports/IMG_2081.jpg";
import img2083 from "@/imports/IMG_2083.jpg";
import img2092 from "@/imports/IMG_2092.jpg";

const categories = [
  { name: "Necklaces", href: "/shop?category=Necklaces", image: img2092 },
  { name: "Bracelets", href: "/shop?category=Bracelets", image: img2083 },
  { name: "Earrings", href: "/shop?category=Earrings", image: img2081 },
  { name: "Rings", href: "/shop?category=Rings", image: img2079 },
];

export function Home() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 5);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[580px] overflow-hidden bg-muted">
        <ImageWithFallback
          src={img2077}
          alt="Voluble Boutique — Infinity Collection Set"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6 space-y-5">
          <p className="text-[10px] tracking-[0.35em] uppercase font-light opacity-80">
            Fine Jewelry
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-none tracking-wide">
            Voluble Boutique
          </h1>
          <p className="text-sm md:text-base font-light max-w-xs md:max-w-sm tracking-wider opacity-90 leading-relaxed">
            Handcrafted pieces made to be worn every day and kept forever.
          </p>
          <Link
            to="/shop"
            className="mt-2 border border-white/70 text-white text-[10px] tracking-[0.3em] uppercase px-10 py-3 hover:bg-white hover:text-foreground transition-all duration-300"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured */}
      <section className="px-6 md:px-12 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              New Season
            </p>
            <h2 className="font-display text-3xl md:text-4xl">Featured Pieces</h2>
          </div>
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-accent transition-colors"
          >
            View All <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Featured grid: large left + 4 right */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {featured[0] && (
            <Link
              to={`/product/${featured[0].id}`}
              className="group col-span-2 lg:col-span-1 lg:row-span-2"
            >
              <div className="overflow-hidden bg-muted aspect-[3/4] lg:aspect-auto lg:h-full min-h-[420px]">
                <ImageWithFallback
                  src={featured[0].image}
                  alt={featured[0].name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="mt-3 space-y-0.5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  {featured[0].category}
                </p>
                <h3 className="font-display text-lg">{featured[0].name}</h3>
                <p className="text-sm text-muted-foreground">${featured[0].price}</p>
              </div>
            </Link>
          )}

          {featured.slice(1, 5).map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div className="overflow-hidden bg-muted aspect-[3/4]">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="mt-3 space-y-0.5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  {product.category}
                </p>
                <h3 className="font-display text-base">{product.name}</h3>
                <p className="text-sm text-muted-foreground">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-accent transition-colors"
          >
            View All Jewelry <ArrowRight className="size-3" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary px-6 md:px-12 py-20">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2 text-center">
          Collections
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.name} to={cat.href} className="group">
              <div className="aspect-square overflow-hidden bg-muted">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
              </div>
              <p className="font-display text-lg mt-4 text-center">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Our Story
          </p>
          <h2 className="font-display text-3xl md:text-4xl leading-snug">
            Each piece tells a story worth keeping.
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Voluble Boutique curates fine jewelry that speaks quietly and endures beautifully.
            Sourced from artisan makers and designed for the everyday — because the best jewelry
            is never saved for a special occasion.
          </p>
          <a
            href="https://www.instagram.com/volubleboutique/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground hover:text-accent transition-colors"
          >
            Follow @volubleboutique <ArrowRight className="size-3" />
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-foreground text-background py-20 px-6 md:px-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-50">Stay Connected</p>
          <h2 className="font-display text-2xl md:text-3xl">First access to new arrivals</h2>
          <form className="flex mt-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-background/20 px-4 py-3 text-sm text-background placeholder:text-background/40 outline-none focus:border-background/60 transition-colors min-w-0"
            />
            <button
              type="submit"
              className="bg-accent px-6 py-3 text-[10px] tracking-[0.25em] uppercase text-white hover:bg-accent/90 transition-colors whitespace-nowrap shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
