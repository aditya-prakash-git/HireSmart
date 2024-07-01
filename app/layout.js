import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from '../../../AI Interview/hiresmart/components/ui/sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HireSmart",
  description: "AI-Driven Interviews",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

   
    <html lang="en">
      <body className={inter.className}>
        <Toaster/>
        
        {children}</body>
    </html>
    </ClerkProvider>
  );
}
