import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PMW Vision - Controle. Invista. Evolua.",
  description:
    "Plataforma moderna de gestão financeira, investimentos, reinvestimentos e metas pessoais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <QueryProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "glass-panel border border-[hsl(var(--border-precision))]",
              }}
              theme="system"
            />
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
