import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Navbar } from "@/components/custom/navbar";
import StoreProvider from "@/components/storeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NustFruta",
  description: "Created By Taha Shah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`flex flex-col gap-2 ${inter.className}`}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Navbar />
            <main className={`flex sm:flex-col justify-center sm:items-center`}>
              {children}
            </main>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
