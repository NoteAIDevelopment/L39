import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "L39 Aviation | Premium Jet Flight Experiences",
  description: "Discover premium jet flight experiences, professional flight training, aircraft hire, and aviation services with L39 Aviation.",
  keywords: ["aviation", "jet flights", "flight training", "aerospace", "private aviation"],
  metadataBase: new URL("https://example.com"),
  alternates: {
    canonical: "https://example.com",
  },
  openGraph: {
    title: "L39 Aviation | Premium Jet Flight Experiences",
    description: "Luxury aviation experiences with elite instruction and modern aircraft.",
    type: "website",
    url: "https://example.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "L39 Aviation",
    description: "Premium aviation experiences built around trust, performance, and style.",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
