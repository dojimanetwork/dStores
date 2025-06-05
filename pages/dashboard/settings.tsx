import DashboardLayout from '@/components/DashboardLayout';
import { Cog6ToothIcon, BellIcon, ShieldCheckIcon, CreditCardIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const settingsGroups = [
    {
      title: 'Store Settings',
      icon: Cog6ToothIcon,
      items: [
        { label: 'Store Information', description: 'Update your store name, description, and contact details' },
        { label: 'Business Information', description: 'Configure tax settings, business address, and legal info' },
        { label: 'Domain & SEO', description: 'Manage custom domain and search engine optimization' },
      ]
    },
    {
      title: 'Payment & Billing',
      icon: CreditCardIcon,
      items: [
        { label: 'Payment Methods', description: 'Configure accepted payment methods and processors' },
        { label: 'Billing Information', description: 'Update subscription and billing details' },
        { label: 'Tax Configuration', description: 'Set up tax rates and calculation rules' },
      ]
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      items: [
        { label: 'Email Notifications', description: 'Configure order and system email alerts' },
        { label: 'Push Notifications', description: 'Manage mobile and desktop notifications' },
        { label: 'Webhooks', description: 'Set up webhook endpoints for integrations' },
      ]
    },
    {
      title: 'Security & Privacy',
      icon: ShieldCheckIcon,
      items: [
        { label: 'Account Security', description: 'Password, two-factor authentication, and access control' },
        { label: 'Privacy Settings', description: 'Data collection and privacy policy configuration' },
        { label: 'API Keys', description: 'Manage API keys and third-party integrations' },
      ]
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your store settings and preferences</p>
        </div>

        <div className="space-y-8">
          {settingsGroups.map((group) => {
            const IconComponent = group.icon;
            return (
              <div key={group.title} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">{group.title}</h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {group.items.map((item, index) => (
                    <div key={index} className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{item.label}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                        <div className="flex items-center">
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Configure
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <GlobeAltIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
              <h4 className="font-medium text-gray-900">Export Data</h4>
              <p className="text-sm text-gray-500 mt-1">Download store data and analytics</p>
            </button>
            <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
              <h4 className="font-medium text-gray-900">Backup Store</h4>
              <p className="text-sm text-gray-500 mt-1">Create a backup of your store</p>
            </button>
            <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
              <h4 className="font-medium text-gray-900">Reset Settings</h4>
              <p className="text-sm text-gray-500 mt-1">Reset to default configuration</p>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 