"use client"

import { useState, useEffect } from "react"
import { Search, User, Mail, Phone, Calendar, ShoppingBag, Eye, Loader2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/api"
import { formatPrice, formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  created_at: string
  total_orders: number
  total_spent: number
}

interface Order {
  id: number
  total_amount: number
  status: string
  created_at: string
}

const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<Order[]>([])
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/customers")
      setCustomers(response.data)
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      toast({
        title: "خطأ في جلب العملاء",
        description: "حدث خطأ أثناء جلب بيانات العملاء، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCustomerOrders = async (customerId: number) => {
    try {
      setIsLoadingOrders(true)
      const response = await api.get(`/customers/${customerId}/orders`)
      setCustomerOrders(response.data)
    } catch (error) {
      console.error("Failed to fetch customer orders:", error)
      toast({
        title: "خطأ في جلب الطلبات",
        description: "حدث خطأ أثناء جلب طلبات العميل، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleViewCustomer = (customer: Customer) => {
    setCurrentCustomer(customer)
    setCustomerOrders([])
    setIsViewDialogOpen(true)
    fetchCustomerOrders(customer.id)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

  // Placeholder data for demo
  const placeholderCustomers: Customer[] = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "0512345678",
      address: "شارع الملك فهد، حي الورود، الرياض",
      created_at: "2023-01-15T10:30:00",
      total_orders: 12,
      total_spent: 1850.75,
    },
    {
      id: 2,
      name: "سارة علي",
      email: "sara@example.com",
      phone: "0523456789",
      address: "شارع التحلية، حي العليا، الرياض",
      created_at: "2023-02-20T14:45:00",
      total_orders: 8,
      total_spent: 1240.5,
    },
    {
      id: 3,
      name: "محمد خالد",
      email: "mohammed@example.com",
      phone: "0534567890",
      address: "شارع الأمير سلطان، حي المحمدية، جدة",
      created_at: "2023-03-10T09:15:00",
      total_orders: 5,
      total_spent: 780.25,
    },
    {
      id: 4,
      name: "فاطمة أحمد",
      email: "fatima@example.com",
      phone: "0545678901",
      address: "شارع الملك عبدالله، حي الروضة، الدمام",
      created_at: "2023-04-05T16:20:00",
      total_orders: 3,
      total_spent: 450.0,
    },
    {
      id: 5,
      name: "خالد عبدالله",
      email: "khaled@example.com",
      phone: "0556789012",
      address: "شارع الأمير محمد بن فهد، حي الشاطئ، الخبر",
      created_at: "2023-05-12T11:30:00",
      total_orders: 7,
      total_spent: 920.75,
    },
  ]

  const placeholderOrders: Order[] = [
    {
      id: 1001,
      total_amount: 185.5,
      status: "completed",
      created_at: "2023-06-10T14:30:00",
    },
    {
      id: 1002,
      total_amount: 120.75,
      status: "delivering",
      created_at: "2023-06-12T15:45:00",
    },
    {
      id: 1003,
      total_amount: 210.25,
      status: "completed",
      created_at: "2023-05-20T16:20:00",
    },
    {
      id: 1004,
      total_amount: 95.0,
      status: "completed",
      created_at: "2023-05-05T17:10:00",
    },
  ]

  const displayCustomers = customers.length > 0 ? filteredCustomers : placeholderCustomers
  const displayOrders = customerOrders.length > 0 ? customerOrders : placeholderOrders

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            قيد الانتظار
          </span>
        )
      case "processing":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
            قيد التحضير
          </span>
        )
      case "delivering":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            قيد التوصيل
          </span>
        )
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            مكتمل
          </span>
        )
      case "cancelled":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            ملغي
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة العملاء</h1>
        <Button variant="outline" onClick={fetchCustomers} disabled={isLoading}>
          تحديث
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="البحث عن عميل بالاسم، البريد الإلكتروني، أو رقم الهاتف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayCustomers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">لا يوجد عملاء</h2>
          <p className="text-muted-foreground mb-6">لم يتم العثور على أي عملاء يطابقون معايير البحث</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي الإنفاق</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell dir="ltr">{customer.phone}</TableCell>
                    <TableCell>
                      {new Date(customer.created_at).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{customer.total_orders}</TableCell>
                    <TableCell>{formatPrice(customer.total_spent)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end">
                        <Button variant="ghost" size="sm" onClick={() => handleViewCustomer(customer)}>
                          <Eye className="h-4 w-4 ml-1" />
                          عرض
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>إرسال بريد إلكتروني</DropdownMenuItem>
                            <DropdownMenuItem>إرسال رسالة نصية</DropdownMenuItem>
                            <DropdownMenuItem>إضافة ملاحظة</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>معلومات العميل</DialogTitle>
            <DialogDescription>عرض معلومات وطلبات العميل</DialogDescription>
          </DialogHeader>

          {currentCustomer && (
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">المعلومات الشخصية</TabsTrigger>
                <TabsTrigger value="orders">الطلبات</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">الاسم</p>
                        <p className="text-muted-foreground">{currentCustomer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">البريد الإلكتروني</p>
                        <p className="text-muted-foreground">{currentCustomer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">رقم الهاتف</p>
                        <p className="text-muted-foreground" dir="ltr">
                          {currentCustomer.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">تاريخ التسجيل</p>
                        <p className="text-muted-foreground">{formatDate(currentCustomer.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>العنوان</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{currentCustomer.address}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ملخص النشاط</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">عدد الطلبات</p>
                      <p className="text-2xl font-bold">{currentCustomer.total_orders}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">إجمالي الإنفاق</p>
                      <p className="text-2xl font-bold">{formatPrice(currentCustomer.total_spent)}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="orders" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>طلبات العميل</CardTitle>
                    <CardDescription>سجل طلبات العميل السابقة</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingOrders ? (
                      <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : displayOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">لا توجد طلبات</h3>
                        <p className="text-muted-foreground">لم يقم هذا العميل بإجراء أي طلبات بعد</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {displayOrders.map((order) => (
                          <div key={order.id} className="flex justify-between items-center p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">طلب #{order.id}</p>
                              <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{formatPrice(order.total_amount)}</p>
                              <div className="mt-1">{getStatusBadge(order.status)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomersManagement
