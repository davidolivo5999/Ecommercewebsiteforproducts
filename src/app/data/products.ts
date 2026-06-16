import { Product } from "../types";

import img2077 from "@/imports/IMG_2077.jpg";
import img2079 from "@/imports/IMG_2079.jpg";
import img2080 from "@/imports/IMG_2080.jpg";
import img2081 from "@/imports/IMG_2081.jpg";
import img2082 from "@/imports/IMG_2082.jpg";
import img2083 from "@/imports/IMG_2083.jpg";
import img2085 from "@/imports/IMG_2085.jpg";
import img2086 from "@/imports/IMG_2086.jpg";
import img2086b from "@/imports/IMG_2086b.jpg";
import img2087 from "@/imports/IMG_2087.jpg";
import img2088 from "@/imports/IMG_2088.jpg";
import img2090 from "@/imports/IMG_2090.jpg";
import img2091 from "@/imports/IMG_2091.jpg";
import img2092 from "@/imports/IMG_2092.jpg";

export const products: Product[] = [
  // ── Sets ──────────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Infinity Collection Set",
    price: 65,
    description:
      "The complete Infinity Collection in one gift-ready set — double infinity pendant necklace on a snake chain, pavé crystal hoop earrings, and the matching double infinity ring. High-quality gold-plated finish.",
    category: "Sets",
    image: img2077,
    images: [img2077],
    sizes: [],
    colors: [],
    inStock: true,
    featured: true,
  },

  // ── Necklaces ─────────────────────────────────────────────────────────────
  {
    id: "10",
    name: "Puffy Heart Pendant Necklace",
    price: 27,
    description:
      "A three-dimensional puffy gold heart pendant on a polished Cuban link chain. Romantic, bold, and instantly recognizable. High-quality gold-plated finish.",
    category: "Necklaces",
    image: img2088,
    images: [img2088, img2090, img2092],
    sizes: ['18"', '20"'],
    colors: [],
    inStock: true,
  },
  {
    id: "12",
    name: "Cuban Link Chain Necklace",
    price: 35,
    description:
      "A substantial gold Cuban link chain — smooth, polished, and unmistakably luxe. Wear alone or layer over pendants. Available in two lengths. High-quality gold-plated finish.",
    category: "Necklaces",
    image: img2091,
    images: [img2091, img2092, img2088],
    sizes: ['18"', '20"', '22"'],
    colors: [],
    inStock: true,
  },

  // ── Rings ─────────────────────────────────────────────────────────────────
  {
    id: "3",
    name: "Double Infinity Ring",
    price: 22,
    description:
      "Two interlocking infinity symbols set with sparkling pavé crystals. An open adjustable band that fits most sizes. High-quality gold-plated brass.",
    category: "Rings",
    image: img2079,
    images: [img2079, img2080],
    sizes: [],
    colors: [],
    inStock: true,
    featured: true,
  },

  // ── Earrings ──────────────────────────────────────────────────────────────
  {
    id: "4",
    name: "Pavé Gold Hoop Earrings",
    price: 25,
    description:
      "Classic huggie hoops set with two rows of brilliant pavé crystals. Secure hinged closure. The everyday earring you will reach for first. High-quality gold-plated finish.",
    category: "Earrings",
    image: img2081,
    images: [img2081, img2082],
    sizes: [],
    colors: [],
    inStock: true,
    featured: true,
  },

  // ── Bracelets ─────────────────────────────────────────────────────────────
  {
    id: "5",
    name: "Stacked Gold Bracelet Collection",
    price: 85,
    description:
      "Five stackable gold bracelets curated to wear together or mix and match: a beaded ball bangle, pavé cross-bar cuff, Cuban link bangle, smooth bar bangle, and heart bead bracelet. Oro laminado de alta calidad — high-quality gold-plated.",
    category: "Bracelets",
    image: img2083,
    images: [img2083, img2086b, img2087, img2085, img2086],
    sizes: [],
    colors: [],
    inStock: true,
    featured: true,
  },
];
