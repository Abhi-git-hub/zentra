import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NavbarWrapper } from "@/components/NavbarWrapper";

import "./globals.css";

export const metadata: Metadata = {
  title: "Zentra",
  description: "AI-powered trading psychology training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          themes={["light", "dark", "neon"]}
        >
          <NavbarWrapper />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
