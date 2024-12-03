import './globals.css';
import BottomNav from './components/layout/BottomNav';
import ClientWrapper from './components/ClientWrapper'; // Import the client component

export const metadata = {
  title: 'OilFight',
  description: 'A Telegram mini app for mining and earning rewards',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">
        <main className="pb-16">
          <div className="max-w-md mx-auto px-4">
            <ClientWrapper>{children}</ClientWrapper> {/* Use the client component */}
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
