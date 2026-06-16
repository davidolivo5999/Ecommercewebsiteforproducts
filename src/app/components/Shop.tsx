import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { useProducts } from "../context/ProductsContext";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function Shop() {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const paramCategory = searchParams.get("category") || "All";

  const [categoryFilter, setCategoryFilter] = useState<string>(paramCategory);
  const [sortBy, setSortBy] = useState<string>("featured");

  useEffect(() => {
    setCategoryFilter(searchParams.get("category") || "All");
  }, [searchParams]);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  let filteredProducts = [...products];

  if (categoryFilter !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.category === categoryFilter);
  }

  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="px-6 md:px-12 py-16">
      {/* Header */}
      <div className="mb-12 text-center space-y-3">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          {categoryFilter === "All" ? "The Collection" : categoryFilter}
        </p>
        <h1 className="font-display text-4xl md:text-5xl">
          {categoryFilter === "All" ? "All Jewelry" : categoryFilter}
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-start sm:items-center justify-between border-y border-border py-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors ${
                categoryFilter === category
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[160px] text-[11px] tracking-wider uppercase h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
              />
              {product.originalPrice && (
                <Badge className="absolute top-3 right-3 bg-accent text-white border-0 text-[9px] tracking-widest uppercase rounded-none px-2">
                  Sale
                </Badge>
              )}
              {!product.inStock && (
                <Badge className="absolute top-3 left-3 bg-muted-foreground text-white border-0 text-[9px] tracking-widest uppercase rounded-none px-2">
                  Sold Out
                </Badge>
              )}
            </div>
            <div className="mt-3 space-y-0.5">
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                {product.category}
              </p>
              <h3 className="font-display text-base leading-snug">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-sm tracking-wide">
            No pieces found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
