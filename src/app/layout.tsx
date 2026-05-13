import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PlanProvider } from "@/lib/context/plan-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sisprot Global Fiber | Internet de alta velocidad",
  description:
    "Planes de internet con fibra óptica para hogar y empresa. Velocidad, estabilidad y soporte 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`} suppressHydrationWarning>
      <body>
        <PlanProvider>{children}</PlanProvider>
      </body>
    </html>
  );
}
