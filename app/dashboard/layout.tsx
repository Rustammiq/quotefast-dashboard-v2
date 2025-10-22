import React from 'react';
import SideNav from './components/SideNav';
import Header from './components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SideNav />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}