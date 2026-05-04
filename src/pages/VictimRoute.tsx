import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Users, Sparkles, PenTool, AlertTriangle, Send } from 'lucide-react';

// --- CONSTANTES ---
const emotions = ['😊', '😐', '😢', '😰', '😡', '🥺'];
const emotionLabels = ['Bien', 'Regular', 'Triste', 'Ansioso/a', 'Enojado/a', 'Vulnerable'];
const breathingSteps = ['Inhala...', 'Sostén...', 'Exhala...', 'Descansa...'];

const supportCategories = [
  { label: 'Familia', icon: '👨‍👩‍👧', people: ['Mamá', 'Papá', 'Hermano/a', 'Abuelo/a'] },
  { label: 'Escuela', icon: '🏫', people: ['Maestro/a', 'Orientador/a'] },
  { label: 'Amigos', icon: '💛', people: ['Mejor amigo/a'] },
  { label: 'Profesionales', icon: '🩺', people: ['Psicólogo/a', 'Médico/a', 'Línea de ayuda', 'Trabajador Social', 'Consejero', 'Terapeuta'] },
];

const transformations = {
  'feo': 'Mi apariencia no define mi valor como persona.',
  'tonto': 'Tengo habilidades únicas que otros no ven todavía.',
  'nadie me quiere': 'Hay personas que se preocupan por mí, aunque a veces no lo sienta.',
  'soy inútil': 'Cada persona tiene un propósito. Aún estoy descubriendo el mío.',
  'no sirvo': 'Mi valor no depende de lo que otros digan de mí.',
  'culpa': 'Lo que me pasa no es mi culpa. Nadie merece ser maltratado.',
  'solo': 'La soledad es temporal. Puedo buscar ayuda y encontrar mi tribu.',
  'miedo': 'El miedo es natural. Ser valiente es actuar a pesar de él.',
  'triste': 'La tristeza es válida. Sentir es humano y sanar es posible.',
  'débil': 'Pedir ayuda es la mayor muestra de fortaleza.',
};

const negativeThoughts = [
  { id: 1, negative: 'Es mi culpa', positive: 'No es mi culpa. Nadie merece ser maltratado.' },
  { id: 2, negative: 'Si hablo, será peor', positive: 'Pedir ayuda es un acto de valentía y fortaleza.' },
  { id: 3, negative: 'Nadie me cree', positive: 'Mi verdad importa. Hay personas dispuestas a escuchar.' },
  { id: 4, negative: 'Soy el problema', positive: 'Yo no causé esto. La responsabilidad es de quien agredió.' },
  { id: 5, negative: 'Debería haber evitado esto', positive: 'No podía controlar lo que otros hacían. Ahora sí puedo buscar ayuda.' },
  { id: 6, negative: 'Nadie me va a creer', positive: 'Hay adultos de confianza que quieren ayudarme.' },
  { id: 7, negative: 'Soy débil', positive: 'Reconocer el daño y pedir ayuda es la mayor fortaleza.' },
  { id: 8, negative: 'Me voy a quedar solo/a', positive: 'Hay una comunidad que me apoya y se preocupa por mí.' },
  { id: 9, negative: 'Nadie entiende lo que siento', positive: 'Mis sentimientos son válidos. Otros han pasado por esto y sanaron.' },
  { id: 10, negative: 'Merezco esto', positive: 'Nadie merece abuso. Mi valor es incondicionalmente válido.' },
  { id: 11, negative: 'Por qué a mí', positive: 'Esto no es por algo que hice. El acoso dice más del agresor que de mí.' },
  { id: 12, negative: 'Nunca voy a superar esto', positive: 'La sanación es posible. El primer paso es buscar ayuda.' },
  { id: 13, negative: 'Soy un fracaso', positive: 'Estoy aprendiendo y creciendo. Cada momento es una oportunidad nueva.' },
  { id: 14, negative: 'No tengo a nadie', positive: 'Hay personas que me aman y quieren apoyarme.' },
];

const crisisWords = ['morir', 'suicid', 'no quiero seguir', 'acabar', 'sin salida', 'matarme'];

const writingPrompts = [
  'Hoy me sentí...',
  'Lo que nadie sabe es...',
  'Si pudiera decirle algo a mi yo del pasado...',
  'Lo que me hace fuerte es...',
];

