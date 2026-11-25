import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function App() {
  const container = useRef<HTMLDivElement>(null)

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

      <div className="fade-in my-16 h-56 w-56 rounded-full bg-gradient-to-br from-sky-300 to-indigo-400 shadow-[0_0_120px_rgba(129,140,248,0.45)]" />

      <button className="fade-in rounded-full bg-white/10 px-8 py-3 text-sm font-medium backdrop-blur transition hover:bg-white/20">
        Begin
      </button>
    </div>
  )
}

export default App