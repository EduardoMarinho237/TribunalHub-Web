import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TribunalHub - Gerenciamento Jurídico",
  description: "Software para gestão de clientes jurídicos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>

        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}