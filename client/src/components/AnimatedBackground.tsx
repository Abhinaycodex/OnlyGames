import { useEffect, useRef } from 'react'

const gameImages = [
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop', // Gaming setup
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop', // Gaming controller
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop', // Gaming keyboard
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&auto=format&fit=crop', // Gaming headset
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920&auto=format&fit=crop', // Gaming monitor
]

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const images = container.querySelectorAll('img')
    let currentIndex = 0

    const rotateImages = () => {
      images.forEach((img, index) => {
        if (index === currentIndex) {
          img.classList.add('opacity-100', 'scale-100', 'rotate-0')
          img.classList.remove('opacity-0', 'scale-95', 'rotate-1')
        } else {
          img.classList.remove('opacity-100', 'scale-100', 'rotate-0')
          img.classList.add('opacity-0', 'scale-95', 'rotate-1')
        }
      })
      currentIndex = (currentIndex + 1) % images.length
    }

    const interval = setInterval(rotateImages, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-sm" />
      <div ref={containerRef} className="absolute inset-0">
        {gameImages.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Game background ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out opacity-0 scale-95 rotate-1"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-background/20 to-background/80" />
    </div>
  )
}