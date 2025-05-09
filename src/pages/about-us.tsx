import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

const AboutUs = () => {
  const [storyRef, storyInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [chefsRef, chefsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [galleryRef, galleryInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const chefs = [
    {
      id: 1,
      name: "أحمد محمد",
      role: "الشيف التنفيذي",
      bio: "يمتلك أحمد خبرة تزيد عن 15 عاماً في المطبخ العربي والعالمي. عمل في أشهر المطاعم في دبي وباريس قبل انضمامه إلى مطعم الشيف.",
      image: "/placeholder.svg?height=400&width=400&text=الشيف أحمد",
    },
    {
      id: 2,
      name: "سارة علي",
      role: "شيف الحلويات",
      bio: "متخصصة في الحلويات العربية والغربية، درست فنون الطهي في أرقى المعاهد بلندن وتتميز بإبداعاتها الفريدة في عالم الحلويات.",
      image: "/placeholder.svg?height=400&width=400&text=الشيف سارة",
    },
    {
      id: 3,
      name: "خالد عبدالله",
      role: "شيف المشويات",
      bio: "يعتبر خالد من أمهر الطهاة في مجال المشويات والأطباق الشرقية، يمتلك أسلوباً فريداً في تحضير أشهى أنواع المشويات.",
      image: "/placeholder.svg?height=400&width=400&text=الشيف خالد",
    },
  ]

  const galleryImages = [
    "/placeholder.svg?height=300&width=400&text=صورة المطعم 1",
    "/placeholder.svg?height=300&width=400&text=صورة المطعم 2",
    "/placeholder.svg?height=300&width=400&text=صورة المطعم 3",
    "/placeholder.svg?height=300&width=400&text=صورة المطعم 4",
    "/placeholder.svg?height=300&width=400&text=صورة المطعم 5",
    "/placeholder.svg?height=300&width=400&text=صورة المطعم 6",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-8">من نحن</h1>

        {/* Restaurant Story */}
        <motion.section
          ref={storyRef}
          initial={{ opacity: 0, y: 20 }}
          animate={storyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">قصة مطعمنا</h2>
              <p className="text-muted-foreground mb-4">
                بدأت قصة مطعم الشيف في عام 2010 عندما قرر الشيف أحمد محمد تحقيق حلمه بإنشاء مطعم يقدم أشهى المأكولات
                العربية والعالمية بلمسة عصرية مميزة.
              </p>
              <p className="text-muted-foreground mb-4">
                انطلق المطعم كمشروع صغير في حي شعبي، لكن سرعان ما ذاع صيته بفضل جودة الطعام والخدمة المتميزة، ليصبح
                اليوم واحداً من أشهر المطاعم في المدينة.
              </p>
              <p className="text-muted-foreground">
                نحن نؤمن بأن الطعام الجيد يجمع الناس ويخلق ذكريات لا تُنسى، لذلك نحرص على انتقاء أجود المكونات الطازجة
                وتقديم تجربة طعام استثنائية لكل زبائننا.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=500&width=600&text=قصة المطعم"
                alt="قصة مطعم الشيف"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* Chef Profiles */}
        <motion.section
          ref={chefsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={chefsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-8">فريق الطهاة</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chefs.map((chef, index) => (
              <motion.div
                key={chef.id}
                initial={{ opacity: 0, y: 20 }}
                animate={chefsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-64 overflow-hidden">
                  <img src={chef.image || "/placeholder.svg"} alt={chef.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{chef.name}</h3>
                  <p className="text-primary font-medium mb-4">{chef.role}</p>
                  <p className="text-muted-foreground">{chef.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Image Gallery */}
        <motion.section
          ref={galleryRef}
          initial={{ opacity: 0, y: 20 }}
          animate={galleryInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-8">معرض الصور</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={galleryInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-lg overflow-hidden h-64"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`صورة المطعم ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}

export default AboutUs
