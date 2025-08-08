'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Activity, AlertTriangle, BarChart3, Bell, ChevronDown, FileText, Home, LogOut, Menu, Settings, Shield, TrendingUp, Users, X, Zap, Download, HelpCircle, Lock, BookOpen, Database } from 'lucide-react'
import { liveEngine, LiveStats } from '@/lib/live-transaction-engine'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState<LiveStats>({
    totalTransactions: 0,
    fraudDetected: 0,
    totalAmount: 0,
    averageAmount: 0,
    riskScore: 2.3,
    accuracy: 97.8,
    processingSpeed: 0.3,
    activeUsers: 8429,
    transactionsPerSecond: 0,
    blockedTransactions: 0,
    flaggedTransactions: 0,
    approvedTransactions: 0
  })

  useEffect(() => {
    const unsubscribe = liveEngine.subscribe((data) => {
      setStats(data.stats)
    })

    return unsubscribe
  }, [])

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home, 
      current: pathname === '/dashboard',
      badge: null
    },
    { 
      name: 'Transactions', 
      href: '/dashboard/transactions', 
      icon: Activity, 
      current: pathname === '/dashboard/transactions',
      badge: stats.transactionsPerSecond > 0 ? stats.transactionsPerSecond.toString() : null
    },
    { 
      name: 'Alerts', 
      href: '/dashboard/alerts', 
      icon: AlertTriangle, 
      current: pathname === '/dashboard/alerts',
      badge: stats.fraudDetected > 0 ? stats.fraudDetected.toString() : null
    },
    { 
      name: 'Reports', 
      href: '/dashboard/reports', 
      icon: FileText, 
      current: pathname === '/dashboard/reports',
      badge: null
    },
    { 
      name: 'Performance', 
      href: '/dashboard/performance', 
      icon: Zap, 
      current: pathname === '/dashboard/performance',
      badge: stats.accuracy < 95 ? '!' : null
    },
    { 
      name: 'Trends', 
      href: '/dashboard/trends', 
      icon: TrendingUp, 
      current: pathname === '/dashboard/trends',
      badge: null
    },
    { 
      name: 'Users', 
      href: '/dashboard/users', 
      icon: Users, 
      current: pathname === '/dashboard/users',
      badge: null
    },
    { 
      name: 'Rules', 
      href: '/dashboard/rules', 
      icon: Shield, 
      current: pathname === '/dashboard/rules',
      badge: null
    },
    { 
      name: 'Security', 
      href: '/dashboard/security', 
      icon: Lock, 
      current: pathname === '/dashboard/security',
      badge: null
    },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: Settings, 
      current: pathname === '/dashboard/settings',
      badge: null
    },
    { 
      name: 'Help', 
      href: '/dashboard/help', 
      icon: HelpCircle, 
      current: pathname === '/dashboard/help',
      badge: null
    },
    { 
      name: 'Downloads', 
      href: '/dashboard/downloads', 
      icon: Download, 
      current: pathname === '/dashboard/downloads',
      badge: null
    },
    { 
      name: 'Getting Started', 
      href: '/dashboard/getting-started', 
      icon: BookOpen, 
      current: pathname === '/dashboard/getting-started',
      badge: null
    }
  ]

  const user = {
    name: 'John Doe',
    email: 'john@company.com',
    avatar: '/professional-avatar.png',
    role: 'Security Analyst'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800">
            <div className="flex h-16 items-center justify-between px-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">FraudGuard</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="mt-4 px-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                      item.current
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 bg-red-500 text-white text-xs animate-pulse">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">FraudGuard</span>
            </div>
          </div>
          <nav className="mt-4 flex-1 px-2 pb-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                    item.current
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 bg-red-500 text-white text-xs animate-pulse">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">Live System</span>
                </div>
                <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Activity className="w-4 h-4" />
                    <span>{stats.transactionsPerSecond}/sec</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>{stats.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{stats.fraudDetected}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white relative">
                <Bell className="h-5 w-5" />
                {stats.fraudDetected > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0 animate-pulse">
                    {stats.fraudDetected}
                  </Badge>
                )}
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 text-gray-300 hover:text-white">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.role}</div>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
                  <DropdownMenuLabel className="text-gray-300">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-gray-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
