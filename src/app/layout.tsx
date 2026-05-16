import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";

export const viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Mind Odyssey – 50 Levels of Brain Growth",
  description: "A progressive puzzle game with 50 unique levels that enhance logic, memory, creativity, and strategic thinking. Challenge your mind and discover personality insights!",
  keywords: ["puzzle game", "brain training", "logic puzzles", "memory game", "personality"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mind Odyssey",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GameProvider>{children}</GameProvider>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in (globalThis as any).navigator) {
            window.addEventListener('load', function() {
              (globalThis as any).navigator.serviceWorker.register('/sw.js');
            });
          }
        `}} />
      </body>
    </html>
  );
}
