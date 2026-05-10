import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, MessageCircle, Users, Trophy, AlertCircle,
  Brain, Send, Bot, Info, Sparkles, Heart, ShieldAlert,
  CheckCircle2, XCircle, MinusCircle, RotateCcw, ChevronRight
} from 'lucide-react';
import aggressorScene1 from '../assets/aggressor-scene-1.jpg';
import aggressorScene2 from '../assets/aggressor-scene-2.jpg';
import aggressorScene3 from '../assets/aggressor-scene-3.jpg';

const sceneImages = [aggressorScene1, aggressorScene2, aggressorScene3];
const scenes = [
  {
    id: 1,
    title: "El Receso",
    location: "Patio de la escuela — 12:30 PM",
    narration: 'Es tu primer día. En el recreo, ves a un chico más pequeño solo. Tus nuevos "amigos" te sugieren que sería gracioso quitarle su almuerzo.',
    options: [
      { text: 'Le quitas el almuerzo para impresionar al grupo', score: -15, type: 'agresion', reaction: 'El chico baja la mirada. Sus ojos se llenan de lágrimas.', emotion: 'Tristeza profunda' },
      { text: 'Te niegas y te sientas con el chico solo', score: 33, type: 'empatia', reaction: 'El chico sonríe con sorpresa. "¿Puedo sentarme contigo?"', emotion: 'Gratitud' },
      { text: 'Ignoras la situación y te alejas', score: 5, type: 'neutral', reaction: 'El chico sigue solo. El grupo busca a otro.', emotion: 'Indiferencia' },
    ],
  },
  {
    id: 2,
    title: "Trabajo en Equipo",
    location: "Salón de clases — 10:15 AM",
    narration: 'En clase, notas que siempre excluyen a la misma compañera. Tu grupo dice que "no encaja" y no la quieren.',
    options: [
      { text: 'Dices "nadie la quiere aquí" en voz alta', score: -20, type: 'agresion', reaction: 'Ella escucha y pide ir al baño. No regresa en toda la clase.', emotion: 'Humillación' },
      { text: 'La invitas a tu equipo sin hacer alarde', score: 33, type: 'empatia', reaction: 'Ella se integra nerviosa pero termina el día sonriendo.', emotion: 'Pertenencia' },
      { text: 'No dices nada, dejas que el grupo decida', score: 5, type: 'neutral', reaction: 'La compañera queda sola otra vez.', emotion: 'Soledad' },
    ],
  },
  {
    id: 3,
    title: "El Grupo de Chat",
    location: "Tu habitación — 9:45 PM",
    narration: 'Te invitan a un grupo de chat creado solo para burlarse de un compañero. Ya hay 15 personas publicando memes.',
    options: [
      { text: 'Te unes y envías un meme de burla', score: -25, type: 'agresion', reaction: 'El compañero se entera. Deja de ir a clase una semana.', emotion: 'Daño irreversible' },
      { text: 'Rechazas y reportas el grupo a un tutor', score: 34, type: 'empatia', reaction: 'El grupo se elimina. Evitas un daño mayor.', emotion: 'Seguridad' },
      { text: 'No te unes pero guardas silencio', score: 5, type: 'neutral', reaction: 'Las burlas siguen escalando sin control.', emotion: 'Miedo' },
    ],
  },
];

const comicPanels = {
  agresor: [
    'Me sentía poderoso cuando los demás se reían. Era mi forma de encajar.',
    'No pensaba en cómo se sentían. Solo pensaba en mí.',
    'Un día me vi en un espejo y no me gustó lo que vi.',
    'El poder que sentía era falso. Estaba tan asustado como ellos.',
    "Repetía en otros el dolor que yo sentía en casa; era un ciclo que no sabía cómo romper.",
    "Creía que para ser fuerte debía hacer a otros débiles, pero la verdadera fuerza era pedir perdón."
  ],
  victima: [
    'Cada mañana sentía un nudo en el estómago. No quería ir a la escuela.',
    'Pensaba que algo estaba mal conmigo. Que yo era el problema.',
    'El silencio era lo peor. Nadie preguntaba cómo estaba.',
    'Un día alguien me tendió la mano. Solo eso cambió todo.',
    "Aprendí a hacerme invisible, esperando que si no me veían, las palabras dejarían de herir.",
    "Sanar no fue olvidar lo que pasó, sino entender que su odio no definía quién soy yo."
  ],
};

