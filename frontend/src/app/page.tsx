import { Suspense } from "react"
import dynamic from "next/dynamic"
import AnimatedMeshBackground from "@/components/AnimatedMeshBackground"
import NavigationHeader from "@/components/NavigationHeader"
import HeroSection from "@/components/HeroSection"
import BenefitsSection from "@/components/BenefitsSection"
import Footer from "@/components/Footer"

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="animate-pulse">
      <div className="h-20 bg-card/20 mb-8" />
      <div className="container mx-auto px-6 space-y-8">
        <div className="h-96 bg-card/20 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-card/20 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <AnimatedMeshBackground />
      
      <div className="relative z-10">
        <NavigationHeader />
        
        <main className="pt-20">
          <Suspense fallback={<LoadingSkeleton />}>
            <HeroSection className="relative z-20" />
            
            <div className="relative z-10 bg-gradient-to-b from-transparent via-background/80 to-background">
              <BenefitsSection className="py-32" />
            </div>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </div>
  )
}