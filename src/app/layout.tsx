import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Did GT Win?',
  description: 'Check if Georgia Tech won their last football game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}