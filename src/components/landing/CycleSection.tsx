import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

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
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const radius = 140;
  const center = 180;

  return (
    <section className="py-24 bg-navy relative">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div ref={ref} className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-softwhite mb-4">
            El Ciclo del <span className="text-warm">Bullying</span>
          </h2>
          <p className="text-mutedblue font-body max-w-xl mx-auto">
            Haz clic en cada etapa para entender cómo se perpetúa y cómo romperlo.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 justify-center">
          <div className="relative" style={{ width: 360, height: 360 }}>
            <svg width="360" height="360" viewBox="0 0 360 360">
              <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(107,127,163,0.15)" strokeWidth="2" />
              {nodes.map((node, i) => {
                const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
                const x = center + radius * Math.cos(angle);
                const y = center + radius * Math.sin(angle);
                const isActive = activeNode === i;
                
                return (
                  <g key={node.id}>
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={isActive ? 28 : 22}
                      fill={isActive ? '#1E6FD9' : 'rgba(30,111,217,0.15)'}
                      stroke="#1E6FD9"
                      strokeWidth={isActive ? 2 : 1}
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ delay: i * 0.2, duration: 0.4, type: 'spring' }}
                      onClick={() => setActiveNode(activeNode === i ? null : i)}
                      style={{ cursor: 'pointer' }}
                    />
                    <text
                      x={x}
                      y={y + 1}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#F0F4FF"
                      fontSize="9"
                      fontFamily="DM Sans"
                      fontWeight="500"
                      style={{ pointerEvents: 'none' }}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: activeNode !== null ? 1 : 0.5 }}
            className="glass-card rounded-2xl p-8 max-w-md w-full"
          >
            {activeNode !== null ? (
              <>
                <h3 className="font-display font-bold text-2xl text-softwhite mb-3">
                  {nodes[activeNode].label}
                </h3>
                <p className="text-mutedblue font-body mb-4 leading-relaxed">
                  {nodes[activeNode].desc}
                </p>
                <div className="bg-hope/10 rounded-xl p-4">
                  <p className="text-hope text-sm font-body font-medium">
                    💡 {nodes[activeNode].tip}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-mutedblue font-body text-center">
                Selecciona una etapa del ciclo para ver su descripción.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
