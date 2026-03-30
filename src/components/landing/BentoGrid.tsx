import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Smartphone, MessageCircle, UserMinus, Zap, Eye, Shield, ChevronDown } from 'lucide-react';

const concepts = [
  {
    title: 'Ciberbullying',
    desc: 'Acoso a través de medios digitales: redes sociales, mensajería, foros.',
    stat: '37%',
    statLabel: 'de jóvenes lo experimentan',
    severity: 'Alta',
    icon: Smartphone,
    large: true,
  },
  {
    title: 'Acoso Verbal',
    desc: 'Insultos, burlas, amenazas verbales repetidas y sistemáticas.',
    stat: '44%',
    statLabel: 'forma más común',
    severity: 'Alta',
    icon: MessageCircle,
    large: true,
  },
  {
    title: 'Exclusión Social',
    desc: 'Aislar deliberadamente a alguien del grupo social.',
    stat: '28%',
    statLabel: 'de casos reportados',
    severity: 'Media',
    icon: UserMinus,
    large: false,
  },
  {
    title: 'Acoso Físico',
    desc: 'Agresiones físicas directas: empujones, golpes, daño a pertenencias.',
    stat: '20%',
    statLabel: 'incluyen contacto físico',
    severity: 'Alta',
    icon: Zap,
    large: false,
  },
  {
    title: 'Microagresiones',
    desc: 'Comentarios sutiles pero dañinos que normalizan la exclusión.',
    stat: '65%',
    statLabel: 'pasan desapercibidas',
    severity: 'Media',
    icon: Eye,
    large: false,
  },
  {
    title: 'El Rol del Testigo',
    desc: 'Los testigos tienen el mayor poder de cambio en situaciones de bullying.',
    stat: '57%',
    statLabel: 'de casos se detienen',
    severity: 'Alta',
    icon: Shield,
    large: false,
  },
];

function ConceptCard({ concept, index }: { concept: typeof concepts[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(!hovered)} // Mejora para móviles
      className={`glass-card rounded-3xl p-6 relative flex flex-col overflow-hidden transition-all duration-500 border border-softwhite/5 cursor-pointer lg:cursor-default ${
        concept.large ? 'md:col-span-2 lg:col-span-1' : 'col-span-1'
      } ${hovered ? 'bg-softwhite/[0.08] shadow-xl' : 'bg-softwhite/[0.03]'}`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            hovered ? 'bg-trust text-midnight' : 'bg-trust/10 text-trust'
          }`}>
            <concept.icon className="w-6 h-6" />
          </div>
          
          <div className="flex items-center gap-3">
             <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border hidden sm:block ${
              concept.severity === 'Alta' ? 'bg-warm/10 text-warm border-warm/20' : 'bg-hope/10 text-hope border-hope/20'
            }`}>
              {concept.severity}
            </span>
            {/* Indicador de despliegue (Flecha) */}
            <motion.div
              animate={{ rotate: hovered ? 180 : 0 }}
              className="text-mutedblue/50"
            >
              <ChevronDown size={20} />
            </motion.div>
          </div>
        </div>

        <h3 className="font-display font-bold text-2xl text-softwhite mb-3">
          {concept.title}
        </h3>
        <p className="text-sm md:text-base text-mutedblue font-body leading-relaxed">
          {concept.desc}
        </p>
      </div>
      
      <motion.div
        initial={false}
        animate={{ 
          height: hovered ? 'auto' : 0, 
          opacity: hovered ? 1 : 0,
          marginTop: hovered ? 24 : 0 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="overflow-hidden relative z-10"
      >
        <div className="pt-5 border-t border-softwhite/10">
          <p className="font-mono text-3xl font-bold text-trust mb-1">{concept.stat}</p>
          <p className="text-xs uppercase tracking-widest text-mutedblue font-semibold">
            {concept.statLabel}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BentoGrid() {
  return (
    <section id="conceptos" className="py-24 bg-midnight">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-softwhite mb-4">
            Tipos de <span className="text-trust">Bullying</span>
          </h2>
          <p className="text-mutedblue text-lg">
            Pasa el mouse o toca una tarjeta para conocer el impacto real de cada situación.
          </p>
        </div>

        {/* Grid optimizado: Ya no usamos row-span-2 para evitar cartas gigantes en PC */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {concepts.map((concept, i) => (
            <ConceptCard key={concept.title} concept={concept} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}