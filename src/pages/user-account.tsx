"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2, User, ShoppingBag, MapPin } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { formatPrice, formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

const profileSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z.string().min(10, { message: "رقم الهاتف غير صالح" }).optional(),
  address: z.string().min(10, { message: "العنوان يجب أن يكون 10 أحرف على الأقل" }).optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
    newPassword: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

interface Order {
  id: number
  total_amount: number
  status: string
  created_at: string
  items: { product_name: string; quantity: number }[]
}

const UserAccount = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const { user, updateUser } = useAuth()
  const { toast } = useToast()

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onProfileSubmit = async (values: ProfileFormValues) => {
    try {
      await updateUser(values)
      toast({
        title: "تم تحديث البيانات بنجاح",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
    }
  }

  const onPasswordSubmit = async (values: PasswordFormValues) => {
    try {
      await api.put("/auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })

      toast({
        title: "تم تغيير كلمة المرور بنجاح",
      })

      passwordForm.reset()
    } catch (error) {
      console.error("Failed to change password:", error)
      toast({
        title: "فشل تغيير كلمة المرور",
        description: "كلمة المرور الحالية غير صحيحة",
        variant: "destructive",
      })
    }
  }

  const fetchOrders = async () => {
    if (activeTab === "orders" && orders.length === 0) {
      try {
        setIsLoadingOrders(true)
        const response = await api.get("/orders/my")
        setOrders(response.data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoadingOrders(false)
      }
    }
  }

  // Placeholder orders for demo
  const placeholderOrders: Order[] = [
    {
      id: 1001,
      total_amount: 185.5,
      status: "completed",
      created_at: "2023-06-10T14:30:00",
      items: [
        { product_name: "برجر لحم أنجوس", quantity: 2 },
        { product_name: "بطاطس مقلية", quantity: 1 },
      ],
    },
    {
      id: 1002,
      total_amount: 120.75,
      status: "delivering",
      created_at: "2023-06-12T15:45:00",
      items: [
        { product_name: "بيتزا مارجريتا", quantity: 1 },
        { product_name: "كولا", quantity: 2 },
      ],
    },
    {
      id: 1003,
      total_amount: 210.25,
      status: "processing",
      created_at: "2023-06-14T16:20:00",
      items: [
        { product_name: "مشاوي مشكلة", quantity: 1 },
        { product_name: "سلطة خضراء", quantity: 1 },
      ],
    },
  ]

  const displayOrders = orders.length > 0 ? orders : placeholderOrders

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
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">حسابي</h1>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value)
            fetchOrders()
          }}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 ml-2" />
              الملف الشخصي
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <ShoppingBag className="h-4 w-4 ml-2" />
              طلباتي
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center">
              <MapPin className="h-4 w-4 ml-2" />
              العناوين
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>المعلومات الشخصية</CardTitle>
                  <CardDescription>قم بتحديث معلوماتك الشخصية</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                      <FormField
                        control={profileForm.control}
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
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                              <Input placeholder="أدخل بريدك الإلكتروني" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={profileForm.control}
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

                      <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                        {profileForm.formState.isSubmitting ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          "حفظ التغييرات"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>تغيير كلمة المرور</CardTitle>
                  <CardDescription>قم بتحديث كلمة المرور الخاصة بك</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور الحالية</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="أدخل كلمة المرور الحالية"
                                  type={showCurrentPassword ? "text" : "password"}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-0 top-0 h-full"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>كلمة المرور الجديدة</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="أدخل كلمة المرور الجديدة"
                                  type={showNewPassword ? "text" : "password"}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-0 top-0 h-full"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>تأكيد كلمة المرور</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="أعد إدخال كلمة المرور الجديدة"
                                  type={showConfirmPassword ? "text" : "password"}
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-0 top-0 h-full"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                        {passwordForm.formState.isSubmitting ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري الحفظ...
                          </>
                        ) : (
                          "تغيير كلمة المرور"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>طلباتي</CardTitle>
                <CardDescription>سجل طلباتك السابقة</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-card/50 animate-pulse rounded-lg"></div>
                    ))}
                  </div>
                ) : displayOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">لا توجد طلبات</h3>
                    <p className="text-muted-foreground mb-4">لم تقم بإجراء أي طلبات بعد</p>
                    <Button asChild>
                      <a href="/menu">تصفح القائمة</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {displayOrders.map((order) => (
                      <div key={order.id} className="border border-border rounded-lg p-4">
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <div>
                            <p className="font-medium">
                              طلب #{order.id} - {formatDate(order.created_at)}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-bold">{formatPrice(order.total_amount)}</p>
                          </div>
                        </div>
                        <div className="border-t border-border pt-4">
                          <p className="font-medium mb-2">المنتجات:</p>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {order.items.map((item, index) => (
                              <li key={index}>
                                {item.product_name} × {item.quantity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/order-success/${order.id}`}>عرض التفاصيل</a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <CardTitle>عناويني</CardTitle>
                <CardDescription>إدارة عناوين التوصيل الخاصة بك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">المنزل</p>
                        <p className="text-muted-foreground mt-1">شارع الملك فهد، حي الورود، الرياض</p>
                        <p className="text-muted-foreground" dir="ltr">
                          +966 12 345 6789
                        </p>
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          تعديل
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">العمل</p>
                        <p className="text-muted-foreground mt-1">طريق الملك عبدالعزيز، حي العليا، الرياض</p>
                        <p className="text-muted-foreground" dir="ltr">
                          +966 12 345 6789
                        </p>
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          تعديل
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">إضافة عنوان جديد</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default UserAccount
