import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { Lightbulb, ArrowRight, RefreshCcw } from 'lucide-react';

const nodes = [
  { id: 0, label: 'Inicio', desc: 'El primer acto de agresión ocurre. Puede ser verbal, físico o digital.', tip: 'Identificar las señales tempranas es clave.' },
  { id: 1, label: 'Repetición', desc: 'El comportamiento se repite de forma sistemática contra la misma persona.', tip: 'Documentar los incidentes ayuda a intervenir.' },
  { id: 2, label: 'Silencio', desc: 'La víctima no reporta por miedo, vergüenza o falta de confianza.', tip: 'Crear espacios seguros para hablar es fundamental.' },
  { id: 3, label: 'Normalización', desc: 'El entorno comienza a ver el acoso como algo "normal" o inevitable.', tip: 'Cuestionar los comportamientos tóxicos rompe el ciclo.' },
  { id: 4, label: 'Escalada', desc: 'La intensidad aumenta, generando daño psicológico y físico severo.', tip: 'Nunca es tarde para intervenir y buscar ayuda.' },
];

export default function CycleSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [activeNode, setActiveNode] = useState(0);

  const radius = 150; 
  const size = 400;   
  const center = size / 2;

  return (
    <section className="py-24 bg-[#96e7f2] relative overflow-hidden" id="ciclo">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0daebc]/20 rounded-full blur-[120px]" />

      <div ref={ref} className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-4xl md:text-6xl text-slate-900 mb-6">
            El Ciclo del <span className="text-rose-700 italic">Bullying</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24">
          
          {/* Visualización del Ciclo */}
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="absolute inset-0 transform -rotate-90">
              {/* Círculo base (fondo) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="2"
              />
              {/* Círculo de progreso animado */}
              <motion.circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#gradient-cycle)"
                strokeWidth="3"
                strokeDasharray="10 6"
                initial={{ pathLength: 0 }}
                animate={inView ? { pathLength: 1 } : {}}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="gradient-cycle" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1E6FD9" />
                  <stop offset="100%" stopColor="#F27457" />
                </linearGradient>
              </defs>
            </svg>

            {nodes.map((node, i) => {
              const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              const isActive = activeNode === i;

              return (
                <div
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{ left: x, top: y }}
                >
                  <button
                    onClick={() => setActiveNode(i)}
                    className="relative group focus:outline-none"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeGlow"
                        className="absolute -inset-4 rounded-full bg-trust/20 blur-xl"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <div className={`
                      relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500
                      ${isActive 
                        ? 'bg-[#0d7ea2] border-[#0d7ea2] text-white scale-110 shadow-lg shadow-[#0d7ea2]/20' 
                        : 'bg-white/90 border-slate-200 text-slate-700 hover:border-[#0d7ea2]/40'}`
                    }>
                      <span className="font-mono font-bold text-lg">{i + 1}</span>
                    </div>

                    <span className={`
                      absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap font-display font-semibold text-[10px] tracking-widest uppercase transition-all duration-300
                      ${isActive ? 'text-softwhite opacity-100' : 'text-mutedblue/40 opacity-0 group-hover:opacity-100'}
                    `}>
                      {node.label}
                    </span>
                  </button>
                </div>
              );
            })}

            {/* CENTRO INTUITIVO: Contador de Fase */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                key={activeNode}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center bg-white/80 backdrop-blur-md w-32 h-32 rounded-full border border-white/60 flex flex-col items-center justify-center"
              >
                <span className="text-slate-500 font-mono text-xs uppercase tracking-tighter mb-1">Fase</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-slate-900 font-display text-5xl font-black">{activeNode + 1}</span>
                  <span className="text-teal-800 font-display text-2xl font-bold">/</span>
                  <span className="text-slate-500/70 font-display text-xl font-bold">{nodes.length}</span>
                </div>
                <div className="mt-2 w-12 h-1 bg-softwhite/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-trust"
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeNode + 1) / nodes.length) * 100}%` }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tarjeta de Información */}
          <div className="w-full max-w-md relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card rounded-[2.5rem] p-10 border border-white/30 bg-white/80 backdrop-blur-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-slate-200/70" />
                  <span className="text-rose-700 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Crítico</span>
                  <div className="h-px flex-1 bg-slate-200/70" />
                </div>

                <h3 className="font-display font-bold text-4xl text-slate-900 mb-4 tracking-tight">
                  {nodes[activeNode].label}
                </h3>
                
                <p className="text-slate-700 font-body text-lg leading-relaxed mb-8 opacity-90">
                  {nodes[activeNode].desc}
                </p>

                <div className="flex items-start gap-4 bg-rose-50 border border-rose-100 rounded-2xl p-5 shadow-inner">
                  <Lightbulb className="text-rose-700 w-6 h-6 shrink-0" />
                  <div>
                    <span className="text-rose-700 font-bold text-[10px] uppercase tracking-widest block mb-1">Estrategia de Intervención</span>
                    <p className="text-slate-700/90 text-sm font-body leading-snug">
                      {nodes[activeNode].tip}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveNode((activeNode + 1) % nodes.length)}
                  className="mt-10 w-full py-4 rounded-xl border border-[#0d7ea2]/20 hover:border-[#0d7ea2]/50 hover:bg-[#0d7ea2]/10 flex items-center justify-center gap-3 text-[#0d7ea2] transition-all font-display font-bold text-sm uppercase tracking-widest group"
                >
                  {activeNode === nodes.length - 1 ? 'Reiniciar Ciclo' : 'Continuar Análisis'}
                  {activeNode === nodes.length - 1 ? <RefreshCcw size={16} /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}