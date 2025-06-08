import Link from 'next/link';
import { useRouter } from 'next/router';
import { XMarkIcon, HomeIcon, CubeIcon, TruckIcon, CreditCardIcon, CheckCircleIcon, BuildingStorefrontIcon, ChartBarIcon, Cog6ToothIcon, UserIcon, RocketLaunchIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';

interface SidebarProps {
  onMobileClose?: () => void;
}

export default function Sidebar({ onMobileClose }: SidebarProps) {
  const router = useRouter();
  const { isStepCompleted, getBuildMethod } = useSetupCompletion();

  // Setup Progress Steps (in order)
  const setupSteps = [
    { href: '/dashboard/build', label: 'Build Website', icon: HomeIcon, description: 'Create your store', step: 1, completionKey: 'buildWebsite' as const },
    { href: '/dashboard/products', label: 'Add Products', icon: CubeIcon, description: 'Manage inventory', step: 2, completionKey: 'addProducts' as const },
    { href: '/dashboard/shipping', label: 'Configure Shipping', icon: TruckIcon, description: 'Delivery options', step: 3, completionKey: 'configureShipping' as const },
    { href: '/dashboard/payments', label: 'Set Up Payments', icon: CreditCardIcon, description: 'Payment methods', step: 4, completionKey: 'setupPayments' as const },
    { href: '/dashboard/review', label: 'Review & Deploy', icon: RocketLaunchIcon, description: 'Launch your store', step: 5, completionKey: 'reviewDeploy' as const },
  ];

  // Other Features
  const otherFeatures = [
    { href: '/dashboard/orders', label: 'Orders', icon: ClipboardDocumentListIcon, description: 'View sales' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: ChartBarIcon, description: 'Performance insights' },
    { href: '/dashboard/settings', label: 'Settings', icon: Cog6ToothIcon, description: 'Store configuration' },
  ];

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Function to render navigation items
  const renderNavItem = (item: any, isSetupStep = false) => {
    const IconComponent = item.icon;
    const isActive = router.pathname === item.href || router.pathname.startsWith(item.href);
    const isCompleted = isSetupStep ? isStepCompleted(item.completionKey) : false;
    const buildMethod = item.completionKey === 'buildWebsite' ? getBuildMethod() : null;
    
    return (
      <div
        key={item.href}
        onClick={() => {
          if (item.label === 'Build Website') {
            console.log('Build Website clicked', item.href, router);
            const prevPath = window.location.pathname;
            router.push(item.href).then(() => {
              setTimeout(() => {
                if (window.location.pathname === prevPath) {
                  console.warn('router.push did not navigate, forcing with window.location.href');
                  window.location.href = item.href;
                }
              }, 200);
            });
          } else {
            router.push(item.href);
          }
        }}
        className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        role="button"
      >
        {isSetupStep && (
          <div className={`mr-3 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
            isCompleted 
              ? 'bg-green-500 border-green-500 text-white' 
              : isActive
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-gray-300 text-gray-400'
          }`}>
            {isCompleted ? '✓' : item.step}
          </div>
        )}
        <IconComponent className={`${isSetupStep ? 'mr-2' : 'mr-3'} h-5 w-5 flex-shrink-0 transition-colors ${
          isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
        }`} />
        <div className="flex-1 min-w-0">
          <div className="truncate">{item.label}</div>
          <div className={`text-xs truncate transition-colors ${
            isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
          }`}>
            {isCompleted && buildMethod ? `Built with ${buildMethod}` : item.description}
          </div>
        </div>
        {isActive && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
        )}
        {isCompleted && !isActive && (
          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 bg-white shadow-xl border-r border-gray-200 h-full flex flex-col">
      {/* Header with close button for mobile */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/dashboard')} tabIndex={0} role="button">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BuildingStorefrontIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">dStores</h1>
            <p className="text-xs text-gray-500">Web3 Commerce</p>
          </div>
        </div>
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {/* Setup Progress Section */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Setup Progress
          </h2>
          <div className="space-y-1">
            {setupSteps.map((item) => renderNavItem(item, true))}
          </div>
        </div>

        {/* Other Features Section */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Store Management
          </h2>
          <div className="space-y-1">
            {otherFeatures.map((item) => renderNavItem(item, false))}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              Store Owner
            </div>
            <div className="text-xs text-gray-500 truncate">
              Free Plan
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-2">
            Web3 Store Builder v1.0
          </div>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
} 