import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fixr',
  description: 'AI-Powered Guest Complaint Management for Budget Hotels',
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
