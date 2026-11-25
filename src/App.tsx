import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'rest'

const phaseText: Record<Phase, string> = {
  idle: 'Ready when you are',
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out',
  rest: 'Rest',
}

interface Step {
  phase: Exclude<Phase, 'idle'>
  duration: number
  scale: number
}

interface Pattern {
  id: string
  label: string
  steps: Step[]
}

const patterns: Pattern[] = [
  {
    id: 'calm',
    label: 'Calm',
    steps: [
      { phase: 'inhale', duration: 4, scale: 1.5 },
      { phase: 'hold', duration: 2, scale: 1.5 },
      { phase: 'exhale', duration: 6, scale: 1 },
    ],
  },
  {
    id: 'relax',
    label: '4-7-8',
    steps: [
      { phase: 'inhale', duration: 4, scale: 1.5 },
      { phase: 'hold', duration: 7, scale: 1.5 },
      { phase: 'exhale', duration: 8, scale: 1 },
    ],
  },
  {
    id: 'box',
    label: 'Box',
    steps: [
      { phase: 'inhale', duration: 4, scale: 1.5 },
      { phase: 'hold', duration: 4, scale: 1.5 },
      { phase: 'exhale', duration: 4, scale: 1 },
      { phase: 'rest', duration: 4, scale: 1 },
    ],
  },
]

function App() {
  const container = useRef<HTMLDivElement>(null)
  const orb = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [isBreathing, setIsBreathing] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [pattern, setPattern] = useState<Pattern>(patterns[0])

  // Entrance animation (plays once)
  useGSAP(
    () => {
      gsap.from('.fade-in', {
        opacity: 0,
        y: 24,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
      })
    },
    { scope: container }
  )

  // Breathing timeline (rebuilds when the pattern changes)
  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, paused: true })

      pattern.steps.forEach((step) => {
        tl.to(orb.current, {
          scale: step.scale,
          duration: step.duration,
          ease:
            step.phase === 'inhale' || step.phase === 'exhale'
              ? 'sine.inOut'
              : 'none',
          onStart: () => setPhase(step.phase),
        })
      })

      timeline.current = tl
    },
    { scope: container, dependencies: [pattern] }
  )

  // Fade the phase text whenever the phase changes
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

  const selectPattern = (next: Pattern) => {
    setPattern(next)
    setIsBreathing(false)
    setPhase('idle')
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

      <div className="fade-in mt-8 flex gap-1 rounded-full bg-white/5 p-1 ring-1 ring-white/10">
        {patterns.map((p) => (
          <button
            key={p.id}
            onClick={() => selectPattern(p)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              p.id === pattern.id
                ? 'bg-white/15 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App