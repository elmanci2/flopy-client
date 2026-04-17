"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { UserPlus, User, Mail, Lock, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { register, isLoading } = useAuth()

  const handleSubmit = async () => {
    console.log('--- REGISTER BUTTON CLICKED ---')
    setError(null)
    try {
      await register(email, password, name)
    } catch (err: any) {
      console.error('Register Submit Error:', err)
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
        <div className="hidden lg:flex w-5/12 bg-secondary relative overflow-hidden flex-col justify-between p-12 text-foreground border-r-4 border-border">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rotate-45 translate-x-16 -translate-y-16" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full -translate-x-32 translate-y-32" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-3 bg-primary border-3 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black uppercase tracking-tighter italic">Flopy</span>
            </div>
            
            <h1 className="text-5xl font-black leading-tight uppercase mb-6 tracking-tighter">
              Únete a la <br /> 
              <span className="text-white bg-primary px-2">Evolución</span> <br />
              del Dev.
            </h1>
            <p className="text-muted-foreground font-bold text-lg max-w-xs leading-relaxed">
              Crea tu cuenta en segundos y empieza a desplegar con el poder de Flopy.
            </p>
          </div>

          <div className="relative z-10 flex gap-2">
             <div className="w-12 h-2 bg-primary border-2 border-border" />
             <div className="w-4 h-2 bg-primary/30 border-2 border-border" />
             <div className="w-4 h-2 bg-primary/30 border-2 border-border" />
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex-1 flex flex-col p-8 lg:p-16 relative bg-card">
          <div className="flex justify-start mb-8">
            <Link href="/login" className="group flex items-center gap-2 text-xs font-black uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
            </Link>
          </div>

          <div className="max-w-sm mx-auto w-full flex-1 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Nueva Cuenta</h2>
              <p className="text-muted-foreground font-bold text-sm uppercase tracking-tight">Empieza tu viaje hoy mismo</p>
            </div>

            {error && (
               <div className="mb-6 bg-destructive/10 border-4 border-destructive p-4 text-destructive text-[11px] font-black uppercase flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="bg-destructive text-white p-1 border-2 border-border shadow-block">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span>Error: {error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    id="name" 
                    placeholder="Andres Perez" 
                    className="flex h-10 w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-10 border-2 border-border font-bold text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    className="flex h-10 w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-10 border-2 border-border font-bold text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    id="password" 
                    type="password" 
                    className="flex h-10 w-full bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 h-10 border-2 border-border font-bold text-black"
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
                className="w-full h-12 bg-secondary text-black font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none mt-4"
                disabled={isLoading}
              >
                {isLoading ? '...' : 'Crear Cuenta'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
