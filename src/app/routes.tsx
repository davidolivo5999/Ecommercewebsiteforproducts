import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { Shop } from "./components/Shop";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Admin } from "./components/Admin";
import { ProductsProvider } from "./context/ProductsContext";

function AdminPage() {
  return (
    <ProductsProvider>
      <Admin />
    </ProductsProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shop", Component: Shop },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
    ],
  },
  { path: "/admin", Component: AdminPage },
]);
