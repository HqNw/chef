"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { CheckCircle, Truck, Clock, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { formatPrice, formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

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

const OrderSuccess = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const response = await api.get(`/orders/${id}`)
        setOrder(response.data)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchOrder()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-12 bg-card/50 animate-pulse rounded-lg mb-8 w-64"></div>
          <div className="h-64 bg-card/50 animate-pulse rounded-lg mb-8"></div>
          <div className="h-48 bg-card/50 animate-pulse rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">الطلب غير موجود</h1>
          <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على الطلب المطلوب</p>
          <Button asChild>
            <Link to="/">العودة إلى الرئيسية</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusStep = () => {
    switch (order.status) {
      case "pending":
        return 0
      case "processing":
        return 1
      case "delivering":
        return 2
      case "completed":
        return 3
      default:
        return 0
    }
  }

  const statusStep = getStatusStep()

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4"
          >
            <CheckCircle className="h-10 w-10" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">تم تأكيد طلبك بنجاح!</h1>
          <p className="text-muted-foreground">
            رقم الطلب: <span className="font-medium text-foreground">#{order.id}</span>
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">حالة الطلب</h2>

          <div className="relative">
            <div className="absolute top-1/2 right-7 left-7 -translate-y-1/2 h-1 bg-muted"></div>
            <div
              className="absolute top-1/2 right-7 -translate-y-1/2 h-1 bg-primary transition-all duration-500"
              style={{ width: `${(statusStep / 3) * 100}%` }}
            ></div>

            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                    statusStep >= 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Package className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">تم التأكيد</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                    statusStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">قيد التحضير</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                    statusStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Truck className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">قيد التوصيل</span>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${
                    statusStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <CheckCircle className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">تم التسليم</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              الوقت المتوقع للتوصيل: <span className="font-medium text-foreground">45-60 دقيقة</span>
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">تفاصيل الطلب</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">معلومات التوصيل</h3>
                <p className="text-muted-foreground mb-1">العنوان: {order.address}</p>
                <p className="text-muted-foreground mb-1">رقم الهاتف: {order.phone}</p>
                {order.notes && <p className="text-muted-foreground">ملاحظات: {order.notes}</p>}
              </div>

              <div>
                <h3 className="font-medium mb-2">معلومات الطلب</h3>
                <p className="text-muted-foreground mb-1">تاريخ الطلب: {formatDate(order.created_at)}</p>
                <p className="text-muted-foreground mb-1">
                  طريقة الدفع: {order.payment_method === "cash" ? "الدفع عند الاستلام" : "بطاقة ائتمان"}
                </p>
                <p className="text-muted-foreground">
                  حالة الطلب:{" "}
                  <span className={`font-medium ${order.status === "cancelled" ? "text-destructive" : "text-primary"}`}>
                    {order.status === "pending"
                      ? "قيد الانتظار"
                      : order.status === "processing"
                        ? "قيد التحضير"
                        : order.status === "delivering"
                          ? "قيد التوصيل"
                          : order.status === "completed"
                            ? "مكتمل"
                            : "ملغي"}
                  </span>
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-medium mb-4">المنتجات</h3>

              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">
                        {item.product_name} × {item.quantity}
                      </p>
                    </div>
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{formatPrice(order.total_amount - order.delivery_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رسوم التوصيل</span>
                  <span>{formatPrice(order.delivery_fee)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold">
                  <span>الإجمالي</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link to="/">العودة إلى الرئيسية</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/menu">طلب المزيد</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess
