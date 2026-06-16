import { projectId } from "../../utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-c0f97509`;

export interface AdminProduct {
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
}

export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  return res.json();
};

export const createProduct = async (
  product: Omit<AdminProduct, "id" | "images" | "colors">,
): Promise<AdminProduct> => {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
};

export const updateProduct = async (
  id: string,
  product: Partial<AdminProduct>,
): Promise<AdminProduct> => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
};

export const uploadImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: reader.result as string,
            fileName: file.name,
            mimeType: file.type,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Upload failed");
        }
        const data = await res.json();
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
