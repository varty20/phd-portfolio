import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script"; // <-- THE OFFICIAL NEXT.JS SCRIPT LOADER

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dr. Varazdat Avetisyan | AI Expert & PhD",
  description: "Professional Portfolio and LMS for Dr. Varazdat Avetisyan",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>

        {/* BULLETPROOF BOTPRESS INJECTION */}
        <Script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js" strategy="afterInteractive" />
        <Script src="https://mediafiles.botpress.cloud/9c45df8f-bcea-4fdd-b5cb-94acb26a1e64/webchat/config.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
