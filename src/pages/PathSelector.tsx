import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Shield, Heart, Eye, X } from 'lucide-react';

const paths = [
  {
    id: 'agresor' as const,
    label: 'Soy el Agresor',
    sublabel: 'Quiero entender mi comportamiento',
    color: 'warm',
    icon: Shield,
    accent: '#F4845F',
    route: '/ruta/agresor',
  },
  {
    id: 'victima' as const,
    label: 'Estoy siendo afectado/a',
    sublabel: 'Necesito apoyo y herramientas',
    color: 'trust',
    icon: Heart,
    accent: '#1E6FD9',
    route: '/ruta/victima',
  },
  {
    id: 'testigo' as const,
    label: 'Lo estoy viendo',
    sublabel: 'Quiero saber cómo ayudar',
    color: 'hope',
    icon: Eye,
    accent: '#00C896',
    route: '/ruta/testigo',
  },
];

const quizQuestions = [
  { q: '¿Has presenciado a alguien siendo molestado?', options: ['Sí, frecuentemente', 'A veces', 'No'] },
  { q: '¿Alguien te ha hecho sentir mal repetidamente?', options: ['Sí', 'No estoy seguro/a', 'No'] },
  { q: '¿Has dicho o hecho cosas que lastimaron a otros?', options: ['Sí, me arrepiento', 'Tal vez sin darme cuenta', 'No'] },
  { q: '¿Qué sientes cuando ves conflictos?', options: ['Quiero intervenir', 'Me siento impotente', 'No sé qué hacer'] },
  { q: '¿Qué buscas en esta plataforma?', options: ['Entender mis acciones', 'Apoyo emocional', 'Aprender a ayudar'] },
];

export default function PathSelector() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const setUserPath = useAppStore((s) => s.setUserPath);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      setShowQuiz(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_#aaf1f7_0%,_#6fe5f1_35%,_#78d4e9_100%)] pt-28 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/60 blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#0d7ea2]/15 blur-3xl opacity-90 pointer-events-none" />
      <div ref={ref} className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h1 className="font-display font-bold text-5xl md:text-6xl text-slate-900 mb-4 leading-tight">
            ¿Cuál es tu <span className="text-teal-900">Historia</span>?
          </h1>
          <p className="text-slate-700 font-body text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Cada perspectiva importa. Elige la tuya para comenzar con seguridad, claridad y apoyo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {paths.map((path, i) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to={path.route}
                onClick={() => setUserPath(path.id)}
              >
                <motion.div
                  whileHover={{ y: -12, rotateX: 5, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="relative overflow-hidden rounded-3xl p-8 h-[400px] flex flex-col items-center justify-center text-center bg-white/85 border border-slate-200/60 shadow-lg shadow-slate-500/10 backdrop-blur-xl"
                  style={{ perspective: '1000px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#aaf1f7]/70 via-white/40 to-[#6fe5f1]/60 opacity-95" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,_rgba(13,126,162,0.18)_0%,_transparent_55%)]" />
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-2 bg-white shadow-sm shadow-slate-300/20">
                      <path.icon className="w-12 h-12" style={{ color: path.accent }} />
                    </div>
                    <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">{path.label}</h3>
                    <p className="text-slate-600 font-body text-sm leading-relaxed max-w-xs">{path.sublabel}</p>
                    <motion.div
                      className="mt-6 px-6 py-3 rounded-full text-sm font-body font-semibold text-white shadow-md shadow-slate-400/20"
                      style={{ backgroundColor: path.accent }}
                      whileHover={{ scale: 1.05 }}
                    >
                      Comenzar →
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={() => { setShowQuiz(true); setQuizStep(0); setAnswers([]); }}
            className="text-teal-900 hover:text-[#0d7ea2] transition-colors font-body text-sm underline underline-offset-4"
          >
            ¿No sabes cuál eres? → Toma el test de 2 minutos
          </button>
        </motion.div>
      </div>

      {showQuiz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-lg p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative rounded-3xl p-8 max-w-md w-full bg-white/95 shadow-2xl shadow-slate-500/20"
          >
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full bg-slate-200 rounded-full h-2 mb-6 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-teal-700"
                animate={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 font-mono mb-4">
              Pregunta {quizStep + 1} de {quizQuestions.length}
            </p>
            <h3 className="font-display font-bold text-2xl text-slate-900 mb-6 leading-snug">
              {quizQuestions[quizStep].q}
            </h3>
            <div className="flex flex-col gap-3">
              {quizQuestions[quizStep].options.map((opt, oi) => (
                <motion.button
                  key={oi}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(oi)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-slate-900 font-body text-sm hover:bg-slate-100 transition-colors shadow-sm"
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
