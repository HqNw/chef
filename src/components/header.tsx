"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ShoppingCart, User, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const { items } = useCart()
  const location = useLocation()

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "القائمة", path: "/menu" },
    { name: "من نحن", path: "/about-us" },
    { name: "اتصل بنا", path: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300 glass-header",
        isScrolled ? "py-2 shadow-md" : "py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          مطعم الشيف
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-4 py-2 rounded-md transition-colors hover:text-primary",
                location.pathname === link.path ? "text-primary font-medium" : "text-foreground/80",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="relative group">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link to="/account" className="block px-4 py-2 text-sm hover:bg-muted">
                  حسابي
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-muted">
                    لوحة التحكم
                  </Link>
                )}
                <button onClick={logout} className="block w-full text-right px-4 py-2 text-sm hover:bg-muted">
                  تسجيل الخروج
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                تسجيل الدخول
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
          >
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-card shadow-xl p-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="text-2xl font-bold">
                  مطعم الشيف
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-4 py-2 rounded-md transition-colors",
                      location.pathname === link.path
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/80 hover:bg-muted",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}

                {!user && (
                  <>
                    <Link to="/login" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-center">
                      تسجيل الدخول
                    </Link>
                    <Link to="/register" className="px-4 py-2 rounded-md border border-input text-center">
                      إنشاء حساب
                    </Link>
                  </>
                )}

                {user && (
                  <>
                    <Link to="/account" className="px-4 py-2 rounded-md hover:bg-muted">
                      حسابي
                    </Link>
                    {user.role === "admin" && (
                      <Link to="/admin" className="px-4 py-2 rounded-md hover:bg-muted">
                        لوحة التحكم
                      </Link>
                    )}
                    <button onClick={logout} className="px-4 py-2 rounded-md text-right w-full hover:bg-muted">
                      تسجيل الخروج
                    </button>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
