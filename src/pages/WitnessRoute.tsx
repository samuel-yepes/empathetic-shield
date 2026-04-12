import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, ClipboardList, Zap, MessageCircle, EyeOff, UserPlus, Megaphone, Smile, Handshake, ChevronRight, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

// Assets
import scene1 from '../assets/scene-1-hallway.jpg';
import scene2 from '../assets/scene-2-cyber.jpg';
import scene3 from '../assets/scene-3-exclusion.jpg';
import scene4 from '../assets/scene-4-locker.jpg';
import scene5 from '../assets/scene-5-extortion.jpg';

const witnessScenes = [
  {
    id: 1,
    image: scene1,
    title: 'El Pasillo',
    narration: 'En el pasillo, ves a un grupo rodeando a un compañero más pequeño. Le están quitando su mochila y se burlan de él.',
    options: [
      { text: 'Unirse a las burlas', impact: 'reir' },
      { text: 'Pasar de largo sin mirar', impact: 'ignorar' },
      { text: 'Ponerse al lado del compañero', impact: 'intervenir' },
      { text: 'Buscar rápido a un profesor', impact: 'reportar' },
    ],
  },
  {
    id: 2,
    image: scene2,
    title: 'Ciberbullying',
    narration: 'En el grupo de WhatsApp de la clase, empiezan a circular memes hirientes y fotos retocadas sobre una compañera.',
    options: [
      { text: 'Reenviar el mensaje a otros', impact: 'reir' },
      { text: 'Silenciar el grupo y no leer', impact: 'ignorar' },
      { text: 'Escribir que paren el acoso', impact: 'intervenir' },
      { text: 'Reportar el grupo a la escuela', impact: 'reportar' },
    ],
  },
  {
    id: 3,
    image: scene3,
    title: 'La Cafetería',
    narration: 'Estás almorzando y notas que tu grupo de amigos está ignorando totalmente a un compañero nuevo que intentó sentarse con ustedes.',
    options: [
      { text: 'Hacer bromas sobre el compañero', impact: 'reir' },
      { text: 'Seguir la conversación sin integrarlo', impact: 'ignorar' },
      { text: 'Presentarlo y hacerle espacio', impact: 'intervenir' },
      { text: 'Contarle a un tutor sobre el clima del grupo', impact: 'reportar' },
    ],
  },
  {
    id: 4,
    image: scene4,
    title: 'El Vestuario',
    narration: 'En el vestuario después de deportes, ves que le escondieron la ropa a alguien y lo están grabando mientras la busca desesperado.',
    options: [
      { text: 'Grabar también con tu celular', impact: 'reir' },
      { text: 'Cambiarse rápido e irse', impact: 'ignorar' },
      { text: 'Ayudarlo a buscar y pedir que paren', impact: 'intervenir' },
      { text: 'Llamar inmediatamente al entrenador', impact: 'reportar' },
    ],
  },
  {
    id: 5,
    image: scene5,
    title: 'El Recreo',
    narration: 'Durante el recreo, en una zona apartada, ves que están empujando e intimidando a alguien para que les dé su dinero.',
    options: [
      { text: 'Alentar a los agresores', impact: 'reir' },
      { text: 'Alejarse para no meterse en problemas', impact: 'ignorar' },
      { text: 'Interponerte físicamente (si es seguro)', impact: 'intervenir' },
      { text: 'Gritar pidiendo ayuda de adultos', impact: 'reportar' },
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

  const modules = [{ icon: Zap, label: 'Simulador' }, { icon: ClipboardList, label: 'Test' }];

  return (
    <div className="min-h-screen bg-midnight pt-24">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 min-h-screen border-r border-softwhite/5 p-6 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-mutedblue hover:text-trust text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <h3 className="font-display font-bold text-lg text-softwhite mb-6">Academia del Aliado</h3>
          <div className="space-y-2">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-colors ${
                  activeModule === i ? 'bg-hope/10 text-hope' : 'text-mutedblue hover:text-softwhite hover:bg-softwhite/5'
                }`}>
                <mod.icon className="w-4 h-4" />{mod.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-10 max-w-4xl pb-24 lg:pb-10 mx-auto">
          <AnimatePresence mode="wait">
            
            {/* SIMULADOR */}
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!isSimFinished ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-display font-bold text-2xl text-softwhite flex items-center gap-3">
                            <Eye className="text-trust" /> Entrenamiento de Campo
                        </h2>
                        <span className="text-mutedblue font-mono text-sm">{sceneIndex + 1} / {witnessScenes.length}</span>
                    </div>

                    <motion.div key={witnessScenes[sceneIndex].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative rounded-2xl overflow-hidden border border-white/10">
                      <div className="relative aspect-video">
                        <img src={witnessScenes[sceneIndex].image} className="w-full h-full object-cover" alt="Situación" />
                        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent" />
                        <div className="absolute bottom-0 p-6">
                          <p className="text-softwhite text-lg leading-snug">{witnessScenes[sceneIndex].narration}</p>
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
                          <span className="text-softwhite text-sm">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 text-center rounded-3xl border border-white/10">
                    <Award className="w-16 h-16 text-hope mx-auto mb-6" />
                    <h3 className={`text-3xl font-display font-bold mb-2 ${getSimFinalMessage().color}`}>
                        {getSimFinalMessage().title}
                    </h3>
                    <p className="text-softwhite/70 text-lg leading-relaxed max-w-lg mx-auto mb-8">
                        {getSimFinalMessage().msg}
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => { setIsSimFinished(false); setSceneIndex(0); setSimAnswers([]); }}
                          className="px-6 py-3 rounded-xl bg-white/10 text-softwhite font-bold hover:bg-white/20 transition-all">
                          REPETIR SIMULACIÓN
                        </button>
                        <button onClick={() => setActiveModule(1)}
                          className="px-6 py-3 rounded-xl bg-hope text-midnight font-bold hover:bg-hope/90 transition-all">
                          REALIZAR TEST DE PERFIL
                        </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* TEST DE PERFIL */}
            {activeModule === 1 && (
              <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {profileResult ? (
                  <div className="glass-card rounded-3xl border border-white/10 p-8 text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-midnight border border-white/10 mb-4">
                      {profiles[profileResult as keyof typeof profiles].icon}
                    </div>
                    <h3 className="text-3xl font-display font-bold text-softwhite mb-2">{profiles[profileResult as keyof typeof profiles].title}</h3>
                    <p className="text-softwhite/70 italic mb-8">"{profiles[profileResult as keyof typeof profiles].desc}"</p>
                    <div className="space-y-3 text-left max-w-md mx-auto">
                      {profiles[profileResult as keyof typeof profiles].tips.map((tip, idx) => (
                        <div key={idx} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                          <CheckCircle2 className="w-5 h-5 text-hope shrink-0" />
                          <p className="text-mutedblue text-sm">{tip}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setProfileResult(null); setProfileStep(0); setProfileAnswers([]); }}
                      className="mt-10 px-8 py-3 rounded-xl bg-white/10 text-softwhite font-bold hover:bg-white/20">
                      REINICIAR TEST
                    </button>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-10">
                        <span className="text-hope text-xs font-bold uppercase tracking-widest">Pregunta {profileStep + 1} de {profileQuestions.length}</span>
                        <h3 className="text-2xl font-display text-softwhite mt-2">{profileQuestions[profileStep].q}</h3>
                    </div>
                    <div className="space-y-3">
                      {profileQuestions[profileStep].opts.map((opt, i) => (
                        <button key={i} onClick={() => handleProfileAnswer(opt.type)}
                          className="w-full p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-hope/50 hover:bg-hope/5 transition-all text-left flex justify-between items-center group">
                          <span className="text-softwhite group-hover:text-white">{opt.text}</span>
                          <ChevronRight className="w-5 h-5 text-mutedblue group-hover:text-hope" />
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