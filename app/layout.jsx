import { Navbar, Footer } from "@/components/common";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import { Setup } from "@/components/utils";
import CustomProvider from "@/redux/provider";
import { NextUIProvider } from "@nextui-org/system";
import { Urbanist } from "next/font/google";
import "@/styles/globals.css";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
  title: "EcOnline",
  description: "Modern Ecommerce App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <CustomProvider>
          <NextUIProvider>
            <ToastProvider />
            <ModalProvider />
            <Setup />
            <Navbar />
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              {children}
            </div>
            <Footer />
          </NextUIProvider>
        </CustomProvider>
      </body>
    </html>
  );
}
