"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  ArrowLeft,
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  ShieldCheck,
  Layout,
  Terminal,
  Activity,
  Box,
  ChevronRight,
  Layers
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { App, DeploymentKey, Release } from '@/types'
import { flopyApi } from '@/lib/api-client'

export default function AppDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [app, setApp] = useState<App | null>(null)
  const [keys, setKeys] = useState<DeploymentKey[]>([])
  const [releases, setReleases] = useState<Release[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newChannel, setNewChannel] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch App Info
      const appData = await flopyApi.get<App>(`/apps/${id}`, user?.token)
      setApp(appData)

      // 2. Fetch Deployment Keys
      const keysData = await flopyApi.get<DeploymentKey[]>(`/apps/${id}/deployments`, user?.token)
      setKeys(keysData)

      // 3. Fetch Releases
      const releasesData = await flopyApi.get<Release[]>(`/apps/${id}/releases`, user?.token)
      setReleases(releasesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (err: any) {
      console.error(err)
      setError(err.message)

      if (err.status === 401) {
        localStorage.removeItem('flopy_user')
        window.location.href = '/login'
        return
      }

      // MOCK DATA
      if (!app) {
        setApp({ id: id as string, name: 'Proyecto de Prueba', ownerId: 'mock', createdAt: new Date().toISOString() })
        setKeys([
          { id: 'k1', channel: 'Production', key: 'pk_prod_82374928374', appId: id as string, createdAt: new Date().toISOString() },
          { id: 'k2', channel: 'Staging', key: 'pk_stg_1122334455', appId: id as string, createdAt: new Date().toISOString() }
        ])
        setReleases([
          { id: 'r1', version: '2.4.0', notes: 'Mejoras en el rendimiento de la cámara y corrección de bugs en login.', appId: id as string, channelId: 'k1', url: '', isMandatory: true, createdAt: new Date().toISOString() }
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.token && id) fetchData()
  }, [user?.token, id])

  const latestRelease = releases[0]

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannel.trim()) return

    try {
      await flopyApi.post(`/apps/${id}/deployments`, { channel: newChannel }, user?.token)
      setNewChannel('')
      fetchData()
    } catch (err: any) {
      console.error('Create Key Error:', err)
      if (err.status === 401) {
        alert('Sesión expirada')
        return
      }

      // Mock add
      const mockKey = {
        id: Math.random().toString(),
        channel: newChannel,
        key: `pk_${newChannel.toLowerCase()}_${Math.random().toString(36).substr(2, 10)}`,
        appId: id as string,
        createdAt: new Date().toISOString()
      }
      setKeys(prev => [...prev, mockKey])
      setNewChannel('')
    }
  }


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(text)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleRollback = async (releaseId: string) => {
    if (!confirm('¿Estás seguro de que deseas hacer rollback a esta versión? La versión actual será desactivada.')) return

    try {
      await flopyApi.post(`/releases/${releaseId}/rollback`, {}, user?.token)
      alert('Rollback completado con éxito')
      fetchData() // Recargar datos para ver el cambio
    } catch (err: any) {
      console.error('Rollback Error:', err)
      alert('Error al realizar el rollback: ' + err.message)
    }
  }

  if (isLoading && !app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent animate-spin rounded-full shadow-block" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 pb-20">
      {/* Breadcrumbs & Actions */}
      <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
        <button
          onClick={() => router.push('/dashboard/apps')}
          className="hover:text-primary flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-foreground">Aplicaciones</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">{app?.name}</span>
      </nav>

      {/* Hero Header */}
      <section className="bg-white border-4 border-black p-8 shadow-block relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary border-3 border-black shadow-block flex items-center justify-center text-white">
                <Box className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter italic">{app?.name}</h1>
            </div>
            <p className="text-muted-foreground font-bold text-xs uppercase tracking-tight ml-15">
              ID del Proyecto: <span className="text-foreground font-mono bg-muted px-2 py-0.5 border-2 border-black/10 select-all">{app?.id}</span>
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-secondary border-2 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <p className="text-[10px] font-black uppercase opacity-60">Instancias</p>
              <p className="text-xl font-black">{releases.length > 0 ? '124' : '0'}</p>
            </div>
            <div className="bg-secondary border-2 border-black p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <p className="text-[10px] font-black uppercase opacity-60">SLA</p>
              <p className="text-xl font-black">100%</p>
            </div>
          </div>
        </div>
        {/* Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -translate-y-32 translate-x-32 rotate-45 pointer-events-none" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Deployment Keys Manager */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border-4 border-black p-8 shadow-block">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-black uppercase tracking-tight italic">Claves de Despliegue</h2>
              </div>
              <form onSubmit={handleCreateKey} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre Canal (ej: Staging)"
                  className="bg-white border-2 border-black p-2 font-bold text-[11px] uppercase tracking-widest outline-none focus:bg-[#f0f0f0] transition-colors"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  required
                />
                <button className="bg-black text-white p-2 border-2 border-black hover:bg-primary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {keys.map((k) => (
                <div key={k.id} className="group relative bg-[#f9f9f9] border-3 border-black p-5 transition-all hover:translate-x-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black">
                        {k.channel}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <Terminal className="w-4 h-4 opacity-30" />
                        <code className="text-xs font-mono font-bold select-all bg-white px-2 py-1 border-2 border-black/5">
                          {k.key}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(k.key)}
                        className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black font-black uppercase text-[9px] tracking-widest shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[2px] hover:bg-muted transition-all"
                      >
                        {copiedKey === k.key ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        {copiedKey === k.key ? 'Copiado!' : 'Copiar Key'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {keys.length === 0 && (
                <div className="text-center py-12 border-4 border-dashed border-black/10 text-muted-foreground/30 font-black uppercase text-xs">
                  No hay claves de despliegue activas
                </div>
              )}
            </div>
          </div>

          {/* Latest Update Visual Info */}
          <div className="bg-white border-4 border-black p-8 shadow-block group">
            <div className="flex items-center justify-between mb-8 overflow-hidden">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                Último Update Lanzado
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowHistory(true)}
                  className="bg-black text-white text-[10px] font-black uppercase px-4 py-2 hover:bg-primary transition-colors flex items-center gap-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
                >
                  <Terminal className="w-3 h-3" />
                  Historial & Rollback
                </button>
                {latestRelease && (
                  <div className="bg-primary text-white text-[10px] font-black uppercase px-3 py-1 border-2 border-black -rotate-2">
                    Versión {latestRelease.version}
                  </div>
                )}
              </div>
            </div>

            {releases[0] ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted p-4 border-2 border-black">
                    <p className="text-[10px] font-black uppercase opacity-60">Descargas</p>
                    <p className="text-2xl font-black">1.2k</p>
                  </div>
                  <div className="bg-muted p-4 border-2 border-black">
                    <p className="text-[10px] font-black uppercase opacity-60">Alcance</p>
                    <p className="text-2xl font-black text-primary">94%</p>
                  </div>
                  <div className="bg-muted p-4 border-2 border-black">
                    <p className="text-[10px] font-black uppercase opacity-60">Errors</p>
                    <p className="text-2xl font-black text-destructive">0</p>
                  </div>
                  <div className="bg-muted p-4 border-2 border-black">
                    <p className="text-[10px] font-black uppercase opacity-60">Tamaño</p>
                    <p className="text-2xl font-black">2.4MB</p>
                  </div>
                </div>

                <div className="bg-secondary/10 border-3 border-dashed border-black p-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors mb-4">Características del Lanzamiento</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase opacity-40">Canal de Despliegue</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs font-black uppercase">{keys.find(k => k.id === latestRelease.channelId)?.channel || 'Producción'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase opacity-40">Criticidad / Tipo</p>
                      <div className="flex items-center gap-2">
                        {latestRelease.isMandatory ? (
                          <span className="bg-destructive text-white text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">Obligatoria</span>
                        ) : (
                          <span className="bg-green-500 text-white text-[9px] font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">Opcional</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase opacity-40">Fecha de Publicación</p>
                      <div className="text-xs font-black uppercase">
                        {new Date(latestRelease.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center border-4 border-dashed border-black/10 text-muted-foreground/20 italic">
                <Activity className="w-12 h-12 mb-4" />
                <p className="font-black uppercase text-xs">Sin actividad de lanzamiento reciente</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white border-4 border-black p-6 shadow-block">
            <h4 className="text-xs font-black uppercase mb-6 border-b-2 border-black pb-2">Estado del Proyecto</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Lanzamientos</span>
                <span className="text-xs font-black">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Uso de Almacenamiento</span>
                <span className="text-xs font-black">0 MB / 50 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Visibilidad</span>
                <span className="text-[9px] font-black uppercase bg-green-100 text-green-800 px-1 border-2 border-green-800">Público</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-block">
            <h4 className="text-xs font-black uppercase mb-6 border-b-2 border-black pb-2">Acciones de Riesgo</h4>
            <div className="space-y-3">
              <button className="w-full py-3 bg-destructive/10 text-destructive border-2 border-destructive font-black uppercase text-[10px] tracking-widest hover:bg-destructive hover:text-white transition-all">
                Archivar Proyecto
              </button>
              <button className="w-full py-3 bg-destructive text-white border-2 border-black font-black uppercase text-[10px] tracking-widest shadow-block hover:shadow-none translate-y-[-2px] active:translate-y-0 transition-all">
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Release History Side Sheet */}
      {showHistory && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-in fade-in transition-all"
            onClick={() => setShowHistory(false)}
          />
          <div className="fixed top-0 right-0 w-full max-w-xl h-full bg-[#f8f8f8] border-l-8 border-black z-[70] shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-8 border-b-4 border-black bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers className="w-8 h-8 text-primary" />
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Historial de Releases</h2>
                  <p className="text-[9px] font-black text-muted-foreground uppercase">{app?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="w-10 h-10 border-3 border-black flex items-center justify-center hover:bg-destructive hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {releases.map((rel, idx) => (
                <div key={rel.id} className={cn(
                  "bg-white border-4 border-black p-6 shadow-block group transition-all",
                  idx === 0 && "ring-4 ring-primary ring-offset-2"
                )}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black italic uppercase">v{rel.version}</span>
                        {idx === 0 && (
                          <span className="bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 border-2 border-black">Active</span>
                        )}
                      </div>
                      <p className="text-[9px] font-black uppercase opacity-40">
                        {new Date(rel.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {idx !== 0 && (
                      <button
                        onClick={() => handleRollback(rel.id)}
                        className="bg-black text-white text-[9px] font-black uppercase px-4 py-2 border-2 border-black flex items-center gap-2 hover:bg-destructive transition-colors shadow-[3px_3px_0_0_rgba(255,50,50,0.3)] active:shadow-none active:translate-y-1"
                      >
                        <ArrowLeft className="w-3 h-3" /> Rollback
                      </button>
                    )}
                  </div>
                  <div className="bg-muted p-4 border-2 border-black border-dashed">
                    <p className="text-xs font-bold leading-relaxed opacity-70">
                      {rel.notes || 'Sin notas de cambio registradas para esta versión.'}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <span className="text-[8px] font-black uppercase p-1 border border-black/20">Hash: {rel.hash.substr(0, 8)}...</span>
                    <span className="text-[8px] font-black uppercase p-1 border border-black/20">Target: {rel.targetBinaryVersion || 'All'}</span>
                  </div>
                </div>
              ))}

              {releases.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center opacity-20 italic">
                  <Box className="w-12 h-12 mb-4" />
                  <p className="font-black uppercase text-xs">No hay versiones previas</p>
                </div>
              )}
            </div>

            <div className="p-8 border-t-4 border-black bg-white">
              <button
                onClick={() => setShowHistory(false)}
                className="w-full bg-black text-white py-4 font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-block active:translate-y-1 active:shadow-none"
              >
                Cerrar Historial
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
