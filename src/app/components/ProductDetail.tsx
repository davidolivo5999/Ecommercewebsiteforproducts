import { useState } from "react";
import { useParams, Link } from "react-router";
import { useProducts } from "../context/ProductsContext";
import { Button } from "./ui/button";
import { useCart } from "../context/CartContext";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  if (!product) {
    return (
      <div className="px-6 md:px-12 py-20 text-center space-y-4">
        <h1 className="font-display text-2xl">Piece not found</h1>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const sizeLabel =
    product.category === "Rings"
      ? "Ring Size"
      : product.category === "Necklaces"
      ? "Chain Length"
      : product.category === "Bracelets"
      ? "Bracelet Size"
      : "Size";

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error(`Please select a ${sizeLabel.toLowerCase()}`);
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a metal finish");
      return;
    }

    addToCart(product, selectedSize, selectedColor);
    toast.success("Added to cart");
  };

  return (
    <div className="px-6 md:px-12 py-12">
      {/* Breadcrumb */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="size-3" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 aspect-square overflow-hidden border-b-2 transition-colors ${
                    selectedImage === index
                      ? "border-foreground"
                      : "border-transparent"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-7 lg:pt-4">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              {product.category}
            </p>
            <h1 className="font-display text-3xl md:text-4xl leading-snug">{product.name}</h1>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl">${product.price}</span>
              {product.originalPrice && (
                <span className="text-base text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Size Selection */}
          {product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                {sizeLabel}
              </label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="border-border rounded-none h-11">
                  <SelectValue placeholder={`Select ${sizeLabel.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Metal / Finish */}
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Metal
              </label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="border-border rounded-none h-11">
                  <SelectValue placeholder="Select metal" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Add to Cart */}
          <div className="pt-2 space-y-3">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              size="lg"
              className="w-full rounded-none tracking-widest uppercase text-xs h-12"
            >
              <ShoppingBag className="mr-2 size-4" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            {!product.inStock && (
              <p className="text-xs text-muted-foreground text-center">
                This piece is currently unavailable
              </p>
            )}
          </div>

          {/* Details */}
          <div className="border-t border-border pt-6 space-y-3">
            <h3 className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              Details
            </h3>
            <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <li>· 14k or 18k gold, as specified</li>
              <li>· Conflict-free stones sourced responsibly</li>
              <li>· Arrives in a Voluble branded gift box</li>
              <li>· Free shipping on orders over $150</li>
              <li>· 30-day returns on unworn pieces</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-16 border-t border-border">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
            More {product.category}
          </p>
          <h2 className="font-display text-3xl mb-10">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((related) => (
              <Link key={related.id} to={`/product/${related.id}`} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={related.image}
                    alt={related.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                </div>
                <div className="mt-3 space-y-0.5">
                  <h3 className="font-display text-base">{related.name}</h3>
                  <p className="text-sm text-muted-foreground">${related.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