const chatDatabase = [
  { keys: ['hola', 'buen', 'tal', 'hey'], response: 'Hola... me da un poco de miedo hablar por aquí, pero gracias por escribir. ¿Qué necesitas?' },
  { keys: ['nombre', 'eres', 'quien', 'maya'], response: 'Soy Maya. O bueno, lo que queda de mí después de este año en la escuela. Intento ser fuerte pero es difícil.' },
  { keys: ['paso', 'pasó', 'sucede', 'cuenta', 'historia'], response: 'Todo empezó con pequeños comentarios, luego risas al pasar... ahora siento que mi presencia molesta a todos.' },
  { keys: ['ayuda', 'apoyo', 'estoy', 'contigo', 'amigo'], response: '¿De verdad estarías dispuesto a ayudarme? A veces siento que soy invisible para los que podrían hacer algo.' },
  { keys: ['perdón', 'perdon', 'siento', 'disculpa', 'lamento'], response: 'Escuchar eso... me hace sentir que no todo está perdido. Gracias por reconocerlo, de verdad.' },
  { keys: ['miedo', 'triste', 'mal', 'asustada'], response: 'Sí, tengo mucho miedo. Mañana hay clase de nuevo y el nudo en el estómago no se va.' },
  { keys: ['hacer', 'puedo', 'ayudarte'], response: 'Solo con que no te rías cuando los demás lo hacen, ya estarías haciendo un mundo de diferencia para mí.' }
];

const negativeWords = ['tonto', 'feo', 'idiota', 'estúpido', 'gordo', 'perdedor', 'inútil', 'basura'];

