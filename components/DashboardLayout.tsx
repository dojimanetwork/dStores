import { ReactNode, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SetupProgress from '@/components/SetupProgress';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from "@web3auth/modal/react";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useWeb3AuthConnect();
  const { disconnect } = useWeb3AuthDisconnect();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await disconnect();
      Cookies.remove('web3auth_token');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar - Always visible on large screens */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - Slide in/out */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onMobileClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content - Adjusted for desktop sidebar */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <h1 className="ml-3 text-lg font-semibold text-gray-900">dStores</h1>
          </div>

          {/* Setup Progress for Mobile */}
          <div className="flex-1 max-w-xs ml-4">
            <SetupProgress compact />
          </div>

          {/* Logout button for mobile */}
          {isConnected && (
            <button
              onClick={handleLogout}
              className="relative group flex items-center justify-center space-x-2 px-4 py-2 rounded-lg overflow-hidden hover-lift border border-gray-200 ml-4"
            >
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gray-100 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-gray-700 font-medium">Disconnect</span>
              </div>

              {/* Subtle glow effect on hover */}
              <div className="absolute right-0 top-0 h-8 w-8 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          )}
        </div>

        {/* Desktop header with setup progress */}
        <div className="hidden lg:flex bg-white shadow-sm border-b px-6 py-3 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* Setup Progress for Desktop */}
          <div className="flex-1 max-w-2xl ml-8">
            <SetupProgress compact />
          </div>

          {/* Logout button for desktop */}
          {isConnected && (
            <button
              onClick={handleLogout}
              className="relative group flex items-center justify-center space-x-2 px-5 py-2 rounded-lg overflow-hidden hover-lift border border-gray-200"
            >
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gray-100 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative z-10 flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-gray-700 font-medium">Disconnect</span>
              </div>

              {/* Subtle glow effect on hover */}
              <div className="absolute right-0 top-0 h-8 w-8 bg-gradient-to-tl from-blue-500/20 to-transparent rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          )}
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
