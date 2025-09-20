import React from 'react';

// Centralized Icon System for Shipnet Applications
// Export commonly used icons to avoid duplicate imports across apps

export {
  // Navigation & UI
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Bell,
  Search,
  Plus,

  // Financial & Accounting
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

  // Maritime & Operations
  Ship,
  Database,
  Construction,

  // Status & Activity
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Building,
  Star,
  // Renamed to avoid conflict with Calendar component
  Calendar as CalendarIcon,

  // Tools & Actions
  Wrench,
} from 'lucide-react';

// Icon component type for TypeScript
export type IconComponent = React.ComponentType<{
  className?: string;
  size?: number;
  color?: string;
}>;

// Import the icons for creating the organized sets
import {
  Home,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  Settings,
  HelpCircle,
  LogOut,
  User,
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
  Ship,
  Database,
  Construction,
} from 'lucide-react';

// Common icon sets for different modules
export const NavigationIcons = {
  home: Home,
  menu: Menu,
  close: X,
  back: ArrowLeft,
  forward: ArrowRight,
  settings: Settings,
  help: HelpCircle,
  logout: LogOut,
  user: User,
} as const;

export const AccountingIcons = {
  dollar: DollarSign,
  credit: CreditCard,
  journal: BookOpen,
  document: FileText,
  bank: Banknote,
  chart: BarChart3,
  calculator: Calculator,
  trending: TrendingUp,
  download: Download,
  shield: Shield,
} as const;

export const CharteringIcons = {
  ship: Ship,
  database: Database,
  construction: Construction,
} as const;
