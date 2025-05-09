import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

const contactSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
  phone: z.string().min(10, { message: "رقم الهاتف غير صالح" }),
  subject: z.string().min(5, { message: "الموضوع يجب أن يكون 5 أحرف على الأقل" }),
  message: z.string().min(20, { message: "الرسالة يجب أن تكون 20 حرف على الأقل" }),
})

type ContactFormValues = z.infer<typeof contactSchema>

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    try {
      setIsSubmitting(true)
      // In a real application, you would send this data to your API
      // await api.post("/contact", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
      })

      form.reset()
    } catch (error) {
      console.error("Failed to send message:", error)
      toast({
        title: "فشل إرسال الرسالة",
        description: "يرجى المحاولة مرة أخرى لاحقاً",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">اتصل بنا</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-card rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">معلومات التواصل</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 ml-4 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">العنوان</h3>
                    <p className="text-muted-foreground">شارع الملك فهد، الرياض، المملكة العربية السعودية</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 ml-4 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">رقم الهاتف</h3>
                    <p className="text-muted-foreground" dir="ltr">
                      +966 12 345 6789
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 ml-4 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-medium mb-1">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground">info@chef-restaurant.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">ساعات العمل</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">الأحد - الخميس</span>
                  <span className="text-muted-foreground">10:00 ص - 11:00 م</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">الجمعة - السبت</span>
                  <span className="text-muted-foreground">12:00 م - 12:00 ص</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">أرسل لنا رسالة</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم الكامل</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسمك الكامل" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل بريدك الإلكتروني" type="email" disabled={isSubmitting} {...field} />
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
                          <Input placeholder="أدخل رقم هاتفك" type="tel" disabled={isSubmitting} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الموضوع</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل موضوع الرسالة" disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرسالة</FormLabel>
                      <FormControl>
                        <Textarea placeholder="اكتب رسالتك هنا..." rows={5} disabled={isSubmitting} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="ml-2 h-4 w-4" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Map */}
        <div className="mt-8 rounded-lg overflow-hidden h-96 bg-card">
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">هنا يتم تضمين خريطة الموقع</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Contact
