"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Loader2, Upload, User, Mail, Phone, MapPin, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const generalSettingsSchema = z.object({
  restaurantName: z.string().min(3, { message: "اسم المطعم يجب أن يكون 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z.string().min(10, { message: "رقم الهاتف غير صالح" }),
  address: z.string().min(10, { message: "العنوان يجب أن يكون 10 أحرف على الأقل" }),
  logo: z.string().optional(),
  description: z.string().min(20, { message: "الوصف يجب أن يكون 20 حرف على الأقل" }),
})

const businessHoursSchema = z.object({
  sunday: z.object({
    isOpen: z.boolean().default(true),
    openTime: z.string().min(1, { message: "يرجى تحديد وقت الفتح" }),
    closeTime: z.string().min(1, { message: "يرجى تحديد وقت الإغلاق" }),
  }),
  monday: z.object({
    isOpen: z.boolean().default(true),
    openTime: z.string().min(1, { message: "يرجى تحديد وقت الفتح" }),
    closeTime: z.string().min(1, { message: "يرجى تحديد وقت الإغلاق" }),
  }),
  tuesday: z.object({
    isOpen: z.boolean().default(true),
    openTime: z.string().min(1, { message: "يرجى تحديد وقت الفتح" }),
    closeTime: z.string().min(1, { message: "يرجى تحديد وقت الإغلاق" }),
  }),
  wednesday: z.object({
    isOpen: z.boolean().default(true),
    openTime: z.string().min(1, { message: "يرجى تحديد وقت الفتح" }),
    closeTime: z.string().min(1, { message: "يرجى تحديد وقت الإغلاق" }),
  }),
  thursday: z.object({
    isOpen: z.boolean().default(true),
    openTime: z.string().min(1, { message: "يرجى تحديد وقت الفتح" }),
    closeTime: z.string().min(1, { message: "يرجى تحديد وقت الإغلاق" }),
  }),
  friday: z.object({
    isOpen: z.boolean().default(true),
    openTime: z.string().min(1, { message: "يرجى تحديد وقت الفتح" }),
    closeTime: z.string().min(1, { message: "يرجى تحديد وقت الإغلاق" }),
  }),
  saturday: z.object({
    isOpen: z.boolean().default(true),
    openTime: z.string().min(1, { message: "يرجى تحديد وقت الفتح" }),
    closeTime: z.string().min(1, { message: "يرجى تحديد وقت الإغلاق" }),
  }),
})

const paymentSettingsSchema = z.object({
  enableCashOnDelivery: z.boolean().default(true),
  enableCreditCard: z.boolean().default(true),
  deliveryFee: z.coerce.number().min(0, { message: "رسوم التوصيل يجب أن تكون رقماً موجباً" }),
  minOrderAmount: z.coerce.number().min(0, { message: "الحد الأدنى للطلب يجب أن يكون رقماً موجباً" }),
  freeDeliveryThreshold: z.coerce.number().min(0, { message: "حد التوصيل المجاني يجب أن يكون رقماً موجباً" }),
})

type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>
type BusinessHoursFormValues = z.infer<typeof businessHoursSchema>
type PaymentSettingsFormValues = z.infer<typeof paymentSettingsSchema>

