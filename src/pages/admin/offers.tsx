import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Search, Edit, Trash2, Loader2, Upload, Calendar, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { formatDate } from "@/lib/utils"

interface Offer {
  id: number
  title: string
  description: string
  discount_percentage: number
  image: string
  is_active: boolean
  start_date: string
  end_date: string
}

const offerSchema = z
  .object({
    title: z.string().min(3, { message: "العنوان يجب أن يكون 3 أحرف على الأقل" }),
    description: z.string().min(10, { message: "الوصف يجب أن يكون 10 أحرف على الأقل" }),
    discount_percentage: z.coerce
      .number()
      .min(1, { message: "نسبة الخصم يجب أن تكون على الأقل 1%" })
      .max(100, { message: "نسبة الخصم يجب أن تكون أقل من أو تساوي 100%" }),
    start_date: z.string().min(1, { message: "يرجى تحديد تاريخ البدء" }),
    end_date: z.string().min(1, { message: "يرجى تحديد تاريخ الانتهاء" }),
    is_active: z.boolean().default(true),
    image: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date)
      const end = new Date(data.end_date)
      return start <= end
    },
    {
      message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء",
      path: ["end_date"],
    },
  )

type OfferFormValues = z.infer<typeof offerSchema>

const OffersManagement = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      description: "",
      discount_percentage: 10,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      is_active: true,
      image: "",
    },
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/offers")
      setOffers(response.data)
    } catch (error) {
      console.error("Failed to fetch offers:", error)
      toast({
        title: "خطأ في جلب العروض",
        description: "حدث خطأ أثناء جلب العروض، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddOffer = () => {
    setCurrentOffer(null)
    setImagePreview(null)
    form.reset({
      title: "",
      description: "",
      discount_percentage: 10,
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      is_active: true,
      image: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditOffer = (offer: Offer) => {
    setCurrentOffer(offer)
    setImagePreview(offer.image)
    form.reset({
      title: offer.title,
      description: offer.description,
      discount_percentage: offer.discount_percentage,
      start_date: new Date(offer.start_date).toISOString().split("T")[0],
      end_date: new Date(offer.end_date).toISOString().split("T")[0],
      is_active: offer.is_active,
      image: offer.image,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteOffer = (offer: Offer) => {
    setCurrentOffer(offer)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteOffer = async () => {
    if (!currentOffer) return

    try {
      setIsSubmitting(true)
      await api.delete(`/offers/${currentOffer.id}`)

      toast({
        title: "تم حذف العرض بنجاح",
      })

      fetchOffers()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete offer:", error)
      toast({
        title: "فشل حذف العرض",
        description: "حدث خطأ أثناء حذف العرض، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (values: OfferFormValues) => {
    try {
      setIsSubmitting(true)

      if (currentOffer) {
        // Update existing offer
        await api.put(`/offers/${currentOffer.id}`, values)
        toast({
          title: "تم تحديث العرض بنجاح",
        })
      } else {
        // Create new offer
        await api.post("/offers", values)
        toast({
          title: "تم إضافة العرض بنجاح",
        })
      }

      fetchOffers()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save offer:", error)
      toast({
        title: "فشل حفظ العرض",
        description: "حدث خطأ أثناء حفظ العرض، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real application, you would upload the file to your server or cloud storage
      // For this demo, we'll just create a local URL
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        setImagePreview(result)
        form.setValue("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredOffers = offers.filter(
    (offer) =>
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Placeholder data for demo
  const placeholderOffers: Offer[] = [
    {
      id: 1,
      title: "خصم 20% على جميع المشاوي",
      description: "استمتع بخصم 20% على جميع أطباق المشاوي طوال أيام الأسبوع",
      discount_percentage: 20,
      image: "/placeholder.svg?height=200&width=400&text=خصم المشاوي",
      is_active: true,
      start_date: "2023-06-01T00:00:00",
      end_date: "2023-06-30T23:59:59",
    },
    {
      id: 2,
      title: "اطلب 2 واحصل على 1 مجاناً",
      description: "اطلب أي بيتزا من اختيارك واحصل على الثالثة مجاناً",
      discount_percentage: 33,
      image: "/placeholder.svg?height=200&width=400&text=عرض البيتزا",
      is_active: true,
      start_date: "2023-06-15T00:00:00",
      end_date: "2023-07-15T23:59:59",
    },
    {
      id: 3,
      title: "خصم 15% للطلبات أونلاين",
      description: "احصل على خصم 15% عند الطلب من موقعنا الإلكتروني",
      discount_percentage: 15,
      image: "/placeholder.svg?height=200&width=400&text=خصم أونلاين",
      is_active: false,
      start_date: "2023-05-01T00:00:00",
      end_date: "2023-05-31T23:59:59",
    },
  ]

  const displayOffers = offers.length > 0 ? filteredOffers : placeholderOffers

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة العروض</h1>
        <Button onClick={handleAddOffer}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة عرض
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="البحث عن عرض..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayOffers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Percent className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">لا توجد عروض</h2>
          <p className="text-muted-foreground mb-6">لم يتم العثور على أي عروض تطابق معايير البحث</p>
          <Button onClick={handleAddOffer}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة عرض جديد
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">الصورة</TableHead>
                  <TableHead>العنوان</TableHead>
                  <TableHead>نسبة الخصم</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayOffers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                      <div className="h-12 w-20 rounded-md overflow-hidden">
                        <img
                          src={offer.image || "/placeholder.svg?height=48&width=80"}
                          alt={offer.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{offer.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{offer.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{offer.discount_percentage}%</TableCell>
                    <TableCell>{formatDate(offer.start_date)}</TableCell>
                    <TableCell>{formatDate(offer.end_date)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          offer.is_active
                            ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {offer.is_active ? "نشط" : "غير نشط"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditOffer(offer)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteOffer(offer)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Add/Edit Offer Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentOffer ? "تعديل عرض" : "إضافة عرض جديد"}</DialogTitle>
            <DialogDescription>
              {currentOffer
                ? "قم بتعديل بيانات العرض ثم اضغط على حفظ التغييرات"
                : "أدخل بيانات العرض الجديد ثم اضغط على إضافة"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان العرض</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل عنوان العرض" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وصف العرض</FormLabel>
                    <FormControl>
                      <Textarea placeholder="أدخل وصف العرض" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نسبة الخصم (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" placeholder="أدخل نسبة الخصم" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>تفعيل العرض</FormLabel>
                        <FormDescription>العروض النشطة فقط ستظهر للعملاء</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تاريخ البدء</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pr-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تاريخ الانتهاء</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="date" className="pr-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormItem>
                <FormLabel>صورة العرض</FormLabel>
                <div className="flex items-center gap-4 mt-2">
                  <div className="h-24 w-40 rounded-md border border-input overflow-hidden flex items-center justify-center bg-muted">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Offer preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      يجب أن تكون الصورة بصيغة JPG أو PNG وبحجم أقصى 2 ميجابايت
                    </p>
                  </div>
                </div>
              </FormItem>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : currentOffer ? (
                    "حفظ التغييرات"
                  ) : (
                    "إضافة العرض"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>تأكيد حذف العرض</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا العرض؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="h-16 w-24 rounded-md overflow-hidden">
              <img
                src={currentOffer?.image || "/placeholder.svg?height=64&width=96"}
                alt={currentOffer?.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">{currentOffer?.title}</h4>
              <p className="text-sm text-muted-foreground">خصم {currentOffer?.discount_percentage}%</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="button" variant="destructive" onClick={confirmDeleteOffer} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OffersManagement
