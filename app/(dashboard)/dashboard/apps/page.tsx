"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  Plus, 
  Trash2, 
  ExternalLink, 
  AlertCircle,
  Clock,
  Layout,
  RefreshCcw,
  Box
} from 'lucide-react'

import { App } from '@/types'
import { flopyApi } from '@/lib/api-client'

export default function AppsPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [apps, setApps] = useState<App[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newAppName, setNewAppName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  // Fetch Apps
  const fetchApps = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await flopyApi.get<App[]>('/apps', user?.token)
      setApps(data)
    } catch (err: any) {
      console.error('Fetch Apps Error:', err)
      
      if (err.status === 401) {
        localStorage.removeItem('flopy_user')
        setError('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión para continuar.')
        return
      }

      setError(err.message)
      // MOCK FALLBACK FOR DEV
      if (apps.length === 0 && !err.message.includes('sesión')) {
        setApps([
          { id: '1', name: 'Flopy Project Alpha', ownerId: '1', createdAt: new Date().toISOString() },
          { id: '2', name: 'Mobile App Beta', ownerId: '1', createdAt: new Date().toISOString() },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token) fetchApps()
  }, [user?.token])

  // Create App
  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAppName.trim()) return

    setIsCreating(true)
    setError(null)
    try {
      await flopyApi.post('/apps', { name: newAppName }, user?.token)
      setNewAppName('')
      fetchApps()
    } catch (err: any) {
      console.error('Create App Error:', err)
      if (err.status === 401) {
         setError('Token inválido o expirado. REINICIA SESIÓN.')
         return
      }
      
      setError(err.message)
      if (err.message.includes('fetch') || err.message.includes('API Error')) {
         const mockNewApp = { 
           id: `mock_${Math.random().toString(36).substr(2, 9)}`, 
           name: newAppName, 
           ownerId: '1', 
           createdAt: new Date().toISOString() 
         }
         setApps(prev => [mockNewApp, ...prev])
         setNewAppName('')
      }
    } finally {
      setIsCreating(false)
    }
  }

  // Delete App
  const handleDeleteApp = async (id: string) => {
    try {
      await flopyApi.delete(`/apps/${id}`, user?.token)
      fetchApps()
    } catch (err) {
      setApps(prev => prev.filter(app => app.id !== id))
    } finally {
      setShowDeleteModal(null)
    }
  }

  const isMockToken = user?.token === 'mock_token'

  return (
    <div className="p-8 max-w-7xl mx-auto relative min-h-[calc(100vh-80px)]">
      {/* Dev Mode Banner */}
      {isMockToken && (
        <div className="mb-8 bg-yellow-400 border-4 border-black p-3 flex items-center justify-between shadow-block animate-pulse">
           <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-tighter">
             <AlertCircle className="w-4 h-4" />
             Modo Desarrollo / Token Simulado Activo
           </div>
           <p className="text-[9px] font-bold uppercase opacity-70">La API real rechazará estas peticiones</p>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Mis Aplicaciones</h1>
          <p className="font-bold text-muted-foreground uppercase text-xs tracking-widest mt-1">
            Gestiona tus contenedores de despliegue OTA
          </p>
        </div>
        
        <form onSubmit={handleCreateApp} className="flex gap-2">
           <input 
             type="text" 
             placeholder="Nombre del Proyecto..."
             className="bg-white border-3 border-black p-3 font-bold text-sm shadow-block focus:translate-y-[-2px] transition-all outline-none md:w-64"
             value={newAppName}
             onChange={(e) => setNewAppName(e.target.value)}
             required
           />
           <button 
             type="submit" 
             disabled={isCreating}
             className="bg-primary text-white border-3 border-black p-3 font-black uppercase text-xs shadow-block hover:shadow-none active:translate-y-1 transition-all disabled:opacity-50"
           >
             {isCreating ? '...' : <Plus className="w-5 h-5" />}
           </button>
        </form>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-8 max-w-sm w-full shadow-[12px_12px_0_0_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-destructive/10 border-3 border-destructive text-destructive flex items-center justify-center mb-6 mx-auto shadow-block">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black uppercase text-center mb-2 tracking-tighter">¿Eliminar Aplicación?</h3>
            <p className="text-sm font-bold text-muted-foreground text-center mb-8 uppercase tracking-tight leading-tight">
              Esta acción es irreversible y detendrá todos los servicios OTA vinculados.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 py-3 border-3 border-black font-black uppercase text-xs hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDeleteApp(showDeleteModal)}
                className="flex-1 py-3 bg-destructive text-white border-3 border-black font-black uppercase text-xs shadow-block hover:shadow-none active:translate-y-1 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-8 bg-destructive/10 border-4 border-destructive p-4 text-destructive text-[11px] font-black uppercase flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-3">
            <div className="bg-destructive text-white p-1 border-2 border-border shadow-block">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span>Error: {error}</span>
          </div>
          {(error.includes('sesión') || error.includes('Token')) && (
            <button 
              onClick={() => {
                localStorage.removeItem('flopy_user')
                window.location.href = '/login'
              }}
              className="px-4 py-2 bg-destructive text-white border-2 border-black font-black uppercase shadow-block active:translate-y-1 active:shadow-none transition-all"
            >
              Reiniciar Sesión
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-black/10">
          <RefreshCcw className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Sincronizando con Flopy Cloud...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {apps.map((app) => (
             <div key={app.id} className="bg-white border-4 border-black p-6 shadow-block relative group hover:translate-y-[-4px] transition-transform">
               <div className="flex justify-between items-start mb-6">
                 <div className="w-10 h-10 bg-secondary border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                   <Box className="w-5 h-5" />
                 </div>
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => router.push(`/dashboard/apps/${app.id}`)}
                      className="p-1 hover:bg-muted" 
                      title="Ver Detalles"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setShowDeleteModal(app.id)}
                      className="p-1 hover:text-destructive" 
                      title="Eliminar Aplicación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               </div>

               <h3 className="text-xl font-black uppercase truncate mb-2">{app.name}</h3>
               
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                    <Clock className="w-3 h-3" />
                    Creado {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="bg-[#f0f0f0] border-2 border-black p-4 flex flex-col gap-2">
                     <p className="text-[10px] font-black uppercase opacity-50">App ID</p>
                     <p className="text-[11px] font-mono font-bold break-all">{app.id}</p>
                  </div>
               </div>

               <button 
                 onClick={() => router.push(`/dashboard/apps/${app.id}`)}
                 className="mt-8 w-full py-4 bg-primary text-white font-black uppercase text-xs tracking-widest border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none active:translate-y-1 transition-all text-center"
               >
                  Gestionar Despliegues
               </button>
             </div>
           ))}

           {apps.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white border-4 border-dashed border-black/20 text-center">
                 <Layout className="w-12 h-12 text-muted-foreground/20 mb-4" />
                 <h3 className="text-xl font-black uppercase text-muted-foreground/40 italic">Aún no tienes aplicaciones</h3>
                 <p className="font-bold text-muted-foreground/30 uppercase text-xs mt-2">Crea tu primer proyecto arriba para comenzar</p>
              </div>
           )}
        </div>
      )}
    </div>
  )
}
