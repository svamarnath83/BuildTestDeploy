"use client";

import React from 'react';
import { Calculator, Database, DollarSign, Ship, Settings, Bell, Search, User, Anchor } from 'lucide-react';
import { cn } from '@commercialapp/ui';

interface ModuleTile {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  bgGradient: string;
  stats?: {
    label: string;
    value: string;
  };
}

const modules: ModuleTile[] = [
  {
    id: 'chartering',
    title: 'Chartering',
    subtitle: 'OPS',
    description: 'Cargo analysis, estimates, and operational planning for maritime operations',
    icon: Ship,
    route: process.env.NEXT_PUBLIC_CHARTERING_URL || 'http://localhost:3000',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    stats: {
      label: 'Active Estimates',
      value: '84'
    }
  },
  {
    id: 'voyagemanager',
    title: 'Voyage Manager',
    subtitle: 'VOY',
    description: 'Track and manage vessel voyages from planning to completion, port calls, and voyage financials',
    icon: Anchor,
    route: process.env.NEXT_PUBLIC_VOYAGEMANAGER_URL || 'http://localhost:3004',
    color: 'text-teal-600',
    bgGradient: 'from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900',
    stats: {
      label: 'Active Voyages',
      value: '23'
    }
  },
  {
    id: 'registers',
    title: 'Master Data',
    subtitle: 'REG',
    description: 'Ship, port, vessel types, grades, and comprehensive master data management across the system',
    icon: Database,
    route: process.env.NEXT_PUBLIC_REGISTERS_URL || 'http://localhost:3001',
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
    stats: {
      label: 'Data Records',
      value: '8,924'
    }
  },
  {
    id: 'accounting',
    title: 'Accounting',
    subtitle: 'ACC',
    description: 'Financial management, accounts receivable/payable, chart of accounts, and comprehensive financial reporting',
    icon: DollarSign,
    route: '/accounting',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
    stats: {
      label: 'Active Transactions',
      value: '2,547'
    }
  }
];

export default function HomePage() {
  const handleModuleClick = (route: string) => {
    if (route.startsWith('http')) {
      window.open(route, '_blank', 'noopener,noreferrer');
    } else if (route === '/accounting') {
      window.open(process.env.NEXT_PUBLIC_ACCOUNTING_URL || 'http://localhost:3003', '_blank', 'noopener,noreferrer');
    } else if (route === '/chartering') {
      window.open(process.env.NEXT_PUBLIC_CHARTERING_URL || 'http://localhost:3000', '_blank', 'noopener,noreferrer');
    } else if (route === '/registers') {
      window.open(process.env.NEXT_PUBLIC_REGISTERS_URL || 'http://localhost:3001', '_blank', 'noopener,noreferrer');
    } else if (route === '/voyagemanager') {
      window.open(process.env.NEXT_PUBLIC_VOYAGEMANAGER_URL || 'http://localhost:3004', '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = route;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Ship className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Shipnet</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Maritime Management Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search modules..."
                  className="pl-10 pr-4 py-2 w-64 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-300">Demo Company</span>
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Welcome to Shipnet
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive maritime management platform. Access powerful modules designed for modern shipping operations.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">2,547</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Modules</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">4</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">System Status</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Online</p>
              </div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module.route)}
                className={cn(
                  "group relative overflow-hidden bg-gradient-to-br rounded-2xl p-8 cursor-pointer",
                  "transform transition-all duration-300 hover:scale-105 hover:shadow-xl",
                  "border border-slate-200 dark:border-slate-700",
                  module.bgGradient
                )}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
                      "bg-white dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300"
                    )}>
                      <IconComponent className={cn("w-7 h-7", module.color)} />
                    </div>
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full",
                      "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
                    )}>
                      {module.subtitle}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {module.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {module.description}
                  </p>
                  
                  {module.stats && (
                    <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/60 rounded-lg backdrop-blur-sm">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {module.stats.label}
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {module.stats.value}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: DollarSign, label: 'View Reports', color: 'text-emerald-600' },
              { icon: Ship, label: 'Track Vessels', color: 'text-blue-600' },
              { icon: Database, label: 'Manage Data', color: 'text-purple-600' },
              { icon: Settings, label: 'System Settings', color: 'text-slate-600' }
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
              >
                <action.icon className={cn("w-8 h-8 mb-3", action.color)} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-12 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              © 2025 Shipnet. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm">
                Documentation
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm">
                Support
              </a>
              <a href="#" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
