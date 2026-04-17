"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  Zap, 
  Search,
  Box,
  Key,
  Copy,
  Check,
  Globe,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Terminal
} from 'lucide-react'

import { App, DeploymentKey } from '@/types'
import { flopyApi } from '@/lib/api-client'

export default function DeploymentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [apps, setApps] = useState<App[]>([])
  const [keys, setKeys] = useState<DeploymentKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const appsData = await flopyApi.get<App[]>('/apps', user?.token)
        setApps(appsData)

        let allKeys: DeploymentKey[] = []
        for (const app of appsData) {
          const appKeys = await flopyApi.get<DeploymentKey[]>(`/apps/${app.id}/deployments`, user?.token)
          allKeys = [...allKeys, ...appKeys]
        }
        
        setKeys(allKeys)
      } catch (err: any) {
        console.error('Fetch Deployments Error:', err)
        // Mock fallback
        if (keys.length === 0) {
           setKeys([
             { id: 'k1', channel: 'Production', key: 'pk_prod_82374928374', appId: 'app1', createdAt: new Date().toISOString() },
             { id: 'k2', channel: 'Staging', key: 'pk_stg_1122334455', appId: 'app2', createdAt: new Date().toISOString() }
           ])
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.token) fetchData()
  }, [user?.token])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const getAppName = (appId: string) => apps.find(a => a.id === appId)?.name || 'App Desconocida'

  const filteredKeys = keys.filter(k => {
    const appName = getAppName(k.appId)
    return k.channel.toLowerCase().includes(searchTerm.toLowerCase()) || 
           appName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           k.key.includes(searchTerm)
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <Zap className="w-10 h-10 text-primary" />
              Gestión de Canales
           </h1>
           <p className="font-bold text-muted-foreground uppercase text-xs tracking-widest mt-1">
              Controla las llaves de acceso a tus despliegues remotos
           </p>
        </div>

        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar canal, app o key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-3 border-black p-3 pl-10 font-bold text-sm shadow-block focus:translate-y-[-2px] transition-all outline-none w-full md:w-64"
              />
           </div>
           <button 
             onClick={() => router.push('/dashboard/apps')}
             className="bg-primary text-white border-3 border-black px-6 py-3 font-black uppercase text-xs shadow-block hover:shadow-none active:translate-y-1 transition-all"
           >
             Configurar Apps
           </button>
        </div>
      </div>

      {/* Grid of Key Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-black/10">
          <Terminal className="w-8 h-8 animate-pulse text-primary mb-4" />
          <p className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Escaneando infraestructura...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredKeys.map((k) => (
             <div key={k.id} className="bg-white border-4 border-black p-6 shadow-block group hover:translate-y-[-4px] transition-transform">
                <div className="flex justify-between items-start mb-6">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className={cn(
                           "text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
                           k.channel.toLowerCase() === 'production' ? "bg-primary text-white" : "bg-secondary text-black"
                         )}>
                            {k.channel}
                         </span>
                         <Globe className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-tight truncate max-w-[180px]">
                         {getAppName(k.appId)}
                      </h3>
                   </div>
                   <button 
                     onClick={() => router.push(`/dashboard/apps/${k.appId}`)}
                     className="p-1 hover:bg-muted border-2 border-transparent hover:border-black transition-all"
                   >
                      <ArrowUpRight className="w-5 h-5" />
                   </button>
                </div>

                <div className="bg-[#f0f0f0] border-2 border-black p-4 space-y-3">
                   <div className="flex items-center justify-between">
                      <p className="text-[9px] font-black uppercase opacity-40">Deployment Key</p>
                      <ShieldCheck className="w-3 h-3 text-green-600" />
                   </div>
                   <div className="flex items-center justify-between gap-4">
                      <code className="text-[11px] font-mono font-bold truncate select-all">{k.key}</code>
                      <button 
                        onClick={() => copyToClipboard(k.key)}
                        className="shrink-0 p-1.5 bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[1px] hover:bg-muted transition-all"
                      >
                         {copiedKey === k.key ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                   </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-dashed border-black/10 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Box className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[9px] font-bold text-muted-foreground uppercase truncate w-32">{k.appId}</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[9px] font-black uppercase tracking-tighter">Ready</span>
                   </div>
                </div>
             </div>
           ))}

           {filteredKeys.length === 0 && (
             <div className="col-span-full border-4 border-dashed border-black/10 py-20 flex flex-col items-center justify-center opacity-30">
                <Key className="w-12 h-12 mb-4" />
                <p className="font-black uppercase text-xs">No se encontraron canales que coincidan</p>
             </div>
           )}
        </div>
      )}
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
