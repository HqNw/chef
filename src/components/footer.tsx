import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">مطعم الشيف</h3>
            <p className="text-muted-foreground mb-4">
              نقدم أشهى المأكولات العربية والعالمية بأيدي أمهر الطهاة، لتجربة طعام لا تُنسى.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  القائمة
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-muted-foreground hover:text-primary transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">اتصل بنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 ml-2 mt-1 text-primary" />
                <span className="text-muted-foreground">شارع الملك فهد، الرياض، المملكة العربية السعودية</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 ml-2 text-primary" />
                <span className="text-muted-foreground" dir="ltr">
                  +966 12 345 6789
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 ml-2 text-primary" />
                <span className="text-muted-foreground">info@chef-restaurant.com</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">ساعات العمل</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-muted-foreground">الأحد - الخميس</span>
                <span className="text-muted-foreground">10:00 ص - 11:00 م</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">الجمعة - السبت</span>
                <span className="text-muted-foreground">12:00 م - 12:00 ص</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} مطعم الشيف. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
