import { Inter } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: "CashJet - Aviator Game | Win Big",
  description: "Play the thrilling Aviator crash game with KSH 500 bonus. Instant withdrawals, fair gaming, and real-time multipliers.",
  icons: { icon: '/cashjet-icon.png', apple: '/cashjet-icon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark bg-slate-950">
      <body className={`${inter.className} antialiased bg-slate-950`}>
        {children}
      </body>
    </html>
  );
}
