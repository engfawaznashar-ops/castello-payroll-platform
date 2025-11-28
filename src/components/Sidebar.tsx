'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Users, 
  Upload, 
  CheckCircle2, 
  Bell, 
  Sparkles,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/lib/store'
import { Button } from './ui/button'

const menuItems = [
  {
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'الموظفين',
    icon: Users,
    href: '/employees',
  },
  {
    label: 'رفع البيانات',
    icon: Upload,
    href: '/upload',
  },
  {
    label: 'جودة البيانات',
    icon: CheckCircle2,
    href: '/quality',
  },
  {
    label: 'التنبيهات',
    icon: Bell,
    href: '/alerts',
  },
  {
    label: 'الذكاء الاصطناعي',
    icon: Sparkles,
    href: '/ai',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-[68px] bottom-0 right-0 z-40 transition-all duration-300 group',
          'flex flex-col backdrop-blur-xl bg-gradient-to-b from-castello-primary/5 to-castello-gold/5 border-l border-castello-neutral-200 shadow-soft',
          sidebarCollapsed ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
          'w-20 hover:w-[280px]'
        )}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden p-4 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-castello-red-50"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    toggleSidebar()
                  }
                }}
                className={cn(
                  'relative flex items-center gap-4 px-5 py-3.5 rounded-card transition-all duration-200 group w-full',
                  isActive
                    ? 'bg-white shadow-gold text-castello-primary font-semibold'
                    : 'text-castello-neutral-700 hover:bg-white/70 hover:text-castello-primary hover:shadow-soft'
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-castello-gold rounded-r-full shadow-gold" />
                )}
                
                <Icon className={cn(
                  'w-5 h-5 shrink-0 transition-transform duration-200',
                  isActive ? 'text-castello-primary' : 'text-castello-neutral-600 group-hover:text-castello-primary'
                )} />
                
                <span className={cn(
                  'font-medium text-sm whitespace-nowrap flex-1',
                  'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  isActive ? 'text-castello-primary' : 'text-castello-neutral-700 group-hover:text-castello-primary'
                )}>
                  {item.label}
                </span>

                {/* Hover glow effect */}
                <div className={cn(
                  'absolute inset-0 rounded-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none',
                  isActive && 'opacity-100 bg-gradient-to-l from-castello-gold/5 to-transparent'
                )} />
              </Link>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-l from-transparent via-castello-neutral-300 to-transparent" />

        {/* Footer with Mini Logo */}
        <div className="p-3 text-center border-t border-castello-neutral-200">
          <div className="w-8 h-8 mx-auto mb-1.5 opacity-100 group-hover:opacity-0 transition-opacity duration-300 rounded-soft overflow-hidden ring-1 ring-castello-gold/20 bg-white">
            <Image
              src="/4bw11l17jtsb1.jpg"
              alt="Castello Coffee"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-xs font-bold text-castello-primary mb-0.5">Castello Coffee</p>
            <p className="text-[10px] text-castello-neutral-600">© 2024 جميع الحقوق محفوظة</p>
          </div>
        </div>
      </aside>
    </>
  )
}

