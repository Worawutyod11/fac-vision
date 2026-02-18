import React from "react";
import "./globals.css";
import { Metadata } from "next";
import { V0Provider } from "@/lib/v0-context";
import localFont from "next/font/local";
import { ClientLayoutShell } from "@/components/layout/client-layout-shell";
import mockDataJson from "../mock.json";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

const mockData = mockDataJson;

const robotoMono = localFont({
  src: "../public/fonts/Prompt-Regular.ttf",
  variable: "--font-roboto-mono",
  weight: "400",
  display: "swap",
});

const promptDisplay = localFont({
  src: "../public/fonts/Prompt-Regular.ttf",
  variable: "--font-rebels",
  weight: "400",
  display: "swap",
});

const isV0 = process.env["VERCEL_URL"]?.includes("vusercontent.net") ?? false;

export const metadata: Metadata = {
  title: {
    template: "%s – Fac Vision",
    default: "Fac Vision",
  },
  description:
    "Industrial Machine Vision Inspection System - AI-powered quality control and monitoring.",
  icons: {
    icon: "/assets/logos/factory-pro-logo-wed.png",
    shortcut: "/assets/logos/factory-pro-logo-wed.png",
    apple: "/assets/logos/factory-pro-logo-wed.png",
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Prompt-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="icon"
          href="/assets/logos/factory-pro-logo-wed.png"
          sizes="any"
        />
      </head>
      <body
        className={`${promptDisplay.variable} ${robotoMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <V0Provider isV0={isV0}>
            <SidebarProvider>
              <ClientLayoutShell mockData={mockData}>
                {children}
              </ClientLayoutShell>
            </SidebarProvider>
          </V0Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
