import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { PokeballIcon } from './icons'

export function Preloader() {
  const [mounted, setMounted] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!containerRef.current || !ballRef.current || !logoRef.current) return

    const tl = gsap.timeline({
      onComplete: () => setMounted(false),
    })

    // Initial state
    gsap.set(ballRef.current, { y: -300, rotation: -180, scale: 0 })
    gsap.set(logoRef.current, { opacity: 0, scale: 0.5, y: 20 })

    // 1. Drop the pokeball and bounce
    tl.to(ballRef.current, {
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.2,
      ease: 'bounce.out',
    })
    
    // 2. Wiggle left and right like catching a pokemon
    tl.to(ballRef.current, { rotation: 15, duration: 0.15, ease: 'power1.inOut' })
      .to(ballRef.current, { rotation: -15, duration: 0.15, ease: 'power1.inOut' })
      .to(ballRef.current, { rotation: 10, duration: 0.15, ease: 'power1.inOut' })
      .to(ballRef.current, { rotation: -10, duration: 0.15, ease: 'power1.inOut' })
      .to(ballRef.current, { rotation: 0, duration: 0.15, ease: 'power1.inOut' })
      
    // 3. Pause for suspense (did we catch it?)
    tl.to({}, { duration: 0.4 })

    // 4. Pop the logo up and explode the pokeball scale
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1.2,
      y: 0,
      duration: 0.6,
      ease: 'back.out(2)',
    }, 'pop')
    
    tl.to(ballRef.current, {
      scale: 25,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.in',
    }, 'pop')

    // 5. Fade out the whole container, revealing the app
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 'pop+=0.4')

  }, [])

  if (!mounted) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F2F2F2] overflow-hidden"
    >
      <div className="relative flex flex-col items-center justify-center">
        <div ref={ballRef} className="relative z-10 flex items-center justify-center text-gray-300 opacity-80">
          <PokeballIcon className="h-32 w-32" />
        </div>
        <img
          ref={logoRef}
          src="https://www.leany.com.br/lovable-uploads/bf894694-b8cc-4d09-9fab-d469b452aa1e.png"
          alt="Leany"
          className="absolute z-20 h-14 object-contain drop-shadow-xl"
        />
      </div>
    </div>
  )
}
