import DashboardLayout from '@/components/DashboardLayout';
import { ChartBarIcon, ArrowTrendingUpIcon, UsersIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function Analytics() {
  const stats = [
    { name: 'Total Revenue', value: '$12,345', change: '+12%', icon: CurrencyDollarIcon, color: 'green' },
    { name: 'Orders', value: '89', change: '+23%', icon: ChartBarIcon, color: 'blue' },
    { name: 'Customers', value: '156', change: '+8%', icon: UsersIcon, color: 'purple' },
    { name: 'Conversion Rate', value: '3.2%', change: '+0.5%', icon: ArrowTrendingUpIcon, color: 'orange' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your store performance and growth metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization will appear here</p>
              <p className="text-sm text-gray-400">Connect your analytics to view real-time data</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 