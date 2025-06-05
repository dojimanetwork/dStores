import Link from 'next/link';
import { useRouter } from 'next/router';

const tabs = [
  { name: 'Build Website', path: '/dashboard/build' },
  { name: 'Add Products', path: '/dashboard/products' },
  { name: 'Shipping Options', path: '/dashboard/shipping' },
  { name: 'Payments', path: '/dashboard/payments' },
  { name: 'Launch Store', path: '/dashboard/launch' },
];

export default function DashboardSidebar() {
  const router = useRouter();
  return (
    <aside className="w-64 bg-gray-100 h-full p-4">
      <h2 className="text-xl font-bold mb-6">Web3 Store Builder</h2>
      <nav className="space-y-4">
        {tabs.map((tab) => (
          <Link key={tab.path} href={tab.path}>
            <div className={`p-2 rounded hover:bg-gray-200 cursor-pointer ${router.pathname === tab.path ? 'bg-gray-300' : ''}`}>
              {tab.name}
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
