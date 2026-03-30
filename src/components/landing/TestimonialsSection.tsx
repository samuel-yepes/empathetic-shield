import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    quote: 'Cuando alguien finalmente me preguntó cómo estaba, sentí que el mundo no estaba completamente en mi contra.',
    initials: 'MR',
    age: '15 años',
    color: 'bg-trust',
  },
  {
    quote: 'No sabía que lo que hacía era bullying hasta que vi cómo afectaba a otros. Cambiar fue la mejor decisión.',
    initials: 'DA',
    age: '16 años',
    color: 'bg-hope',
  },
  {
    quote: 'Fui testigo durante meses. El día que hablé, todo cambió. Los testigos tenemos más poder del que creemos.',
    initials: 'LC',
    age: '14 años',
    color: 'bg-warm',
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-midnight">
      <div ref={ref} className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl text-softwhite mb-4">
            Voces <span className="text-hope">Reales</span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto relative">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl p-8 md:p-12 text-center"
          >
            <div className={`w-14 h-14 ${testimonials[active].color} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <span className="font-display font-bold text-softwhite text-lg">
                {testimonials[active].initials}
              </span>
            </div>
            <blockquote className="font-display text-xl md:text-2xl text-softwhite italic leading-relaxed mb-6">
              "{testimonials[active].quote}"
            </blockquote>
            <p className="text-mutedblue text-sm font-body">
              Anónimo, {testimonials[active].age}
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-mutedblue hover:text-softwhite transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === active ? 'bg-trust w-6' : 'bg-mutedblue/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setActive((a) => (a + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-mutedblue hover:text-softwhite transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
