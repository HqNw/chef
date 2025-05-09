"use client"

import { Outlet } from "react-router-dom"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <motion.main
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

export default PublicLayout
