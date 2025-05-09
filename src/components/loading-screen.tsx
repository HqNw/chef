import { Loader2 } from "lucide-react"

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-bold">جاري التحميل...</h2>
      </div>
    </div>
  )
}

export default LoadingScreen
