'use client';

import { useRouter } from 'next/navigation';

export default function IntroPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/tasks');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
      <div className="text-center max-w-sm">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
          Introduction
        </h1>
        
        <p className="text-slate-300 mb-8">
          Welcome to the Mining Mini App! Earn rewards by mining, completing tasks, and referring friends.
        </p>

        <button
          onClick={handleContinue}
          className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-purple-600 rounded-lg font-medium 
                   transform transition-all duration-200 hover:scale-105 active:scale-95 
                   focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        >
          Click to Continue
        </button>
      </div>
    </div>
  );
}