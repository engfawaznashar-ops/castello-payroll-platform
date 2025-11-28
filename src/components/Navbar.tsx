'use client'

import { Bell, Settings, LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useUIStore } from '@/lib/store'
import { Button } from './ui/button'

export function Navbar() {
  const { data: session } = useSession()
  const { toggleSidebar } = useUIStore()
  
  const user = session?.user || {
    name: 'مستخدم',
    email: 'user@castello.com',
    role: 'HR_MANAGER'
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/90 shadow-soft border-b border-castello-neutral-200">
      <div className="max-w-[1920px] mx-auto px-6 py-2.5">
        <div className="flex items-center justify-between">
          {/* Left Side - Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-castello-primary/5"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5 text-castello-neutral-700" />
            </Button>

            {/* User Profile Block */}
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-soft bg-white shadow-soft hover:shadow-card transition-all duration-200">
              <div className="w-9 h-9 rounded-full bg-castello-gold text-white flex items-center justify-center font-bold text-sm shadow-sm">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="font-semibold text-sm text-castello-black leading-tight">{user.name}</p>
                <p className="text-xs text-castello-neutral-600">{user.role === 'CEO' ? 'المدير التنفيذي' : 'مدير الموارد البشرية'}</p>
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 rounded-soft hover:bg-castello-gold/10 transition-all duration-200 group">
              <Bell className="w-4.5 h-4.5 text-castello-neutral-700 group-hover:text-castello-primary transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-castello-primary rounded-full animate-pulse shadow-castello" />
            </button>

            {/* Settings */}
            <button className="p-2.5 rounded-soft hover:bg-castello-neutral-100 transition-all duration-200 hidden md:block group">
              <Settings className="w-4.5 h-4.5 text-castello-neutral-700 group-hover:text-castello-primary group-hover:rotate-45 transition-all duration-300" />
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-soft hover:bg-red-50 transition-all duration-200 text-castello-primary hidden md:block group"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Right Side - Logo & Branding (RTL) */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h1 className="text-xl font-bold bg-castello-red bg-clip-text text-transparent leading-tight">
                Castello Coffee
              </h1>
              <p className="text-[10px] text-castello-neutral-600 font-medium">نظام إدارة الرواتب</p>
            </div>
            <div className="w-12 h-12 rounded-soft overflow-hidden shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300 ring-1 ring-castello-gold/30 bg-white p-0.5">
              <Image
                src="/4bw11l17jtsb1.jpg"
                alt="Castello Coffee"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

