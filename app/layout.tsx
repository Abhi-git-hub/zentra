/* c:\Users\hp\Desktop\Zentra\app\layout.tsx */
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Suspense } from "react";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Zentra | Master Your Trading Psychology",
  description: "AI-powered trading psychology training in space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="bg-black text-white antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <LenisProvider>
            <CustomCursor />
            <Navbar />
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
