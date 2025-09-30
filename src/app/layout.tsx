import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/user/UserContext";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";
import { ToastProvider } from "@/context/toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/config.js" defer></script>
      </head>
      <body className={inter.variable}>
        <ToastProvider>
          <DialogsProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </DialogsProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
