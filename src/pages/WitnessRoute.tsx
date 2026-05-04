import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, ClipboardList, Zap, MessageCircle, EyeOff, UserPlus, Megaphone, Smile, Handshake, ChevronRight, CheckCircle2, Eye, Users, Sparkles, AlertTriangle } from 'lucide-react';

// Assets (puedes ajustar las rutas de tus imágenes según corresponda)
import scene1 from '../assets/scene-1-hallway.jpg';
import scene2 from '../assets/scene-2-cyber.jpg';
import scene3 from '../assets/scene-3-exclusion.jpg';
import scene4 from '../assets/scene-4-locker.jpg';
import scene5 from '../assets/scene-5-extortion.jpg';

const witnessScenes = [
  {
    id: 1,
    image: scene1,
    title: 'Exclusión en el Grupo',
    narration: 'Notas que un compañero de clase es sistemáticamente excluido de los grupos de trabajo y se sienta solo en la cafetería.',
    options: [
      { text: 'Unirme a la exclusión para no ser excluido yo también', impact: 'reir' },
      { text: 'Hacer como si no lo hubiera notado y seguir con mis amigos', impact: 'ignorar' },
      { text: 'Acercarme a saludarlo e invitarlo a unirse a mi mesa', impact: 'intervenir' },
      { text: 'Informar a un profesor o tutor sobre la situación', impact: 'reportar' },
    ],
  },
  {
    id: 2,
    image: scene2,
    title: 'Burlas en Redes Sociales',
    narration: 'Ves comentarios ofensivos y burlas dirigidas a un compañero de clase en un chat público del grupo.',
    options: [
      { text: 'Darle "me gusta" a la burla para encajar', impact: 'reir' },
      { text: 'Silenciar el chat y no decir nada', impact: 'ignorar' },
      { text: 'Defender a tu compañero respondiendo con respeto y cortando el rumor', impact: 'intervenir' },
      { text: 'Reportar el mensaje y al usuario por acoso en la plataforma', impact: 'reportar' },
    ],
  },
  {
    id: 3,
    image: scene3,
    title: 'Acoso Verbal',
    narration: 'Un compañero es constantemente insultado y menospreciado por su apariencia física en los pasillos.',
    options: [
      { text: 'Reírme junto con el grupo para evitar problemas', impact: 'reir' },
      { text: 'Pasar de largo y fingir que no escucho nada', impact: 'ignorar' },
      { text: 'Mostrarle apoyo a la persona afectada después del incidente', impact: 'intervenir' },
      { text: 'Intervenir en el momento o buscar a una autoridad escolar', impact: 'reportar' },
    ],
  },
  {
    id: 4,
    image: scene4,
    title: 'Intimidación en el Casillero',
    narration: 'Observas cómo un estudiante bloquea el paso a otro y le exige que entregue sus pertenencias.',
    options: [
      { text: 'Grabar el conflicto para subirlo a internet', impact: 'reir' },
      { text: 'Alejarme rápidamente del lugar', impact: 'ignorar' },
      { text: 'Hacer ruido o distraer al agresor para detener la situación', impact: 'intervenir' },
      { text: 'Llamar inmediatamente a un adulto o personal de seguridad', impact: 'reportar' },
    ],
  },
  {
    id: 5,
    image: scene5,
    title: 'Extorsión o Presión Grupal',
    narration: 'Notas que algunos compañeros obligan a otro a hacerles tareas o pagarles dinero para dejarlo en paz.',
    options: [
      { text: 'Aprovecharme de la situación para pedir también favores', impact: 'reir' },
      { text: 'No intervenir porque no es mi problema', impact: 'ignorar' },
      { text: 'Hablar con la víctima para brindarle apoyo y sugerir ayuda', impact: 'intervenir' },
      { text: 'Denunciar la situación con las autoridades del colegio de forma confidencial', impact: 'reportar' },
    ],
  },
];

const profiles = {
  pasivo: {
    title: 'Espectador Pasivo',
    desc: 'Tu impulso es mantener distancia para no complicarte. Esto ayuda a protegerte individualmente, pero deja el espacio libre para que el acoso continúe.',
    icon: <EyeOff className="w-8 h-8 text-warm" />,
    tips: ['Empieza con pequeños gestos.', 'Habla con alguien de confianza.', 'Tu silencio puede ser interpretado como aprobación.'],
  },
  temeroso: {
    title: 'Espectador Temeroso',
    desc: 'Sientes empatía, pero el miedo al "qué dirán" te frena. Eres un aliado potencial que solo necesita un poco más de seguridad.',
    icon: <MessageCircle className="w-8 h-8 text-mutedblue" />,
    tips: ['Busca otros compañeros que piensen como tú.', 'Identifica adultos confiables.', 'Apoyar después del evento también cuenta.'],
  },
  aliado: {
    title: 'Aliado en Proceso',
    desc: 'Ya estás tomando conciencia y actuando de forma indirecta. Buscas soluciones que protejan a la víctima y tu seguridad.',
    icon: <UserPlus className="w-8 h-8 text-hope" />,
    tips: ['Sigue brindando compañía.', 'Anímate a reportar de forma anónima.', 'Tu presencia positiva ya está cambiando el clima.'],
  },
  defensor: {
    title: 'Defensor Activo',
    desc: 'Eres una pieza clave para detener el acoso. Usas tu voz y liderazgo para marcar límites claros frente a las injusticias.',
    icon: <Shield className="w-8 h-8 text-hope" />,
    tips: ['Lidera con el ejemplo.', 'Intervén siempre con respeto.', 'Comparte tus estrategias con otros.'],
  },
};

const profileQuestions = [
  { q: '¿Qué haces cuando ves a alguien siendo excluido en el grupo?', opts: [
    { text: 'Paso de largo y no me meto', type: 'pasivo' },
    { text: 'Quisiera ayudar, pero me da miedo', type: 'temeroso' },
    { text: 'Busco una forma de apoyarlo indirectamente', type: 'aliado' },
    { text: 'Le ofrezco ayuda directamente', type: 'defensor' },
  ]},
  { q: 'Cuando escuchas rumores dañinos sobre alguien, tú:', opts: [
    { text: 'No me meto', type: 'pasivo' },
    { text: 'Me da miedo que me vean raro', type: 'temeroso' },
    { text: 'Le muestro apoyo a la persona', type: 'aliado' },
    { text: 'Rechazo el rumor y protejo a quien lo sufre', type: 'defensor' },
  ]},
  { q: 'Si un compañero te pide ayuda durante un conflicto, tú:', opts: [
    { text: 'Digo que no es asunto mío', type: 'pasivo' },
    { text: 'Quisiera ayudar, pero no sé si es seguro', type: 'temeroso' },
    { text: 'Busco a un adulto confiable', type: 'aliado' },
    { text: 'Actúo para calmar la situación', type: 'defensor' },
  ]},
  { q: 'En reuniones o en el recreo, cuando notas injusticias, tú:', opts: [
    { text: 'Guardo silencio', type: 'pasivo' },
    { text: 'Siento miedo a represalias', type: 'temeroso' },
    { text: 'Me acerco con cuidado', type: 'aliado' },
    { text: 'Uso mi voz para señalar lo que está mal', type: 'defensor' },
  ]},
  { q: 'Para ser mejor espectador, tú crees que necesitas:', opts: [
    { text: 'Evitar meterme', type: 'pasivo' },
    { text: 'Más seguridad', type: 'temeroso' },
    { text: 'Herramientas para apoyar', type: 'aliado' },
    { text: 'Más responsabilidad y liderazgo', type: 'defensor' },
  ]},
];

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'reir': return <Smile className="w-5 h-5 text-warm" />;
    case 'ignorar': return <EyeOff className="w-5 h-5 text-warm" />;
    case 'intervenir': return <Handshake className="w-5 h-5 text-hope" />;
    case 'reportar': return <Megaphone className="w-5 h-5 text-trust" />;
    default: return <Zap className="w-5 h-5 text-mutedblue" />;
  }
};

