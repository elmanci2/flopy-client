"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  Plus, 
  Rocket, 
  ChevronRight, 
  Search,
  Box,
  Tag,
  Calendar,
  Layers,
  DownloadCloud,
  ExternalLink,
  ShieldAlert
} from 'lucide-react'

import { Release, App, DeploymentKey } from '@/types'
import { flopyApi } from '@/lib/api-client'

export default function ReleasesPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [releases, setReleases] = useState<Release[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch All Releases (assuming the server has a /releases endpoint for the user)
        // If not, we iterate apps and fetch their releases.
        const appsData = await flopyApi.get<App[]>('/apps', user?.token)
        setApps(appsData)

        let allReleases: Release[] = []
        for (const app of appsData) {
          const appReleases = await flopyApi.get<Release[]>(`/apps/${app.id}/releases`, user?.token)
          allReleases = [...allReleases, ...appReleases]
        }
        
        setReleases(allReleases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (err: any) {
        console.error('Fetch Releases Error:', err)
        // No mock data - only real server data
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.token) fetchData()
  }, [user?.token])

  const filteredReleases = releases.filter(r => {
    const appName = apps.find(a => a.id === r.appId)?.name || ''
    const version = r.version || ''
    return version.includes(searchTerm) || appName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getAppName = (appId: string) => apps.find(a => a.id === appId)?.name || 'App Desconocida'

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Rocket className="w-10 h-10 text-primary" />
              Historial de Lanzamientos
           </h1>
           <p className="font-bold text-muted-foreground uppercase text-xs tracking-widest mt-1">
              Monitorea cada bit desplegado en tus aplicaciones
           </p>
        </div>

        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar versión o App..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-3 border-black p-3 pl-10 font-bold text-sm shadow-block focus:translate-y-[-2px] transition-all outline-none w-full md:w-64"
              />
           </div>
           
           <button 
             onClick={() => router.push('/dashboard/apps')}
             className="bg-primary text-white border-3 border-black px-6 py-3 font-black uppercase text-xs shadow-block hover:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
           >
             <Plus className="w-5 h-5" /> Nuevo Release
           </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Releases', value: releases.length, color: 'bg-white' },
          { label: 'Lanzados hoy', value: '0', color: 'bg-white' },
          { label: 'Criticos (Mandatory)', value: releases.filter(r => r.isMandatory).length, color: 'bg-destructive/10 text-destructive' },
          { label: 'Apps Activas', value: apps.length, color: 'bg-white' },
        ].map((s, idx) => (
          <div key={idx} className={`${s.color} border-4 border-black p-6 shadow-block`}>
            <p className="text-[10px] font-black uppercase opacity-60 m-0">{s.label}</p>
            <p className="text-3xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Releases List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border-4 border-black shadow-block">
             <DownloadCloud className="w-12 h-12 animate-bounce text-primary mb-4" />
             <p className="font-black uppercase text-xs">Cargando línea de tiempo...</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white border-4 border-black shadow-block">
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#f0f0f0] border-b-4 border-black">
                   <tr className="text-[10px] font-black uppercase">
                      <th className="p-4">Versión</th>
                      <th className="p-4">Aplicación</th>
                      <th className="p-4">Tipo / Estado</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4 text-right">Acciones</th>
                   </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/10">
                   {filteredReleases.map((r) => (
                      <tr key={r.id} className="group hover:bg-muted/30 transition-colors">
                         <td className="p-4">
                            <div className="flex items-center gap-2 font-black">
                               <Tag className="w-4 h-4 text-primary" />
                               {r.version}
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex flex-col">
                               <span className="text-xs font-black uppercase">{getAppName(r.appId)}</span>
                               <span className="text-[10px] font-mono opacity-50">{r.appId}</span>
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-2">
                               {r.isMandatory ? (
                                  <span className="bg-destructive text-white text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black">Mandatory</span>
                               ) : (
                                  <span className="bg-secondary text-black text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black">Standard</span>
                               )}
                               <span className="flex items-center gap-1 text-[9px] font-black uppercase text-green-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-current" /> Activo
                               </span>
                            </div>
                         </td>
                         <td className="p-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                               <Calendar className="w-3.5 h-3.5" />
                               {new Date(r.createdAt).toLocaleDateString()}
                            </div>
                         </td>
                         <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => router.push(`/dashboard/apps/${r.appId}`)}
                                 className="p-2 border-2 border-black hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none translate-y-[-2px] active:translate-y-0"
                               >
                                 <ExternalLink className="w-4 h-4" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
             {filteredReleases.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                   <Layers className="w-12 h-12 opacity-10" />
                   <p className="font-black uppercase text-xs text-muted-foreground/30">No se encontraron lanzamientos que coincidan</p>
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  )
}
