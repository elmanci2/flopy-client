"use client"

import { useAuth } from "@/context/AuthContext"
import { Rocket, Box, Zap, Activity, ArrowUpRight } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    { label: "Apps Activas", value: "0", icon: Box, color: "bg-blue-500" },
    { label: "Despliegues", value: "0", icon: Rocket, color: "bg-purple-500" },
    { label: "OTA Canales", value: "2", icon: Zap, color: "bg-yellow-500" },
    { label: "Request/sec", value: "0.0", icon: Activity, color: "bg-green-500" },
  ]

  return (
    <main className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="text-6xl font-black uppercase tracking-tighter leading-none italic">
          Bienvenido, <br />
          <span className="text-primary not-italic">{user?.name}</span>
        </h1>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-sm max-w-xl leading-relaxed">
          Tu infraestructura de actualizaciones OTA está lista. Gestiona tus aplicaciones y despliega versiones con la potencia de Flopy.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border-4 border-black p-6 shadow-block group hover:translate-y-[-4px] transition-transform">
            <div className={`w-12 h-12 ${stat.color} border-3 border-black shadow-block mb-6 flex items-center justify-center text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black tabular-nums">{stat.value}</h3>
          </div>
        ))}
      </section>

      {/* Quick Actions / Recent info */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border-4 border-black p-8 shadow-block">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black uppercase italic tracking-tight">Últimos Lanzamientos</h2>
            <button className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1">
              Ver Historial <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-12 border-4 border-dashed border-muted-foreground/20 rounded-2xl">
            <Rocket className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="font-bold text-muted-foreground/40 uppercase text-xs">No se han detectado publicaciones recientes</p>
          </div>
        </div>

        <div className="bg-primary text-white border-4 border-black p-8 shadow-block relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black uppercase mb-4 leading-tight italic">
                ¿Listo para lanzar <br /> tu primera App?
              </h2>
              <p className="font-bold text-white/70 uppercase text-xs max-w-xs leading-relaxed">
                Empieza por crear un contenedor para tu aplicación y configurar el canal de despliegue.
              </p>
            </div>
            <button className="mt-8 bg-white text-black py-4 px-8 font-black uppercase text-xs tracking-widest border-3 border-black shadow-block hover:shadow-none translate-y-[-4px] active:translate-y-0 transition-all w-full sm:w-max">
              Comenzar Ahora
            </button>
          </div>
          {/* Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rotate-45 translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-8 translate-y-8" />
        </div>
      </section>
    </main>
  )
}
