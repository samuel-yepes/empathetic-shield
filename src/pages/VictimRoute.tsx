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
        <circle cx="47" cy="59" r="2" fill="white" /> {/* Brillo del ojo */}

        {/* Ojo Derecho */}
        <circle cx="75" cy="62" r="6" fill="#2D3436" />
        <circle cx="77" cy="59" r="2" fill="white" /> {/* Brillo del ojo */}
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
    <div className="min-h-screen bg-midnight pt-24" style={{ background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1B3E 100%)' }}>

      {/* Banner de Crisis */}
      {showCrisis && (
        <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-rose-600 text-white py-4 px-4 text-center font-medium flex items-center justify-center gap-3 shadow-xl">
          <AlertTriangle className="w-5 h-5" />
          <span>¿Estás en peligro? No esperes: <a href="tel:800-290-0024" className="underline font-bold">800-290-0024</a></span>
          <button onClick={() => setShowCrisis(false)} className="ml-6 text-xs bg-white/20 px-2 py-1 rounded">Cerrar</button>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Lateral */}
        <div className="hidden lg:block w-72 min-h-screen border-r border-softwhite/5 p-8 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-mutedblue hover:text-trust text-sm mb-10 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver
          </Link>
          <h3 className="font-display font-bold text-xl text-softwhite mb-8 tracking-tight">Centro de Apoyo</h3>
          <div className="space-y-3">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all ${activeModule === i ? 'bg-trust/20 text-trust border border-trust/30' : 'text-mutedblue hover:text-softwhite hover:bg-softwhite/5'
                  }`}>
                <mod.icon className="w-5 h-5" />{mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navegación Móvil */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-softwhite/10 flex justify-around py-4">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)}
              className={`flex flex-col items-center gap-1 text-xs ${activeModule === i ? 'text-trust' : 'text-mutedblue'}`}>
              <mod.icon className="w-5 h-5" />{mod.label}
            </button>
          ))}
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 p-6 lg:p-12 max-w-5xl pb-32 lg:pb-12">
          <AnimatePresence mode="wait">

            {/* --- MÓDULO 0: CHATBOT LUNA (REDiseñado) --- */}
            {activeModule === 0 && (
              <motion.div key="luna" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">

                {/* Cabecera Luna */}
                <div className="flex items-center gap-6 bg-softwhite/5 p-6 rounded-3xl border border-softwhite/10 shadow-inner">
                  <LunaAvatar />
                  <div>
                    <h2 className="font-display font-bold text-3xl text-softwhite leading-none mb-2">Habla con Luna</h2>
                    <p className="text-mutedblue font-body text-sm max-w-sm">Estoy aquí para escucharte sin juzgarte. Puedes decirme cómo te sientes o simplemente desahogarte.</p>
                  </div>
                </div>

                {/* Layout Principal: 3 Columnas en Desktop, Vertical en Mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Columna Izquierda: Selección de Emociones */}
                  <div className="lg:col-span-3">
                    {selectedEmotion === null && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-3xl p-6 border border-softwhite/5 shadow-xl h-full">
                        <p className="text-sm text-hope font-semibold mb-6 uppercase tracking-widest text-center">¿Cómo te sientes hoy?</p>
                        <div className="grid grid-cols-2 gap-3">
                          {emotions.map((e, i) => (
                            <motion.button key={i} whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }} whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedEmotion(i);
                                setChatMessages(m => [...m, { from: 'user', text: `Me siento ${emotionLabels[i].toLowerCase()}` }, { from: 'luna', text: `Gracias por compartir que te sientes ${emotionLabels[i].toLowerCase()}. Tus sentimientos son importantes para mí. ¿Quieres contarme qué pasó o qué tienes en mente?` }]);
                              }}
                              className="flex flex-col items-center gap-3 p-4 rounded-xl border border-softwhite/5 transition-all hover:bg-softwhite/5">
                              <span className="text-5xl">{e}</span>
                              <span className="text-[9px] text-mutedblue font-bold uppercase tracking-tighter text-center">{emotionLabels[i]}</span>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Columna Central: Chatbox Principal */}
                  <div className="lg:col-span-6">
                    <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border border-softwhite/10 bg-midnight/40" style={{ height: '550px' }}>
                      <div className="bg-softwhite/5 px-8 py-4 border-b border-softwhite/10 flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-hope rounded-full animate-pulse shadow-[0_0_8px_#2ecc71]" />
                        <span className="text-xs text-mutedblue font-mono font-semibold uppercase tracking-widest">Luna está contigo</span>
                      </div>

                      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-softwhite/10">
                        {chatMessages.map((msg, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: msg.from === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative max-w-[80%] px-6 py-4 text-[15px] leading-relaxed font-body shadow-lg ${msg.from === 'user'
                              ? 'bg-trust text-softwhite rounded-[1.5rem] rounded-tr-none'
                              : 'bg-softwhite/10 text-softwhite rounded-[1.5rem] rounded-tl-none border border-softwhite/5 backdrop-blur-md'
                              }`}>
                              {msg.from === 'luna' && (
                                <span className="absolute -top-6 left-1 text-[10px] text-hope font-black uppercase tracking-widest">Luna</span>
                              )}
                              {msg.text}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Input del Chat */}
                      <div className="p-6 bg-softwhite/5 border-t border-softwhite/10">
                        <div className="relative flex items-center gap-3 bg-midnight/60 rounded-2xl border border-softwhite/10 p-2 focus-within:border-trust/40 transition-all shadow-inner">
                          <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                            placeholder="Escribe lo que sientes..."
                            className="flex-1 bg-transparent px-5 py-3 text-sm text-softwhite outline-none placeholder:text-mutedblue/40"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleChat}
                            className="bg-trust hover:bg-trust/80 text-white p-3.5 rounded-xl transition-all shadow-lg"
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
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.04)' }}
                      onClick={startBreathing}
                      className="w-full glass-card rounded-3xl p-6 border border-hope/10 flex flex-col items-center justify-center gap-4 shadow-xl transition-all h-full"
                    >
                      {!breathing ? (
                        <>
                          <div className="w-14 h-14 bg-hope/10 rounded-full flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-hope" />
                          </div>
                          <div className="text-center">
                            <p className="text-softwhite font-display font-bold text-lg mb-1">¿Necesitas calma?</p>
                            <p className="text-mutedblue text-xs">Respiración guiada</p>
                          </div>
                          <span className="text-hope font-bold text-xs border-b border-hope/30 pb-1">COMENZAR</span>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <motion.div
                            animate={{ scale: breathStep < 2 ? [1, 1.5, 1.5] : [1.5, 1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-24 h-24 rounded-full bg-hope/10 border-2 border-hope/40 flex items-center justify-center shadow-[0_0_30px_rgba(46,204,113,0.2)]"
                          >
                            <span className="text-hope font-black text-sm tracking-wider text-center">{breathingSteps[breathStep]}</span>
                          </motion.div>
                          <p className="text-mutedblue animate-pulse text-xs font-mono tracking-widest">Sigue el ritmo...</p>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- MÓDULO 1: RED DE APOYO --- */}
            {activeModule === 1 && (
              <motion.div
                key="red"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >

                {/* HEADER */}
                <div>
                  <h2 className="font-display font-bold text-3xl text-softwhite mb-2">
                    Tu Red de Apoyo
                  </h2>
                  <p className="text-mutedblue text-sm max-w-xl">
                    Estas son las personas que pueden acompañarte. No tienes que pasar por esto solo/a.
                  </p>
                </div>

                {/* RESUMEN SUPERIOR */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* CONTADOR */}
                  <div className="glass-card p-6 rounded-3xl border border-hope/20 flex flex-col justify-center">
                    <p className="text-xs text-mutedblue uppercase mb-2">Personas de apoyo</p>
                    <p className="text-4xl font-bold text-hope">{myNetwork.length}</p>
                    <p className="text-xs text-mutedblue mt-2">
                      {myNetwork.length === 0
                        ? "Empieza agregando personas"
                        : "Personas que pueden ayudarte"}
                    </p>
                  </div>

                  {/* LISTA SELECCIONADA */}
                  <div className="glass-card p-6 rounded-3xl border border-softwhite/10 lg:col-span-2">
                    <p className="text-xs text-mutedblue uppercase mb-4">Tu círculo cercano</p>

                    {myNetwork.length === 0 ? (
                      <p className="text-mutedblue text-sm italic">
                        Aún no has agregado a nadie. Empieza abajo 👇
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {myNetwork.map((p) => (
                          <div
                            key={p}
                            className="px-4 py-2 rounded-full bg-hope/20 text-hope text-xs flex items-center gap-2"
                          >
                            💛 {p}
                            <button
                              onClick={() =>
                                setMyNetwork(myNetwork.filter((x) => x !== p))
                              }
                              className="text-[10px] opacity-70 hover:opacity-100"
                            >
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
                    <motion.div
                      key={cat.label}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card rounded-3xl p-6 border border-softwhite/5 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-softwhite font-bold flex items-center gap-2">
                          <span className="text-xl">{cat.icon}</span>
                          {cat.label}
                        </h3>
                        <span className="text-[10px] text-mutedblue">
                          {cat.people.length} opciones
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {cat.people.map((p) => {
                          const selected = myNetwork.includes(p);

                          return (
                            <motion.button
                              key={p}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                selected
                                  ? setMyNetwork(myNetwork.filter((x) => x !== p))
                                  : setMyNetwork([...myNetwork, p])
                              }
                              className={`px-4 py-2 rounded-xl text-xs transition-all ${selected
                                ? 'bg-gradient-to-r from-hope to-trust text-white shadow-md'
                                : 'bg-softwhite/5 text-mutedblue hover:text-softwhite'
                                }`}
                            >
                              {selected ? '✓ ' : '+ '}
                              {p}
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
              <motion.div
                key="transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Encabezado Principal */}
                <div className="mb-8">
                  <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Transformar Pensamientos</h2>
                  <p className="text-mutedblue font-body text-sm max-w-2xl">
                    Selecciona los pensamientos que has tenido y mira cómo podemos transformarlos juntos.
                  </p>
                </div>

                {/* Contenedor Principal: Dos Secciones (Selecciones + Respuestas) */}
                <div className="space-y-8">
                  
                  {/* SECCIÓN 1: GRID DE 14 PENSAMIENTOS (2 FILAS x 7 COLUMNAS) */}
                  <div>
                    <div className="inline-flex items-center gap-2 text-rose-400 text-[11px] font-bold uppercase tracking-widest mb-6">
                      <div className="w-2 h-2 bg-rose-400 rounded-full" />
                      Pensamientos que reconozco
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {negativeThoughts.map((thought) => (
                        <motion.button
                          key={thought.id}
                          whileHover={{ scale: 1.08, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedThoughts(prev =>
                              prev.includes(thought.id)
                                ? prev.filter(id => id !== thought.id)
                                : [...prev, thought.id]
                            );
                          }}
                          className={`relative py-4 px-2 rounded-lg border-2 transition-all text-center font-body text-[10px] leading-tight flex items-center justify-center min-h-[100px] flex-col gap-2 ${selectedThoughts.includes(thought.id)
                              ? 'bg-rose-500/30 border-rose-400 text-softwhite shadow-lg shadow-rose-500/20'
                              : 'bg-white/[0.02] border-white/10 text-mutedblue hover:border-rose-400/40 hover:bg-white/[0.05]'
                            }`}
                          title={thought.negative}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selectedThoughts.includes(thought.id)
                              ? 'bg-rose-400 border-rose-400'
                              : 'border-white/30'
                            }`}>
                            {selectedThoughts.includes(thought.id) && (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[8px] text-midnight font-bold">
                                ✓
                              </motion.span>
                            )}
                          </div>
                          <p className="font-semibold">{thought.negative}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* SECCIÓN 2: RESPUESTAS TRANSFORMADAS */}
                  <div>
                    <div className="inline-flex items-center gap-2 text-hope text-[11px] font-bold uppercase tracking-widest mb-6">
                      <div className={`w-2 h-2 bg-hope rounded-full ${selectedThoughts.length > 0 ? 'animate-pulse' : ''}`} />
                      Nuevas perspectivas para ti
                    </div>

                    {selectedThoughts.length === 0 ? (
                      <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-3xl opacity-30 mx-auto">
                          ✨
                        </div>
                        <p className="text-mutedblue/50 text-sm font-body italic">
                          Selecciona pensamientos arriba para ver sus transformaciones...
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                          {negativeThoughts
                            .filter(thought => selectedThoughts.includes(thought.id))
                            .map((thought) => (
                              <motion.div
                                key={thought.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="glass-card rounded-xl p-4 border border-hope/30 bg-gradient-to-br from-hope/15 via-trust/5 to-transparent relative overflow-hidden"
                              >
                                {/* Decoración de fondo */}
                                <div className="absolute -top-8 -right-8 w-24 h-24 bg-hope/5 rounded-full blur-2xl" />

                                <div className="relative z-10 flex flex-col gap-3">
                                  <div>
                                    <p className="text-[9px] font-bold text-hope/70 uppercase tracking-tighter mb-2">Transformación:</p>
                                    <p className="text-softwhite text-sm leading-relaxed font-display font-medium">
                                      {thought.positive}
                                    </p>
                                  </div>

                                  <div className="pt-2 border-t border-white/5 flex justify-end">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => saveAffirmation(thought.positive)}
                                      className="flex items-center gap-1 text-hope text-[9px] font-bold hover:text-hope/80 transition-colors"
                                    >
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón Limpiar */}
                {selectedThoughts.length > 0 && (
                  <div className="pt-6 border-t border-white/5">
                    <motion.button
                      whileHover={{ x: -10 }}
                      onClick={() => setSelectedThoughts([])}
                      className="flex items-center gap-2 text-mutedblue hover:text-softwhite transition-all text-sm font-medium"
                    >
                      ← Limpiar selección
                    </motion.button>
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