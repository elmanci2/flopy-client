"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { Rocket, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()

  const handleSubmit = async () => {
    console.log('--- LOGIN BUTTON CLICKED ---')
    setError(null)
    try {
      await login(email, password)
    } catch (err: any) {
      console.error('Submit Error:', err)
      setError(err.message || 'Ocurrió un error inesperado')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[650px] bg-background border-4 border-border shadow-block flex overflow-hidden">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden lg:flex w-5/12 bg-primary relative overflow-hidden flex-col justify-between p-12 text-white border-r-4 border-border text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rotate-45 -translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-32 translate-y-32" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-white border-3 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter italic">Flopy</span>
            </div>
            
            <h1 className="text-5xl font-black leading-tight uppercase mb-6 tracking-tighter">
              El Control <br /> 
              <span className="text-black bg-white px-2">Total</span> <br />
              está aquí.
            </h1>
            <p className="text-primary-foreground/80 font-bold text-lg max-w-xs leading-relaxed">
              La plataforma definitiva para gestionar tus aplicaciones con estilo y potencia.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white border-2 border-border" />
                <span className="font-bold uppercase text-xs tracking-widest">Optimizado para Devs</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white border-2 border-border" />
                <span className="font-bold uppercase text-xs tracking-widest">Seguridad de Bloque</span>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex flex-col p-8 lg:p-16 relative bg-card">
          <div className="flex justify-end mb-8">
            <Link href="/register" className="group flex items-center gap-2 text-xs font-black uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors">
              Crear cuenta <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="max-w-sm mx-auto w-full flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Bienvenido</h2>
              <p className="text-muted-foreground font-bold text-sm uppercase tracking-tight">Ingresa con tus credenciales</p>
            </div>

            {error && (
              <div className="mb-6 bg-destructive/10 border-4 border-destructive p-4 text-destructive text-[11px] font-black uppercase flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="bg-destructive text-white p-1 border-2 border-border shadow-block">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span>Error: {error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="admin@flopy.app" 
                    className="flex h-10 w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-10 border-2 border-border font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="#" className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">Olvidaste?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    id="password" 
                    type="password" 
                    className="flex h-10 w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-10 border-2 border-border font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                  />
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleSubmit}
                className="w-full h-12 bg-primary text-white font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none"
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Iniciar Sesión'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
