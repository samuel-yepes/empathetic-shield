import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: 'Cuando alguien finalmente me preguntó cómo estaba, sentí que el mundo no estaba completamente en mi contra.',
    initials: 'MR',
    age: '15 años',
    role: 'Estudiante',
    color: 'from-trust/20 to-trust/5',
    accent: 'bg-trust',
  },
  {
    quote: 'No sabía que lo que hacía era bullying hasta que vi cómo afectaba a otros. Cambiar fue la mejor decisión.',
    initials: 'DA',
    age: '16 años',
    role: 'Ex-agresor',
    color: 'from-hope/20 to-hope/5',
    accent: 'bg-hope',
  },
  {
    quote: 'Fui testigo durante meses. El día que hablé, todo cambió. Los testigos tenemos más poder del que creemos.',
    initials: 'LC',
    age: '14 años',
    role: 'Testigo valiente',
    color: 'from-warm/20 to-warm/5',
    accent: 'bg-warm',
  },
];

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false });

  useEffect(() => {
    if (!inView) return;
    const interval = 8000;
    const step = 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActive((a) => (a + 1) % testimonials.length);
          return 0;
        }
        return prev + (step / interval) * 100;
      });
    }, step);
    return () => clearInterval(timer);
  }, [active, inView]);

  const handleNext = () => { setActive((a) => (a + 1) % testimonials.length); setProgress(0); };
  const handlePrev = () => { setActive((a) => (a - 1 + testimonials.length) % testimonials.length); setProgress(0); };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-midnight relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-trust rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-warm rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">
          
          {/* Lado Izquierdo: Info (En móvil queda arriba de la carta) */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
            >
              <h2 className="font-display font-bold text-4xl md:text-6xl text-softwhite mb-6 leading-tight">
                Voces que <br className="hidden lg:block" /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-hope to-trust italic">rompen el silencio</span>
              </h2>
              <p className="text-mutedblue text-base md:text-lg font-body max-w-xl mx-auto lg:mx-0">
                Historias reales de quienes vivieron el ciclo y decidieron cambiar el final. Tu voz también importa.
              </p>
              
              {/* Controles: SOLO VISIBLES EN PC AQUÍ */}
              <div className="hidden lg:flex items-center gap-4 mt-8">
                <ControlButtons handlePrev={handlePrev} handleNext={handleNext} />
              </div>
            </motion.div>
          </div>

          {/* Lado Derecho: La Carta + Controles Móvil */}
          <div className="w-full lg:w-2/3 flex flex-col items-center">
            <div className="relative w-full h-[400px] md:h-[450px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.05, x: -20 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className={`absolute w-full max-w-xl glass-card rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 border border-softwhite/10 bg-gradient-to-br ${testimonials[active].color} backdrop-blur-3xl shadow-2xl`}
                >
                  <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-12 h-12 md:w-16 md:h-16 bg-midnight border border-softwhite/10 rounded-xl md:rounded-2xl flex items-center justify-center text-trust">
                    <Quote size={24} className="md:w-8 md:h-8 opacity-40" />
                  </div>

                  <blockquote className="font-display text-xl md:text-3xl text-softwhite leading-relaxed mb-8 md:mb-10 italic">
                    "{testimonials[active].quote}"
                  </blockquote>

                  <div className="flex items-center gap-4 md:gap-5">
                    <div className={`w-12 h-12 md:w-14 md:h-14 ${testimonials[active].accent} rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="font-display font-bold text-softwhite text-lg md:text-xl">
                        {testimonials[active].initials}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-softwhite font-display font-bold text-base md:text-lg leading-none mb-1">
                        Anónimo <span className="text-mutedblue/50 font-normal ml-1">| {testimonials[active].age}</span>
                      </h4>
                      <p className="text-trust font-mono text-[10px] md:text-xs uppercase tracking-widest">
                        {testimonials[active].role}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 rounded-b-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${testimonials[active].accent}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Stack Effect (Desktop Only for cleanliness) */}
              <div className="hidden md:block absolute w-full max-w-xl h-full border border-softwhite/5 rounded-[2.5rem] -z-10 translate-x-4 translate-y-4 opacity-20" />
            </div>

            {/* Controles: SOLO VISIBLES EN MÓVIL AQUÍ (Debajo de la carta) */}
            <div className="flex lg:hidden items-center gap-6 mt-8">
              <ControlButtons handlePrev={handlePrev} handleNext={handleNext} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// Subcomponente de botones para no repetir código
function ControlButtons({ handlePrev, handleNext }) {
  return (
    <>
      <button 
        onClick={handlePrev}
        className="p-4 md:p-5 rounded-2xl border border-softwhite/10 bg-softwhite/5 text-softwhite active:scale-95 transition-all"
        aria-label="Anterior"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={handleNext}
        className="p-4 md:p-5 rounded-2xl border border-softwhite/10 bg-softwhite/5 text-softwhite active:scale-95 transition-all"
        aria-label="Siguiente"
      >
        <ChevronRight size={24} />
      </button>
    </>
  );
}