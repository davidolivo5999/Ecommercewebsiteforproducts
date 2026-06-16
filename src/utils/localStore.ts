// All product data is stored in localStorage — works immediately, no deployment needed.

export interface StoredProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  isCustom?: boolean;
}

const CUSTOM_KEY = "vb_custom_products";
const OVERRIDES_KEY = "vb_product_overrides";
const HIDDEN_KEY = "vb_hidden_products";

const parse = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const getCustomProducts = (): StoredProduct[] =>
  parse<StoredProduct[]>(CUSTOM_KEY, []);

export const saveCustomProducts = (products: StoredProduct[]) =>
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(products));

export const getOverrides = (): Record<string, Partial<StoredProduct>> =>
  parse(OVERRIDES_KEY, {});

export const setOverride = (id: string, data: Partial<StoredProduct>) => {
  const all = getOverrides();
  all[id] = { ...all[id], ...data };
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
};

export const clearOverride = (id: string) => {
  const all = getOverrides();
  delete all[id];
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
};

export const getHidden = (): string[] => parse<string[]>(HIDDEN_KEY, []);

export const hideProduct = (id: string) => {
  const h = getHidden();
  if (!h.includes(id)) localStorage.setItem(HIDDEN_KEY, JSON.stringify([...h, id]));
};

// Compress uploaded photo to ~200 KB JPEG data URL
export const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const MAX = 900;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
