import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartProvider } from "../context/CartContext";
import { ProductsProvider } from "../context/ProductsContext";
import { Toaster } from "./ui/sonner";

export function Root() {
  return (
    <ProductsProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <Toaster />
        </div>
      </CartProvider>
    </ProductsProvider>
  );
}
