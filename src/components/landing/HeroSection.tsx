import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-midnight">
      <ParticleCanvas />
      <div className="absolute inset-0 gradient-mesh" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6"
          >
            <span className="text-softwhite">Entender el Bullying</span>
            <br />
            <span className="relative inline-block text-trust">
              es el Primer Paso.
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute bottom-1 left-0 w-full h-1 bg-trust origin-left rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-mutedblue font-body max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Una herramienta interactiva para estudiantes, educadores y familias.
            Explora, aprende y actúa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/caminos"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-trust-hope text-softwhite font-body font-semibold text-base shadow-lg shadow-trust/25"
              >
                Encuentra tu Camino
                <span>→</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <a
                href="#estadisticas"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-softwhite font-body font-medium text-base hover:bg-softwhite/5 transition-colors"
              >
                Ver cómo funciona
                <span>↓</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
      </motion.div>
    </section>
  );
}
