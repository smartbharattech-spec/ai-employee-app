import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Kriti AI CRM - WhatsApp Sales Employee',
  description: 'AI Automation & CRM Dashboard for WhatsApp Sales Pipeline',
  icons: {
    icon: [
      { url: '/icon.png?v=2', type: 'image/png' },
      { url: '/favicon.png?v=2', type: 'image/png' },
      { url: '/favicon.ico?v=2' },
    ],
    shortcut: '/icon.png?v=2',
    apple: '/icon.png?v=2',
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="font-sans h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
