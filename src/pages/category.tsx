"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

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
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const categoryRes = await api.get(`/categories/slug/${slug}`)
        setCategory(categoryRes.data)

        const productsRes = await api.get(`/products/category/${categoryRes.data.id}`)
        setProducts(productsRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-card/50 animate-pulse rounded-lg mb-8 w-64"></div>
        <div className="h-8 bg-card/50 animate-pulse rounded-lg mb-8 w-full max-w-xs"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-card/50 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">القسم غير موجود</h2>
          <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على القسم المطلوب</p>
          <Button asChild>
            <a href="/menu">العودة إلى القائمة</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center mb-2">
          <a href="/menu" className="text-muted-foreground hover:text-primary flex items-center">
            القائمة
            <ChevronLeft className="h-4 w-4 mx-1" />
          </a>
          <span>{category.name}</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">{category.name}</h1>

        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">عدد المنتجات: {products.length}</p>

          <div className="w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="الترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">الاسم (أ-ي)</SelectItem>
                <SelectItem value="price_asc">السعر (الأقل أولاً)</SelectItem>
                <SelectItem value="price_desc">السعر (الأعلى أولاً)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">لا توجد منتجات في هذا القسم حالياً</p>
          </div>
        ) : (
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={product.image || `/placeholder.svg?height=300&width=400&text=${product.name}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                    <Button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image || `/placeholder.svg?height=100&width=100&text=${product.name}`,
                        })
                      }
                    >
                      إضافة للسلة
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default CategoryPage
