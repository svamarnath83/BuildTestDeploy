"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  CreditCard, 
  BookOpen, 
  FileText, 
  Banknote, 
  BarChart3, 
  Calculator, 
  TrendingUp, 
  Download, 
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@commercialapp/ui';

interface KPICard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
  color: string;
  bgGradient: string;
  status: 'active' | 'coming-soon';
}

const kpiData: KPICard[] = [
  {
    title: 'Total Revenue',
    value: '$2,547,890',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950'
  },
  {
    title: 'Accounts Receivable',
    value: '$847,230',
    change: '-3.2%',
    trend: 'down',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    title: 'Accounts Payable',
    value: '$234,567',
    change: '+8.1%',
    trend: 'up',
    icon: Building,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  },
  {
    title: 'Cash Flow',
    value: '$1,234,567',
    change: '+15.3%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  }
];

const modules: ModuleCard[] = [
  {
    id: 'ar',
    title: 'Accounts Receivable',
    description: 'Manage customer invoices, payments, and outstanding balances',
    icon: DollarSign,
    route: '/accounting/ar',
    color: 'text-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
    status: 'coming-soon'
  },
  {
    id: 'ap',
    title: 'Accounts Payable',
    description: 'Handle vendor bills, payments, and supplier management',
    icon: CreditCard,
    route: '/accounting/ap',
    color: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
    status: 'coming-soon'
  },
  {
    id: 'journals',
    title: 'Transaction Recording',
    description: 'Journals, VAT/GST, Multi-Currency, Multi-Company transactions',
    icon: BookOpen,
    route: '/accounting/journals',
    color: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
    status: 'coming-soon'
  },
  {
    id: 'chart-of-accounts',
    title: 'Chart of Accounts',
    description: 'Configure and manage your accounting structure',
    icon: FileText,
    route: '/accounting/chart-of-accounts',
    color: 'text-orange-600',
    bgGradient: 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
    status: 'coming-soon'
  },
  {
    id: 'reconciliation',
    title: 'Cash & Bank Reconciliation',
    description: 'Reconcile bank statements and cash accounts',
    icon: Banknote,
    route: '/accounting/reconciliation',
    color: 'text-yellow-600',
    bgGradient: 'from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900',
    status: 'coming-soon'
  },
  {
    id: 'financial-statements',
    title: 'Financial Statements',
    description: 'P&L, Balance Sheet, and Cash Flow reports',
    icon: BarChart3,
    route: '/accounting/financial-statements',
    color: 'text-red-600',
    bgGradient: 'from-red-50 to-red-100 dark:from-red-950 dark:to-red-900',
    status: 'coming-soon'
  },
  {
    id: 'reports',
    title: 'Control & Tax Reports',
    description: 'Trial Balance, General Ledger, VAT/GST, Variance reports',
    icon: Calculator,
    route: '/accounting/reports',
    color: 'text-indigo-600',
    bgGradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900',
    status: 'coming-soon'
  },
  {
    id: 'budget',
    title: 'Budget Management',
    description: 'Budget planning, tracking, and variance analysis',
    icon: TrendingUp,
    route: '/accounting/budget',
    color: 'text-pink-600',
    bgGradient: 'from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900',
    status: 'coming-soon'
  },
  {
    id: 'integration',
    title: 'Integration Hub',
    description: 'Import/Export data and system integrations',
    icon: Download,
    route: '/accounting/integration',
    color: 'text-teal-600',
    bgGradient: 'from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900',
    status: 'coming-soon'
  },
  {
    id: 'compliance',
    title: 'Compliance & Audit',
    description: 'Audit Logs, Role Management, and Compliance reporting',
    icon: Shield,
    route: '/accounting/compliance',
    color: 'text-slate-600',
    bgGradient: 'from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900',
    status: 'coming-soon'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'invoice',
    title: 'Invoice #INV-2025-001 created',
    description: 'New invoice for Maritime Solutions Ltd.',
    amount: '$12,500',
    time: '2 hours ago',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment received from ABC Corp',
    description: 'Payment for invoice #INV-2025-002',
    amount: '$8,750',
    time: '5 hours ago',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    id: 3,
    type: 'journal',
    title: 'Journal entry posted',
    description: 'Monthly depreciation adjustments',
    amount: '$3,200',
    time: '1 day ago',
    icon: BookOpen,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900'
  }
];

export default function AccountingDashboard() {
  const router = useRouter();
  
  const handleModuleClick = (route: string) => {
    router.push(route);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'New Invoice':
        router.push('/ar/create');
        break;
      case 'Record Payment':
        // TODO: Add payment recording functionality
        console.log('Record Payment clicked');
        break;
      case 'Journal Entry':
        router.push('/journals');
        break;
      case 'View Reports':
        // TODO: Add reports functionality
        console.log('View Reports clicked');
        break;
      default:
        console.log(`Action not implemented: ${action}`);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Accounting Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Manage your financial operations and reporting</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            View Reports
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className={cn("p-3 rounded-lg", kpi.bgColor)}>
                  <IconComponent className={cn("w-6 h-6", kpi.color)} />
                </div>
                <div className={cn(
                  "flex items-center space-x-1 text-sm font-medium",
                  kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                )}>
                  <TrendIcon className="w-4 h-4" />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{kpi.title}</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: 'New Invoice', color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-950' },
            { icon: CreditCard, label: 'Record Payment', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-950' },
            { icon: BookOpen, label: 'Journal Entry', color: 'text-purple-600', bgColor: 'bg-purple-50 dark:bg-purple-950' },
            { icon: BarChart3, label: 'View Reports', color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-950' }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => handleQuickAction(action.label)}
              className="flex flex-col items-center p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
            >
              <div className={cn("p-3 rounded-lg mb-3 group-hover:scale-110 transition-transform", action.bgColor)}>
                <action.icon className={cn("w-6 h-6", action.color)} />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Module Grid */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Accounting Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <div
                  key={module.id}
                  onClick={() => handleModuleClick(module.route)}
                  className={cn(
                    "group relative overflow-hidden bg-gradient-to-br rounded-xl p-6 cursor-pointer",
                    "transform transition-all duration-300 hover:scale-105 hover:shadow-lg",
                    "border border-slate-200 dark:border-slate-700",
                    module.bgGradient
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shadow-sm",
                        "bg-white dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300"
                      )}>
                        <IconComponent className={cn("w-6 h-6", module.color)} />
                      </div>
                      {module.status === 'coming-soon' && (
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {module.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="xl:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">Recent Activity</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className={cn("p-2 rounded-lg", activity.bgColor)}>
                    <activity.icon className={cn("w-4 h-4", activity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activity.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{activity.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400 dark:text-slate-500">{activity.time}</span>
                      <span className={cn("text-sm font-medium", activity.color)}>{activity.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button className="w-full text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                View all activities
              </button>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">API Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Database</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-emerald-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Last Backup</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
