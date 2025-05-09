import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "customer" | "staff"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      fetchCurrentUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/auth/me")
      setUser(response.data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
      localStorage.removeItem("token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.post("/auth/login", { email, password })
      localStorage.setItem("token", response.data.token)
      setUser(response.data.user)
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً بك ${response.data.user.name}`,
      })
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "فشل تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.post("/auth/register", { name, email, password })
      localStorage.setItem("token", response.data.token)
      setUser(response.data.user)
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً بك ${response.data.user.name}`,
      })
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "فشل إنشاء الحساب",
        description: "يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast({
      title: "تم تسجيل الخروج",
      description: "نتمنى رؤيتك مرة أخرى قريباً",
    })
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      const response = await api.put("/auth/me", userData)
      setUser(response.data)
      toast({
        title: "تم تحديث البيانات بنجاح",
      })
    } catch (error) {
      console.error("Update failed:", error)
      toast({
        title: "فشل تحديث البيانات",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
