"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";

export const NavbarWrapper = () => {
  const pathname = usePathname();

  // Hide Navbar on the immersive landing page
  if (pathname === "/") return null;

  return <Navbar />;
};
