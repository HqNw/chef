import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/contexts/cart-context"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface Category {
  id: number
  name: string
  slug: string
  image: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category_id: number
  is_featured: boolean
}

interface Offer {
  id: number
  title: string
  description: string
  discount_percentage: number
  image: string
}

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const { addItem } = useCart()

  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [categoriesRef, categoriesInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [productsRef, productsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [offerRef, offerInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [aboutRef, aboutInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [categoriesRes, productsRes, offersRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products/featured"),
          api.get("/offers"),
        ])

        setCategories(categoriesRes.data)
        setFeaturedProducts(productsRes.data)
        setOffers(offersRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (offers.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [offers.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length)
  }

  // Placeholder images for demo
  const heroImages = [
    "/placeholder.svg?height=600&width=1200",
    "/placeholder.svg?height=600&width=1200",
    "/placeholder.svg?height=600&width=1200",
  ]

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-12 rounded-lg h-96 bg-card/50 animate-pulse"></div>
        <div className="grid grid-cols-2 gap-4 mb-12 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-card/50 animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-lg bg-card/50 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative h-[500px] mb-16 rounded-xl overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={offers[currentSlide]?.image || heroImages[currentSlide % heroImages.length]}
            alt="عروض المطعم"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {offers[currentSlide]?.title || "مطعم الشيف"}
          </h1>
          <p className="max-w-2xl mb-6 text-lg md:text-xl text-white/90">
            {offers[currentSlide]?.description || "أشهى المأكولات العربية والعالمية بأيدي أمهر الطهاة"}
          </p>
          <div className="flex space-x-4 space-x-reverse">
            <Button asChild size="lg">
              <Link to="/menu">استعرض القائمة</Link>
            </Button>
            {offers[currentSlide]?.discount_percentage && (
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm">
                خصم {offers[currentSlide].discount_percentage}%
              </Button>
            )}
          </div>
        </div>

        {offers.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute text-white -translate-y-1/2 rounded-full top-1/2 right-4 bg-black/30 hover:bg-black/50"
              onClick={prevSlide}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute text-white -translate-y-1/2 rounded-full top-1/2 left-4 bg-black/30 hover:bg-black/50"
              onClick={nextSlide}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div className="absolute flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
              {offers.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </>
        )}
      </motion.section>

      {/* Categories Section */}
      <motion.section
        ref={categoriesRef}
        initial={{ opacity: 0, y: 20 }}
        animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold md:text-3xl">أقسام الطعام</h2>
          <Link to="/menu" className="flex items-center text-primary hover:underline">
            عرض الكل
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.slice(0, 4).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={categoriesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link to={`/category/${category.slug}`} className="relative block h-40 overflow-hidden rounded-lg group">
                <img
                  src={category.image || `/placeholder.svg?height=300&width=300&text=${category.name}`}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-lg font-bold text-white">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section
        ref={productsRef}
        initial={{ opacity: 0, y: 20 }}
        animate={productsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold md:text-3xl">الأطباق المميزة</h2>
          <Link to="/menu" className="flex items-center text-primary hover:underline">
            عرض الكل
            <ChevronLeft className="w-4 h-4 mr-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.slice(0, 6).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={productsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="overflow-hidden transition-shadow rounded-lg shadow-md bg-card hover:shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={product.image || `/placeholder.svg?height=300&width=400&text=${product.name}`}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-lg font-bold">{product.name}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
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
        </div>
      </motion.section>

      {/* Special Offer Banner */}
      {offers.length > 0 && (
        <motion.section
          ref={offerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={offerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="relative overflow-hidden rounded-lg">
            <div className="p-8 bg-primary/90 md:p-12">
              <div className="md:max-w-2xl">
                <h2 className="mb-4 text-2xl font-bold md:text-3xl text-primary-foreground">{offers[0].title}</h2>
                <p className="mb-6 text-primary-foreground/90">{offers[0].description}</p>
                <div className="flex space-x-4 space-x-reverse">
                  <Button asChild variant="secondary">
                    <Link to="/menu">اطلب الآن</Link>
                  </Button>
                  <div className="flex items-center justify-center px-4 py-2 font-bold rounded-md bg-primary-foreground text-primary">
                    خصم {offers[0].discount_percentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* About Us Preview */}
      <motion.section
        ref={aboutRef}
        initial={{ opacity: 0, y: 20 }}
        animate={aboutInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">من نحن</h2>
            <p className="mb-6 text-muted-foreground">
              مطعم الشيف هو وجهتك المثالية لتذوق أشهى المأكولات العربية والعالمية. نحن نقدم تجربة طعام فريدة من نوعها
              بأيدي أمهر الطهاة وأجود المكونات الطازجة.
            </p>
            <p className="mb-6 text-muted-foreground">
              تأسس مطعمنا عام 2010 وأصبح منذ ذلك الحين وجهة مفضلة للعائلات والأصدقاء الباحثين عن تجربة طعام لا تُنسى في
              أجواء مريحة وخدمة متميزة.
            </p>
            <Button asChild>
              <Link to="/about-us">اقرأ المزيد</Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-lg">
            <img
              src="/placeholder.svg?height=400&width=600&text=مطعم الشيف"
              alt="مطعم الشيف"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
