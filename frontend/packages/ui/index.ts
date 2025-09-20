// Export shared components and utilities
export * from './src/index';
export {
  NavigationIcons,
  AccountingIcons,
  CharteringIcons,
  // Re-export individual icons with specific names to avoid conflicts
  DollarSign as IconDollarSign,
  Ship as IconShip,
  Database as IconDatabase,
  Calculator as IconCalculator,
  Home as IconHome,
  Menu as IconMenu,
  X as IconClose,
  ArrowLeft as IconArrowLeft,
  ArrowRight as IconArrowRight,
  Settings as IconSettings,
  User as IconUser,
  Bell as IconBell,
  Search as IconSearch,
  Plus as IconPlus,
  CreditCard as IconCreditCard,
  BookOpen as IconBookOpen,
  FileText as IconFileText,
  Banknote as IconBanknote,
  BarChart3 as IconBarChart3,
  TrendingUp as IconTrendingUp,
  Download as IconDownload,
  Shield as IconShield,
  Construction as IconConstruction,
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
  ChevronDown as IconChevronDown,
  HelpCircle as IconHelpCircle,
  LogOut as IconLogOut,
  // Calendar icon renamed to avoid conflict with Calendar component
  CalendarIcon as IconCalendar,
} from './src/components/icons';
export * from './libs/registers/ships/models';
export * from './libs/registers/ships/services';
export * from './libs/registers/ships/shipFormSchema';
export * from './libs/registers/ports/models';
export * from './libs/registers/ports/services';
export * from './libs/registers/grades/models';
export * from './libs/registers/grades/services';
export * from './libs/registers/grades/defaultGrade';
export * from './libs/registers/grades/gradeFormSchema';
export * from './libs/registers/vessel-types/models';
export * from './libs/registers/vessel-types/services';
export * from './libs/registers/country/models';
export * from './libs/registers/Area/models';
export * from './libs/registers/Area/services';
export * from './libs/registers/commodity/models';
export * from './libs/registers/commodity/service';
export * from './libs/registers/unit-of-measure/models';
export * from './libs/registers/unit-of-measure/service';
export * from './libs/registers/currencies/models';
export * from './libs/registers/currencies/service';
export * from './libs/auth/models';
export * from './libs/auth/services';
export * from './libs/registers/vessel-types/models';
export * from './libs/registers/vessel-types/services';
export * from './config/api';
export { default as AppLayout } from './src/components/ui/AppLayout';
export { SimpleCache } from './src/components/ui/SimpleCache';
export * from './libs/api-client';
export * from './libs/cache';
export * from './libs/cacheManager';
export * from './libs/utils';
export * from './libs/chartering/models';
export * from './libs/chartering/services';
export * from './libs/activity/models';
export * from './src/components/activity';
export * from './src/classnames';
export * from './libs/registers/ports/defaultPort';
export * from './libs/registers/ports/portFormSchema';
export { default as MultiSelect, type SelectOption } from './src/components/ui/MultiSelect';
export * from './libs/hooks';

