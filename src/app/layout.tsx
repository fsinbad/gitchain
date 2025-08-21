
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GigChain - Decentralized Task Marketplace",
  description: "Complete micro-tasks and earn gasless USDC with instant global payouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white min-h-screen`}
      >
        <nav className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>
                  <span className="text-white text-xl font-semibold">GigChain</span>
                </div>
                <div className="hidden md:block ml-10">
                  <div className="flex items-baseline space-x-8">
                    <a href="/" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Dashboard</a>
                    <a href="/tasks" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Tasks</a>
                    <a href="/payments" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Payments</a>
                    <a href="/profile" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Profile</a>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button className="relative p-2 text-gray-400 hover:text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17H4l5 5v-5z" />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
