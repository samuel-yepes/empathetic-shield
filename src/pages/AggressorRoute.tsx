import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, MessageCircle, Users, Trophy, AlertCircle,
  Brain, Send, Bot, Info, Sparkles, Heart, ShieldAlert
} from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const scenes = [
  {
    id: 1,
    title: "El Receso",
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
  ],
  victima: [
    'Cada mañana sentía un nudo en el estómago. No quería ir a la escuela.',
    'Pensaba que algo estaba mal conmigo. Que yo era el problema.',
    'El silencio era lo peor. Nadie preguntaba cómo estaba.',
    'Un día alguien me tendió la mano. Solo eso cambió todo.',
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

// --- COMPONENTE AVATAR ---
const MayaAvatar = ({ isTyping }) => (
  <div className="relative w-32 h-32 lg:w-44 lg:h-44 mx-auto mb-4">
    <motion.div
      animate={isTyping ? { scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] } : { y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 4 }}
      className="w-full h-full bg-gradient-to-b from-trust/20 to-transparent rounded-full border border-trust/20 flex items-center justify-center relative"
    >
      <svg viewBox="0 0 100 100" className="w-24 h-24 fill-trust/70">
        <circle cx="50" cy="35" r="18" />
        <path d="M25,80 Q50,55 75,80 L75,90 L25,90 Z" />
        <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3, times: [0, 0.9, 1] }}>
          <circle cx="44" cy="35" r="2" fill="white" />
          <circle cx="56" cy="35" r="2" fill="white" />
        </motion.g>
      </svg>
      {isTyping && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-0 right-0 bg-trust p-2 rounded-full shadow-lg">
          <Sparkles size={14} className="text-midnight" />
        </motion.div>
      )}
    </motion.div>
  </div>
);

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
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
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
    { icon: Brain, label: 'Jugar' },
    { icon: Users, label: 'Miradas' },
    { icon: MessageCircle, label: 'Maya' },
  ];

  return (
    <div className="min-h-screen bg-midnight text-softwhite pb-28 lg:pb-0 font-sans">

      {/* HEADER MÓVIL */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-midnight/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <Link to="/caminos" className="text-mutedblue"><ArrowLeft size={22} /></Link>
        <div className="relative w-24 h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full flex items-center justify-center text-[9px] font-bold text-black"
            animate={{
              width: `${Math.max(0, reputationScore)}%`,
              backgroundColor:
                reputationScore >= 70
                  ? '#00C896'   // verde
                  : reputationScore >= 40
                    ? '#F59E0B'   // naranja
                    : '#EF4444'   // rojo
            }}
          >
            {Math.max(0, reputationScore)}%
          </motion.div>
        </div>
        <div className="w-6" />
      </header>

      <div className="flex flex-col lg:flex-row pt-20 lg:pt-24 lg:px-10">

        {/* SIDEBAR ESCRITORIO */}
        <aside className="hidden lg:block w-72 min-h-screen border-r border-white/5 p-6 sticky top-24 self-start z-40">
          <div className="mb-12">
            <Link
              to="/caminos"
              className="inline-flex items-center gap-2 text-mutedblue text-[10px] font-mono tracking-widest hover:text-trust transition-all py-2"
            >
              <ArrowLeft className="w-4 h-4" /> VOLVER
            </Link>
          </div>
          <div className="mb-10">
            <h3 className="text-[10px] text-mutedblue font-mono tracking-[0.3em] mb-4 uppercase">Reputación</h3>
            <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full flex items-center justify-center text-[10px] font-bold text-black"
                animate={{
                  width: `${Math.max(0, reputationScore)}%`,
                  backgroundColor:
                    reputationScore >= 70
                      ? '#00C896'   // verde
                      : reputationScore >= 40
                        ? '#F59E0B'   // naranja
                        : '#EF4444'   // rojo
                }}
              >
                {Math.max(0, reputationScore)}%
              </motion.div>
            </div>
          </div>
          <nav className="space-y-2">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all ${activeModule === i ? 'bg-trust/10 text-trust border border-trust/20 shadow-lg' : 'text-mutedblue hover:text-softwhite hover:bg-white/5'}`}>
                <mod.icon className="w-5 h-5" /> {mod.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 p-5 lg:p-10 max-w-5xl mx-auto w-full">
          <AnimatePresence mode="wait">

            {/* MODULO 0: SIMULADOR */}
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {sceneIndex < scenes.length ? (
                  <div className="space-y-6">
                    <div>
                      <span className="text-trust font-mono text-[11px] tracking-[0.5em] uppercase">Escena {sceneIndex + 1} de 3</span>
                      <h2 className="text-3xl lg:text-4xl font-black mt-2 leading-tight">{scenes[sceneIndex].title}</h2>
                    </div>
                    <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 bg-white/[0.03] border border-white/10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-trust/30" />
                      <p className="text-xl lg:text-2xl leading-relaxed text-softwhite/90 font-light italic">"{scenes[sceneIndex].narration}"</p>
                    </div>
                    {chosenOption !== null && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-2xl p-6 border ${scenes[sceneIndex].options[chosenOption].type === 'agresion' ? 'bg-warm/10 border-warm/20 text-warm' : 'bg-hope/10 border-hope/20 text-hope'}`}>
                        <p className="text-softwhite/80 text-lg">"{scenes[sceneIndex].options[chosenOption].reaction}"</p>
                      </motion.div>
                    )}
                    <div className="grid gap-3">
                      {scenes[sceneIndex].options.map((opt, oi) => (
                        <button key={oi} disabled={chosenOption !== null} onClick={() => handleChoice(oi)}
                          className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${chosenOption === oi ? (opt.type === 'agresion' ? 'bg-warm text-midnight' : 'bg-hope text-midnight') : 'bg-white/5 border-white/10 hover:border-trust/50'}`}>
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Trophy size={60} className="text-trust mx-auto mb-6" />
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">{analysis?.title}</h3>
                    <p className="text-mutedblue text-lg mb-8">{analysis?.text}</p>
                    <button onClick={() => { setSceneIndex(0); setHistory([]); updateReputation(-reputationScore); }}
                      className="px-10 py-4 bg-trust text-midnight font-black rounded-2xl">REINICIAR</button>
                  </div>
                )}
              </motion.div>
            )}

            {/* MODULO 1: PERSPECTIVAS */}
            {activeModule === 1 && (
              <motion.div key="persp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex p-1 bg-white/5 rounded-2xl">
                  {['agresor', 'victima'].map((p) => (
                    <button key={p} onClick={() => setPerspective(p)}
                      className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${perspective === p ? (p === 'agresor' ? 'bg-warm text-midnight' : 'bg-trust text-midnight') : 'text-mutedblue'}`}>
                      {p === 'agresor' ? 'El Agresor' : 'La Víctima'}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comicPanels[perspective].map((panel, i) => (
                    <div key={i} className="glass-card rounded-3xl p-8 border border-white/5 bg-white/[0.02] text-lg font-light leading-relaxed italic">
                      "{panel}"
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* MODULO 2: CHAT CON MAYA (ACTUALIZADO) */}
            {activeModule === 2 && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col lg:flex-row h-[100dvh] lg:h-[85vh] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
              >

                {/* ───────── PANEL MAYA (ESTILO MEJORADO) ───────── */}
                <div className="flex lg:w-64 flex-col items-center bg-gradient-to-b from-[#0d1a2e] via-[#0a0f1a] to-[#0a0a0f] border-b lg:border-b-0 lg:border-r border-trust/10 p-4 lg:p-6 relative overflow-hidden flex-shrink-0">

                  {/* Glow de fondo para profundidad */}
                  <div className="absolute top-0 left-0 w-full h-32 bg-trust/5 blur-3xl pointer-events-none" />

                  {/* Avatar SVG Mejorado */}
                  <div className="relative mb-3 group">
                    <motion.svg
                      className="w-24 h-auto lg:w-[120px] drop-shadow-[0_0_15px_rgba(0,200,150,0.2)]"
                      viewBox="0 0 120 160"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <defs>
                        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fddbb9" />
                          <stop offset="100%" stopColor="#f4c89a" />
                        </linearGradient>
                        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#4a3525" />
                          <stop offset="100%" stopColor="#2d1b0e" />
                        </linearGradient>
                      </defs>

                      {/* Sombra base */}
                      <ellipse cx="60" cy="155" rx="30" ry="6" fill="rgba(0,0,0,0.3)" />

                      {/* Cuerpo/Ropa */}
                      <path d="M30 150 Q30 100 60 100 Q90 100 90 150" fill="#1e293b" />
                      <path d="M40 105 Q60 120 80 105" fill="none" stroke="rgba(0,200,150,0.2)" strokeWidth="2" />

                      {/* Cabeza */}
                      <circle cx="60" cy="65" r="32" fill="url(#skinGrad)" />

                      {/* Cabello (Estilo más fluido) */}
                      <path d="M28 65 Q28 25 60 25 Q92 25 92 65 L95 85 Q85 75 80 85 L75 70 Q60 60 45 70 L40 85 Q35 75 25 85 Z" fill="url(#hairGrad)" />

                      {/* Ojos con Brillo */}
                      <g>
                        <circle cx="48" cy="68" r="5" fill="white" />
                        <circle cx="72" cy="68" r="5" fill="white" />
                        <circle cx="49" cy="69" r="2.5" fill="#2d1b0e" />
                        <circle cx="73" cy="69" r="2.5" fill="#2d1b0e" />
                        <circle cx="47" cy="67" r="1.2" fill="white" />
                        <circle cx="71" cy="67" r="1.2" fill="white" />
                      </g>

                      {/* Detalles: Rubor y Boca */}
                      <circle cx="40" cy="78" r="3" fill="rgba(244,150,100,0.3)" />
                      <circle cx="80" cy="78" r="3" fill="rgba(244,150,100,0.3)" />
                      <path d="M55 85 Q60 88 65 85" stroke="#c8956a" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                      {/* Auriculares (Contexto tecnológico/estudiante) */}
                      <rect x="22" y="60" width="8" height="18" rx="4" fill="#00C896" opacity="0.8" />
                      <rect x="90" y="60" width="8" height="18" rx="4" fill="#00C896" opacity="0.8" />
                      <path d="M30 60 Q30 35 60 35 Q90 35 90 60" fill="none" stroke="#00C896" strokeWidth="3" opacity="0.5" />
                    </motion.svg>

                    {/* Aura de estado */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-trust/20 rounded-full blur-xl animate-pulse" />
                  </div>

                  {/* Info Personalizada */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 bg-hope rounded-full shadow-[0_0_8px_#00C896]" />
                      <span className="text-[9px] text-hope font-bold tracking-widest uppercase font-mono">En línea</span>
                    </div>
                    <h3 className="text-lg lg:text-xl font-black text-white tracking-tight">Maya</h3>
                    <p className="text-[9px] font-mono text-trust/70 uppercase tracking-[0.2em] mb-4">Estudiante Virtual</p>
                  </div>

                  {/* Tips Box */}
                  <div className="hidden lg:block w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-trust/20 rounded-lg text-trust">
                        <Info size={12} />
                      </div>
                      <p className="text-[10px] font-black uppercase text-trust tracking-tighter">Objetivo</p>
                    </div>
                    <p className="text-[11px] text-softwhite/60 leading-relaxed italic">
                      "Tu amabilidad es lo único que puede hacerme sentir segura hoy."
                    </p>
                  </div>

                  {/* Chips Scroll (Optimizado para móvil) */}
                  <div className="flex lg:flex-col gap-2 overflow-x-auto w-full pb-2 no-scrollbar">
                    {[
                      { txt: '¿Cómo te sientes?', icon: '🧠' },
                      { txt: '¿Qué pasó?', icon: '❓' },
                      { txt: 'Estoy contigo', icon: '🛡️' }
                    ].map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => { setChatInput(chip.txt); setTimeout(() => handleChat(), 50); }}
                        className="min-w-[150px] lg:w-full flex items-center gap-2 text-[10px] text-softwhite/70 bg-white/[0.04] hover:bg-trust/10 hover:text-white border border-white/10 rounded-xl px-4 py-2.5 transition-all active:scale-95"
                      >
                        <span>{chip.icon}</span>
                        {chip.txt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ───────── CHAT ───────── */}
                <div className="flex-1 flex flex-col bg-[#0a0a0f] min-w-0 overflow-hidden">

                  {/* Header */}
                  <div className="p-4 border-b border-white/5 flex items-center gap-3 shrink-0">
                    <div className="w-3 h-3 bg-hope rounded-full" />
                    <div>
                      <h3 className="font-bold text-sm">Maya</h3>
                      <p className="text-[9px] text-trust">Chat empático</p>
                    </div>
                  </div>

                  {/* Mensajes */}
                  <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-3 lg:p-5 space-y-3 scroll-smooth"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: msg.from === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] lg:max-w-[78%] px-3 py-2 text-sm rounded-xl ${msg.from === 'user'
                            ? 'bg-trust text-midnight'
                            : 'bg-white/[0.05] text-softwhite border border-white/[0.08]'
                            }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-1 px-3 py-2 bg-white/[0.05] rounded-xl w-fit">
                        {[0, 0.2, 0.4].map((d, i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-white/40 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: d }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-white/5 bg-white/[0.02] shrink-0">
                    <div className="flex items-center gap-2 bg-midnight border border-white/10 rounded-2xl px-3 py-2">
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                        placeholder="Escribe con empatía..."
                        className="flex-1 bg-transparent text-sm outline-none text-softwhite"
                      />
                      <button
                        onClick={handleChat}
                        className="p-2 bg-trust text-midnight rounded-xl"
                      >
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-midnight/90 backdrop-blur-2xl border-t border-white/10 px-6 py-4 flex justify-between items-center">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)} className="flex flex-col items-center gap-1.5 transition-all">
              <div className={`p-3 rounded-2xl transition-all ${activeModule === i ? 'bg-trust text-midnight' : 'text-mutedblue'}`}>
                <mod.icon size={22} strokeWidth={activeModule === i ? 2.5 : 2} />
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest ${activeModule === i ? 'text-trust' : 'text-mutedblue opacity-50'}`}>{mod.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}