import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secret Game Deck",
  description: "認識を選び直すための実践カードデッキ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Zen+Kaku+Gothic+New:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#EDE8E0", minHeight: "100vh" }}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}