"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Search, Filter, ChevronUp, ChevronDown, HelpCircle, MessageSquare, Settings, User, Star, Layers, Calculator, Ship, Anchor, Package, Fuel, LogOut } from "lucide-react";
import { navigateToApp } from '../../../libs/cacheManager';
import { getCurrentUserSession, clearAllSessions } from '../../../libs/cache';
import { tokenManager } from '../../../libs/auth/tokenManager';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface MenuSection {
  title: string;
  href?: string;
  items: MenuItem[];
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [filters, setFilters] = useState(["Favorites"]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isCharteringApp, setIsCharteringApp] = useState(false);
  const [isRegisterApp, setIsRegisterApp] = useState(false);
  const [isVoyageManagerApp, setIsVoyageManagerApp] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  // App URLs for cross-navigation
  const APP_URLS = {
    AUTH: process.env.NEXT_PUBLIC_AUTH_URL,
    HOME: process.env.NEXT_PUBLIC_HOME_URL,
    ACCOUNTING: process.env.NEXT_PUBLIC_ACCOUNTING_URL,
    CHARTERING: process.env.NEXT_PUBLIC_CHARTERING_URL,
    REGISTERS: process.env.NEXT_PUBLIC_REGISTERS_URL,
    VOYAGEMANAGER: process.env.NEXT_PUBLIC_VOYAGEMANAGER_URL,
  };

  // Define chartering menu items
  const charteringItems: MenuItem[] = [
    { name: "Cargo Analysis", href: "/cargo-analysis", icon: Layers },
    { name: "Estimates", href: "/estimates", icon: Calculator },
    { name: "Bunker Prices", href: "/estimates/bunker-prices", icon: Fuel },
  ];

  // Define register menu items
  const registerItems: MenuItem[] = [
    { name: "Vessel", href: "/ships", icon: Ship },
    { name: "Vessel Type", href: "/vessel-types", icon: Ship },
    { name: "Grade", href: "/grades", icon: Fuel },
    { name: "Port", href: "/ports", icon: Anchor },
    { name: "Commodity", href: "/commodities", icon: Package },
    { name: "Charterer", href: "/charterers", icon: Package },
    { name: "Accounts", href: "/accounts", icon: Calculator },
    { name: "Account Groups", href: "/account-groups", icon: Layers }
  ];

  // Define voyage manager menu items
  const voyageManagerItems: MenuItem[] = [
    { name: "Voyages", href: "/voyages", icon: Ship },
    { name: "Port Calls", href: "/port-calls", icon: Anchor },
    { name: "Reports", href: "/reports", icon: Calculator },
  ];  

  // Get current user session
  useEffect(() => {
    const getUserSession = () => {
      try {
        const session = getCurrentUserSession();
        if (session?.username) {
          setCurrentUser(session.username);
        } else {
          // Fallback to token manager if no session
          const tokenData = tokenManager.getTokenData();
          if (tokenData?.username) {
            setCurrentUser(tokenData.username);
          }
        }
      } catch (error) {
        console.error('Error getting user session:', error);
      }
    };

    getUserSession();
  }, []);

  // Detect current app context based on port and pathname
  useEffect(() => {
    setIsClient(true);
    
    const currentPort = window.location.port;
    const charteringApp = currentPort === '3000' || 
                        pathname.startsWith('/cargo-analysis') || 
                        pathname.startsWith('/estimates');
    
    const registerApp = currentPort === '3001' ||
                       pathname.startsWith('/ports') ||
                       pathname.startsWith('/commodities') ||
                       pathname.startsWith('/ships') ||
                       pathname.startsWith('/grades') ||
                       pathname.startsWith('/vessel-types') ||
                       pathname.startsWith('/accounts') ||
                       pathname.startsWith('/account-groups');

    const voyageManagerApp = currentPort === '3004' ||
                            pathname.startsWith('/voyages') ||
                            pathname.startsWith('/port-calls') ||
                            pathname.startsWith('/reports');
    
    setIsCharteringApp(charteringApp);
    setIsRegisterApp(registerApp);
    setIsVoyageManagerApp(voyageManagerApp);
  }, [pathname]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear all sessions and tokens
      clearAllSessions();
      tokenManager.clearTokens();
      
      // Always redirect to chartering login (ports are dynamic)
      const charteringUrl = process.env.NEXT_PUBLIC_CHARTERING_URL;
      window.location.href = `${charteringUrl}/login`;
    } catch (error) {
      console.error('Error during logout:', error);
      // Force redirect to chartering login as fallback
      const charteringUrl = process.env.NEXT_PUBLIC_CHARTERING_URL;
      window.location.href = `${charteringUrl}/login`;
    }
  };

  // Context-aware menu structure
  let menuSections: MenuSection[];
  
  // Use pathname-based detection for initial render to avoid hydration mismatch
  const isCharteringAppByPath = pathname.startsWith('/cargo-analysis') || 
                              pathname.startsWith('/estimates');
  
  const isRegisterAppByPath = pathname.startsWith('/ports') ||
                              pathname.startsWith('/commodities') ||
                              pathname.startsWith('/ships') ||
                              pathname.startsWith('/grades') ||
                              pathname.startsWith('/vessel-types') ||
                              pathname.startsWith('/accounts') ||
                              pathname.startsWith('/account-groups');

  const isVoyageManagerAppByPath = pathname.startsWith('/voyages') ||
                                  pathname.startsWith('/port-calls') ||
                                  pathname.startsWith('/reports') ||
                                  pathname === '/';
  
  // Determine current app context - use pathname for SSR, port for client
  const isInCharteringApp = isClient ? isCharteringApp : isCharteringAppByPath;
  const isInRegistersApp = isClient ? isRegisterApp : isRegisterAppByPath;
  const isInVoyageManagerApp = isClient ? isVoyageManagerApp : isVoyageManagerAppByPath;
  
  if (isInCharteringApp) {
    // In chartering app: show only chartering items
    menuSections = [
      {
        title: "Chartering",
        items: charteringItems
      }
    ];
  } else if (isInRegistersApp) {
    // In registers app: show only register items  
    menuSections = [
      {
        title: "Register",
        items: registerItems
      }
    ];
  } else if (isInVoyageManagerApp) {
    // In voyage manager app: show only voyage manager items
    menuSections = [
      {
        title: "Voyage Manager",
        items: voyageManagerItems
      }
    ];
  } else {
    // Fallback: show all sections (should rarely happen)
    menuSections = [
      {
        title: "Chartering",
        href: APP_URLS.CHARTERING,
        items: charteringItems
      },
      {
        title: "Register", 
        href: APP_URLS.REGISTERS,
        items: registerItems
      },
      {
        title: "Voyage Manager",
        href: APP_URLS.VOYAGEMANAGER,
        items: voyageManagerItems
      }
    ];
  }

  // Check if we're on the voyage manager map view (main page)
  const isVoyageManagerMapView = isInVoyageManagerApp && pathname === '/';
  
  // If we're on the voyage manager map view, render without sidebar and nav
  if (isVoyageManagerMapView) {
    return (
      <div className="h-screen bg-gray-50">
        {/* Minimal top nav for map view */}
        <nav className="bg-blue-900 text-white shadow-lg">
          <div className="px-4">
            <div className="flex justify-between items-center h-12">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-blue-900 font-bold text-base">V</span>
                </div>
                <h1 className="text-base font-semibold">VMS</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-blue-800 rounded">
                  <Settings className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-300">{currentUser || "Demo Company"}</span>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <User className="w-4 h-4 text-gray-600" />
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{currentUser || "User"}</p>
                        <p className="text-xs text-gray-500">Logged in</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Full screen content for map */}
        <div className="h-[calc(100vh-3rem)]">
          {children}
        </div>
        
        {/* Click outside to close dropdown */}
        {isProfileDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsProfileDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-blue-900 font-bold text-base">V</span>
              </div>
              <h1 className="text-base font-semibold">VMS</h1>
            </div>
            {/* Global Search Bar */}
            <div className="flex-1 max-w-md mx-4 flex items-center justify-center relative">
              {/* Search Bar */}
              <div 
                className="flex items-center bg-gray-200 border border-gray-300 rounded-md px-3 py-1.5 w-full max-w-sm cursor-pointer"
                onClick={() => setIsSearchDropdownOpen(true)}
              >
                {/* Search Icon */}
                <Search className="w-4 h-4 text-gray-500 mr-2" />
                {/* Input */}
                <input
                  type="text"
                  className="flex-1 outline-none border-none bg-transparent text-sm text-gray-700 placeholder-gray-500 cursor-pointer"
                  placeholder="Search..."
                  readOnly
                />
                {/* Chevron Icon */}
                <div 
                  className="ml-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchDropdownOpen(!isSearchDropdownOpen);
                  }}
                >
                  {isSearchDropdownOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Dropdown Menu */}
              {isSearchDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  <div className="grid grid-cols-3 gap-4 p-4">
                    {/* Filters Section */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Filter className="w-4 h-4 mr-2 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                      </div>
                      <div className="space-y-1">
                        {["Favorites", "Sales", "Purchases", "Liquidity", "Miscellaneous", "Archived", "Custom Filter..."].map((filter) => (
                          <button
                            key={filter}
                            className="block w-full text-left text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-2 py-1 rounded"
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Group By Section */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Layers className="w-4 h-4 mr-2 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-700">Group By</h3>
                      </div>
                      <div className="space-y-1">
                        <div className="relative">
                          <select className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded px-2 py-1">
                            <option>Custom Group</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Favorites Section */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 mr-2 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-700">Favorites</h3>
                      </div>
                      <div className="space-y-1">
                        <button className="w-full text-left text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-2 py-1 rounded flex items-center">
                          Save current search
                          <ChevronDown className="ml-auto w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-blue-800 rounded relative">
                <MessageSquare className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full text-xs flex items-center justify-center">9</div>
              </button>
              <button className="p-2 hover:bg-blue-800 rounded relative">
                <HelpCircle className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full text-xs flex items-center justify-center">34</div>
              </button>
              <button className="p-2 hover:bg-blue-800 rounded">
                <Settings className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-300">{currentUser || "Demo Company"}</span>
              
              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <User className="w-4 h-4 text-gray-600" />
                </button>
                
                {/* Profile Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser || "User"}</p>
                      <p className="text-xs text-gray-500">Logged in</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 bg-gray-100 min-h-screen">
          <div className="p-4">
            <nav className="space-y-6">
              {menuSections.map((section, sectionIndex) => (
                <div key={section.title}>
                  {/* Section Header */}
                  <div className="mb-3">
                    {section.href ? (
                      <a 
                        href={section.href}
                        className="flex items-center px-2 py-1 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-800 transition-colors"
                      >
                         {section.title}
                      </a>
                    ) : (
                      <div className="px-2 py-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                         {section.title}
                      </div>
                    )}
                  </div>

                  {/* Section Items */}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                          pathname === item.href
                            ? "text-gray-900 bg-gray-200 border-l-2 border-green-500"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </a>
                    ))}
                  </div>

                  {/* Visual Separator (except for last section) */}
                  {sectionIndex < menuSections.length - 1 && (
                    <div className="mt-6 pt-0">
                      <div className="border-t border-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}

              {/* Cross-App Navigation Link */}
              {isInCharteringApp && (
                <div>
                  <div className="mt-6 pt-6">
                    <div className="border-t border-gray-300"></div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={async () => {
                        await navigateToApp('registers', 'chartering');
                      }}
                      className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-blue-600 hover:bg-blue-50 hover:text-blue-800 border border-blue-200 hover:border-blue-300 w-full text-left"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Register
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-2">
          <div className="max-w-100% mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Click outside to close dropdowns */}
      {(isSearchDropdownOpen || isProfileDropdownOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsSearchDropdownOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
} 