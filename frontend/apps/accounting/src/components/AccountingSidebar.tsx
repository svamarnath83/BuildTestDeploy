"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@commercialapp/ui';

interface SidebarItem {
  id: string;
  title: string;
  abbreviation: string; // Short label for collapsed state
  icon: React.ElementType;
  href: string;
  badge?: string;
  color: string;
  bgColor: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    abbreviation: '',
    icon: Home,
    href: '/',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    id: 'ar',
    title: 'Accounts Receivable',
    abbreviation: 'AR',
    icon: DollarSign,
    href: '/ar',
    badge: '12',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950'
  },
  {
    id: 'ap',
    title: 'Accounts Payable',
    abbreviation: 'AP',
    icon: CreditCard,
    href: '/ap',
    badge: '8',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950'
  },
  {
    id: 'journals',
    title: 'Journal Entry',
    abbreviation: 'JE',
    icon: BookOpen,
    href: '/journals',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950'
  },
  {
    id: 'account-groups',
    title: 'Account Groups',
    abbreviation: 'AG',
    icon: FileText,
    href: '/chart-of-accounts/account-groups',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950'
  },
  {
    id: 'chart-of-accounts',
    title: 'Accounts',
    abbreviation: 'ACC',
    icon: FileText,
    href: '/chart-of-accounts',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950'
  },
  {
    id: 'reconciliation',
    title: 'Bank Reconciliation',
    abbreviation: 'BR',
    icon: Banknote,
    href: '/reconciliation',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950'
  },
  {
    id: 'financial-statements',
    title: 'Financial Statements',
    abbreviation: 'FS',
    icon: BarChart3,
    href: '/financial-statements',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950'
  },
  {
    id: 'reports',
    title: 'Reports & Analytics',
    abbreviation: 'RPT',
    icon: Calculator,
    href: '/reports',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950'
  },
  {
    id: 'budget',
    title: 'Budget Management',
    abbreviation: 'BM',
    icon: TrendingUp,
    href: '/budget',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950'
  },
  {
    id: 'integration',
    title: 'Integration Hub',
    abbreviation: 'INT',
    icon: Download,
    href: '/integration',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 dark:bg-teal-950'
  },
  {
    id: 'compliance',
    title: 'Compliance & Audit',
    abbreviation: 'AUD',
    icon: Shield,
    href: '/compliance',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-950'
  }
];

const bottomItems = [
  {
    id: 'settings',
    title: 'Settings',
    abbreviation: 'SET',
    icon: Settings,
    href: '/settings',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-950'
  },
  {
    id: 'help',
    title: 'Help & Support',
    abbreviation: 'HLP',
    icon: HelpCircle,
    href: '/help',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-950'
  }
];

interface AccountingSidebarProps {
  children: React.ReactNode;
}

export default function AccountingSidebar({ children }: AccountingSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-collapse sidebar when not on dashboard
  useEffect(() => {
    // Check if current page is the dashboard (root path '/')
    const isDashboard = pathname === '/';
    
    // Collapse sidebar if not on dashboard
    if (!isDashboard) {
      setIsCollapsed(true);
    }
    // Note: We don't auto-expand on dashboard to let user control the state
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Accounting</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Financial Management</p>
            </div>
          </div>
        )}
        
        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">SN User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Financial Manager</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex transition-all duration-200",
                "hover:bg-slate-50 dark:hover:bg-slate-800",
                active 
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-r-2 border-emerald-600" 
                  : "text-slate-700 dark:text-slate-300",
                isCollapsed 
                  ? "flex-col items-center justify-center px-2 py-3 text-xs font-medium rounded-lg" 
                  : "flex-row items-center px-3 py-2.5 text-sm font-medium rounded-lg"
              )}
            >
              {isCollapsed ? (
                <>
                  <div className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-200 mb-1",
                    "w-8 h-8",
                    active ? item.bgColor : "group-hover:" + item.bgColor
                  )}>
                    <IconComponent className={cn(
                      "transition-colors duration-200 w-5 h-5",
                      active ? item.color : "text-slate-500 dark:text-slate-400 group-hover:" + item.color
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold block truncate leading-tight",
                    active ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400"
                  )}>
                    {item.abbreviation}
                  </span>
                </>
              ) : (
                <>
                  <div className={cn(
                    "flex items-center justify-center rounded-lg transition-all duration-200",
                    "w-6 h-6 mr-3",
                    active ? item.bgColor : "group-hover:" + item.bgColor
                  )}>
                    <IconComponent className={cn(
                      "transition-colors duration-200 w-4 h-4",
                      active ? item.color : "text-slate-500 dark:text-slate-400 group-hover:" + item.color
                    )} />
                  </div>
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge && (
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="px-2 py-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        {bottomItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex transition-all duration-200",
                "hover:bg-slate-50 dark:hover:bg-slate-800",
                active 
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                  : "text-slate-600 dark:text-slate-400",
                isCollapsed 
                  ? "flex-col items-center justify-center px-2 py-3 text-xs font-medium rounded-lg" 
                  : "flex-row items-center px-3 py-2.5 text-sm font-medium rounded-lg"
              )}
            >
              {isCollapsed ? (
                <>
                  <div className="flex items-center justify-center transition-all duration-200 mb-1 w-8 h-8">
                    <IconComponent className={cn(
                      "transition-colors duration-200 w-5 h-5",
                      active ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-semibold block truncate leading-tight",
                    active ? "text-slate-700 dark:text-slate-300" : "text-slate-600 dark:text-slate-400"
                  )}>
                    {item.abbreviation}
                  </span>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center transition-all duration-200 w-6 h-6 mr-3">
                    <IconComponent className={cn(
                      "transition-colors duration-200 w-4 h-4",
                      active ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-400"
                    )} />
                  </div>
                  <span className="flex-1 truncate">{item.title}</span>
                </>
              )}
            </Link>
          );
        })}
        
        {/* Logout Button */}
        <button
          className={cn(
            "group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
            "hover:bg-red-50 dark:hover:bg-red-950 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}
        >
          <div className={cn(
            "flex items-center justify-center transition-all duration-200",
            isCollapsed ? "w-8 h-8" : "w-6 h-6 mr-3"
          )}>
            <LogOut className={cn(
              "transition-colors duration-200",
              isCollapsed ? "w-5 h-5" : "w-4 h-4"
            )} />
          </div>
          
          {!isCollapsed && (
            <span className="flex-1 truncate">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex lg:flex-shrink-0 transition-all duration-300",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Accounting</h1>
              </div>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
