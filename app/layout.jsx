import { Navbar, Footer } from "@/components/common";
import ModalProvider from "@/providers/modal-provider";
import { Setup } from "@/components/utils";
import AuthInitializer from "@/components/utils/AuthInitializer";
import CustomProvider from "@/redux/provider";
import { Urbanist } from "next/font/google";
import "@/styles/globals.css";

const font = Urbanist({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://virtualeline.com"),
  title: "EcOnline",
  description: "Modern Ecommerce App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <CustomProvider>
          <ModalProvider />
          <Setup />
          <AuthInitializer>
            <Navbar />
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              {children}
            </div>
            <Footer />
          </AuthInitializer>
        </CustomProvider>
      </body>
    </html>
  );
}
