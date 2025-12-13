import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext"; 
import AuthProvider from "@/components/SessionProvider";


const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Esmae | Home Decor",
  description: "Diseño y decoración minimalista",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        {/* 2. Envuelve todo dentro del AuthProvider */}
        <AuthProvider>
            <CartProvider>
              <Navbar /> 
              {children}
            </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}