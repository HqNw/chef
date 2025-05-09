"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Eye,
  Loader2,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
  Truck,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { formatPrice, formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface OrderItem {
  id: number
  product_id: number
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: number
  user_id: number
  customer_name: string
  total_amount: number
  delivery_fee: number
  status: "pending" | "processing" | "delivering" | "completed" | "cancelled"
  payment_method: string
  address: string
  phone: string
  notes: string
  created_at: string
  items: OrderItem[]
}

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchQuery, statusFilter, dateFilter])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/orders")
      setOrders(response.data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast({
        title: "خطأ في جلب الطلبات",
        description: "حدث خطأ أثناء جلب الطلبات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = () => {
    let result = [...orders]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (order) =>
          order.id.toString().includes(searchQuery) ||
          order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.phone.includes(searchQuery),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      if (dateFilter === "today") {
        result = result.filter((order) => {
          const orderDate = new Date(order.created_at)
          return orderDate >= today
        })
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        result = result.filter((order) => {
          const orderDate = new Date(order.created_at)
          return orderDate >= weekAgo
        })
      } else if (dateFilter === "month") {
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        result = result.filter((order) => {
          const orderDate = new Date(order.created_at)
          return orderDate >= monthAgo
        })
      }
    }

    setFilteredOrders(result)
  }

  const handleViewOrder = (order: Order) => {
    setCurrentOrder(order)
    setIsViewDialogOpen(true)
  }

  const handleUpdateStatus = (order: Order) => {
    setCurrentOrder(order)
    setNewStatus(order.status)
    setIsUpdateStatusDialogOpen(true)
  }

  const confirmUpdateStatus = async () => {
    if (!currentOrder || !newStatus) return

    try {
      setIsSubmitting(true)
      await api.put(`/orders/${currentOrder.id}/status`, { status: newStatus })

      toast({
        title: "تم تحديث حالة الطلب بنجاح",
      })

      // Update the order in the local state
      const updatedOrders = orders.map((order) =>
        order.id === currentOrder.id ? { ...order, status: newStatus as any } : order,
      )
      setOrders(updatedOrders)

      setIsUpdateStatusDialogOpen(false)
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast({
        title: "فشل تحديث حالة الطلب",
        description: "حدث خطأ أثناء تحديث حالة الطلب، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-600 hover:bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400"
          >
            قيد الانتظار
          </Badge>
        )
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
          >
            قيد التحضير
          </Badge>
        )
      case "delivering":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 hover:bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
          >
            قيد التوصيل
          </Badge>
        )
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
          >
            مكتمل
          </Badge>
        )
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400"
          >
            ملغي
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-orange-500" />
      case "processing":
        return <Package className="h-5 w-5 text-yellow-500" />
      case "delivering":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Placeholder data for demo
  const placeholderOrders: Order[] = [
    {
      id: 1001,
      user_id: 1,
      customer_name: "أحمد محمد",
      total_amount: 185.5,
      delivery_fee: 15,
      status: "completed",
      payment_method: "cash",
      address: "شارع الملك فهد، حي الورود، الرياض",
      phone: "0512345678",
      notes: "",
      created_at: "2023-06-15T14:30:00",
      items: [
        { id: 1, product_id: 1, product_name: "برجر لحم أنجوس", quantity: 2, price: 45.99 },
        { id: 2, product_id: 3, product_name: "سلطة سيزر", quantity: 1, price: 25.99 },
        { id: 3, product_id: 5, product_name: "كولا", quantity: 2, price: 5.99 },
      ],
    },
    {
      id: 1002,
      user_id: 2,
      customer_name: "سارة علي",
      total_amount: 120.75,
      delivery_fee: 15,
      status: "delivering",
      payment_method: "card",
      address: "شارع التحلية، حي العليا، الرياض",
      phone: "0523456789",
      notes: "الرجاء الاتصال قبل التوصيل",
      created_at: "2023-06-15T15:45:00",
      items: [
        { id: 4, product_id: 2, product_name: "بيتزا مارجريتا", quantity: 1, price: 39.99 },
        { id: 5, product_id: 5, product_name: "كنافة بالقشطة", quantity: 1, price: 29.99 },
        { id: 6, product_id: 6, product_name: "عصير برتقال", quantity: 2, price: 17.99 },
      ],
    },
    {
      id: 1003,
      user_id: 3,
      customer_name: "محمد خالد",
      total_amount: 210.25,
      delivery_fee: 15,
      status: "processing",
      payment_method: "cash",
      address: "شارع الأمير سلطان، حي المحمدية، جدة",
      phone: "0534567890",
      notes: "",
      created_at: "2023-06-15T16:20:00",
      items: [
        { id: 7, product_id: 4, product_name: "مشاوي مشكلة", quantity: 1, price: 89.99 },
        { id: 8, product_id: 7, product_name: "أرز بخاري", quantity: 2, price: 24.99 },
        { id: 9, product_id: 8, product_name: "سلطة خضراء", quantity: 1, price: 19.99 },
        { id: 10, product_id: 9, product_name: "مياه معدنية", quantity: 2, price: 3.99 },
      ],
    },
    {
      id: 1004,
      user_id: 4,
      customer_name: "فاطمة أحمد",
      total_amount: 95.0,
      delivery_fee: 15,
      status: "pending",
      payment_method: "card",
      address: "شارع الملك عبدالله، حي الروضة، الدمام",
      phone: "0545678901",
      notes: "الرجاء إحضار أدوات بلاستيكية",
      created_at: "2023-06-15T17:10:00",
      items: [
        { id: 11, product_id: 10, product_name: "شاورما دجاج", quantity: 2, price: 19.99 },
        { id: 12, product_id: 11, product_name: "بطاطس مقلية", quantity: 1, price: 14.99 },
        { id: 13, product_id: 12, product_name: "كولا دايت", quantity: 2, price: 5.99 },
      ],
    },
    {
      id: 1005,
      user_id: 5,
      customer_name: "خالد عبدالله",
      total_amount: 155.75,
      delivery_fee: 15,
      status: "cancelled",
      payment_method: "cash",
      address: "شارع الأمير محمد بن فهد، حي الشاطئ، الخبر",
      phone: "0556789012",
      notes: "",
      created_at: "2023-06-15T18:30:00",
      items: [
        { id: 14, product_id: 13, product_name: "برجر دجاج", quantity: 3, price: 35.99 },
        { id: 15, product_id: 14, product_name: "حلقات بصل", quantity: 1, price: 19.99 },
        { id: 16, product_id: 15, product_name: "آيس كريم", quantity: 1, price: 12.99 },
      ],
    },
  ]

  const displayOrders = orders.length > 0 ? filteredOrders : placeholderOrders

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
            تحديث
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث برقم الطلب، اسم العميل، أو رقم الهاتف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد الانتظار</SelectItem>
              <SelectItem value="processing">قيد التحضير</SelectItem>
              <SelectItem value="delivering">قيد التوصيل</SelectItem>
              <SelectItem value="completed">مكتمل</SelectItem>
              <SelectItem value="cancelled">ملغي</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب التاريخ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التواريخ</SelectItem>
              <SelectItem value="today">اليوم</SelectItem>
              <SelectItem value="week">آخر أسبوع</SelectItem>
              <SelectItem value="month">آخر شهر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">لا توجد طلبات</h2>
          <p className="text-muted-foreground mb-6">لم يتم العثور على أي طلبات تطابق معايير البحث</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>المبلغ</TableHead>
                  <TableHead>طريقة الدفع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p>{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground" dir="ltr">
                          {order.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{formatPrice(order.total_amount)}</TableCell>
                    <TableCell>{order.payment_method === "cash" ? "الدفع عند الاستلام" : "بطاقة ائتمان"}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order)}>
                          تحديث الحالة
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب #{currentOrder?.id}</DialogTitle>
            <DialogDescription>تم الطلب في {currentOrder && formatDate(currentOrder.created_at)}</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">تفاصيل الطلب</TabsTrigger>
              <TabsTrigger value="customer">معلومات العميل</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-muted">{currentOrder && getStatusIcon(currentOrder.status)}</div>
                <div>
                  <p className="font-medium">حالة الطلب</p>
                  <p>{currentOrder && getStatusBadge(currentOrder.status)}</p>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="p-4 border-b">
                  <h3 className="font-medium mb-2">المنتجات</h3>
                  <div className="space-y-3">
                    {currentOrder?.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p>
                            {item.product_name} × {item.quantity}
                          </p>
                        </div>
                        <p>{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">المجموع الفرعي</p>
                      <p>{formatPrice(currentOrder ? currentOrder.total_amount - currentOrder.delivery_fee : 0)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">رسوم التوصيل</p>
                      <p>{formatPrice(currentOrder?.delivery_fee || 0)}</p>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <p>الإجمالي</p>
                      <p>{formatPrice(currentOrder?.total_amount || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentOrder?.payment_method === "cash" ? (
                  <Banknote className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                )}
                <p>
                  طريقة الدفع:{" "}
                  <span className="font-medium">
                    {currentOrder?.payment_method === "cash" ? "الدفع عند الاستلام" : "بطاقة ائتمان"}
                  </span>
                </p>
              </div>
            </TabsContent>
            <TabsContent value="customer" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات العميل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {currentOrder?.customer_name.charAt(0) || "A"}
                    </div>
                    <div>
                      <p className="font-medium">{currentOrder?.customer_name}</p>
                      <p className="text-sm text-muted-foreground" dir="ltr">
                        {currentOrder?.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">عنوان التوصيل</p>
                      <p className="text-muted-foreground">{currentOrder?.address}</p>
                    </div>
                  </div>

                  {currentOrder?.notes && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-medium">ملاحظات</p>
                        <p className="text-muted-foreground">{currentOrder.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              إغلاق
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false)
                if (currentOrder) {
                  handleUpdateStatus(currentOrder)
                }
              }}
            >
              تحديث الحالة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تحديث حالة الطلب #{currentOrder?.id}</DialogTitle>
            <DialogDescription>اختر الحالة الجديدة للطلب</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الحالة الجديدة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="processing">قيد التحضير</SelectItem>
                <SelectItem value="delivering">قيد التوصيل</SelectItem>
                <SelectItem value="completed">مكتمل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>

            <div className="mt-4 flex items-center gap-2">
              <div className="p-2 rounded-full bg-muted">{getStatusIcon(newStatus)}</div>
              <div>
                <p className="text-sm text-muted-foreground">الحالة الجديدة</p>
                <p>{getStatusBadge(newStatus)}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)} disabled={isSubmitting}>
              إلغاء
            </Button>
            <Button onClick={confirmUpdateStatus} disabled={isSubmitting || newStatus === currentOrder?.status}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري التحديث...
                </>
              ) : (
                "تحديث الحالة"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrdersManagement
