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
    <div className="min-h-screen bg-midnight pt-28 pb-20">
      <div ref={ref} className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h1 className="font-display font-bold text-5xl md:text-6xl text-softwhite mb-4">
            ¿Cuál es tu <span className="text-trust">Historia</span>?
          </h1>
          <p className="text-mutedblue font-body text-lg max-w-xl mx-auto">
            Cada perspectiva importa. Elige la tuya para comenzar.
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
                  className="glass-card rounded-2xl p-8 h-[400px] flex flex-col items-center justify-center text-center group relative overflow-hidden"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at center, ${path.accent}, transparent 70%)` }}
                  />
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${path.accent}15` }}
                  >
                    <path.icon className="w-10 h-10" style={{ color: path.accent }} />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-softwhite mb-2">{path.label}</h3>
                  <p className="text-mutedblue font-body text-sm">{path.sublabel}</p>
                  <motion.div
                    className="mt-6 px-6 py-2.5 rounded-full text-sm font-body font-semibold text-softwhite"
                    style={{ backgroundColor: path.accent }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Comenzar →
                  </motion.div>
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
            className="text-mutedblue hover:text-trust transition-colors font-body text-sm underline underline-offset-4"
          >
            ¿No sabes cuál eres? → Toma el test de 2 minutos
          </button>
        </motion.div>
      </div>

      {showQuiz && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 backdrop-blur-lg p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card rounded-2xl p-8 max-w-md w-full relative"
          >
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-4 right-4 text-mutedblue hover:text-softwhite"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full bg-softwhite/5 rounded-full h-1.5 mb-6">
              <motion.div
                className="h-full rounded-full gradient-trust-hope"
                animate={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-mutedblue font-mono mb-4">
              Pregunta {quizStep + 1} de {quizQuestions.length}
            </p>
            <h3 className="font-display font-bold text-xl text-softwhite mb-6">
              {quizQuestions[quizStep].q}
            </h3>
            <div className="flex flex-col gap-3">
              {quizQuestions[quizStep].options.map((opt, oi) => (
                <motion.button
                  key={oi}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(oi)}
                  className="glass-card rounded-xl p-4 text-left text-softwhite font-body text-sm hover:bg-softwhite/[0.06] transition-colors"
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
