import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Smartphone, MessageCircle, UserMinus, Zap, Eye, Shield } from 'lucide-react';

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
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:bg-softwhite/[0.06] ${
        concept.large ? 'md:col-span-1 md:row-span-2' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-trust/10 flex items-center justify-center">
          <concept.icon className="w-5 h-5 text-trust" />
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded-full ${
          concept.severity === 'Alta'
            ? 'bg-warm/10 text-warm'
            : 'bg-hope/10 text-hope'
        }`}>
          {concept.severity}
        </span>
      </div>
      <h3 className="font-display font-bold text-xl text-softwhite mb-2">{concept.title}</h3>
      <p className="text-sm text-mutedblue font-body leading-relaxed mb-4">{concept.desc}</p>
      
      <motion.div
        initial={false}
        animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-4 border-t border-softwhite/5">
          <p className="font-mono text-2xl font-bold text-trust mb-1">{concept.stat}</p>
          <p className="text-xs text-mutedblue">{concept.statLabel}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BentoGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="conceptos" className="py-24 bg-midnight">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-softwhite mb-4">
            Tipos de <span className="text-trust">Bullying</span>
          </h2>
          <p className="text-mutedblue font-body max-w-xl mx-auto">
            Conocer las formas de acoso es el primer paso para prevenirlo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          {concepts.map((concept, i) => (
            <ConceptCard key={concept.title} concept={concept} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
