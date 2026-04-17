"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { User } from '@/types'
import { flopyApi } from '@/lib/api-client'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isChecking: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Session check in background
    try {
      const storedUser = localStorage.getItem('flopy_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error parsing stored user:', error)
      localStorage.removeItem('flopy_user')
    } finally {
      setIsChecking(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    console.log('--- LOGIN START ---')
    
    try {
      const data = await flopyApi.post<any>('/auth/login', { email, password })

      if (!data.token) {
        throw new Error('El servidor no devolvió un token de acceso')
      }

      const loggedUser = { 
        id: data.id || 'user_id', 
        email, 
        name: email.split('@')[0], 
        token: data.token 
      }
      
      setUser(loggedUser)
      localStorage.setItem('flopy_user', JSON.stringify(loggedUser))
      console.log('LOGIN SUCCESS! Redirecting...')
      
      // Foolproof redirect
      window.location.href = '/dashboard'

    } catch (error: any) {
      console.error('Login error detail:', error)
      
      if (error.status === 401) {
        throw new Error('Credenciales inválidas')
      }

      // FALLBACK FOR DEVELOPMENT
      if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('API Error')) {
        console.warn('API OFFLINE: Usando MOCK LOGIN para desarrollo')
        const mockUser = { id: 'mock_1', email, name: email.split('@')[0], token: 'mock_token' }
        setUser(mockUser)
        localStorage.setItem('flopy_user', JSON.stringify(mockUser))
        window.location.href = '/dashboard'
        return
      }
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    try {
      await flopyApi.post('/auth/register', { email, password, name })
      await login(email, password)
    } catch (error: any) {
      console.error('Register error:', error)
      if (error.status === 409) {
        throw new Error('El email ya está en uso')
      }
      if (error.message.includes('fetch') || error.message.includes('API Error')) {
         await login(email, password)
         return
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('flopy_user')
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isChecking }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Guard Component
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isChecking } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  const currentPath = pathname || ''
  const isAuthPage = currentPath.startsWith('/login') || currentPath.startsWith('/register')
  const isProtectedPage = currentPath.startsWith('/dashboard') || currentPath === '/'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isChecking) return

    // 1. Si NO está logueado y trata de entrar a una página protegida (Dashboard) -> Al Login
    if (!user && isProtectedPage) {
      console.log('Guard: Acceso denegado. Redirigiendo a Login.')
      router.push('/login')
    } 
    // 2. Si SI está logueado y trata de entrar a Login/Register -> Al Dashboard
    else if (user && isAuthPage) {
      console.log('Guard: Ya estás logueado. Redirigiendo a Dashboard.')
      router.push('/dashboard')
    }
  }, [user, isChecking, isAuthPage, isProtectedPage, router, mounted])

  // Mientras se verifica la sesión o se monta el componente
  if (!mounted || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full shadow-block" />
          <div className="text-xl font-black uppercase tracking-widest text-primary animate-pulse">
            Flopy is Loading...
          </div>
        </div>
      </div>
    )
  }

  // Permitir renderizar según el estado final
  return <>{children}</>
}
