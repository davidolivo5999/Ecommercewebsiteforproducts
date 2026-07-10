import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { StoredProduct } from "@/utils/localStore";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c0f97509`;

const SECRET_KEY = "vb_admin_secret";

export const getAdminSecret = (): string =>
  sessionStorage.getItem(SECRET_KEY) ?? "";

export const setAdminSecret = (secret: string) =>
  sessionStorage.setItem(SECRET_KEY, secret);

export const clearAdminSecret = () => sessionStorage.removeItem(SECRET_KEY);

const baseHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
});

const adminHeaders = (): Record<string, string> => ({
  ...baseHeaders(),
  "x-admin-secret": getAdminSecret(),
});

// ── Auth ─────────────────────────────────────────────────────────────────────

export const verifyAdmin = async (password: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE}/admin/verify`, {
    method: "POST",
    headers: { ...baseHeaders(), "x-admin-secret": password },
  });
  return res.ok;
};

// ── Catalog state (custom products, overrides, hidden) ──────────────────────

export interface CatalogState {
  custom: StoredProduct[];
  overrides: Record<string, Partial<StoredProduct>>;
  hidden: string[];
}

export const emptyState = (): CatalogState => ({
  custom: [],
  overrides: {},
  hidden: [],
});

export const fetchCatalogState = async (): Promise<CatalogState> => {
  const res = await fetch(`${API_BASE}/state`, { headers: baseHeaders() });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  const data = await res.json();
  return {
    custom: Array.isArray(data.custom) ? data.custom : [],
    overrides: data.overrides ?? {},
    hidden: Array.isArray(data.hidden) ? data.hidden : [],
  };
};

export const saveCatalogState = async (
  state: CatalogState,
): Promise<void> => {
  const res = await fetch(`${API_BASE}/state`, {
    method: "PUT",
    headers: adminHeaders(),
    body: JSON.stringify(state),
  });
  if (res.status === 401) throw new Error("Session expired — please sign in again");
  if (!res.ok) throw new Error("Failed to save changes");
};

// ── Image upload ─────────────────────────────────────────────────────────────
// Accepts a base64 data URL (already compressed client-side), stores it in
// Supabase storage, and returns a permanent public URL.

export const uploadImageDataUrl = async (
  dataUrl: string,
  fileName: string,
): Promise<string> => {
  const mimeType = dataUrl.match(/^data:([^;]+);/)?.[1] ?? "image/jpeg";
  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({ imageBase64: dataUrl, fileName, mimeType }),
  });
  if (res.status === 401) throw new Error("Session expired — please sign in again");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Upload failed");
  }
  const data = await res.json();
  return data.url;
};
// ── Square checkout ──────────────────────────────────────────────────────────

export interface CheckoutItem {
  id: string;
  quantity: number;
  size?: string;
  color?: string;
}

export const createCheckout = async (items: CheckoutItem[]): Promise<string> => {
  const res = await fetch(`${API_BASE}/create-checkout`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({ items }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Could not start checkout");
  return data.url;
};
