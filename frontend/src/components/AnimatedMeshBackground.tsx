"use client"

import { useEffect, useRef } from 'react'

export default function AnimatedMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      time += 0.005

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Create gradient mesh with #009890 theme
      const gradient = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time * 0.8) * 200,
        height * 0.4 + Math.cos(time * 0.6) * 150,
        0,
        width * 0.7 + Math.cos(time * 0.5) * 300,
        height * 0.6 + Math.sin(time * 0.7) * 200,
        Math.max(width, height) * 0.8
      )

      // Teal/turquoise gradient based on #009890
      gradient.addColorStop(0, `rgba(0, 152, 144, ${0.15 + Math.sin(time) * 0.05})`)
      gradient.addColorStop(0.3, `rgba(0, 128, 120, ${0.1 + Math.cos(time * 1.2) * 0.03})`)
      gradient.addColorStop(0.6, `rgba(0, 104, 96, ${0.08 + Math.sin(time * 0.8) * 0.02})`)
      gradient.addColorStop(1, 'rgba(11, 12, 16, 0.9)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Secondary gradient for depth with complementary teal shades
      const gradient2 = ctx.createRadialGradient(
        width * 0.7 + Math.cos(time * 0.9) * 250,
        height * 0.3 + Math.sin(time * 0.4) * 180,
        0,
        width * 0.2 + Math.sin(time * 0.6) * 200,
        height * 0.8 + Math.cos(time * 0.8) * 120,
        Math.max(width, height) * 0.6
      )

      gradient2.addColorStop(0, `rgba(0, 180, 170, ${0.12 + Math.cos(time * 1.1) * 0.04})`)
      gradient2.addColorStop(0.4, `rgba(0, 140, 130, ${0.08 + Math.sin(time * 0.9) * 0.03})`)
      gradient2.addColorStop(0.7, `rgba(0, 100, 90, ${0.05 + Math.cos(time * 0.7) * 0.02})`)
      gradient2.addColorStop(1, 'rgba(11, 12, 16, 0.95)')

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, width, height)

      // Cyan accent highlights (lighter complement to #009890)
      const accentGradient = ctx.createRadialGradient(
        width * 0.8 + Math.sin(time * 0.3) * 100,
        height * 0.2 + Math.cos(time * 0.5) * 80,
        0,
        width * 0.8 + Math.sin(time * 0.3) * 100,
        height * 0.2 + Math.cos(time * 0.5) * 80,
        200 + Math.sin(time * 0.8) * 50
      )

      accentGradient.addColorStop(0, `rgba(0, 255, 230, ${0.03 + Math.sin(time * 1.5) * 0.02})`)
      accentGradient.addColorStop(0.5, `rgba(0, 220, 200, ${0.02 + Math.cos(time * 1.3) * 0.01})`)
      accentGradient.addColorStop(1, 'rgba(0, 255, 230, 0)')

      ctx.fillStyle = accentGradient
      ctx.fillRect(0, 0, width, height)

      // Additional cyan accent
      const accentGradient2 = ctx.createRadialGradient(
        width * 0.1 + Math.cos(time * 0.4) * 120,
        height * 0.9 + Math.sin(time * 0.6) * 100,
        0,
        width * 0.1 + Math.cos(time * 0.4) * 120,
        height * 0.9 + Math.sin(time * 0.6) * 100,
        150 + Math.cos(time * 0.9) * 40
      )

      accentGradient2.addColorStop(0, `rgba(64, 224, 208, ${0.025 + Math.cos(time * 1.2) * 0.015})`)
      accentGradient2.addColorStop(0.6, `rgba(32, 178, 170, ${0.015 + Math.sin(time * 1.1) * 0.01})`)
      accentGradient2.addColorStop(1, 'rgba(64, 224, 208, 0)')

      ctx.fillStyle = accentGradient2
      ctx.fillRect(0, 0, width, height)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'var(--color-background)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      />
      {/* Subtle overlay for additional depth with teal theme */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 152, 144, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 255, 230, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 128, 120, 0.08) 0%, transparent 50%)
          `
        }}
      />
    </div>
  )
}