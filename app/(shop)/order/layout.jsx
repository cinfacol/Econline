import { CheckoutProvider } from "@/contexts/CheckoutContext";

export default function OrderLayout({ children }) {
  return (
    <CheckoutProvider>
      {children}
    </CheckoutProvider>
  );
} 