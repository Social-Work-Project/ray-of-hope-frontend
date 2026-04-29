import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Layout/Navbar';
import { Footer } from '@/components/Layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Nagarkata Ray of Hope Society | Hope for No Hope',
  description: 'A nonprofit serving underprivileged communities in the Dooars region of West Bengal since 2008.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