const SettingsPage = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    "/placeholder.svg?height=100&width=100&text=شعار المطعم",
  )
  const [isSubmittingGeneral, setIsSubmittingGeneral] = useState(false)
  const [isSubmittingHours, setIsSubmittingHours] = useState(false)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const { toast } = useToast()

  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      restaurantName: "مطعم الشيف",
      email: "info@chef-restaurant.com",
      phone: "0512345678",
      address: "شارع الملك فهد، الرياض، المملكة العربية السعودية",
      description: "نقدم أشهى المأكولات العربية والعالمية بأيدي أمهر الطهاة، لتجربة طعام لا تُنسى.",
    },
  })

  const businessHoursForm = useForm<BusinessHoursFormValues>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: {
      sunday: { isOpen: true, openTime: "10:00", closeTime: "23:00" },
      monday: { isOpen: true, openTime: "10:00", closeTime: "23:00" },
      tuesday: { isOpen: true, openTime: "10:00", closeTime: "23:00" },
      wednesday: { isOpen: true, openTime: "10:00", closeTime: "23:00" },
      thursday: { isOpen: true, openTime: "10:00", closeTime: "23:00" },
      friday: { isOpen: true, openTime: "12:00", closeTime: "00:00" },
      saturday: { isOpen: true, openTime: "12:00", closeTime: "00:00" },
    },
  })

  const paymentForm = useForm<PaymentSettingsFormValues>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      enableCashOnDelivery: true,
      enableCreditCard: true,
      deliveryFee: 15,
      minOrderAmount: 50,
      freeDeliveryThreshold: 200,
    },
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real application, you would upload the file to your server or cloud storage
      // For this demo, we'll just create a local URL
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setLogoPreview(result)
        generalForm.setValue("logo", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmitGeneral = async (values: GeneralSettingsFormValues) => {
    try {
      setIsSubmittingGeneral(true)

      // In a real application, you would send this data to your API
      // await api.put("/settings/general", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "تم حفظ الإعدادات العامة بنجاح",
      })
    } catch (error) {
      console.error("Failed to save general settings:", error)
      toast({
        title: "فشل حفظ الإعدادات",
        description: "حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingGeneral(false)
    }
  }

  const onSubmitBusinessHours = async (values: BusinessHoursFormValues) => {
    try {
      setIsSubmittingHours(true)

      // In a real application, you would send this data to your API
      // await api.put("/settings/business-hours", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "تم حفظ ساعات العمل بنجاح",
      })
    } catch (error) {
      console.error("Failed to save business hours:", error)
      toast({
        title: "فشل حفظ ساعات العمل",
        description: "حدث خطأ أثناء حفظ ساعات العمل، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingHours(false)
    }
  }

  const onSubmitPayment = async (values: PaymentSettingsFormValues) => {
    try {
      setIsSubmittingPayment(true)

      // In a real application, you would send this data to your API
      // await api.put("/settings/payment", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "تم حفظ إعدادات الدفع والتوصيل بنجاح",
      })
    } catch (error) {
      console.error("Failed to save payment settings:", error)
      toast({
        title: "فشل حفظ إعدادات الدفع",
        description: "حدث خطأ أثناء حفظ إعدادات الدفع، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingPayment(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">الإعدادات العامة</TabsTrigger>
          <TabsTrigger value="hours">ساعات العمل</TabsTrigger>
          <TabsTrigger value="payment">الدفع والتوصيل</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>إدارة المعلومات الأساسية للمطعم</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onSubmitGeneral)} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المطعم</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pr-10" placeholder="أدخل اسم المطعم" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>البريد الإلكتروني</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input className="pr-10" placeholder="أدخل البريد الإلكتروني" type="email" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>رقم الهاتف</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input className="pr-10" placeholder="أدخل رقم الهاتف" type="tel" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea className="pr-10 min-h-[80px]" placeholder="أدخل عنوان المطعم" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المطعم</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصفاً مختصراً للمطعم" className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormDescription>سيظهر هذا الوصف في الصفحة الرئيسية وصفحة من نحن</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>شعار المطعم</FormLabel>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="h-24 w-24 rounded-md border border-input overflow-hidden flex items-center justify-center bg-muted">
                        {logoPreview ? (
                          <img
                            src={logoPreview || "/placeholder.svg"}
                            alt="Restaurant logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input type="file" accept="image/*" onChange={handleLogoChange} className="mb-2" />
                        <p className="text-xs text-muted-foreground">
                          يجب أن يكون الشعار بصيغة JPG أو PNG وبحجم أقصى 2 ميجابايت
                        </p>
                      </div>
                    </div>
                  </FormItem>

                  <Button type="submit" disabled={isSubmittingGeneral}>
                    {isSubmittingGeneral ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        حفظ الإعدادات
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ساعات العمل</CardTitle>
              <CardDescription>تحديد أوقات فتح وإغلاق المطعم</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...businessHoursForm}>
                <form onSubmit={businessHoursForm.handleSubmit(onSubmitBusinessHours)} className="space-y-6">
                  {[
                    { day: "sunday", label: "الأحد" },
                    { day: "monday", label: "الإثنين" },
                    { day: "tuesday", label: "الثلاثاء" },
                    { day: "wednesday", label: "الأربعاء" },
                    { day: "thursday", label: "الخميس" },
                    { day: "friday", label: "الجمعة" },
                    { day: "saturday", label: "السبت" },
                  ].map(({ day, label }) => (
                    <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="flex items-center justify-between md:col-span-1">
                        <FormLabel className="font-medium">{label}</FormLabel>
                        <FormField
                          control={businessHoursForm.control}
                          name={`${day}.isOpen` as any}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-x-reverse">
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">{field.value ? "مفتوح" : "مغلق"}</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="md:col-span-3 grid grid-cols-2 gap-4">
                        <FormField
                          control={businessHoursForm.control}
                          name={`${day}.openTime` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وقت الفتح</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pr-10"
                                    type="time"
                                    disabled={!businessHoursForm.watch(`${day}.isOpen` as any)}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={businessHoursForm.control}
                          name={`${day}.closeTime` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>وقت الإغلاق</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    className="pr-10"
                                    type="time"
                                    disabled={!businessHoursForm.watch(`${day}.isOpen` as any)}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button type="submit" disabled={isSubmittingHours}>
                    {isSubmittingHours ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        حفظ ساعات العمل
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الدفع والتوصيل</CardTitle>
              <CardDescription>إدارة طرق الدفع ورسوم التوصيل</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onSubmitPayment)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">طرق الدفع</h3>

                    <FormField
                      control={paymentForm.control}
                      name="enableCashOnDelivery"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">الدفع عند الاستلام</FormLabel>
                            <FormDescription>السماح للعملاء بالدفع نقداً عند استلام الطلب</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="enableCreditCard"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">بطاقة ائتمان</FormLabel>
                            <FormDescription>السماح للعملاء بالدفع باستخدام بطاقات الائتمان</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">إعدادات التوصيل</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={paymentForm.control}
                        name="deliveryFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رسوم التوصيل</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pr-10"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="أدخل رسوم التوصيل"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>رسوم التوصيل الثابتة لكل طلب</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="minOrderAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الحد الأدنى للطلب</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pr-10"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="أدخل الحد الأدنى للطلب"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>الحد الأدنى لقيمة الطلب</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="freeDeliveryThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>حد التوصيل المجاني</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  className="pr-10"
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="أدخل حد التوصيل المجاني"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>قيمة الطلب التي يصبح بعدها التوصيل مجانياً</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmittingPayment}>
                    {isSubmittingPayment ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="ml-2 h-4 w-4" />
                        حفظ الإعدادات
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsPage
