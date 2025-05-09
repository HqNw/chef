"use client"

import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, ShoppingBag, Users, Tag, BarChart, Settings, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AdminSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const AdminSidebar = ({ open, setOpen }: AdminSidebarProps) => {
  const location = useLocation()
  const { logout } = useAuth()

  const navItems = [
    { name: "لوحة التحكم", path: "/admin", icon: LayoutDashboard },
    { name: "الطلبات", path: "/admin/orders", icon: ShoppingBag },
    { name: "المنتجات", path: "/admin/products", icon: ShoppingBag },
    { name: "العملاء", path: "/admin/customers", icon: Users },
    { name: "العروض", path: "/admin/offers", icon: Tag },
    { name: "التحليلات", path: "/admin/analytics", icon: BarChart },
    { name: "الإعدادات", path: "/admin/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        id="admin-sidebar"
        className={cn(
          "fixed top-0 bottom-0 right-0 z-50 w-64 bg-sidebar text-sidebar-foreground border-l border-sidebar-border transition-transform md:translate-x-0 md:relative md:z-0",
          open ? "translate-x-0" : "translate-x-full",
        )}
        initial={false}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-xl font-bold">لوحة التحكم</h2>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="w-5 h-5 ml-2" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 transition-colors rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="w-5 h-5 ml-2" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

export default AdminSidebar