export default function WitnessRoute() {
  const { completeModule } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  
  // Simulador States
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState<typeof witnessScenes[0]['options'][0] | null>(null);
  const [simAnswers, setSimAnswers] = useState<string[]>([]);
  const [isSimFinished, setIsSimFinished] = useState(false);

  // Test States
  const [profileStep, setProfileStep] = useState(0);
  const [profileAnswers, setProfileAnswers] = useState<string[]>([]);
  const [profileResult, setProfileResult] = useState<string | null>(null);

  const handleSceneChoice = (option: typeof witnessScenes[0]['options'][0]) => {
    setChosenOption(option);
    setSimAnswers([...simAnswers, option.impact]);
    
    setTimeout(() => {
      setChosenOption(null);
      if (sceneIndex < witnessScenes.length - 1) {
        setSceneIndex(sceneIndex + 1);
      } else {
        setIsSimFinished(true);
        completeModule('testigo-simulator');
      }
    }, 2000);
  };

  const getSimFinalMessage = () => {
    const positives = simAnswers.filter(a => a === 'intervenir' || a === 'reportar').length;
    if (positives === 5) return { 
        title: "Defensor Ejemplar", 
        msg: "Has demostrado un compromiso total con la convivencia. Tu valentía para actuar y reportar es lo que transforma una escuela en un lugar seguro.",
        color: "text-hope"
    };
    if (positives >= 3) return { 
        title: "Aliado en camino", 
        msg: "Tienes la intención clara de ayudar. En algunas situaciones dudas, pero tu tendencia es proteger a los demás. ¡Sigue fortaleciendo esa seguridad!",
        color: "text-trust"
    };
    return { 
        title: "Observador en Reflexión", 
        msg: "Parece que el miedo o la duda te frenaron en varias situaciones. Recuerda que no actuar también tiene un impacto. ¡Este es un buen momento para aprender nuevas herramientas de apoyo!",
        color: "text-warm"
    };
  };

  const handleProfileAnswer = (type: string) => {
    const newAnswers = [...profileAnswers, type];
    setProfileAnswers(newAnswers);
    if (profileStep < profileQuestions.length - 1) {
      setProfileStep(profileStep + 1);
      return;
    }
    const counts: Record<string, number> = {};
    newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
    const order = ['defensor', 'aliado', 'temeroso', 'pasivo'];
    const result = Object.entries(counts).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return order.indexOf(a[0]) - order.indexOf(b[0]);
    })[0][0];
    setProfileResult(result);
  };

  const modules = [
    { icon: Zap, label: 'Entrenamiento' },
    { icon: ClipboardList, label: 'Test' }
  ];

  return (
    <div className="min-h-screen pt-24" style={{ background: 'linear-gradient(180deg, #6fe5f1 0%, #aaf1f7 100%)' }}>
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Lateral */}
        <div className="hidden lg:block w-72 min-h-screen border-r border-softwhite/5 p-8 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-slate-800 hover:text-indigo-900 text-base mb-10 transition-colors group font-medium">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Volver
          </Link>
          <h3 className="font-display font-bold text-2xl text-slate-900 mb-8 tracking-tight">Centro de Apoyo</h3>
          <div className="space-y-3">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${
                  activeModule === i 
                    ? 'bg-indigo-600/20 text-indigo-900 border border-indigo-200 shadow-sm' 
                    : 'text-slate-700 hover:bg-white/40 hover:text-slate-900'
                }`}>
                <mod.icon className="w-5 h-5" />
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-10 max-w-4xl pb-24 lg:pb-10 mx-auto">
          {/* Navegación Móvil */}
          <div className="lg:hidden flex flex-col gap-4 mb-8">
            <Link to="/caminos" className="flex items-center gap-2 text-mutedblue text-sm">
              <ArrowLeft className="w-4 h-4" /> Volver a Caminos
            </Link>
            <div className="flex gap-2">
              {modules.map((mod, i) => (
                <button
                  key={i}
                  onClick={() => setActiveModule(i)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all ${
                    activeModule === i 
                      ? 'bg-hope text-midnight shadow-lg shadow-hope/20' 
                      : 'bg-white/5 text-slate-900 border border-white/10'
                  }`}
                >
                  <mod.icon className="w-4 h-4" />
                  {mod.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* SECCIÓN 0: SIMULADOR */}
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {!isSimFinished ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display font-bold text-3xl text-slate-900 flex items-center gap-3">
                        <Eye className="text-trust" /> Entrenamiento
                      </h2>
                      <span className="text-mutedblue font-mono text-sm">{sceneIndex + 1} / {witnessScenes.length}</span>
                    </div>

                    <motion.div key={witnessScenes[sceneIndex].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                      <div className="relative aspect-video sm:aspect-auto sm:h-[400px]">
                        <img src={witnessScenes[sceneIndex].image} className="w-full h-full object-cover" alt="Situación" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent" />
                        <div className="absolute bottom-0 p-4 sm:p-8">
                          <p className="text-white text-xl sm:text-2xl leading-snug font-medium">{witnessScenes[sceneIndex].title}</p>
                          <p className="text-slate-300 text-sm sm:text-base mt-2">{witnessScenes[sceneIndex].narration}</p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {witnessScenes[sceneIndex].options.map((opt, i) => (
                        <button key={i} onClick={() => !chosenOption && handleSceneChoice(opt)}
                          disabled={!!chosenOption}
                          className={`p-4 rounded-xl border text-left transition-all flex gap-3 items-center
                            ${chosenOption === opt ? 'border-hope bg-hope/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                            ${chosenOption && chosenOption !== opt ? 'opacity-40' : 'opacity-100'}`}>
                          {getImpactIcon(opt.impact)}
                          <span className="text-slate-900 text-sm sm:text-base">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-12 text-center rounded-3xl border border-white/10">
                    <Award className="w-16 h-16 text-hope mx-auto mb-6" />
                    <h3 className={`text-2xl sm:text-4xl font-display font-bold mb-4 ${getSimFinalMessage().color}`}>
                        {getSimFinalMessage().title}
                    </h3>
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
                        {getSimFinalMessage().msg}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={() => { setIsSimFinished(false); setSceneIndex(0); setSimAnswers([]); }}
                          className="px-6 py-4 rounded-xl bg-white/10 text-slate-900 font-bold hover:bg-white/20 transition-all">
                            REPETIR ENTRENAMIENTO
                        </button>
                        <button onClick={() => setActiveModule(1)}
                          className="px-6 py-4 rounded-xl bg-hope text-midnight font-bold hover:bg-hope/90 transition-all shadow-lg shadow-hope/20">
                            REALIZAR TEST DE PERFIL
                        </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* SECCIÓN 1: TEST DE PERFIL */}
            {activeModule === 1 && (
              <motion.div key="test" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {profileResult ? (
                  <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-10 text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-midnight border border-white/10 mb-6">
                      {profiles[profileResult as keyof typeof profiles].icon}
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 mb-4">{profiles[profileResult as keyof typeof profiles].title}</h3>
                    <p className="text-slate-700 italic mb-8 text-lg leading-relaxed">"{profiles[profileResult as keyof typeof profiles].desc}"</p>
                    <div className="space-y-3 text-left max-w-md mx-auto">
                      <h4 className="text-hope font-bold text-sm uppercase tracking-widest mb-4">Consejos para crecer:</h4>
                      {profiles[profileResult as keyof typeof profiles].tips.map((tip, idx) => (
                        <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-5 h-5 text-hope shrink-0" />
                          <p className="text-slate-600 text-sm sm:text-base">{tip}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setProfileResult(null); setProfileStep(0); setProfileAnswers([]); }}
                      className="mt-10 w-full sm:w-auto px-10 py-4 rounded-xl bg-white/10 text-slate-900 font-bold hover:bg-white/20 transition-all">
                      REINICIAR TEST
                    </button>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-10">
                        <span className="text-hope text-xs font-bold uppercase tracking-widest">Pregunta {profileStep + 1} de {profileQuestions.length}</span>
                        <h3 className="text-3xl sm:text-4xl font-display text-slate-900 mt-2 leading-tight">{profileQuestions[profileStep].q}</h3>
                    </div>
                    <div className="space-y-3">
                      {profileQuestions[profileStep].opts.map((opt, i) => (
                        <button key={i} onClick={() => handleProfileAnswer(opt.type)}
                          className="w-full p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-hope/50 hover:bg-hope/5 transition-all text-left flex justify-between items-center group">
                          <span className="text-slate-900 group-hover:text-slate-800 text-base sm:text-lg">{opt.text}</span>
                          <ChevronRight className="w-5 h-5 text-mutedblue group-hover:text-hope shrink-0 ml-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}