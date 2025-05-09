import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/auth-context"
import LoadingScreen from "@/components/loading-screen"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "customer" | "staff"
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
