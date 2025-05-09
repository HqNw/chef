import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

const Menu = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCart()

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [categoriesRes, productsRes] = await Promise.all([api.get("/categories"), api.get("/products")])

        setCategories(categoriesRes.data)
        setProducts(productsRes.data)
        setFilteredProducts(productsRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory) {
      result = result.filter((product) => product.category_id === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    // Sort products
    result.sort((a, b) => {
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

    setFilteredProducts(result)
  }, [products, selectedCategory, searchQuery, sortBy])

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const resetFilters = () => {
    setSelectedCategory(null)
    setSearchQuery("")
    setSortBy("name")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-12 bg-card/50 animate-pulse rounded-lg mb-8 w-full max-w-md"></div>
        <div className="flex overflow-x-auto space-x-2 space-x-reverse mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-24 bg-card/50 animate-pulse rounded-lg flex-shrink-0"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-card/50 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">قائمة الطعام</h1>

        {/* Mobile Filters Button */}
        <div className="md:hidden mb-4">
          <Button variant="outline" className="w-full" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="ml-2 h-4 w-4" />
            {showFilters ? "إخفاء الفلاتر" : "عرض الفلاتر"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search and Filters */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 space-y-4`}>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن طعام..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pr-10"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">الأقسام</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`w-full text-right px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === null ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  الكل
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-right px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === category.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">الترتيب</h3>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الترتيب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">الاسم (أ-ي)</SelectItem>
                  <SelectItem value="price_asc">السعر (الأقل أولاً)</SelectItem>
                  <SelectItem value="price_desc">السعر (الأعلى أولاً)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(selectedCategory !== null || searchQuery || sortBy !== "name") && (
              <Button variant="ghost" className="w-full" onClick={resetFilters}>
                <X className="ml-2 h-4 w-4" />
                إعادة ضبط الفلاتر
              </Button>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">لا توجد منتجات تطابق البحث</p>
                <Button variant="link" onClick={resetFilters} className="mt-2">
                  إعادة ضبط الفلاتر
                </Button>
              </div>
            ) : (
              <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
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
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Menu
