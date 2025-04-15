'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrackSystemPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-lg mr-1">☀️</span>
            <span className="text-sm font-bold tracking-wider">SOLARLAA</span>
          </Link>
          
          <Link href="/" className="px-5 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-sm">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8 bg-blue-900 text-white p-8 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">Track Your Solar Installation</h1>
          <p className="text-lg">Check the status of your solar panel installation. Enter your tracking ID to see the progress.</p>
        </section>

        <section className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <form className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="trackingId" className="block text-gray-700 font-medium mb-2">
                Tracking ID
              </label>
              <input
                type="text"
                id="trackingId"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your tracking ID"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Track Now
            </button>
          </form>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help Tracking Your Installation?</h2>
            <p className="text-gray-600 mb-6">Our customer support team is ready to assist you with any questions.</p>
            <Link href="/contact-us" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 px-8 rounded-lg transition-colors">
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-slate-100 py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600">
            <p>© 2024 SOLARLAA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 