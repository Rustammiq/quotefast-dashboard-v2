
'use client';

import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <UserCircle />
        </button>
      </div>
    </header>
  );
}
