import { ThemeProvider } from "@/Components/ThemeProvider";
import type { Metadata } from "next";
import { Geist} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/Components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Project Nidhi",
  description: "Web Based Wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning

    >
      <body className={`${geistSans.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster></Toaster>
          {children}
        
        </ThemeProvider>
      </body>
    </html>
  );
}
