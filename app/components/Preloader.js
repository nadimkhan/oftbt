'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Preloader() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTelegram = async () => {
      try {
        let tg;

        // Check if Telegram WebApp SDK is available
        if (window.Telegram && window.Telegram.WebApp) {
          tg = window.Telegram.WebApp;
          tg.ready();
          console.log('Telegram WebApp initialized:', tg.initDataUnsafe);
        } else {
          console.warn('Telegram WebApp SDK not detected. Mocking data for development.');
          // Mock the Telegram SDK in development mode
          if (process.env.NODE_ENV === 'development') {
            window.Telegram = {
              WebApp: {
                initDataUnsafe: {
                  user: {
                    id: '12345',
                    username: 'test_user',
                    isPremium: true,
                  },
                },
                ready: () => console.log('Mock Telegram WebApp ready'),
              },
            };
            tg = window.Telegram.WebApp;
          } else {
            throw new Error('Telegram WebApp SDK is not available.');
          }
        }

        // Simulate user data
        const user = {
          telegramId: tg.initDataUnsafe.user.id,
          username: tg.initDataUnsafe.user.username,
          isPremium: tg.initDataUnsafe.user.isPremium || false,
        };

        console.log('User Data:', user);

        // Save user data to backend
        const response = await fetch('http://localhost:3001/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error('API Error Response:', errorResponse);
          throw new Error(errorResponse.error || 'Failed to save user data');
        }

        console.log('User saved successfully.');

        // Redirect to intro screen
        router.push('/intro');
      } catch (err) {
        console.error('Preloader error:', err);
        if (process.env.NODE_ENV === 'development') {
          // Redirect to intro in development mode even if there’s an error
          router.push('/intro');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    initTelegram();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
        <div className="text-center">
          <div className="text-red-500 mb-2">Error loading app</div>
          <div className="text-sm text-slate-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-lg font-medium">Loading...</div>
        <div className="text-sm text-slate-400 mt-2">
          {process.env.NODE_ENV === 'development' ? 'Development Mode' : 'Initializing app'}
        </div>
      </div>
    </div>
  );
}
