import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"

interface DashboardStats {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  salesGrowth: number
  ordersGrowth: number
  customersGrowth: number
}

interface RecentOrder {
  id: number
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

interface TopProduct {
  id: number
  name: string
  total_sold: number
  revenue: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/recent-orders"),
          api.get("/dashboard/top-products"),
        ])

        setStats(statsRes.data)
        setRecentOrders(ordersRes.data)
        setTopProducts(productsRes.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Placeholder data for demo
  const placeholderStats: DashboardStats = {
    totalSales: 24500,
    totalOrders: 156,
    totalCustomers: 89,
    averageOrderValue: 157.05,
    salesGrowth: 12.5,
    ordersGrowth: 8.2,
    customersGrowth: 15.3,
  }

  const placeholderRecentOrders: RecentOrder[] = [
    {
      id: 1001,
      customer_name: "أحمد محمد",
      total_amount: 185.5,
      status: "completed",
      created_at: "2023-06-15T14:30:00",
    },
    {
      id: 1002,
      customer_name: "سارة علي",
      total_amount: 120.75,
      status: "delivering",
      created_at: "2023-06-15T15:45:00",
    },
    {
      id: 1003,
      customer_name: "محمد خالد",
      total_amount: 210.25,
      status: "processing",
      created_at: "2023-06-15T16:20:00",
    },
    {
      id: 1004,
      customer_name: "فاطمة أحمد",
      total_amount: 95.0,
      status: "pending",
      created_at: "2023-06-15T17:10:00",
    },
  ]

  const placeholderTopProducts: TopProduct[] = [
    {
      id: 101,
      name: "برجر لحم أنجوس",
      total_sold: 48,
      revenue: 3840,
    },
    {
      id: 102,
      name: "بيتزا مارجريتا",
      total_sold: 42,
      revenue: 2940,
    },
    {
      id: 103,
      name: "مشاوي مشكلة",
      total_sold: 36,
      revenue: 4320,
    },
    {
      id: 104,
      name: "كنافة بالقشطة",
      total_sold: 30,
      revenue: 1800,
    },
  ]

  const displayStats = stats || placeholderStats
  const displayRecentOrders = recentOrders.length > 0 ? recentOrders : placeholderRecentOrders
  const displayTopProducts = topProducts.length > 0 ? topProducts : placeholderTopProducts

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-50 dark:bg-green-900/20"
      case "delivering":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
      case "processing":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
      case "pending":
        return "text-orange-500 bg-orange-50 dark:bg-orange-900/20"
      case "cancelled":
        return "text-red-500 bg-red-50 dark:bg-red-900/20"
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتمل"
      case "delivering":
        return "قيد التوصيل"
      case "processing":
        return "قيد التحضير"
      case "pending":
        return "قيد الانتظار"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(displayStats.totalSales)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {displayStats.salesGrowth > 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {displayStats.salesGrowth}% من الشهر الماضي
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(displayStats.salesGrowth)}% من الشهر الماضي
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {displayStats.ordersGrowth > 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {displayStats.ordersGrowth}% من الشهر الماضي
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(displayStats.ordersGrowth)}% من الشهر الماضي
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayStats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {displayStats.customersGrowth > 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {displayStats.customersGrowth}% من الشهر الماضي
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(displayStats.customersGrowth)}% من الشهر الماضي
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">متوسط قيمة الطلب</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(displayStats.averageOrderValue)}</div>
            <p className="text-xs text-muted-foreground mt-1">لكل طلب</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>أحدث الطلبات</CardTitle>
            <CardDescription>آخر الطلبات المستلمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-sm font-medium">#{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium">{formatPrice(order.total_amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/admin/orders" className="text-sm text-primary hover:underline">
                عرض جميع الطلبات
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
            <CardDescription>أفضل المنتجات أداءً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayTopProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.total_sold} وحدة مباعة</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(product.revenue)}</p>
                    <p className="text-xs text-muted-foreground">الإيرادات</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/admin/products" className="text-sm text-primary hover:underline">
                عرض جميع المنتجات
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>تحليل المبيعات</CardTitle>
          <CardDescription>مبيعات آخر 7 أيام</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            <span className="text-muted-foreground mr-2">هنا يتم عرض رسم بياني للمبيعات</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
