import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const PRODUCTS_KEY = "products_catalog_v1";
const BUCKET = "product-images";

const getSupabase = () =>
  createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

const ensureBucket = async () => {
  const supabase = getSupabase();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.some((b: any) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }
};

const app = new Hono();
app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-c0f97509/health", (c) => c.json({ status: "ok" }));

// ── Products ────────────────────────────────────────────────────────────────

app.get("/make-server-c0f97509/products", async (c) => {
  const products = (await kv.get(PRODUCTS_KEY)) ?? [];
  return c.json(products);
});

app.post("/make-server-c0f97509/products", async (c) => {
  const body = await c.req.json();
  const products = (await kv.get(PRODUCTS_KEY)) ?? [];
  const newProduct = {
    id: `admin-${crypto.randomUUID()}`,
    name: body.name ?? "Untitled",
    price: Number(body.price ?? 0),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    description: body.description ?? "",
    category: body.category ?? "Other",
    image: body.image ?? "",
    images: body.image ? [body.image] : [],
    sizes: body.sizes ?? [],
    colors: [],
    inStock: body.inStock !== false,
    featured: body.featured ?? false,
  };
  products.push(newProduct);
  await kv.set(PRODUCTS_KEY, products);
  return c.json(newProduct, 201);
});

app.put("/make-server-c0f97509/products/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const products = (await kv.get(PRODUCTS_KEY)) ?? [];
  const idx = products.findIndex((p: any) => p.id === id);
  if (idx === -1) return c.json({ error: "Not found" }, 404);
  const updated = {
    ...products[idx],
    name: body.name ?? products[idx].name,
    price: body.price !== undefined ? Number(body.price) : products[idx].price,
    originalPrice:
      body.originalPrice !== undefined
        ? body.originalPrice
          ? Number(body.originalPrice)
          : undefined
        : products[idx].originalPrice,
    description: body.description ?? products[idx].description,
    category: body.category ?? products[idx].category,
    featured: body.featured ?? products[idx].featured,
    inStock: body.inStock ?? products[idx].inStock,
  };
  if (body.image) {
    updated.image = body.image;
    updated.images = [body.image, ...products[idx].images.slice(1)];
  }
  products[idx] = updated;
  await kv.set(PRODUCTS_KEY, products);
  return c.json(updated);
});

app.delete("/make-server-c0f97509/products/:id", async (c) => {
  const id = c.req.param("id");
  const products = (await kv.get(PRODUCTS_KEY)) ?? [];
  await kv.set(
    PRODUCTS_KEY,
    products.filter((p: any) => p.id !== id),
  );
  return c.json({ success: true });
});

// ── Image upload ─────────────────────────────────────────────────────────────

app.post("/make-server-c0f97509/upload", async (c) => {
  try {
    await ensureBucket();
    const { imageBase64, fileName, mimeType } = await c.req.json();
    const base64Data = imageBase64.replace(/^data:[^;]+;base64,/, "");
    const binary = Uint8Array.from(atob(base64Data), (ch) => ch.charCodeAt(0));
    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const supabase = getSupabase();
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(safeName, binary, { contentType: mimeType, upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(safeName);
    return c.json({ url: data.publicUrl });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);