export default function AggressorRoute() {
  const { reputationScore, updateReputation, completeModule } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState(null);
  const [perspective, setPerspective] = useState('agresor');
  const [history, setHistory] = useState([]);

  const [chatMessages, setChatMessages] = useState([{ from: 'maya', text: 'Hola... soy Maya. Me dijeron que querías hablar conmigo.' }]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleChoice = (optionIndex) => {
    const option = scenes[sceneIndex].options[optionIndex];
    setChosenOption(optionIndex);
    updateReputation(option.score);
    setHistory([...history, option]);
    setTimeout(() => {
      setChosenOption(null);
      if (sceneIndex < scenes.length - 1) setSceneIndex(sceneIndex + 1);
      else { setSceneIndex(scenes.length); completeModule('agresor-simulator'); }
    }, 3000);
  };

  const handleChat = () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      const lowerMsg = userMsg.toLowerCase();
      const isNegative = negativeWords.some(word => lowerMsg.includes(word));
      let response = "No sé qué decir... a veces el silencio duele menos que ciertas palabras.";
      if (isNegative) {
        response = "¿Por qué me hablas así? Pensé que eras diferente...";
        updateReputation(-15);
      } else {
        const match = chatDatabase.find(item => item.keys.some(key => lowerMsg.includes(key)));
        if (match) response = match.response;
        updateReputation(5);
      }
      setChatMessages(prev => [...prev, { from: 'maya', text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const analysis = useMemo(() => {
    if (history.length < 3) return null;
    const counts = history.reduce((acc, curr) => { acc[curr.type] = (acc[curr.type] || 0) + 1; return acc; }, {});
    if (counts.agresion >= 2) return { title: "Perfil de Alerta", text: "Tus decisiones reflejan una tendencia a usar el poder para encajar.", advice: "El verdadero liderazgo no requiere víctimas." };
    if (counts.empatia >= 2) return { title: "Liderazgo Empático", text: "Has demostrado valentía para romper el ciclo del acoso.", advice: "Sigue siendo esa voz valiente." };
    return { title: "Perfil Neutral", text: "Tu silencio permite que el acoso continúe.", advice: "Recuerda: no actuar también es una decisión." };
  }, [history]);

  const modules = [
    { icon: Users, label: 'Miradas' },
    { icon: Brain, label: 'Jugar' },
    { icon: MessageCircle, label: 'Maya' },
  ];

  // Color helpers based on score/type
  const repColor = reputationScore >= 70 ? '#0ea5e9' : reputationScore >= 40 ? '#f59e0b' : '#ef4444';
  const repBg    = reputationScore >= 70 ? 'bg-sky-400/20' : reputationScore >= 40 ? 'bg-yellow-400/20' : 'bg-red-400/20';
  const repText  = reputationScore >= 70 ? 'text-sky-600' : reputationScore >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="min-h-screen pb-28 lg:pb-0 font-sans"
      style={{ background: 'linear-gradient(180deg, #6fe5f1 0%, #aaf1f7 100%)' }}>

      {/* HEADER MÓVIL */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-cyan-100/80 backdrop-blur-xl border-b border-cyan-200/60 px-6 py-4 flex justify-between items-center">
        <Link to="/caminos" className="text-slate-600"><ArrowLeft size={22} /></Link>
        <span className="text-xs font-mono text-slate-500 tracking-widest uppercase">Simulador</span>
        <div className="w-6" />
      </header>

      <div className="flex flex-col lg:flex-row pt-20 lg:pt-24 lg:px-10">

        {/* SIDEBAR */}
        <aside className="hidden lg:block w-72 min-h-screen border-r border-white/30 p-6 sticky top-24 self-start z-40">
          <div className="mb-12">
            <Link to="/caminos"
              className="inline-flex items-center gap-2 text-slate-500 text-[10px] font-mono tracking-widest hover:text-slate-800 transition-all py-2">
              <ArrowLeft className="w-4 h-4" /> VOLVER
            </Link>
          </div>
          <nav className="space-y-2">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-semibold transition-all ${
                  activeModule === i
                    ? 'bg-indigo-600/20 text-indigo-900 border border-indigo-200 shadow-sm'
                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'
                }`}>
                <mod.icon className="w-5 h-5" /> {mod.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 p-5 lg:p-10 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {/* MÓDULO 1: SIMULADOR */}
            {activeModule === 1 && (
              <motion.div key="sim" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {sceneIndex < scenes.length ? (
                  <div className="space-y-5">

                    {/* Top bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        {scenes.map((_, i) => (
                          <div key={i} className="flex-1 flex items-center gap-2">
                            <motion.div
                              className={`h-1.5 rounded-full flex-1 ${i < sceneIndex ? 'bg-sky-500' : i === sceneIndex ? 'bg-sky-400/70' : 'bg-slate-300/50'}`}
                              initial={false}
                              animate={{ scaleX: i <= sceneIndex ? 1 : 0.3 }}
                              style={{ originX: 0 }}
                            />
                          </div>
                        ))}
                        <span className="text-slate-500 font-mono text-xs">{sceneIndex + 1}/{scenes.length}</span>
                      </div>

                      {/* Reputation widget */}
                      <motion.div layout
                        className="flex items-center gap-3 bg-white/50 backdrop-blur-md border border-white/70 rounded-2xl px-4 py-2.5 sm:min-w-[200px]">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${repBg}`}>
                          <ShieldAlert className={`w-4 h-4 ${repText}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase block">Reputación</span>
                          <div className="relative w-full h-2 bg-slate-200/60 rounded-full overflow-hidden mt-1">
                            <motion.div
                              className="h-full rounded-full"
                              animate={{ width: `${Math.max(4, reputationScore)}%`, backgroundColor: repColor }}
                              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            />
                          </div>
                        </div>
                        <motion.span
                          key={reputationScore}
                          initial={{ scale: 1.4 }}
                          animate={{ scale: 1 }}
                          className="text-sm font-bold font-mono w-9 text-right text-slate-700"
                        >
                          {Math.max(0, reputationScore)}
                        </motion.span>
                      </motion.div>
                    </div>

                    {/* Scene image card */}
                    <motion.div key={sceneIndex} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative rounded-3xl overflow-hidden border border-white/30 shadow-2xl">
                      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9]">
                        <img src={sceneImages[sceneIndex]} alt={scenes[sceneIndex].title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent" />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                          className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <span className="text-[11px] font-mono text-white/80 tracking-wide">{scenes[sceneIndex].location}</span>
                        </motion.div>
                        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                          <motion.h2 key={`title-${sceneIndex}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 leading-tight text-white">
                            {scenes[sceneIndex].title}
                          </motion.h2>
                          <motion.p key={`narr-${sceneIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="text-sm sm:text-base lg:text-lg text-white/80 font-light leading-relaxed max-w-2xl">
                            {scenes[sceneIndex].narration}
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Reaction feedback */}
                    <AnimatePresence>
                      {chosenOption !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
                          className={`rounded-2xl p-5 sm:p-6 border flex items-start gap-4 ${
                            scenes[sceneIndex].options[chosenOption].type === 'agresion'
                              ? 'bg-red-400/10 border-red-400/30'
                              : scenes[sceneIndex].options[chosenOption].type === 'empatia'
                                ? 'bg-emerald-400/10 border-emerald-400/30'
                                : 'bg-white/20 border-white/30'
                          }`}>
                          <div className={`p-2 rounded-xl shrink-0 ${
                            scenes[sceneIndex].options[chosenOption].type === 'agresion' ? 'bg-red-400/20'
                            : scenes[sceneIndex].options[chosenOption].type === 'empatia' ? 'bg-emerald-400/20'
                            : 'bg-white/20'
                          }`}>
                            {scenes[sceneIndex].options[chosenOption].type === 'agresion'
                              ? <XCircle className="w-5 h-5 text-red-500" />
                              : scenes[sceneIndex].options[chosenOption].type === 'empatia'
                                ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                : <MinusCircle className="w-5 h-5 text-slate-500" />}
                          </div>
                          <div>
                            <span className={`text-xs font-mono uppercase tracking-widest ${
                              scenes[sceneIndex].options[chosenOption].type === 'agresion' ? 'text-red-500'
                              : scenes[sceneIndex].options[chosenOption].type === 'empatia' ? 'text-emerald-600'
                              : 'text-slate-500'
                            }`}>{scenes[sceneIndex].options[chosenOption].emotion}</span>
                            <p className="text-slate-800 mt-1 text-sm sm:text-base">"{scenes[sceneIndex].options[chosenOption].reaction}"</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Options */}
                    <div className="space-y-2.5">
                      <p className="text-[11px] text-slate-500 font-mono tracking-widest uppercase">¿Qué decides hacer?</p>
                      <div className="grid gap-2.5 sm:gap-3">
                        {scenes[sceneIndex].options.map((opt, oi) => {
                          const isChosen = chosenOption === oi;
                          const isAgresion = opt.type === 'agresion';
                          const isEmpatia = opt.type === 'empatia';
                          return (
                            <motion.button key={oi}
                              disabled={chosenOption !== null}
                              onClick={() => handleChoice(oi)}
                              whileHover={chosenOption === null ? { scale: 1.01, x: 4 } : {}}
                              whileTap={chosenOption === null ? { scale: 0.98 } : {}}
                              className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-center gap-4 group ${
                                isChosen
                                  ? isAgresion ? 'bg-red-400/20 border-red-400/40 shadow-lg'
                                  : isEmpatia ? 'bg-emerald-400/20 border-emerald-400/40 shadow-lg'
                                  : 'bg-white/30 border-white/50'
                                  : chosenOption !== null
                                    ? 'bg-white/10 border-white/20 opacity-40'
                                    : 'bg-white/30 border-white/40 hover:border-sky-400/60 hover:bg-white/50'
                              }`}>
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
                                isChosen
                                  ? isAgresion ? 'bg-red-500 text-white'
                                  : isEmpatia ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-400 text-white'
                                  : 'bg-white/60 text-slate-500 group-hover:bg-sky-400/30 group-hover:text-sky-700'
                              }`}>
                                {String.fromCharCode(65 + oi)}
                              </div>
                              <span className="text-slate-800 text-sm sm:text-base">{opt.text}</span>
                              {chosenOption === null && (
                                <ChevronRight className="w-4 h-4 ml-auto text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Results */
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 sm:py-14 space-y-8">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-sky-400/20 border border-sky-400/30 flex items-center justify-center mx-auto">
                      <Trophy size={40} className="text-sky-600" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black mb-3 uppercase tracking-tight text-slate-800">{analysis?.title}</h3>
                      <p className="text-slate-600 text-base sm:text-lg mb-3 max-w-md mx-auto">{analysis?.text}</p>
                      <p className="text-sky-600 text-sm italic">{analysis?.advice}</p>
                    </div>

                    <div className="inline-flex items-center gap-4 bg-white/50 backdrop-blur-md border border-white/70 rounded-2xl px-6 py-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${repBg}`}>
                        <ShieldAlert className={`w-6 h-6 ${repText}`} />
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase block">Reputación Final</span>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="w-28 h-2.5 bg-slate-200/60 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                              animate={{ width: `${Math.max(4, reputationScore)}%`, backgroundColor: repColor }}
                              transition={{ duration: 1, delay: 0.5 }} />
                          </div>
                          <span className="text-lg font-bold font-mono text-slate-700">{Math.max(0, reputationScore)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3">
                      {history.map((h, i) => (
                        <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          h.type === 'agresion' ? 'bg-red-400/20 border border-red-400/30'
                          : h.type === 'empatia' ? 'bg-emerald-400/20 border border-emerald-400/30'
                          : 'bg-white/30 border border-white/50'
                        }`}>
                          {h.type === 'agresion' ? <XCircle className="w-4 h-4 text-red-500" />
                          : h.type === 'empatia' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          : <MinusCircle className="w-4 h-4 text-slate-400" />}
                        </div>
                      ))}
                    </div>

                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setSceneIndex(0); setHistory([]); updateReputation(-reputationScore); }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-black rounded-2xl shadow-lg">
                      <RotateCcw className="w-4 h-4" /> REINICIAR
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* MÓDULO 0: PERSPECTIVAS */}
            {activeModule === 0 && (
              <motion.div key="persp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex p-1 bg-white/30 border border-white/50 rounded-2xl">
                  {['agresor', 'victima'].map((p) => (
                    <button key={p} onClick={() => setPerspective(p)}
                      className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        perspective === p
                          ? p === 'agresor'
                            ? 'bg-orange-400 text-white shadow-md'
                            : 'bg-sky-500 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}>
                      {p === 'agresor' ? 'El Agresor' : 'La Víctima'}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comicPanels[perspective].map((panel, i) => (
                    <div key={i}
                      className="rounded-3xl p-8 border border-white/40 bg-white/40 backdrop-blur-sm text-lg font-light leading-relaxed italic text-slate-700 shadow-sm">
                      "{panel}"
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MÓDULO 2: CHAT CON MAYA */}
            {activeModule === 2 && (
              <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col lg:flex-row h-[100dvh] lg:h-[85vh] rounded-[2rem] overflow-hidden border border-white/40 shadow-2xl">

                {/* Panel Maya */}
                <div className="flex lg:w-64 flex-col items-center bg-white/40 backdrop-blur-xl border-b lg:border-b-0 lg:border-r border-white/40 p-4 lg:p-6 relative overflow-hidden flex-shrink-0">
                  <div className="absolute top-0 left-0 w-full h-32 bg-cyan-300/20 blur-3xl pointer-events-none" />

                  {/* Avatar */}
                  <div className="relative mb-3">
                    <motion.svg className="w-24 h-auto lg:w-[120px] drop-shadow-lg"
                      viewBox="0 0 120 160"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                      <defs>
                        <linearGradient id="skinGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fddbb9" />
                          <stop offset="100%" stopColor="#f4c89a" />
                        </linearGradient>
                        <linearGradient id="hairGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4a3525" />
                          <stop offset="100%" stopColor="#2d1b0e" />
                        </linearGradient>
                      </defs>
                      <ellipse cx="60" cy="155" rx="30" ry="6" fill="rgba(0,0,0,0.1)" />
                      <path d="M30 150 Q30 100 60 100 Q90 100 90 150" fill="#1e3a5f" />
                      <path d="M40 105 Q60 120 80 105" fill="none" stroke="rgba(14,165,233,0.4)" strokeWidth="2" />
                      <circle cx="60" cy="65" r="32" fill="url(#skinGrad2)" />
                      <path d="M28 65 Q28 25 60 25 Q92 25 92 65 L95 85 Q85 75 80 85 L75 70 Q60 60 45 70 L40 85 Q35 75 25 85 Z" fill="url(#hairGrad2)" />
                      <g>
                        <circle cx="48" cy="68" r="5" fill="white" />
                        <circle cx="72" cy="68" r="5" fill="white" />
                        <circle cx="49" cy="69" r="2.5" fill="#2d1b0e" />
                        <circle cx="73" cy="69" r="2.5" fill="#2d1b0e" />
                        <circle cx="47" cy="67" r="1.2" fill="white" />
                        <circle cx="71" cy="67" r="1.2" fill="white" />
                      </g>
                      <circle cx="40" cy="78" r="3" fill="rgba(244,150,100,0.3)" />
                      <circle cx="80" cy="78" r="3" fill="rgba(244,150,100,0.3)" />
                      <path d="M55 85 Q60 88 65 85" stroke="#c8956a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                      <rect x="22" y="60" width="8" height="18" rx="4" fill="#0ea5e9" opacity="0.8" />
                      <rect x="90" y="60" width="8" height="18" rx="4" fill="#0ea5e9" opacity="0.8" />
                      <path d="M30 60 Q30 35 60 35 Q90 35 90 60" fill="none" stroke="#0ea5e9" strokeWidth="3" opacity="0.5" />
                    </motion.svg>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-sky-400/20 rounded-full blur-xl animate-pulse" />
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
                      <span className="text-[9px] text-emerald-600 font-bold tracking-widest uppercase font-mono">En línea</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-black text-slate-800 tracking-tight">Maya</h3>
                    <p className="text-[9px] font-mono text-sky-600 uppercase tracking-[0.2em] mb-4">Estudiante Virtual</p>
                  </div>

                  <div className="hidden lg:block w-full bg-white/50 border border-white/60 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-sky-400/20 rounded-lg">
                        <Info size={12} className="text-sky-600" />
                      </div>
                      <p className="text-[10px] font-black uppercase text-sky-700 tracking-tighter">Objetivo</p>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      "Tu amabilidad es lo único que puede hacerme sentir segura hoy."
                    </p>
                  </div>

                  <div className="flex lg:flex-col gap-2 overflow-x-auto w-full pb-2 no-scrollbar">
                    {[
                      { txt: '¿Cómo te sientes?', icon: '🧠' },
                      { txt: '¿Qué pasó?', icon: '❓' },
                      { txt: 'Estoy contigo', icon: '🛡️' }
                    ].map((chip, i) => (
                      <button key={i}
                        onClick={() => { setChatInput(chip.txt); setTimeout(() => handleChat(), 50); }}
                        className="min-w-[150px] lg:w-full flex items-center gap-2 text-[10px] text-slate-600 bg-white/50 hover:bg-sky-400/20 hover:text-sky-800 border border-white/60 rounded-xl px-4 py-2.5 transition-all active:scale-95">
                        <span>{chip.icon}</span>
                        {chip.txt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm min-w-0 overflow-hidden">
                  <div className="p-4 border-b border-white/40 flex items-center gap-3 shrink-0 bg-white/20">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Maya</h3>
                      <p className="text-[9px] text-sky-600">Chat empático</p>
                    </div>
                  </div>

                  <div ref={scrollRef}
                    className="flex-1 overflow-y-auto p-3 lg:p-5 space-y-3 scroll-smooth"
                    style={{ WebkitOverflowScrolling: 'touch' }}>
                    {chatMessages.map((msg, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: msg.from === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] lg:max-w-[78%] px-4 py-2.5 text-sm rounded-2xl ${
                          msg.from === 'user'
                            ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-md'
                            : 'bg-white/70 text-slate-700 border border-white/60 shadow-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-1 px-4 py-3 bg-white/60 rounded-2xl w-fit border border-white/50">
                        {[0, 0.2, 0.4].map((d, i) => (
                          <motion.div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: d }} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-t border-white/40 bg-white/20 shrink-0">
                    <div className="flex items-center gap-2 bg-white/60 border border-white/70 rounded-2xl px-4 py-2.5">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                        placeholder="Escribe con empatía..."
                        className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400"
                      />
                      <button onClick={handleChat}
                        className="p-2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-xl hover:opacity-90 transition-all">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* NAVEGACIÓN MÓVIL */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-cyan-100/90 backdrop-blur-2xl border-t border-cyan-200/60 px-6 py-4 flex justify-between items-center">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)} className="flex flex-col items-center gap-1.5 transition-all">
              <div className={`p-3 rounded-2xl transition-all ${
                activeModule === i
                  ? 'bg-gradient-to-br from-cyan-500 to-sky-500 text-white shadow-lg'
                  : 'text-slate-500'
              }`}>
                <mod.icon size={22} strokeWidth={activeModule === i ? 2.5 : 2} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${
                activeModule === i ? 'text-sky-600' : 'text-slate-400'
              }`}>{mod.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}