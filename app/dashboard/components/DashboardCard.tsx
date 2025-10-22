import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
}

export default function DashboardCard({ title, value, icon, change }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-gray-500">{icon}</div>
      </div>
      {change && <p className="text-sm text-green-500 mt-2">{change}</p>}
    </div>
  );
}