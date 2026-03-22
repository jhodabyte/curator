import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import NotFoundPage from "./pages/NotFoundPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <ProductPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "status/:transactionId", element: <PaymentStatusPage /> },
    ],
  },
]);
