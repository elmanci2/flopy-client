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

         {/* Hero Stats */}
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
                        <p className="text-3xl font-black mt-1 leading-none">{stat.value}</p>
                     </div>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:rotate-12 transition-transform">
                     <stat.icon className="w-full h-full" />
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Adoption Chart Mock */}
            <div className="lg:col-span-2 bg-white border-4 border-black p-8 shadow-block">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black uppercase italic flex items-center gap-2">
                     <TrendingUp className="w-5 h-5 text-primary" />
                     Adopción de Versiones (Últimos 7 días)
                  </h3>
                  <div className="flex gap-2 text-[8px] font-black uppercase">
                     <span className="flex items-center gap-1"><div className="w-2 h-2 bg-primary" /> v2.4.0</span>
                     <span className="flex items-center gap-1"><div className="w-2 h-2 bg-secondary" /> v2.3.1</span>
                  </div>
               </div>

               <div className="h-64 flex items-end gap-4 overflow-hidden">
                  {[40, 65, 45, 90, 75, 80, 95].map((h, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative bg-muted/30 border-t-2 border-black/10 h-full flex items-end">
                           <div
                              className="w-full bg-primary border-2 border-black transition-all hover:brightness-110 shadow-block group-hover:shadow-none"
                              style={{ height: `${h}%` }}
                           />
                        </div>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase italic px-1">Día {i + 1}</span>
                     </div>
                  ))}
               </div>
            </div>

            {/* OS Distribution */}
            <div className="bg-white border-4 border-black p-8 shadow-block">
               <h3 className="text-sm font-black uppercase italic mb-8 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Plataformas (Activas)
               </h3>
               <div className="space-y-8">
                  {[
                    { label: 'iOS Devices', value: 68, color: 'bg-black' },
                    { label: 'Android Devices', value: 32, color: 'bg-primary' },
                  ].map((p, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase">
                          <span>{p.label}</span>
                          <span>{p.value}%</span>
                       </div>
                       <div className="w-full h-6 bg-[#f0f0f0] border-2 border-black p-0.5 overflow-hidden shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                          <div 
                            className={`h-full ${p.color} border-r-2 border-black transition-all duration-1000`}
                            style={{ width: `${p.value}%` }} 
                          />
                       </div>
                    </div>
                  ))}
               </div>

               <div className="mt-12 pt-8 border-t-2 border-dashed border-black/10">
                  <h4 className="text-[10px] font-black uppercase opacity-40 mb-4">Versión del Binario</h4>
                  <div className="space-y-3">
                     {[
                        { v: 'v1.2.0', p: 85 },
                        { v: 'v1.1.8', p: 12 },
                        { v: 'v1.1.0', p: 3 },
                     ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px] font-black uppercase">
                           <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-black" /> {item.v}</span>
                           <span className="text-primary">{item.p}%</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Global Distribution Map Mock */}
         <div className="bg-black text-white border-4 border-black p-10 shadow-block relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Alcance Global de Flopy</h3>
                  <p className="text-xs font-bold text-white/60 uppercase leading-relaxed max-w-sm">
                     Tus aplicaciones han desplegado <span className="text-primary">82.3 TB</span> de actualizaciones en <span className="text-secondary">42 países</span> durante este mes.
                  </p>
                  <button className="px-6 py-3 border-2 border-primary text-primary font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
                     Ver Mapa de Calor
                  </button>
               </div>
               <div className="bg-primary/20 p-8 border-4 border-primary border-dashed group-hover:bg-primary/30 transition-colors">
                  <div className="flex items-center gap-6">
                     <Globe className="w-16 h-16 animate-spin-slow" />
                     <div>
                        <p className="text-4xl font-black italic">42</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Regiones Activas</p>
                     </div>
                  </div>
               </div>
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none select-none overflow-hidden">
               <div className="text-[200px] font-black -rotate-12 translate-x-1/4 translate-y-1/4">METRICS</div>
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
