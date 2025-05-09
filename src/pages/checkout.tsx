import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CreditCard, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { motion } from "framer-motion"

const checkoutSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  phone: z.string().min(10, { message: "رقم الهاتف غير صالح" }),
  address: z.string().min(10, { message: "العنوان يجب أن يكون 10 أحرف على الأقل" }),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "card"], {
    required_error: "يرجى اختيار طريقة الدفع",
  }),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

const Checkout = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || "",
      phone: "",
      address: "",
      notes: "",
      paymentMethod: "cash",
    },
  })

  const onSubmit = async (values: CheckoutFormValues) => {
    if (items.length === 0) return

    try {
      setIsSubmitting(true)

      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total_amount: totalPrice,
        delivery_fee: 15,
        status: "pending",
        payment_method: values.paymentMethod,
        address: values.address,
        phone: values.phone,
        notes: values.notes,
      }

      const response = await api.post("/orders", orderData)
      clearCart()
      navigate(`/order-success/${response.data.id}`)
    } catch (error) {
      console.error("Failed to place order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">معلومات التوصيل</h2>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم الكامل</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسمك الكامل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم هاتفك" type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عنوان التوصيل</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل عنوان التوصيل بالتفصيل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أي ملاحظات خاصة بالطلب أو التوصيل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">طريقة الدفع</h3>

                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-3"
                            >
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="cash" id="cash" />
                                <Banknote className="h-5 w-5 ml-2 text-muted-foreground" />
                                <label htmlFor="cash" className="font-medium cursor-pointer">
                                  الدفع عند الاستلام
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <RadioGroupItem value="card" id="card" />
                                <CreditCard className="h-5 w-5 ml-2 text-muted-foreground" />
                                <label htmlFor="card" className="font-medium cursor-pointer">
                                  بطاقة ائتمان
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري تأكيد الطلب...
                      </>
                    ) : (
                      "تأكيد الطلب"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2>

              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center">
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 mr-3">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right mr-3">
                      <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رسوم التوصيل</span>
                  <span>{formatPrice(15)}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>الإجمالي</span>
                  <span>{formatPrice(totalPrice + 15)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Checkout
