'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('[Login] Starting sign in...')
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 30000)
      )
      
      const signInPromise = signIn('credentials', {
        email,
        password,
        redirect: false
      })

      const result = await Promise.race([signInPromise, timeoutPromise]) as any

      console.log('[Login] Sign in result:', result)

      if (result?.error) {
        console.error('[Login] Sign in error:', result.error)
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setLoading(false)
        return
      }

      if (result?.ok) {
        console.log('[Login] Sign in successful, redirecting...')
        router.push('/dashboard')
        router.refresh()
      } else {
        console.warn('[Login] Unexpected result:', result)
        setError('حدث خطأ غير متوقع')
        setLoading(false)
      }
    } catch (err) {
      console.error('[Login] Exception:', err)
      if (err instanceof Error && err.message === 'Timeout') {
        setError('انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.')
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول')
      }
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-castello-smoke px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-castello-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-castello-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="w-24 h-24 rounded-card overflow-hidden shadow-gold ring-2 ring-castello-gold/30 bg-white p-2">
            <Image
              src="/4bw11l17jtsb1.jpg"
              alt="Castello Coffee"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-card shadow-gold-lg p-8 border border-castello-gold/20 animate-slide-in">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-castello-red bg-clip-text text-transparent mb-2">
              Castello Coffee
            </h1>
            <p className="text-sm text-castello-neutral-600">نظام إدارة الرواتب والموارد البشرية</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-soft bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-castello-black mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-castello-neutral-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-soft border border-castello-neutral-300 focus:border-castello-gold focus:ring-2 focus:ring-castello-gold/20 outline-none transition-all text-left"
                  placeholder="example@castello.com"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-castello-black mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-castello-neutral-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-soft border border-castello-neutral-300 focus:border-castello-gold focus:ring-2 focus:ring-castello-gold/20 outline-none transition-all text-left"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-castello-red hover:shadow-gold-lg text-white font-bold py-3 rounded-soft flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span>جاري تسجيل الدخول...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-soft bg-castello-neutral-100 border border-castello-neutral-200">
            <p className="text-xs font-semibold text-castello-neutral-700 mb-2">بيانات تجريبية:</p>
            <div className="space-y-1 text-xs text-castello-neutral-600">
              <p className="font-mono">CEO: ceo@castello.com / castello123</p>
              <p className="font-mono">HR: hr@castello.com / castello123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-castello-neutral-500 mt-6">
          © 2024 Castello Coffee. جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  )
}


