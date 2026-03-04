import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "APPSITE ERP – B2A Engenharia",
  description: "Sistema ERP para gestão de obras, equipes, contratos, medições e compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} font-sans antialiased bg-gray-50`}>
        <Navbar />
        {/* Desktop: offset for sidebar; Mobile: offset for top header + bottom nav */}
        <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
