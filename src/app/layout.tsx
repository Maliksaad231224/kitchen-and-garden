import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kitchen & Garden - Recipes & Culinary Delights",
  description: "Explore a collection of kitchen tested and approved recipes, from breakfast to desserts, cocktails to plant-based dishes.",
  keywords: ["recipes", "cooking", "kitchen", "garden", "food blog"],
  openGraph: {
    title: "Kitchen & Garden - Recipes & Culinary Delights",
    description: "Explore a collection of kitchen tested and approved recipes",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
    {/* Use the site logo as the browser tab / favicon */}
    <link rel="icon" href="/logo.png" />
    <link rel="shortcut icon" href="/logo.png" />
    {/* Apple touch icon (for iOS home screen) */}
    <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
      </head>
      <body className={`${poppins.className} bg-background text-foreground`}>
        <AuthProvider>
          <TooltipProvider>
            <main>
              <Header />
              <div className="content-container">
                {children}
              </div>
              <Footer />
            </main>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
