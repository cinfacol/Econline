// components/checkout/CheckoutWrapper.jsx
"use client";

import { CheckoutProvider } from "@/contexts/CheckoutContext";
import CheckoutDetails from "./CheckoutDetails";

export default function CheckoutWrapper() {
  return (
    <CheckoutProvider>
      <CheckoutDetails />
    </CheckoutProvider>
  );
}