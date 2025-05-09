import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Search, Edit, Trash2, Loader2, X, Upload, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category_id: number
  category_name: string
  is_featured: boolean
  is_available: boolean
}

const productSchema = z.object({
  name: z.string().min(3, { message: "اسم المنتج يجب أن يكون 3 أحرف على الأقل" }),
  description: z.string().min(10, { message: "وصف المنتج يجب أن يكون 10 أحرف على الأقل" }),
  price: z.coerce.number().positive({ message: "السعر يجب أن يكون رقماً موجباً" }),
  category_id: z.coerce.number({ invalid_type_error: "يرجى اختيار القسم" }),
  is_featured: z.boolean().default(false),
  is_available: z.boolean().default(true),
  image: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category_id: 0,
      is_featured: false,
      is_available: true,
      image: "",
    },
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/products")
      setProducts(response.data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      toast({
        title: "خطأ في جلب المنتجات",
        description: "حدث خطأ أثناء جلب المنتجات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setImagePreview(null)
    form.reset({
      name: "",
      description: "",
      price: 0,
      category_id: 0,
      is_featured: false,
      is_available: true,
      image: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product)
    setImagePreview(product.image)
    form.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      is_featured: product.is_featured,
      is_available: product.is_available,
      image: product.image,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = async () => {
    if (!currentProduct) return

    try {
      setIsSubmitting(true)
      await api.delete(`/products/${currentProduct.id}`)

      toast({
        title: "تم حذف المنتج بنجاح",
      })

      fetchProducts()
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        title: "فشل حذف المنتج",
        description: "حدث خطأ أثناء حذف المنتج، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsSubmitting(true)

      if (currentProduct) {
        // Update existing product
        await api.put(`/products/${currentProduct.id}`, values)
        toast({
          title: "تم تحديث المنتج بنجاح",
        })
      } else {
        // Create new product
        await api.post("/products", values)
        toast({
          title: "تم إضافة المنتج بنجاح",
        })
      }

      fetchProducts()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to save product:", error)
      toast({
        title: "فشل حفظ المنتج",
        description: "حدث خطأ أثناء حفظ المنتج، يرجى المحاولة مرة أخرى",
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

  const filteredProducts = products.filter((product) => {
    // Filter by search query
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by category
    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter

    // Filter by availability
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && product.is_available) ||
      (availabilityFilter === "unavailable" && !product.is_available)

    return matchesSearch && matchesCategory && matchesAvailability
  })

  // Placeholder data for demo
  const placeholderProducts: Product[] = [
    {
      id: 1,
      name: "برجر لحم أنجوس",
      description: "برجر لحم أنجوس مشوي مع جبنة شيدر وصلصة خاصة",
      price: 45.99,
      image: "/placeholder.svg?height=100&width=100&text=برجر",
      category_id: 1,
      category_name: "برجر",
      is_featured: true,
      is_available: true,
    },
    {
      id: 2,
      name: "بيتزا مارجريتا",
      description: "بيتزا إيطالية أصلية مع صلصة طماطم وجبنة موزاريلا وريحان",
      price: 39.99,
      image: "/placeholder.svg?height=100&width=100&text=بيتزا",
      category_id: 2,
      category_name: "بيتزا",
      is_featured: true,
      is_available: true,
    },
    {
      id: 3,
      name: "سلطة سيزر",
      description: "خس روماني مع صلصة سيزر وقطع خبز محمص وجبنة بارميزان",
      price: 25.99,
      image: "/placeholder.svg?height=100&width=100&text=سلطة",
      category_id: 3,
      category_name: "سلطات",
      is_featured: false,
      is_available: true,
    },
    {
      id: 4,
      name: "مشاوي مشكلة",
      description: "تشكيلة من اللحوم المشوية مع خضروات وأرز",
      price: 89.99,
      image: "/placeholder.svg?height=100&width=100&text=مشاوي",
      category_id: 4,
      category_name: "مشاوي",
      is_featured: true,
      is_available: true,
    },
    {
      id: 5,
      name: "كنافة بالقشطة",
      description: "كنافة طازجة محشوة بالقشطة ومغطاة بالقطر والفستق",
      price: 29.99,
      image: "/placeholder.svg?height=100&width=100&text=حلويات",
      category_id: 5,
      category_name: "حلويات",
      is_featured: false,
      is_available: false,
    },
  ]

  const placeholderCategories: Category[] = [
    { id: 1, name: "برجر", slug: "burger" },
    { id: 2, name: "بيتزا", slug: "pizza" },
    { id: 3, name: "سلطات", slug: "salads" },
    { id: 4, name: "مشاوي", slug: "grills" },
    { id: 5, name: "حلويات", slug: "desserts" },
  ]

  const displayProducts = products.length > 0 ? filteredProducts : placeholderProducts
  const displayCategories = categories.length > 0 ? categories : placeholderCategories

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة منتج
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث عن منتج..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        <div className="flex gap-4">
          <Select
            value={categoryFilter.toString()}
            onValueChange={(value) => setCategoryFilter(value === "all" ? "all" : Number.parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأقسام</SelectItem>
              {displayCategories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب التوفر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="available">متوفر</SelectItem>
              <SelectItem value="unavailable">غير متوفر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">لا توجد منتجات</h2>
          <p className="text-muted-foreground mb-6">لم يتم العثور على أي منتجات تطابق معايير البحث</p>
          <Button onClick={handleAddProduct}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة منتج جديد
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">الصورة</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>مميز</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="h-12 w-12 rounded-md overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg?height=48&width=48"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{product.category_name}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          product.is_available
                            ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {product.is_available ? "متوفر" : "غير متوفر"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.is_featured ? (
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProduct(product)}
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentProduct ? "تعديل منتج" : "إضافة منتج جديد"}</DialogTitle>
            <DialogDescription>
              {currentProduct
                ? "قم بتعديل بيانات المنتج ثم اضغط على حفظ التغييرات"
                : "أدخل بيانات المنتج الجديد ثم اضغط على إضافة"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المنتج</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم المنتج" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>وصف المنتج</FormLabel>
                        <FormControl>
                          <Textarea placeholder="أدخل وصف المنتج" rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>السعر</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" min="0" placeholder="أدخل سعر المنتج" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>القسم</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر القسم" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {displayCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormLabel>صورة المنتج</FormLabel>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-24 w-24 rounded-md border border-input overflow-hidden flex items-center justify-center bg-muted">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Product preview"
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
                </div>

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>منتج مميز</FormLabel>
                        <FormDescription>سيتم عرض المنتجات المميزة في الصفحة الرئيسية</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>متوفر للبيع</FormLabel>
                        <FormDescription>سيتم عرض المنتجات المتوفرة فقط للعملاء</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

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
                  ) : currentProduct ? (
                    "حفظ التغييرات"
                  ) : (
                    "إضافة المنتج"
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
            <DialogTitle>تأكيد حذف المنتج</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <div className="h-16 w-16 rounded-md overflow-hidden">
              <img
                src={currentProduct?.image || "/placeholder.svg?height=64&width=64"}
                alt={currentProduct?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-medium">{currentProduct?.name}</h4>
              <p className="text-sm text-muted-foreground">{currentProduct?.category_name}</p>
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
            <Button type="button" variant="destructive" onClick={confirmDeleteProduct} disabled={isSubmitting}>
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

export default ProductsManagement
