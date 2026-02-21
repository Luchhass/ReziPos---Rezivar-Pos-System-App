import { Inter, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ReziPOS - Rezivar Pos System",
  description: "Modern POS management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        <Header />

        <div className="flex flex-col flex-1 md:ml-64 min-h-screen bg-[#f3f3f3] dark:bg-[#111315]">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
