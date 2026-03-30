import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Users, Trophy, AlertCircle, Brain, Send } from 'lucide-react';

// --- CONFIGURACIÓN DE DATOS ---
const scenes = [
  {
    id: 1,
    title: "El Receso",
    narration: 'Es tu primer día. En el recreo, ves a un chico más pequeño solo. Tus nuevos "amigos" te sugieren que sería gracioso quitarle su almuerzo.',
    context: "Presión de grupo detectada",
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
    context: "Exclusión social en curso",
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
    context: "Ciberacoso masivo",
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
    'Pedir perdón fue lo más difícil que he hecho.',
    'Hoy soy diferente. Todavía trabajo en ello cada día.',
  ],
  victima: [
    'Cada mañana sentía un nudo en el estómago. No quería ir a la escuela.',
    'Pensaba que algo estaba mal conmigo. Que yo era el problema.',
    'El silencio era lo peor. Nadie preguntaba cómo estaba.',
    'Un día alguien me tendió la mano. Solo eso cambió todo.',
    'Aprendí que pedir ayuda no es debilidad, es valentía.',
    'Hoy ayudo a otros a encontrar su voz. Mi historia no me define.',
  ],
};

const chatResponses = {
  hola: 'Hola... gracias por hablarme. No muchos lo hacen.',
  perdón: 'Escuchar eso significa mucho. No sabes cuánto.',
  perdon: 'Escuchar eso significa mucho. No sabes cuánto.',
  'lo siento': 'Gracias... llevo mucho tiempo esperando que alguien dijera eso.',
  amigos: 'No tengo muchos amigos. La gente me evita después de lo que pasó.',
  ayuda: 'Me gustaría creer que las cosas pueden cambiar. ¿Tú crees?',
  mal: 'Sí... ha sido muy difícil. Pero hablar contigo ayuda un poco.',
  default_positive: 'Gracias por ser amable. Significa más de lo que imaginas.',
  default_negative: 'Eso... eso duele. ¿Por qué dirías algo así?',
};

const negativeWords = ['tonto', 'feo', 'idiota', 'estúpido', 'gordo', 'perdedor', 'inútil', 'basura'];
const positiveWords = ['ayuda', 'bien', 'perdón', 'lo siento', 'amigo', 'gracias', 'apoyo', 'hola'];

