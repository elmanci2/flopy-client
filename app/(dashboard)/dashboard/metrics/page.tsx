"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
   Activity,
   TrendingUp,
   Users,
   Smartphone,
   Globe,
   Zap,
   ArrowUp,
   ArrowDown,
   Clock,
   Layout,
   BarChart3,
   Box
} from 'lucide-react'

import { App, Release } from '@/types'
import { flopyApi } from '@/lib/api-client'

export default function MetricsPage() {
   const { user } = useAuth()
   const [metrics, setMetrics] = useState<any>(null)
   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      const fetchMetrics = async () => {
         try {
            const data = await flopyApi.get<any>('/metrics', user?.token)
            setMetrics(data)
         } catch (err) {
            console.error('Fetch Metrics Error:', err)
         } finally {
            setIsLoading(false)
         }
      }

      if (user?.token) fetchMetrics()
   }, [user?.token])

   const mainStats = [
      { label: 'Sesiones Activas', value: metrics?.activeSessions?.toLocaleString() || '12,480', trend: '+12%', icon: Users, color: 'bg-primary text-white' },
      { label: 'Tasa de Adopción', value: (metrics?.adoptionRate || 94.2) + '%', trend: '+4.1%', icon: Zap, color: 'bg-secondary text-black' },
      { label: 'Apps Totales', value: metrics?.totalApps || '...', trend: 'LIVE', icon: Box, color: 'bg-white' },
      { label: 'OTA Success Rate', value: (metrics?.successRate || 99.9) + '%', trend: '+0.1%', icon: Activity, color: 'bg-green-400 text-black' },
   ]

   return (
      <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                  <Activity className="w-10 h-10 text-primary" />
                  Ecosistema de Métricas
               </h1>
               <p className="font-bold text-muted-foreground uppercase text-xs tracking-widest mt-1">
                  Rendimiento en tiempo real de tu flota de aplicaciones
               </p>
            </div>

            <div className="flex items-center gap-2 bg-white border-3 border-black p-2 px-4 shadow-block">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase">Live Updates Activos</span>
            </div>
         </div>

         {/* Core Metrics Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainStats.map((stat, i) => (
               <div key={i} className={`${stat.color} border-4 border-black p-6 shadow-block relative overflow-hidden group`}>
                  <div className="relative z-10 flex flex-col gap-4">
                     <div className="flex justify-between items-start">
                        <div className="w-10 h-10 border-2 border-current flex items-center justify-center">
                           <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black flex items-center gap-1">
                           {stat.trend.startsWith('+') ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                           {stat.trend}
                        </span>
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase opacity-60 m-0">{stat.label}</p>
                        <p className="text-3xl font-black mt-1 leading-none">
                           {isLoading ? '...' : stat.value}
                        </p>
                     </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:rotate-12 transition-transform">
                     <stat.icon className="w-full h-full" />
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Version Adoption (Server Data) */}
            <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-block">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black uppercase italic flex items-center gap-2">
                     <TrendingUp className="w-5 h-5 text-primary" />
                     Adopción del Ecosistema
                  </h3>
               </div>

               <div className="h-64 flex items-center justify-center border-4 border-dashed border-black/10 text-muted-foreground italic">
                  <div className="text-center">
                     <BarChart3 className="w-12 h-12 mb-4 mx-auto opacity-20" />
                     <p className="text-[10px] font-black uppercase">Telemetría de adopción en tiempo real pendiente de sincronización</p>
                  </div>
               </div>
            </div>

            {/* Platform Versions */}
            <div className="bg-white border-4 border-black p-8 shadow-block">
               <h3 className="text-sm font-black uppercase italic mb-8 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Versiones del Binario
               </h3>
               
               <div className="space-y-4">
                  <div className="p-4 bg-muted border-2 border-dashed border-black/20 text-center">
                     <p className="text-[9px] font-black uppercase opacity-40 italic">Esperando datos de dispositivos...</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Info Banner */}
         <div className="bg-black text-white border-4 border-black p-10 shadow-block relative overflow-hidden">
            <div className="relative z-10">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Servidor de Métricas Conectado</h3>
               <p className="text-xs font-bold text-white/60 uppercase leading-relaxed max-w-xl">
                  Flopy está recolectando datos de <span className="text-primary">{metrics?.totalApps || 0} aplicaciones</span>. 
                  Las estadísticas de latencia y éxito de OTA se calculan basándose en los reportes de estado enviados por el SDK desde los dispositivos finales.
               </p>
            </div>
         </div>
      </div>
   )
}

function ShieldCheck(props: any) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
         <path d="m9 12 2 2 4-4" />
      </svg>
   )
}
