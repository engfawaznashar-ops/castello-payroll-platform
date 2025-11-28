import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      
      <main className="pt-[88px] pr-20 transition-all duration-300">
        <div className="max-w-[1920px] mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

