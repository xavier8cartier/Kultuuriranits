import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kultuuriraanits",
  description: "Eesti kultuurihariduse platvorm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" className="h-full antialiased bg-gray-50">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-3 focus:rounded-xl focus:shadow-xl focus:font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Liigu edasi põhisisu juurde
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