// --- COMPONENTE PRINCIPAL ---
export default function AggressorRoute() {
  const { reputationScore, updateReputation, completeModule } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState(null);
  const [perspective, setPerspective] = useState('agresor');
  const [chatMessages, setChatMessages] = useState([
    { from: 'maya', text: 'Hola... soy Maya. Me dijeron que querías hablar conmigo.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [history, setHistory] = useState([]);

  // Lógica del Simulador
  const handleChoice = (optionIndex) => {
    const option = scenes[sceneIndex].options[optionIndex];
    setChosenOption(optionIndex);
    updateReputation(option.score);
    setHistory([...history, option]);
    
    setTimeout(() => {
      setChosenOption(null);
      if (sceneIndex < scenes.length - 1) {
        setSceneIndex(sceneIndex + 1);
      } else {
        setSceneIndex(scenes.length);
        completeModule('agresor-simulator');
      }
    }, 3500);
  };

  const analysis = useMemo(() => {
    if (history.length < 3) return null;
    const counts = history.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});
    if (counts.agresion >= 2) return { title: "Perfil de Alerta", text: "Tus decisiones reflejan una tendencia a usar el poder para encajar.", advice: "El verdadero liderazgo no requiere víctimas." };
    if (counts.empatia >= 2) return { title: "Liderazgo Empático", text: "Has demostrado valentía para romper el ciclo del acoso.", advice: "Sigue siendo esa voz valiente." };
    return { title: "Perfil Neutral", text: "Tu silencio permite que el acoso continúe.", advice: "Recuerda: no actuar también es una decisión." };
  }, [history]);

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.toLowerCase().trim();
    setChatMessages((m) => [...m, { from: 'user', text: chatInput }]);
    setChatInput('');

    const isNegative = negativeWords.some((w) => msg.includes(w));
    const isPositive = positiveWords.some((w) => msg.includes(w));

    let response = isNegative ? chatResponses.default_negative : chatResponses.default_positive;
    for (const key in chatResponses) { if (msg.includes(key)) response = chatResponses[key]; }

    if (isNegative) updateReputation(-5);
    if (isPositive) updateReputation(5);

    setTimeout(() => {
      setChatMessages((m) => [...m, { from: 'maya', text: response }]);
    }, 1000);
  };

  const getScenario = () => {
    if (reputationScore >= 70) return { title: 'Integración Social', desc: 'Has ganado el respeto genuino de tus compañeros.', color: 'hope' };
    if (reputationScore >= 30) return { title: 'Oportunidad de Cambio', desc: 'Estás a tiempo de corregir tu camino.', color: 'trust' };
    return { title: 'Consecuencias Críticas', desc: 'Tu comportamiento te ha llevado al aislamiento social.', color: 'warm' };
  };

  const modules = [
    { icon: Brain, label: 'Jugar' },
    { icon: Users, label: 'Miradas' },
    { icon: MessageCircle, label: 'Maya' },
    { icon: Trophy, label: 'Final' },
  ];

  return (
    <div className="min-h-screen bg-midnight text-softwhite pb-28 lg:pb-0 font-sans">
      
      {/* HEADER MÓVIL */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-midnight/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <Link to="/caminos" className="text-mutedblue active:scale-90 transition-transform"><ArrowLeft size={22}/></Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono tracking-[0.2em] text-mutedblue uppercase">Conciencia</span>
          <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
            <motion.div className="h-full" animate={{ width: `${Math.max(0, reputationScore)}%`, backgroundColor: reputationScore > 50 ? '#00C896' : '#F4845F' }} />
          </div>
        </div>
        <div className="w-6" />
      </header>

      <div className="flex flex-col lg:flex-row pt-20 lg:pt-24 lg:px-10">
        
        {/* SIDEBAR ESCRITORIO */}
        <aside className="hidden lg:block w-72 min-h-screen border-r border-white/5 p-6 sticky top-24 self-start bg-midnight/50">
          <Link to="/caminos" className="flex items-center gap-2 text-mutedblue hover:text-trust text-xs font-mono tracking-widest mb-12 transition-all">
            <ArrowLeft className="w-4 h-4" /> VOLVER AL MAPA
          </Link>
          <div className="mb-10">
            <h3 className="text-[10px] text-mutedblue font-mono tracking-[0.3em] mb-4 uppercase">Estado Actual</h3>
            <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div className="h-full" animate={{ width: `${Math.max(0, reputationScore)}%`, backgroundColor: reputationScore > 50 ? '#00C896' : '#F4845F' }} />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-mutedblue uppercase">
              <span>Nivel Ético</span>
              <span className="text-softwhite font-bold">{Math.max(0, reputationScore)}%</span>
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
        <main className="flex-1 p-5 lg:p-10 max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* 0: SIMULADOR */}
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {sceneIndex < scenes.length ? (
                  <div className="space-y-6">
                    <div className="mb-4">
                      <span className="text-trust font-mono text-[11px] tracking-[0.5em] uppercase">Escena {sceneIndex + 1} de 3</span>
                      <h2 className="text-3xl lg:text-4xl font-black mt-2 leading-tight">{scenes[sceneIndex].title}</h2>
                    </div>
                    <div className="glass-card rounded-[2.5rem] p-8 lg:p-12 bg-white/[0.03] border border-white/10 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-trust/30" />
                      <p className="text-xl lg:text-2xl leading-relaxed text-softwhite/90 font-light">
                        "{scenes[sceneIndex].narration}"
                      </p>
                    </div>
                    {chosenOption !== null && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className={`rounded-2xl p-6 border ${scenes[sceneIndex].options[chosenOption].type === 'agresion' ? 'bg-warm/10 border-warm/20 text-warm' : 'bg-hope/10 border-hope/20 text-hope'}`}>
                        <div className="flex items-center gap-3 mb-2">
                           <AlertCircle size={18}/>
                           <span className="text-xs font-black uppercase tracking-widest">{scenes[sceneIndex].options[chosenOption].emotion}</span>
                        </div>
                        <p className="text-softwhite/80 italic text-lg leading-relaxed">"{scenes[sceneIndex].options[chosenOption].reaction}"</p>
                      </motion.div>
                    )}
                    <div className="grid lg:grid-cols-1 gap-3 pt-4">
                      {scenes[sceneIndex].options.map((opt, oi) => (
                        <motion.button key={oi} disabled={chosenOption !== null} onClick={() => handleChoice(oi)}
                          className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 text-base font-medium shadow-md ${
                            chosenOption === oi ? (opt.type === 'agresion' ? 'bg-warm text-midnight border-warm' : 'bg-hope text-midnight border-hope')
                            : (chosenOption !== null ? 'opacity-30 scale-95' : 'bg-white/5 border-white/10 text-softwhite hover:border-trust/50 active:scale-[0.98]')
                          }`}>
                          {opt.text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto glass-card rounded-[3rem] p-10 lg:p-14 text-center border border-white/10 mt-6 bg-gradient-to-b from-white/5 to-transparent">
                    <div className="bg-trust/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,200,150,0.2)]">
                      <Trophy size={40} className="text-trust" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">{analysis?.title}</h3>
                    <p className="text-mutedblue text-lg leading-relaxed mb-8">{analysis?.text}</p>
                    <div className="bg-white/5 p-6 rounded-2xl mb-10 border border-white/5 italic text-softwhite/60">
                      "{analysis?.advice}"
                    </div>
                    <button onClick={() => { setSceneIndex(0); setHistory([]); updateReputation(-reputationScore); }} 
                      className="w-full py-5 rounded-2xl bg-trust text-midnight font-black tracking-widest uppercase hover:bg-hope transition-colors shadow-xl">
                      Reiniciar Simulación
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* 1: PERSPECTIVAS */}
            {activeModule === 1 && (
              <motion.div key="persp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-black mb-2">Ponte en sus zapatos</h2>
                  <p className="text-mutedblue uppercase text-xs tracking-widest font-mono">Entiende el impacto real</p>
                </div>
                <div className="flex p-1.5 bg-white/5 rounded-2xl gap-2">
                  {['agresor', 'victima'].map((p) => (
                    <button key={p} onClick={() => setPerspective(p)}
                      className={`flex-1 py-4 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${perspective === p ? (p === 'agresor' ? 'bg-warm text-midnight shadow-lg' : 'bg-trust text-midnight shadow-lg') : 'text-mutedblue hover:text-softwhite'}`}>
                      {p === 'agresor' ? 'El que agrede' : 'El que sufre'}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {comicPanels[perspective].map((panel, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} 
                      className="glass-card rounded-3xl p-6 border border-white/5 text-base leading-relaxed bg-white/[0.02] shadow-inner font-light">
                      <span className="text-trust/40 font-serif text-4xl block mb-2">“</span>
                      {panel}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2: CHAT CON MAYA */}
            {activeModule === 2 && (
              <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[65vh] flex flex-col max-w-2xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-3xl font-black mb-1">Maya</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-hope rounded-full animate-pulse" />
                    <p className="text-mutedblue text-xs uppercase tracking-widest font-mono">En línea ahora</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-3 mb-6 custom-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: msg.from === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-5 py-4 rounded-3xl text-sm shadow-sm ${msg.from === 'user' ? 'bg-trust text-midnight rounded-tr-none font-semibold' : 'bg-white/10 text-softwhite rounded-tl-none border border-white/5'}`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="relative flex items-center gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                    placeholder="Escribe algo aquí..." className="flex-1 bg-transparent px-5 py-3 text-sm outline-none placeholder:text-mutedblue" />
                  <button onClick={handleChat} className="p-4 bg-trust text-midnight rounded-full shadow-lg active:scale-90 transition-transform"><Send size={20}/></button>
                </div>
              </motion.div>
            )}

            {/* 3: CONSECUENCIAS (DESTINO) */}
            {activeModule === 3 && (
              <motion.div key="conseq" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                {(() => {
                  const s = getScenario();
                  return (
                    <div className="glass-card rounded-[4rem] p-12 lg:p-20 border border-white/10 max-w-xl mx-auto bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl">
                      <div className={`w-24 h-24 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-2xl ${s.color === 'hope' ? 'bg-hope/20 text-hope' : s.color === 'trust' ? 'bg-trust/20 text-trust' : 'bg-warm/20 text-warm'}`}>
                        <Trophy size={48} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-4xl font-black mb-6 tracking-tighter uppercase">{s.title}</h3>
                      <p className="text-mutedblue text-lg mb-10 leading-relaxed font-light">{s.desc}</p>
                      <div className="inline-block px-8 py-3 bg-white/5 rounded-full text-[12px] font-mono text-trust tracking-[0.3em] border border-white/5">
                        SCORE FINAL: {reputationScore}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* NAVEGACIÓN INFERIOR (TAB BAR) MÓVIL */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-midnight/90 backdrop-blur-2xl border-t border-white/10 px-6 py-4 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)} className="flex flex-col items-center gap-1.5 transition-all">
              <div className={`p-3 rounded-2xl transition-all duration-300 ${activeModule === i ? 'bg-trust text-midnight shadow-[0_0_20px_rgba(0,200,150,0.5)] scale-110' : 'text-mutedblue active:scale-90'}`}>
                <mod.icon size={22} strokeWidth={activeModule === i ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${activeModule === i ? 'text-trust opacity-100' : 'text-mutedblue opacity-50'}`}>
                {mod.label}
              </span>
            </button>
          ))}
        </nav>

      </div>
    </div>
  );
}