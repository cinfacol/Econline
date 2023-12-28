import { Navbar, Footer } from "@/components/common";
import { Setup } from "@/components/utils";
import CustomProvider from "@/redux/provider";
import { Nunito } from "next/font/google";
import "@/styles/globals.css";

const font = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "EcOnline | Home",
  description: "Tienda Online home page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <CustomProvider>
          <Setup />
          <Navbar />
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            {children}
          </div>
          <Footer />
        </CustomProvider>
      </body>
    </html>
  );
}
