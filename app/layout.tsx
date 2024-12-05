import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";
import CustomThemeProvider from "./theme-provider";
export const metadata: Metadata = {
  title: "Daphnis",
  description: "Artemis score viewer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="any" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="any" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="any" href="/icon.png" />{" "}
      </head>
      <body className={GeistSans.className}>
        <CustomThemeProvider>
          <main className="">{children} </main>
        </CustomThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
