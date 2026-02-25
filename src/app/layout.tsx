import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AskTuring - Bot Gallery",
  description: "Explore and chat with AI-powered bots built on AskTuring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
