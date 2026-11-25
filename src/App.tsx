import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale'

const phaseText: Record<Phase, string> = {
  idle: 'Ready when you are',
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out',
}

function App() {
  const container = useRef<HTMLDivElement>(null)
  const orb = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [isBreathing, setIsBreathing] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')

  useGSAP(
    () => {
      gsap.from('.fade-in', {
        opacity: 0,
        y: 24,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
      })

      timeline.current = gsap
        .timeline({ repeat: -1, paused: true })
        .to(orb.current, { scale: 1.5, duration: 4, ease: 'sine.inOut' })
        .to(orb.current, { scale: 1.5, duration: 2 })
        .to(orb.current, { scale: 1, duration: 6, ease: 'sine.inOut' })

      timeline.current = gsap
        .timeline({ repeat: -1, paused: true })
        .to(orb.current, {
          scale: 1.5,
          duration: 4,
          ease: 'sine.inOut',
          onStart: () => setPhase('inhale'),
        })
        .to(orb.current, {
          scale: 1.5,
          duration: 2,
          onStart: () => setPhase('hold'),
        })
        .to(orb.current, {
          scale: 1,
          duration: 6,
          ease: 'sine.inOut',
          onStart: () => setPhase('exhale'),
        })
    },
    { scope: container }
  )

  useGSAP(
    () => {
      gsap.fromTo(
        '.phase-text',
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
    },
    { scope: container, dependencies: [phase] }
  )

  const toggle = () => {
    if (isBreathing) {
      timeline.current?.pause()
    } else {
      timeline.current?.play()
    }
    setIsBreathing((current) => !current)
  }

  return (
    <div
      ref={container}
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-neutral-100"
    >
      <p className="fade-in text-sm font-medium tracking-widest text-indigo-300 uppercase">
        Breathe
      </p>

      <h1 className="fade-in mt-4 text-center text-5xl font-semibold tracking-tight sm:text-6xl">
        Take a moment.
      </h1>

      <div
        ref={orb}
        className="fade-in my-10 h-56 w-56 rounded-full bg-gradient-to-br from-sky-300 to-indigo-400 shadow-[0_0_120px_rgba(129,140,248,0.45)] will-change-transform"
      />
      
      <p className="phase-text mt-2 h-8 text-xl font-light tracking-wide text-neutral-300">
        {phaseText[phase]}
      </p>

      <button
        onClick={toggle}
        className="fade-in mt-6 rounded-full bg-white/10 px-8 py-3 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/20"
      >
        {isBreathing ? 'Pause' : 'Play'}
      </button>

      
    </div>
  )
}

export default App