// --- COMPONENTE LUNA AVATAR ---
const LunaAvatar = () => (
  <motion.div
    animate={{
      y: [0, -10, 0],
      rotate: [0, 1, -1, 0]
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="relative w-32 h-32 flex-shrink-0"
  >
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_10px_15px_rgba(251,192,45,0.3)]">
      {/* Halo de luz místico detrás */}
      <motion.circle
        cx="60" cy="60" r="45"
        fill="url(#luna-halo)"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Cuerpo principal (Forma de gota/nube suave) */}
      <path
        d="M60 20C35 20 15 40 15 65C15 90 35 105 60 105C85 105 105 90 105 65C105 40 85 20 60 20Z"
        fill="url(#luna-body-grad)"
        stroke="white"
        strokeWidth="0.5"
        strokeOpacity="0.5"
      />

      {/* Brillo superior para dar volumen */}
      <ellipse cx="60" cy="35" rx="30" ry="10" fill="white" opacity="0.2" />

      {/* Ojos expresivos y amables */}
      <g>
        {/* Ojo Izquierdo */}
        <circle cx="45" cy="62" r="6" fill="#2D3436" />
        <circle cx="47" cy="59" r="2" fill="white" />

        {/* Ojo Derecho */}
        <circle cx="75" cy="62" r="6" fill="#2D3436" />
        <circle cx="77" cy="59" r="2" fill="white" />
      </g>

      {/* Mejillas sonrosadas suaves */}
      <circle cx="38" cy="72" r="5" fill="#F06292" opacity="0.4" />
      <circle cx="82" cy="72" r="5" fill="#F06292" opacity="0.4" />

      {/* Boca - Una sonrisa pequeña y tierna */}
      <path
        d="M54 75C54 75 57 79 60 79C63 79 66 75 66 75"
        stroke="#2D3436"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Pequeña corona o estrella de guía */}
      <path
        d="M60 12L62 17H58L60 12Z"
        fill="#FBC02D"
        className="drop-shadow-[0_0_5px_#FBC02D]"
      />

      <defs>
        {/* Gradiente principal: Tonos amarillos y crema para calidez */}
        <linearGradient id="luna-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFDE7" />
          <stop offset="50%" stopColor="#FFF59D" />
          <stop offset="100%" stopColor="#FBC02D" />
        </linearGradient>

        {/* Gradiente para el halo místico */}
        <radialGradient id="luna-halo">
          <stop offset="0%" stopColor="#FBC02D" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FBC02D" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>

    {/* Partículas de brillo alrededor */}
    <motion.div
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.5, 0.2],
        x: [0, 5, -5, 0],
        y: [0, -5, 5, 0]
      }}
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute top-4 right-4 bg-yellow-200 w-3 h-3 rounded-full blur-sm"
    />
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.1, 0.4, 0.1],
        x: [0, -8, 8, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      className="absolute bottom-6 left-4 bg-white w-2 h-2 rounded-full blur-[2px]"
    />
  </motion.div>
);

