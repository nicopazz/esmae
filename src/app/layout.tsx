import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext"; 
import AuthProvider from "@/components/SessionProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import TopBar from "@/components/TopBar";
import { Toaster } from "react-hot-toast";


const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Esmae",
  description: "Diseño y decoración",
  icons: {
    icon: '/logo.jpg', 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
            <CartProvider>
              <Toaster 
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#000',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '14px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#fff',
                      secondary: '#000',
                    },
                  },
                }}
              />
              <TopBar />
              <Navbar /> 
              {children}
              <WhatsAppButton />
            </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}