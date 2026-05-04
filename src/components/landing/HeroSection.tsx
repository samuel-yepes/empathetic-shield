import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_#aaf1f7_0%,_#6fe5f1_35%,_#7bd7dd_70%,_#78d4e9_100%)]">
      <ParticleCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.45)_0%,_transparent_45%)]" />
      <div className="absolute inset-0 gradient-mesh mix-blend-screen opacity-80" />

      <div className="relative z-10 container mx-auto px-4 lg:px-10 xl:px-16 pt-24 pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[420px_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col items-center lg:items-start gap-6 lg:pl-10"
          >
            <motion.img
              src="/logo_empathix.png"
              alt="Escudo Empathix"
              className="w-48 h-48 md:w-64 md:h-64 object-contain"
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 260 }}
            />
            <div className="text-center lg:text-left">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-900 leading-tight">
                Una defensa clara contra el bullying.
              </h2>
              <p className="mt-4 text-base md:text-lg text-slate-700 leading-relaxed max-w-md">
                Conecta con recursos, herramientas y rutas de apoyo desde un diseño más amable y directo.
              </p>
            </div>
          </motion.div>

          <div className="text-center lg:text-left lg:pl-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-6 text-slate-900"
            >
              <span className="block">Entender el Bullying</span>
              <span className="relative inline-block text-teal-800">
                es el Primer Paso
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute bottom-1 left-0 w-full h-1 bg-teal-700 origin-left rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-700 font-body max-w-2xl leading-relaxed mb-10"
            >
              Una herramienta interactiva para estudiantes, educadores y familias.
              Explora, aprende y actúa desde una experiencia visual y accesible.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/caminos"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#0d7ea3] to-[#11b5de] text-white font-body font-semibold text-base shadow-lg shadow-[#0d7ea3]/25"
                >
                  Encuentra tu Camino
                  <span>→</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="#estadisticas"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-card text-slate-900 font-body font-medium text-base hover:bg-white/70 transition-colors"
                >
                  Ver cómo funciona
                  <span>↓</span>
                </a>
              </motion.div>
            </motion.div>
          </div>
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
