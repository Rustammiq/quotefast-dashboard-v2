
import React from 'react';
import DashboardCard from './components/DashboardCard';
import { DollarSign, Users, FileText, ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          value="$45,231.89"
          icon={<DollarSign />}
          change="+20.1% from last month"
        />
        <DashboardCard
          title="New Customers"
          value="+2,350"
          icon={<Users />}
          change="+180.1% from last month"
        />
        <DashboardCard
          title="Quotes Sent"
          value="1,234"
          icon={<FileText />}
          change="+19% from last month"
        />
        <DashboardCard
          title="Conversion Rate"
          value="57.3%"
          icon={<ArrowUpRight />}
          change="+2.1% from last month"
        />
      </div>
      <div className="mt-8">
        {/* Placeholder for recent activity or charts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-gray-500 mt-2">Activity feed will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
