import { BrowserRouter as Router } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import AppRoutes from "@/routes"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { NotificationProvider } from "@/contexts/notification-context"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="chef-restaurant-theme">
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Router>
              <div className="app-container">
                <div className="app-background" />
                <AppRoutes />
                <Toaster />
              </div>
            </Router>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App