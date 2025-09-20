import React from 'react';
import { 
  Clock, 
  Wrench, 
  ArrowLeft, 
  Bell,
  CheckCircle,
  Star,
  Users,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@commercialapp/ui';

interface ComingSoonPageProps {
  title: string;
  description: string;
  features?: string[];
  estimatedDate?: string;
  icon?: React.ElementType;
}

export default function ComingSoonPage({ 
  title, 
  description, 
  features = [], 
  estimatedDate = "Q2 2025",
  icon: IconComponent = Wrench 
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6">
          <Link 
            href="/accounting"
            className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icon */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <IconComponent className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  {title}
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900 dark:to-blue-900 rounded-full border border-emerald-200 dark:border-emerald-700">
                <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  Currently in Development
                </span>
              </div>

              {/* Release Timeline */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Expected Release
                  </h3>
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {estimatedDate}
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  We're working hard to bring you this feature
                </p>
              </div>

              {/* Features Preview */}
              {features.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-left">
                  <div className="flex items-center space-x-3 mb-6">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Planned Features
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notification Signup */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Get Notified
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Be the first to know when this feature becomes available
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Notify Me
                  </button>
                </div>
              </div>

              {/* Team Info */}
              <div className="flex items-center justify-center space-x-2 text-slate-500 dark:text-slate-400">
                <Users className="w-4 h-4" />
                <span className="text-sm">
                  Built with ❤️ by the Shipnet Development Team
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
