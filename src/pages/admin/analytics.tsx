import { useState } from "react"
import {
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatPrice } from "@/lib/utils"

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("month")

  // Placeholder data for demo
  const salesData = {
    total: 24500,
    growth: 12.5,
    averageOrder: 157.05,
  }

  const ordersData = {
    total: 156,
    growth: 8.2,
    completed: 142,
    cancelled: 14,
  }

  const customersData = {
    total: 89,
    growth: 15.3,
    new: 12,
  }

  const topProducts = [
    { name: "برجر لحم أنجوس", sales: 48, revenue: 3840 },
    { name: "بيتزا مارجريتا", sales: 42, revenue: 2940 },
    { name: "مشاوي مشكلة", sales: 36, revenue: 4320 },
    { name: "كنافة بالقشطة", sales: 30, revenue: 1800 },
    { name: "سلطة سيزر", sales: 28, revenue: 1120 },
  ]

  const topCategories = [
    { name: "برجر", percentage: 30 },
    { name: "بيتزا", percentage: 25 },
    { name: "مشاوي", percentage: 20 },
    { name: "حلويات", percentage: 15 },
    { name: "سلطات", percentage: 10 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">التحليلات</h1>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 ml-2" />
              <SelectValue placeholder="اختر الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">آخر أسبوع</SelectItem>
              <SelectItem value="month">آخر شهر</SelectItem>
              <SelectItem value="quarter">آخر 3 أشهر</SelectItem>
              <SelectItem value="year">آخر سنة</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">تصدير التقرير</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المبيعات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(salesData.total)}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">متوسط قيمة الطلب: {formatPrice(salesData.averageOrder)}</p>
              {salesData.growth > 0 ? (
                <p className="text-xs text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {salesData.growth}%
                </p>
              ) : (
                <p className="text-xs text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(salesData.growth)}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersData.total}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {ordersData.completed} مكتمل, {ordersData.cancelled} ملغي
              </p>
              {ordersData.growth > 0 ? (
                <p className="text-xs text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {ordersData.growth}%
                </p>
              ) : (
                <p className="text-xs text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(ordersData.growth)}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">العملاء</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersData.total}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{customersData.new} عميل جديد</p>
              {customersData.growth > 0 ? (
                <p className="text-xs text-green-500 flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {customersData.growth}%
                </p>
              ) : (
                <p className="text-xs text-red-500 flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  {Math.abs(customersData.growth)}%
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales">المبيعات</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="customers">العملاء</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل المبيعات</CardTitle>
              <CardDescription>
                إجمالي المبيعات خلال{" "}
                {dateRange === "week"
                  ? "الأسبوع"
                  : dateRange === "month"
                    ? "الشهر"
                    : dateRange === "quarter"
                      ? "الربع"
                      : "السنة"}{" "}
                الماضية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">هنا يتم عرض رسم بياني للمبيعات</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أفضل المنتجات مبيعاً</CardTitle>
                <CardDescription>المنتجات الأكثر مبيعاً من حيث الإيرادات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} وحدة مباعة</p>
                      </div>
                      <p className="font-medium">{formatPrice(product.revenue)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>توزيع المبيعات حسب الفئة</CardTitle>
                <CardDescription>نسبة المبيعات لكل فئة من المنتجات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">هنا يتم عرض رسم بياني دائري</span>
                </div>
                <div className="space-y-2">
                  {topCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <p className="text-sm">{category.name}</p>
                      <p className="text-sm font-medium">{category.percentage}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل الطلبات</CardTitle>
              <CardDescription>
                عدد الطلبات خلال{" "}
                {dateRange === "week"
                  ? "الأسبوع"
                  : dateRange === "month"
                    ? "الشهر"
                    : dateRange === "quarter"
                      ? "الربع"
                      : "السنة"}{" "}
                الماضية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">هنا يتم عرض رسم بياني للطلبات</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>حالة الطلبات</CardTitle>
                <CardDescription>توزيع الطلبات حسب الحالة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">هنا يتم عرض رسم بياني دائري</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm">مكتمل</p>
                    </div>
                    <p className="text-xl font-bold">91%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <p className="text-sm">قيد التنفيذ</p>
                    </div>
                    <p className="text-xl font-bold">5%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <p className="text-sm">ملغي</p>
                    </div>
                    <p className="text-xl font-bold">4%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>أوقات الذروة</CardTitle>
                <CardDescription>توزيع الطلبات حسب ساعات اليوم</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 flex items-center justify-center bg-muted/20 rounded-md mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">هنا يتم عرض رسم بياني للأوقات</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">وقت الذروة</p>
                    <p className="text-sm">7:00 م - 9:00 م</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">متوسط وقت التحضير</p>
                    <p className="text-sm">25 دقيقة</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">متوسط وقت التوصيل</p>
                    <p className="text-sm">35 دقيقة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>تحليل العملاء</CardTitle>
              <CardDescription>
                عدد العملاء الجدد خلال{" "}
                {dateRange === "week"
                  ? "الأسبوع"
                  : dateRange === "month"
                    ? "الشهر"
                    : dateRange === "quarter"
                      ? "الربع"
                      : "السنة"}{" "}
                الماضية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
                <LineChart className="h-8 w-8 text-muted-foreground" />
                <span className="text-muted-foreground mr-2">هنا يتم عرض رسم بياني للعملاء</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>أفضل العملاء</CardTitle>
                <CardDescription>العملاء الأكثر إنفاقاً</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "أحمد محمد", orders: 12, spent: 1850.75 },
                    { name: "سارة علي", orders: 8, spent: 1240.5 },
                    { name: "محمد خالد", orders: 5, spent: 780.25 },
                    { name: "فاطمة أحمد", orders: 3, spent: 450.0 },
                    { name: "خالد عبدالله", orders: 7, spent: 920.75 },
                  ].map((customer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.orders} طلب</p>
                      </div>
                      <p className="font-medium">{formatPrice(customer.spent)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معدل الاحتفاظ بالعملاء</CardTitle>
                <CardDescription>نسبة العملاء العائدين</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-4xl font-bold">78%</p>
                    </div>
                    <div className="h-full w-full rounded-full border-8 border-primary/30">
                      <div
                        className="h-full w-full rounded-full border-8 border-primary"
                        style={{
                          clipPath: "polygon(0 0, 100% 0, 100% 78%, 0 78%)",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">معدل الاحتفاظ بالعملاء</p>
                    <div className="flex items-center justify-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <p className="text-sm text-green-500">زيادة 5% عن الفترة السابقة</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">عملاء جدد</p>
                    <p className="text-sm">22%</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">عملاء عائدون</p>
                    <p className="text-sm">78%</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">متوسط عدد الطلبات للعميل</p>
                    <p className="text-sm">4.2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AnalyticsPage
