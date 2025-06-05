import { ReactNode, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SetupProgress from '@/components/SetupProgress';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        </div>

        {/* Desktop header with setup progress */}
        <div className="hidden lg:flex bg-white shadow-sm border-b px-6 py-3 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">dStores Dashboard</h1>
          </div>
          
          {/* Setup Progress for Desktop */}
          <div className="flex-1 max-w-2xl ml-8">
            <SetupProgress compact />
          </div>
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
