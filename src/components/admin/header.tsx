"use client"

import { Menu, Bell, Sun, Moon, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useTheme } from "next-themes"

interface AdminHeaderProps {
  onMenuClick: () => void
  logout: () => void
}

const AdminHeader = ({ onMenuClick, logout }: AdminHeaderProps) => {
  const { setTheme, theme } = useTheme()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-card border-border md:px-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick} aria-label="القائمة">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="mr-2 text-lg font-bold truncate md:text-xl md:mr-4">لوحة التحكم</h1>
      </div>
      <div className="flex items-center gap-1 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="الإشعارات">
          <Bell className="w-5 h-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="حسابي">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="صورة المستخدم" />
                <AvatarFallback>مد</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="w-4 h-4 ml-2" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 ml-2" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="w-4 h-4 ml-2" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default AdminHeader
