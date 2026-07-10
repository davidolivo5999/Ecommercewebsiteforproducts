import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { products as staticProducts } from "../data/products";
import { StoredProduct } from "@/utils/localStore";
import { CatalogState, emptyState, fetchCatalogState, saveCatalogState } from "@/utils/api";
import { Product } from "../types";

interface ProductsContextType {
  products: Product[];
  allStoredProducts: StoredProduct[];
  loading: boolean;
  refresh: () => void;
  addProduct: (p: Omit<StoredProduct, "id" | "isCustom">) => Promise<void>;
  updateProduct: (id: string, changes: Partial<StoredProduct>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const buildAll = (state: CatalogState): StoredProduct[] => {
  const hidden = new Set(state.hidden);
  const customIds = new Set(state.custom.map((p) => p.id));

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
      ...(state.overrides[p.id] ?? {}),
    }));

  return [...state.custom, ...statics.filter((p) => !customIds.has(p.id))];
};

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CatalogState>(emptyState());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    fetchCatalogState()
      .then(setState)
      .catch(() => {}) // keep last known state if the fetch fails
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Persist a new state to the server; roll back locally if the save fails.
  const commit = async (next: CatalogState) => {
    const prev = state;
    setState(next);
    try {
      await saveCatalogState(next);
    } catch (err) {
      setState(prev);
      throw err;
    }
  };

  const addProduct = async (data: Omit<StoredProduct, "id" | "isCustom">) => {
    const newProduct: StoredProduct = {
      ...data,
      id: `custom-${Date.now()}`,
      isCustom: true,
    };
    await commit({ ...state, custom: [newProduct, ...state.custom] });
  };

  const updateProduct = async (id: string, changes: Partial<StoredProduct>) => {
    if (state.custom.some((p) => p.id === id)) {
      await commit({
        ...state,
        custom: state.custom.map((p) => (p.id === id ? { ...p, ...changes } : p)),
      });
    } else {
      await commit({
        ...state,
        overrides: {
          ...state.overrides,
          [id]: { ...state.overrides[id], ...changes },
        },
      });
    }
  };

  const removeProduct = async (id: string) => {
    if (state.custom.some((p) => p.id === id)) {
      const overrides = { ...state.overrides };
      delete overrides[id];
      await commit({
        ...state,
        custom: state.custom.filter((p) => p.id !== id),
        overrides,
      });
    } else if (!state.hidden.includes(id)) {
      await commit({ ...state, hidden: [...state.hidden, id] });
    }
  };

  const allStoredProducts = buildAll(state);

  const products: Product[] = allStoredProducts.map((p) => ({
    ...p,
    images: p.images?.length > 0 ? p.images : [p.image],
  }));

  return (
    <ProductsContext.Provider
      value={{ products, allStoredProducts, loading, refresh, addProduct, updateProduct, removeProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
