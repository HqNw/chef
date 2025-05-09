"use client"

import { Link, useNavigate } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate("/checkout")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">سلة التسوق</h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">سلة التسوق فارغة</h2>
            <p className="text-muted-foreground mb-6">لم تقم بإضافة أي منتجات إلى سلة التسوق بعد</p>
            <Button asChild>
              <Link to="/menu">استعرض القائمة</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">المنتجات</h2>
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="py-4 flex items-center"
                      >
                        <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 mr-4">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-muted-foreground">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center mr-4">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-3 w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right mr-4 w-24">
                          <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رسوم التوصيل</span>
                    <span>{formatPrice(15)}</span>
                  </div>
                  <div className="border-t border-border pt-4 flex justify-between font-bold">
                    <span>الإجمالي</span>
                    <span>{formatPrice(totalPrice + 15)}</span>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    إتمام الطلب
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/menu">مواصلة التسوق</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Cart
