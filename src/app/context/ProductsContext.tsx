import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { products as staticProducts } from "../data/products";
import {
  getCustomProducts, getOverrides, getHidden,
  saveCustomProducts, setOverride, clearOverride, hideProduct,
  StoredProduct,
} from "@/utils/localStore";
import { Product } from "../types";

interface ProductsContextType {
  products: Product[];
  allStoredProducts: StoredProduct[];
  refresh: () => void;
  addProduct: (p: Omit<StoredProduct, "id" | "isCustom">) => void;
  updateProduct: (id: string, changes: Partial<StoredProduct>) => void;
  removeProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const buildAll = (): StoredProduct[] => {
  const custom = getCustomProducts();
  const overrides = getOverrides();
  const hidden = new Set(getHidden());
  const customIds = new Set(custom.map((p) => p.id));

  const statics: StoredProduct[] = staticProducts
    .filter((p) => !hidden.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      description: p.description,
      category: p.category,
      image: p.image as unknown as string,
      images: (p.images as unknown as string[]),
      sizes: p.sizes,
      colors: p.colors,
      inStock: p.inStock,
      featured: p.featured ?? false,
      isCustom: false,
      ...(overrides[p.id] ?? {}),
    }));

  return [...custom, ...statics.filter((p) => !customIds.has(p.id))];
};

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);

  const allStoredProducts = buildAll();

  const addProduct = (data: Omit<StoredProduct, "id" | "isCustom">) => {
    const existing = getCustomProducts();
    saveCustomProducts([{ ...data, id: `custom-${Date.now()}`, isCustom: true }, ...existing]);
    refresh();
  };

  const updateProduct = (id: string, changes: Partial<StoredProduct>) => {
    const existing = getCustomProducts();
    if (existing.some((p) => p.id === id)) {
      saveCustomProducts(existing.map((p) => (p.id === id ? { ...p, ...changes } : p)));
    } else {
      setOverride(id, changes);
    }
    refresh();
  };

  const removeProduct = (id: string) => {
    const existing = getCustomProducts();
    if (existing.some((p) => p.id === id)) {
      saveCustomProducts(existing.filter((p) => p.id !== id));
      clearOverride(id);
    } else {
      hideProduct(id);
    }
    refresh();
  };

  const products: Product[] = allStoredProducts.map((p) => ({
    ...p,
    images: p.images?.length > 0 ? p.images : [p.image],
  }));

  return (
    <ProductsContext.Provider value={{ products, allStoredProducts, refresh, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
