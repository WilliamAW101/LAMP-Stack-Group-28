import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/user/UserContext";
import DialogsProvider from "@/hooks/useDialogs/DialogsProvider";
import { ToastProvider } from "@/context/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
