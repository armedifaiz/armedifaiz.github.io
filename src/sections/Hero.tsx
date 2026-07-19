import { motion } from 'framer-motion'
import { useRandomPhoto } from '../hooks/useRandomPhoto'
import Button from '../components/common/Button'
import { hero } from '../data/site'

export default function Hero() {
  const photo = useRandomPhoto()

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden bg-base-950">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-28 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 aspect-[4/5] w-full overflow-hidden rounded-xl2 bg-base-800 md:order-1"
        >
          {photo ? (
            <img
              src={photo.imageUrl}
              alt="Foto profil"
              className="h-full w-full object-cover grayscale contrast-125"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/30">
              Add photo via scripts/drive_api.py
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 md:order-2"
        >
          <span className="font-display text-sm uppercase tracking-[0.3em] text-accent">{hero.badge}</span>
          <h1 className="mt-4 font-display text-5xl font-bold leading-tight text-white sm:text-6xl">
            {hero.name}
          </h1>
          <p className="mt-3 text-lg font-medium text-white/70">
            {hero.role}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
            {hero.tagline}
          </p>
          <div className="mt-8 flex gap-4">
            <Button href="#contact">{hero.primaryCta}</Button>
            <Button href="#projects" variant="outline">
              {hero.secondaryCta}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
