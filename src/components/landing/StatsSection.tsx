import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, EyeOff, School, HandHelping } from 'lucide-react';

const stats = [
  { icon: Users, value: '1 de 3', label: 'estudiantes sufre bullying', suffix: '' },
  { icon: EyeOff, value: '85', label: 'de casos no se reportan', suffix: '%' },
  { icon: School, value: '160000', label: 'niños faltan a la escuela por miedo', suffix: '', format: true },
  { icon: HandHelping, value: '57', label: 'de incidentes se detienen con un testigo', suffix: '%' },
];

function AnimatedNumber({ value, suffix, format, inView }: { value: string; suffix: string; format?: boolean; inView: boolean }) {
  const [display, setDisplay] = useState('0');
  const isNumeric = /^\d+$/.test(value);

  useEffect(() => {
    if (!inView) return;
    if (!isNumeric) { setDisplay(value); return; }
    const target = parseInt(value);
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(format ? current.toLocaleString() : String(current));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value, isNumeric, format]);

  return <span>{display}{suffix}</span>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="estadisticas" className="py-24 bg-navy relative">
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div ref={ref} className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 text-center group hover:bg-softwhite/[0.06] transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-trust/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-trust/20 transition-colors">
                <stat.icon className="w-6 h-6 text-trust" />
              </div>
              <p className="font-display font-bold text-3xl md:text-4xl text-softwhite mb-2">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} format={stat.format} inView={inView} />
              </p>
              <p className="text-sm text-mutedblue font-body">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
