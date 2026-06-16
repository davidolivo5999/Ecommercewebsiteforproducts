import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { useProducts } from "../context/ProductsContext";
import { compressImage, StoredProduct } from "@/utils/localStore";
import { Plus, Pencil, Trash2, X, Upload, ArrowLeft, Loader2, Star, EyeOff } from "lucide-react";
import logo from "@/imports/logo.jpg";

const ADMIN_PASSWORD = "voluble2024";
const CATEGORIES = ["Rings", "Necklaces", "Earrings", "Bracelets", "Sets", "Other"];

type Form = {
  name: string; price: string; originalPrice: string;
  category: string; description: string;
  featured: boolean; inStock: boolean;
};

const blank = (): Form => ({
  name: "", price: "", originalPrice: "",
  category: "Rings", description: "", featured: false, inStock: true,
});

const fromProduct = (p: StoredProduct): Form => ({
  name: p.name, price: String(p.price),
  originalPrice: p.originalPrice ? String(p.originalPrice) : "",
  category: p.category, description: p.description,
  featured: p.featured, inStock: p.inStock,
});

export function Admin() {
  const { allStoredProducts, addProduct, updateProduct, removeProduct } = useProducts();

  const [authed, setAuthed] = useState(() => sessionStorage.getItem("vb_admin") === "1");
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);

  const [modal, setModal] = useState<null | "add" | "edit">(null);
  const [editing, setEditing] = useState<StoredProduct | null>(null);
  const [form, setForm] = useState<Form>(blank());
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Form, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const login = () => {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("vb_admin", "1"); setAuthed(true); }
    else { setPwError(true); setPw(""); }
  };

  const openAdd = () => {
    setEditing(null); setForm(blank()); setPreview(""); setModal("add");
  };

  const openEdit = (p: StoredProduct) => {
    setEditing(p); setForm(fromProduct(p)); setPreview(p.image); setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditing(null); };

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCompressing(true);
    try { setPreview(await compressImage(file)); }
    catch { showToast("Could not load image"); }
    finally { setCompressing(false); }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0]; if (f) handleFile(f);
  }, [handleFile]);

  const handleSave = () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const data = {
      name: form.name.trim(),
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category,
      description: form.description.trim(),
      featured: form.featured,
      inStock: form.inStock,
      image: preview,
      images: preview ? [preview] : [],
      sizes: [], colors: [],
    };
    try {
      if (modal === "edit" && editing) { updateProduct(editing.id, data); showToast("Saved ✓"); }
      else { addProduct(data); showToast("Product added ✓"); }
      closeModal();
    } catch { showToast("Something went wrong"); }
    finally { setSaving(false); }
  };

  const handleRemove = (p: StoredProduct) => {
    const msg = p.isCustom ? "Delete this product?" : "Hide this product from the store?";
    if (!window.confirm(msg)) return;
    removeProduct(p.id);
    showToast(p.isCustom ? "Deleted" : "Hidden from store");
  };

  // ── Login ────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#EDE9E1] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img src={logo} alt="Voluble Boutique" className="h-20 w-auto mx-auto"
              style={{ mixBlendMode: "multiply" }} />
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#6B6056] mt-1">Admin</p>
          </div>
          <div className="bg-white border border-[rgba(26,20,16,0.1)] p-8 space-y-4">
            <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B6056] block">Password</label>
            <input type="password" value={pw} autoFocus
              onChange={(e) => { setPw(e.target.value); setPwError(false); }}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Enter password"
              className={`w-full border px-4 py-3 text-sm outline-none transition-colors bg-white ${pwError ? "border-red-500" : "border-[rgba(26,20,16,0.1)] focus:border-[#1A1410]"}`}
            />
            {pwError && <p className="text-xs text-red-600">Incorrect password.</p>}
            <button onClick={login}
              className="w-full bg-[#1A1410] text-white py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-[#B8965A] transition-colors">
              Sign In
            </button>
          </div>
          <p className="text-center text-xs text-[#6B6056] mt-6">
            <Link to="/" className="hover:text-[#1A1410] transition-colors">← Back to store</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#1A1410] text-white px-5 py-3 text-sm shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[rgba(26,20,16,0.1)] px-5 md:px-10 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-[#6B6056] hover:text-[#1A1410]"><ArrowLeft className="size-4" /></Link>
          <img src={logo} alt="Voluble Boutique" className="h-10 w-auto object-contain"
            style={{ mixBlendMode: "multiply" }} />
          <span className="hidden sm:block text-[10px] tracking-[0.25em] uppercase text-[#6B6056] border-l border-[rgba(26,20,16,0.1)] pl-3">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#B8965A] text-white px-4 py-2 text-[10px] tracking-[0.2em] uppercase hover:bg-[#B8965A]/90 transition-colors">
            <Plus className="size-3.5" /> Add Product
          </button>
          <button onClick={() => { sessionStorage.removeItem("vb_admin"); setAuthed(false); }}
            className="text-xs text-[#6B6056] hover:text-[#1A1410] transition-colors px-2">
            Sign out
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="bg-white border-b border-[rgba(26,20,16,0.1)] px-5 md:px-10 py-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6056]">
        <span><strong className="text-[#1A1410]">{allStoredProducts.length}</strong> products</span>
        <span className="text-green-700 font-medium">● Changes save instantly — no extra steps</span>
        <Link to="/shop" className="text-[#B8965A] hover:underline ml-auto hidden sm:block">Preview store →</Link>
      </div>

      {/* Product grid */}
      <div className="px-5 md:px-10 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {allStoredProducts.map((p) => (
            <div key={p.id} className="bg-white border border-[rgba(26,20,16,0.1)] flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#E8E3D9] shrink-0">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6B6056] text-[10px] uppercase tracking-wider">
                    No photo
                  </div>
                )}
                {p.featured && (
                  <div className="absolute top-2 left-2 bg-[#B8965A] p-1">
                    <Star className="size-2.5 text-white fill-white" />
                  </div>
                )}
                {!p.isCustom && (
                  <div className="absolute top-2 right-2 bg-white/80 text-[8px] px-1.5 py-0.5 tracking-wider uppercase text-[#6B6056]">
                    Built-in
                  </div>
                )}
                {!p.inStock && (
                  <div className="absolute bottom-0 inset-x-0 bg-[#1A1410]/70 text-white text-center text-[9px] tracking-widest uppercase py-1">
                    Out of stock
                  </div>
                )}
              </div>
              <div className="p-2.5 flex flex-col gap-1 flex-1">
                <p className="text-[9px] tracking-[0.15em] uppercase text-[#6B6056]">{p.category}</p>
                <p className="font-display text-sm leading-tight line-clamp-2 flex-1">{p.name}</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-medium">${p.price}</span>
                  {p.originalPrice && (
                    <span className="text-xs text-[#6B6056] line-through">${p.originalPrice}</span>
                  )}
                </div>
                <div className="flex gap-1.5 mt-2">
                  <button onClick={() => openEdit(p)}
                    className="flex-1 flex items-center justify-center gap-1 border border-[rgba(26,20,16,0.1)] py-1.5 text-[9px] tracking-wider uppercase hover:bg-[#EDE9E1] transition-colors">
                    <Pencil className="size-2.5" /> Edit
                  </button>
                  <button onClick={() => handleRemove(p)}
                    title={p.isCustom ? "Delete" : "Hide from store"}
                    className="w-8 flex items-center justify-center border border-[rgba(26,20,16,0.1)] py-1.5 text-[#6B6056] hover:text-red-500 hover:border-red-300 transition-colors">
                    {p.isCustom ? <Trash2 className="size-3" /> : <EyeOff className="size-3" />}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add tile */}
          <button onClick={openAdd}
            className="aspect-[3/4] border-2 border-dashed border-[rgba(26,20,16,0.15)] hover:border-[#B8965A] hover:text-[#B8965A] transition-colors flex flex-col items-center justify-center gap-2 text-[#6B6056] bg-white">
            <Plus className="size-6" />
            <span className="text-[10px] tracking-[0.2em] uppercase">Add product</span>
          </button>
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-[#1A1410]/40" onClick={closeModal} />
          <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 max-h-[92vh] flex flex-col shadow-2xl">

            <div className="sticky top-0 bg-white border-b border-[rgba(26,20,16,0.1)] px-6 py-4 flex items-center justify-between shrink-0">
              <h2 className="font-display text-xl">
                {modal === "edit" ? `Edit: ${editing?.name}` : "Add New Product"}
              </h2>
              <button onClick={closeModal} className="text-[#6B6056] hover:text-[#1A1410]">
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-5">

              {/* Photo */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B6056] block">Product Photo</label>
                <div
                  onClick={() => !compressing && fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`relative border-2 border-dashed cursor-pointer transition-colors ${dragging ? "border-[#B8965A] bg-[#B8965A]/5" : "border-[rgba(26,20,16,0.15)] hover:border-[#B8965A]"}`}
                >
                  {compressing ? (
                    <div className="aspect-[4/3] flex items-center justify-center gap-2 text-[#6B6056] text-sm">
                      <Loader2 className="size-5 animate-spin" /> Compressing…
                    </div>
                  ) : preview ? (
                    <div className="relative group">
                      <img src={preview} alt="Preview" className="w-full aspect-[4/3] object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="text-white text-[10px] tracking-widest uppercase bg-black/50 px-3 py-2">Change photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] flex flex-col items-center justify-center gap-2 text-[#6B6056]">
                      <Upload className="size-7" />
                      <p className="text-sm font-medium">Tap to upload photo</p>
                      <p className="text-xs opacity-60">From camera roll, files, or drag & drop</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
                {preview && (
                  <button onClick={() => setPreview("")}
                    className="text-xs text-[#6B6056] hover:text-red-500 transition-colors underline">
                    Remove photo
                  </button>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B6056] block">Product Name *</label>
                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Gold Hoop Earrings"
                  className="w-full border border-[rgba(26,20,16,0.1)] px-4 py-2.5 text-sm outline-none focus:border-[#1A1410] transition-colors" />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B6056] block">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6056] text-sm">$</span>
                    <input type="number" min="0" step="0.01" value={form.price}
                      onChange={(e) => set("price", e.target.value)} placeholder="0.00"
                      className="w-full border border-[rgba(26,20,16,0.1)] pl-7 pr-3 py-2.5 text-sm outline-none focus:border-[#1A1410] transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B6056] block">
                    Original <span className="normal-case">(for sale)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6056] text-sm">$</span>
                    <input type="number" min="0" step="0.01" value={form.originalPrice}
                      onChange={(e) => set("originalPrice", e.target.value)} placeholder="0.00"
                      className="w-full border border-[rgba(26,20,16,0.1)] pl-7 pr-3 py-2.5 text-sm outline-none focus:border-[#1A1410] transition-colors" />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B6056] block">Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full border border-[rgba(26,20,16,0.1)] px-4 py-2.5 text-sm outline-none focus:border-[#1A1410] transition-colors bg-white">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] tracking-[0.2em] uppercase text-[#6B6056] block">Description</label>
                <textarea value={form.description} rows={3}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Materials, style, details…"
                  className="w-full border border-[rgba(26,20,16,0.1)] px-4 py-2.5 text-sm outline-none focus:border-[#1A1410] transition-colors resize-none" />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                    className="w-4 h-4 accent-[#B8965A]" />
                  <span className="text-sm">Featured on homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.inStock}
                    onChange={(e) => set("inStock", e.target.checked)}
                    className="w-4 h-4 accent-[#B8965A]" />
                  <span className="text-sm">In stock</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-[rgba(26,20,16,0.1)] px-6 py-4 flex gap-3 shrink-0">
              <button onClick={closeModal}
                className="flex-1 border border-[rgba(26,20,16,0.1)] py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#EDE9E1] transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name.trim() || compressing}
                className="flex-1 bg-[#B8965A] text-white py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#B8965A]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="size-3.5 animate-spin" /> Saving…</> :
                  modal === "edit" ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