// --- COMPONENTE PRINCIPAL ---
export default function VictimRoute() {
  const { savedAffirmations, saveAffirmation } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    { from: 'luna', text: '💛 Hola, soy Luna. Estoy aquí para acompañarte en este espacio seguro. ¿Cómo te sientes en este momento?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [breathing, setBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [myNetwork, setMyNetwork] = useState([]);
  const [negativeThought, setNegativeThought] = useState('');
  const [transformed, setTransformed] = useState('');
  const [selectedThoughts, setSelectedThoughts] = useState([]);
  const [journalText, setJournalText] = useState('');
  const [showCatharsis, setShowCatharsis] = useState(false);

  // Lógica del Chatbot
  const handleChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    const msgLower = userMsg.toLowerCase();

    setChatMessages((m) => [...m, { from: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      if (crisisWords.some((w) => msgLower.includes(w))) {
        setShowCrisis(true);
        setChatMessages((m) => [...m, { from: 'luna', text: '💛 Te escucho y me importas mucho. Por favor, no pases por esto a solas. Llama a alguien de confianza ahora mismo o a la línea de ayuda: 800-290-0024. Estoy contigo.' }]);
        return;
      }

      const responses = [
        'Entiendo perfectamente lo que dices. Tus sentimientos son válidos y merecen ser escuchados.',
        'Gracias por confiar en mí. Se requiere mucha fuerza para expresar lo que sientes.',
        'No estás solo/a en esto. Estoy aquí para acompañarte el tiempo que necesites.',
        'Recuerda que nada de lo que está pasando es tu culpa. Eres una persona valiosa.',
        '¿Has pensado en comentarle esto a alguien de tu red de apoyo? A veces compartir la carga ayuda un poco.',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages((m) => [...m, { from: 'luna', text: randomResponse }]);
    }, 1000);
  };

  // Respiración
  const startBreathing = () => {
    setBreathing(true);
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 4;
      setBreathStep(step);
      if (step === 0) {
        clearInterval(interval);
        setBreathing(false);
      }
    }, 4000);
  };

  // Transformador
  const handleTransform = () => {
    const input = negativeThought.toLowerCase();
    let result = 'Mi situación actual no define mi futuro. Tengo el poder de buscar ayuda y cambiar mi historia.';
    for (const key of Object.keys(transformations)) {
      if (input.includes(key)) { result = transformations[key]; break; }
    }
    setTransformed(result);
  };

  const addToNetwork = (person) => {
    if (!myNetwork.includes(person)) setMyNetwork([...myNetwork, person]);
  };

  const modules = [
    { icon: MessageCircle, label: 'Luna' },
    { icon: Users, label: 'Red' },
    { icon: Sparkles, label: 'Transformar' },
  ];

  return (
    <div className="min-h-screen pt-24" style={{ background: 'linear-gradient(180deg, #6fe5f1 0%, #aaf1f7 100%)' }}>

      {/* Banner de Crisis */}
      {showCrisis && (
        <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-rose-600 text-white py-4 px-4 text-center font-medium flex items-center justify-center gap-3 shadow-xl">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-base">¿Estás en peligro? No esperes: <a href="tel:800-290-0024" className="underline font-bold">800-290-0024</a></span>
          <button onClick={() => setShowCrisis(false)} className="ml-6 text-sm bg-white/20 px-2 py-1 rounded text-white">Cerrar</button>
        </motion.div>
      )}

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
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${activeModule === i ? 'bg-indigo-600/20 text-indigo-900 border border-indigo-600/30' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/5'
                  }`}>
                <mod.icon className="w-6 h-6" />{mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navegación Móvil */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-100 border-t border-slate-300 flex justify-around py-4 shadow-lg">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)}
              className={`flex flex-col items-center gap-1 text-xs font-semibold ${activeModule === i ? 'text-indigo-600' : 'text-slate-600'}`}>
              <mod.icon className="w-6 h-6" />{mod.label}
            </button>
          ))}
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 p-6 lg:p-12 max-w-5xl pb-32 lg:pb-12">
          <AnimatePresence mode="wait">

            {/* --- MÓDULO 0: CHATBOT LUNA --- */}
            {activeModule === 0 && (
              <motion.div key="luna" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">

                {/* Cabecera Luna */}
                <div className="flex items-center gap-6 bg-white/40 p-6 rounded-3xl border border-slate-300/40 shadow-inner">
                  <LunaAvatar />
                  <div>
                    <h2 className="font-display font-bold text-4xl text-slate-900 leading-none mb-3">Habla con Luna</h2>
                    <p className="text-slate-700 font-body text-base max-w-sm">Estoy aquí para escucharte sin juzgarte. Puedes decirme cómo te sientes o simplemente desahogarte.</p>
                  </div>
                </div>

                {/* Layout Principal: 3 Columnas en Desktop, Vertical en Mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Columna Izquierda: Selección de Emociones */}
                  <div className="lg:col-span-3">
                    {selectedEmotion === null && (
                      <div className="bg-white/40 rounded-3xl p-6 border border-slate-300/40 shadow-xl h-full flex flex-col justify-between">
                        <p className="text-sm text-indigo-700 font-bold mb-6 uppercase tracking-widest text-center">¿Cómo te sientes hoy?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {emotions.map((e, i) => (
                            <motion.button key={i} whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.4)' }} whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedEmotion(i);
                                setChatMessages(m => [...m, { from: 'user', text: `Me siento ${emotionLabels[i].toLowerCase()}` }, { from: 'luna', text: `Gracias por compartir que te sientes ${emotionLabels[i].toLowerCase()}. Tus sentimientos son importantes para mí. ¿Quieres contarme qué pasó o qué tienes en mente?` }]);
                              }}
                              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-300/50 bg-white/50 transition-all hover:shadow-md">
                              <span className="text-5xl">{e}</span>
                              <span className="text-xs text-slate-800 font-extrabold uppercase text-center">{emotionLabels[i]}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Columna Central: Chatbox Principal */}
                  <div className="lg:col-span-6">
                    <div className="bg-white/70 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-slate-300/50" style={{ height: '550px' }}>
                      <div className="bg-white px-8 py-4 border-b border-slate-200 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-slate-700 font-mono font-extrabold uppercase tracking-widest">Luna está contigo</span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {chatMessages.map((msg, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: msg.from === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative max-w-[80%] px-6 py-4 text-base leading-relaxed font-body shadow-md ${msg.from === 'user'
                              ? 'bg-indigo-600 text-white rounded-[1.5rem] rounded-tr-none'
                              : 'bg-white/80 text-slate-900 rounded-[1.5rem] rounded-tl-none border border-slate-300'
                              }`}>
                              {msg.from === 'luna' && (
                                <span className="absolute -top-6 left-1 text-[10px] text-indigo-700 font-black uppercase tracking-widest">Luna</span>
                              )}
                              {msg.text}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Input del Chat */}
                      <div className="p-6 bg-white border-t border-slate-200">
                        <div className="relative flex items-center gap-3 bg-slate-100 rounded-2xl border border-slate-300 p-2 focus-within:border-indigo-600 transition-all shadow-inner">
                          <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                            placeholder="Escribe lo que sientes..."
                            className="flex-1 bg-transparent px-5 py-3 text-base text-slate-900 outline-none placeholder:text-slate-500"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleChat}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-xl transition-all shadow-lg"
                          >
                            <Send className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha: Ejercicio de Respiración */}
                  <div className="lg:col-span-3">
                    <motion.button
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.6)' }}
                      onClick={startBreathing}
                      className="w-full bg-white/60 rounded-3xl p-6 border border-green-400 flex flex-col items-center justify-center gap-4 shadow-xl transition-all h-full"
                    >
                      {!breathing ? (
                        <>
                          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-green-700" />
                          </div>
                          <div className="text-center">
                            <p className="text-slate-900 font-display font-bold text-xl mb-1">¿Necesitas calma?</p>
                            <p className="text-slate-600 text-sm">Respiración guiada</p>
                          </div>
                          <span className="text-green-700 font-bold text-sm border-b-2 border-green-500 pb-1">COMENZAR</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <motion.div
                            animate={{ scale: breathStep < 2 ? [1, 1.5, 1.5] : [1.5, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-28 h-28 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center shadow-md"
                          >
                            <span className="text-green-700 font-black text-sm tracking-wider text-center px-2">{breathingSteps[breathStep]}</span>
                          </motion.div>
                          <p className="text-slate-600 animate-pulse text-xs font-mono tracking-widest mt-2">Sigue el ritmo...</p>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- MÓDULO 1: RED DE APOYO --- */}
            {activeModule === 1 && (
              <motion.div key="red" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                
                {/* HEADER */}
                <div>
                  <h2 className="font-display font-bold text-4xl text-slate-900 mb-3">Tu Red de Apoyo</h2>
                  <p className="text-slate-700 text-base max-w-xl">Estas son las personas que pueden acompañarte. No tienes que pasar por esto solo/a.</p>
                </div>

                {/* RESUMEN SUPERIOR */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* CONTADOR */}
                  <div className="bg-white/50 p-6 rounded-3xl border border-green-400 flex flex-col justify-center">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Personas de apoyo</p>
                    <p className="text-5xl font-extrabold text-green-700">{myNetwork.length}</p>
                    <p className="text-sm text-slate-600 mt-3">
                      {myNetwork.length === 0 ? "Empieza agregando personas" : "Personas que pueden ayudarte"}
                    </p>
                  </div>

                  {/* LISTA SELECCIONADA */}
                  <div className="bg-white/50 p-6 rounded-3xl border border-slate-300/60 lg:col-span-2 flex flex-col justify-center">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-4">Tu círculo cercano</p>
                    {myNetwork.length === 0 ? (
                      <p className="text-slate-500 text-sm italic">Aún no has agregado a nadie. Empieza abajo 👇</p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {myNetwork.map((p) => (
                          <div key={p} className="px-5 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-sm flex items-center gap-3">
                            💛 {p}
                            <button onClick={() => setMyNetwork(myNetwork.filter((x) => x !== p))} className="text-xs opacity-70 hover:opacity-100 font-bold">
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CATEGORÍAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {supportCategories.map((cat) => (
                    <motion.div key={cat.label} whileHover={{ scale: 1.02 }} className="bg-white/70 rounded-3xl p-6 border border-slate-300 shadow-xl">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-slate-900 font-bold text-lg flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          {cat.label}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">{cat.people.length} opciones</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {cat.people.map((p) => {
                          const selected = myNetwork.includes(p);
                          return (
                            <motion.button
                              key={p}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => selected ? setMyNetwork(myNetwork.filter((x) => x !== p)) : setMyNetwork([...myNetwork, p])}
                              className={`px-4 py-2.5 rounded-xl text-sm transition-all font-semibold ${selected ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'}`}
                            >
                              {selected ? '✓ ' : '+ '} {p}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- MÓDULO 2: TRANSFORMAR --- */}
            {activeModule === 2 && (
              <motion.div key="transform" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="mb-8">
                  <h2 className="font-display font-bold text-4xl text-slate-900 mb-3">Transformar Pensamientos</h2>
                  <p className="text-slate-700 font-body text-base max-w-2xl">Selecciona los pensamientos que has tenido y mira cómo podemos transformarlos juntos.</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 text-rose-700 text-xs font-black uppercase tracking-widest mb-6">
                      <div className="w-2 h-2 bg-rose-500 rounded-full" />
                      Pensamientos que reconozco
                    </div>

                    <div className="grid grid-cols-7 gap-3">
                      {negativeThoughts.map((thought) => (
                        <motion.button
                          key={thought.id}
                          whileHover={{ scale: 1.08, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedThoughts(prev => prev.includes(thought.id) ? prev.filter(id => id !== thought.id) : [...prev, thought.id]);
                          }}
                          className={`relative py-4 px-2 rounded-xl border-2 transition-all text-center font-body text-xs font-semibold flex items-center justify-center min-h-[120px] flex-col gap-3 ${selectedThoughts.includes(thought.id) ? 'bg-rose-100 border-rose-500 text-rose-900 shadow-md' : 'bg-white/50 border-slate-300 text-slate-700 hover:border-rose-400 hover:bg-white'}`}
                          title={thought.negative}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedThoughts.includes(thought.id) ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-400'}`}>
                            {selectedThoughts.includes(thought.id) && (
                              <span className="text-xs font-bold">✓</span>
                            )}
                          </div>
                          <p className="leading-tight">{thought.negative}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-2 text-green-800 text-xs font-black uppercase tracking-widest mb-6">
                      <div className={`w-2 h-2 bg-green-500 rounded-full ${selectedThoughts.length > 0 ? 'animate-pulse' : ''}`} />
                      Nuevas perspectivas para ti
                    </div>

                    {selectedThoughts.length === 0 ? (
                      <div className="p-12 border-2 border-dashed border-slate-300 rounded-3xl text-center bg-white/40">
                        <p className="text-slate-500 text-sm font-body italic">Selecciona pensamientos arriba para ver sus transformaciones...</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <AnimatePresence mode="popLayout">
                          {negativeThoughts.filter(thought => selectedThoughts.includes(thought.id)).map((thought) => (
                            <motion.div
                              key={thought.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="bg-white/90 rounded-2xl p-6 border-2 border-green-400 shadow-lg relative overflow-hidden"
                            >
                              <div className="relative z-10 flex flex-col gap-3">
                                <div>
                                  <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-2">Transformación:</p>
                                  <p className="text-slate-900 text-base leading-relaxed font-display font-medium">{thought.positive}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}