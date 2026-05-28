import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: process.env.BLOG_TITLE || "My Blog",
    template: "%s | " + (process.env.BLOG_TITLE || "My Blog"),
  },
  description: process.env.BLOG_DESCRIPTION || "A personal blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
