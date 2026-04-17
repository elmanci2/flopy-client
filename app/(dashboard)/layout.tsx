"use client"

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { 
  LayoutDashboard, 
  Box, 
  Rocket, 
  Activity, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Zap,
  Shield,
  Layers
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  active?: boolean
  collapsed?: boolean
}

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: SidebarItemProps) => (
  <Link 
    href={href}
    className={cn(
      "flex items-center gap-4 p-3 font-bold uppercase text-[10px] tracking-widest transition-all border-2 border-transparent",
      active 
        ? "bg-primary text-white border-black shadow-block translate-x-1" 
        : "hover:bg-muted text-muted-foreground hover:text-foreground",
      collapsed && "justify-center px-0"
    )}
  >
    <Icon className="w-5 h-5 shrink-0" />
    {!collapsed && <span>{label}</span>}
  </Link>
)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { group: "General", items: [
      { icon: LayoutDashboard, label: "Panel", href: "/dashboard" },
    ]},
    { group: "Despliegue", items: [
      { icon: Box, label: "Mis Aplicaciones", href: "/dashboard/apps" },
      { icon: Rocket, label: "Lanzamientos", href: "/dashboard/releases" },
      { icon: Zap, label: "Deployments", href: "/dashboard/deployments" },
    ]},
    { group: "Análisis", items: [
      { icon: Activity, label: "Métricas", href: "/dashboard/metrics" },
      { icon: Shield, label: "Auditoría", href: "/dashboard/logs" },
    ]},
    { group: "Cuenta", items: [
      { icon: Settings, label: "Ajustes", href: "/dashboard/settings" },
    ]}
  ]

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex">
      {/* Sidebar Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r-4 border-black transition-all flex flex-col sticky top-0 h-screen z-50",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 border-b-4 border-black flex items-center justify-between overflow-hidden">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="font-black italic uppercase text-lg tracking-tighter">Flopy</span>
            </div>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-muted border-2 border-black bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:shadow-none active:translate-y-[1px]"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-8">
          {menuItems.map((group, idx) => (
            <div key={idx} className="space-y-2">
              {!collapsed && (
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-3 mb-4">
                  {group.group}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, i) => (
                  <SidebarItem 
                    key={i} 
                    {...item} 
                    active={pathname === item.href} 
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t-4 border-black bg-muted/30">
           {!collapsed && (
             <div className="mb-4 px-3">
               <p className="text-[10px] font-black uppercase text-muted-foreground truncate">{user?.email}</p>
             </div>
           )}
           <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 font-bold uppercase text-[10px] tracking-widest text-destructive hover:bg-destructive hover:text-white transition-all border-2 border-transparent border-dashed hover:border-solid hover:border-black"
           >
             <LogOut className="w-5 h-5" />
             {!collapsed && <span>Cerrar Sesión</span>}
           </button>
        </div>
      </aside>

      {/* Main Area Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Header */}
        <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-8 sticky top-0 z-40">
           <div>
             <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Box className="w-4 h-4 text-primary" />
                Espacio de Trabajo / <span className="text-muted-foreground">Flopy Cloud</span>
             </h2>
           </div>

           <div className="flex items-center gap-4">
             <button className="flex items-center gap-2 px-4 py-2 bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-colors shadow-block active:shadow-none active:translate-y-1">
               <Plus className="w-4 h-4" />
               Nuevo Proyecto
             </button>
           </div>
        </header>

        {/* Content Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
