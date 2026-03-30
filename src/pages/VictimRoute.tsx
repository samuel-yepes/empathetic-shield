import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Users, Sparkles, PenTool, AlertTriangle } from 'lucide-react';

const emotions = ['😊', '😐', '😢', '😰', '😡', '🥺'];
const emotionLabels = ['Bien', 'Regular', 'Triste', 'Ansioso/a', 'Enojado/a', 'Vulnerable'];

const breathingSteps = ['Inhala...', 'Sostén...', 'Exhala...', 'Descansa...'];

const supportCategories = [
  { label: 'Familia', icon: '👨‍👩‍👧', people: ['Mamá', 'Papá', 'Hermano/a', 'Abuelo/a'] },
  { label: 'Escuela', icon: '🏫', people: ['Maestro/a', 'Orientador/a', 'Director/a', 'Compañero/a'] },
  { label: 'Amigos', icon: '💛', people: ['Mejor amigo/a', 'Amigo/a de confianza', 'Vecino/a'] },
  { label: 'Profesionales', icon: '🩺', people: ['Psicólogo/a', 'Médico/a', 'Línea de ayuda'] },
];

const transformations: Record<string, string> = {
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

const crisisWords = ['morir', 'suicid', 'no quiero seguir', 'acabar', 'sin salida'];

const writingPrompts = [
  'Hoy me sentí...',
  'Lo que nadie sabe es...',
  'Si pudiera decirle algo a mi yo del pasado...',
  'Lo que me hace fuerte es...',
];

export default function VictimRoute() {
  const { savedAffirmations, saveAffirmation } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string }[]>([
    { from: 'luna', text: '💛 Hola, soy Luna. Estoy aquí para escucharte. ¿Cómo te sientes hoy?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [breathing, setBreathing] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [myNetwork, setMyNetwork] = useState<string[]>([]);
  const [negativeThought, setNegativeThought] = useState('');
  const [transformed, setTransformed] = useState('');
  const [journalText, setJournalText] = useState('');
  const [showCatharsis, setShowCatharsis] = useState(false);

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.toLowerCase();
    setChatMessages((m) => [...m, { from: 'user', text: chatInput }]);
    setChatInput('');

    if (crisisWords.some((w) => msg.includes(w))) {
      setShowCrisis(true);
      setTimeout(() => {
        setChatMessages((m) => [...m, { from: 'luna', text: '💛 Entiendo que estás pasando por un momento muy difícil. Por favor, habla con alguien ahora. No estás solo/a. Línea de crisis: 800-290-0024' }]);
      }, 800);
      return;
    }

    const responses = [
      'No es tu culpa. Nada de lo que te pasa lo mereces.',
      'Gracias por compartir eso. Se necesita mucho valor.',
      'Tus sentimientos son completamente válidos.',
      '¿Has podido hablar de esto con alguien de confianza?',
      'Estoy aquí para ti. No tienes que pasar por esto solo/a.',
    ];
    setTimeout(() => {
      setChatMessages((m) => [...m, { from: 'luna', text: responses[Math.floor(Math.random() * responses.length)] }]);
    }, 1000);
  };

  const startBreathing = () => {
    setBreathing(true);
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % 4;
      setBreathStep(step);
      if (step === 0) { clearInterval(interval); setBreathing(false); }
    }, 4000);
  };

  const handleTransform = () => {
    const input = negativeThought.toLowerCase();
    let result = 'Mi situación actual no define mi futuro. Tengo el poder de buscar ayuda y cambiar mi historia.';
    for (const key of Object.keys(transformations)) {
      if (input.includes(key)) { result = transformations[key]; break; }
    }
    setTransformed(result);
  };

  const addToNetwork = (person: string) => {
    if (!myNetwork.includes(person)) setMyNetwork([...myNetwork, person]);
  };

  const modules = [
    { icon: MessageCircle, label: 'Luna' },
    { icon: Users, label: 'Red' },
    { icon: Sparkles, label: 'Transformar' },
    { icon: PenTool, label: 'Expresión' },
  ];

  return (
    <div className="min-h-screen bg-midnight pt-24" style={{ background: 'linear-gradient(180deg, #0A0F1E 0%, #0D1B3E 100%)' }}>
      {showCrisis && (
        <motion.div initial={{ y: -50 }} animate={{ y: 0 }} className="fixed top-0 left-0 right-0 z-50 bg-warm/90 text-softwhite py-3 px-4 text-center font-body text-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          ¿Estás en peligro? Llama ahora: <a href="tel:800-290-0024" className="underline font-bold">800-290-0024</a>
          <button onClick={() => setShowCrisis(false)} className="ml-4 text-xs underline">Cerrar</button>
        </motion.div>
      )}

      <div className="container mx-auto px-4 lg:px-8 mb-4">
        <div className="glass-card rounded-xl px-6 py-3 inline-flex items-center gap-2 text-hope text-sm font-body">
          <span>💚</span> Este es un espacio seguro. Aquí no estás solo/a.
        </div>
      </div>

      <div className="flex">
        <div className="hidden lg:block w-64 min-h-screen border-r border-softwhite/5 p-6 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-mutedblue hover:text-trust text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <h3 className="font-display font-bold text-lg text-softwhite mb-6">Centro de Apoyo</h3>
          <div className="space-y-2">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-colors ${
                  activeModule === i ? 'bg-trust/10 text-trust' : 'text-mutedblue hover:text-softwhite hover:bg-softwhite/5'
                }`}>
                <mod.icon className="w-4 h-4" />{mod.label}
              </button>
            ))}
          </div>
          {savedAffirmations.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-mono text-mutedblue mb-3">MIS AFIRMACIONES</p>
              {savedAffirmations.slice(-3).map((a, i) => (
                <div key={i} className="bg-hope/5 rounded-lg p-3 mb-2 text-xs text-hope font-body">"{a}"</div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-softwhite/5 flex">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${activeModule === i ? 'text-trust' : 'text-mutedblue'}`}>
              <mod.icon className="w-4 h-4" />{mod.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 lg:p-10 max-w-4xl pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            {activeModule === 0 && (
              <motion.div key="luna" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-6">Habla con Luna</h2>

                {selectedEmotion === null && (
                  <div className="glass-card rounded-2xl p-6 mb-6">
                    <p className="text-sm text-mutedblue font-body mb-4">¿Cómo te sientes hoy?</p>
                    <div className="flex gap-3 flex-wrap">
                      {emotions.map((e, i) => (
                        <motion.button key={i} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}
                          onClick={() => { setSelectedEmotion(i); setChatMessages(m => [...m, { from: 'user', text: `Me siento ${emotionLabels[i].toLowerCase()}` }, { from: 'luna', text: 'Gracias por compartir cómo te sientes. Tus emociones son válidas. ¿Quieres contarme más?' }]); }}
                          className="text-3xl hover:bg-softwhite/5 rounded-xl p-3 transition-colors flex flex-col items-center gap-1">
                          <span>{e}</span>
                          <span className="text-xs text-mutedblue">{emotionLabels[i]}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ height: '420px' }}>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body ${
                          msg.from === 'user' ? 'bg-trust/20 text-softwhite rounded-br-md' : 'bg-softwhite/5 text-softwhite rounded-bl-md'
                        }`}>
                          {msg.from === 'luna' && <p className="text-xs text-hope mb-1 font-medium">Luna</p>}
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-softwhite/5 p-4 flex gap-3">
                    <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                      placeholder="Escribe lo que sientes..."
                      className="flex-1 bg-softwhite/5 rounded-xl px-4 py-3 text-sm text-softwhite font-body placeholder:text-mutedblue border-0 outline-none focus:ring-1 focus:ring-trust/50" />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleChat}
                      className="px-5 py-3 rounded-xl bg-trust text-softwhite text-sm font-semibold">Enviar</motion.button>
                  </div>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} onClick={startBreathing}
                  className="mt-6 w-full glass-card rounded-xl p-6 text-center">
                  <p className="text-sm text-mutedblue font-body mb-3">Ejercicio de respiración guiada</p>
                  {breathing ? (
                    <motion.div animate={{ scale: breathStep < 2 ? [1, 1.3] : [1.3, 1] }} transition={{ duration: 3.5 }}
                      className="w-20 h-20 rounded-full bg-hope/20 mx-auto flex items-center justify-center">
                      <span className="text-hope text-sm font-body">{breathingSteps[breathStep]}</span>
                    </motion.div>
                  ) : (
                    <p className="text-hope text-sm">Comenzar respiración 🫁</p>
                  )}
                </motion.button>
              </motion.div>
            )}

            {activeModule === 1 && (
              <motion.div key="red" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Tu Red de Apoyo</h2>
                <p className="text-mutedblue font-body mb-8 text-sm">Arrastra personas a tu red de seguridad.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {supportCategories.map((cat) => (
                    <div key={cat.label} className="glass-card rounded-2xl p-6">
                      <h3 className="font-display font-bold text-lg text-softwhite mb-4">
                        <span className="mr-2">{cat.icon}</span>{cat.label}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {cat.people.map((p) => (
                          <motion.button key={p} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => addToNetwork(p)}
                            className={`px-3 py-1.5 rounded-full text-xs font-body transition-colors ${
                              myNetwork.includes(p) ? 'bg-hope/20 text-hope' : 'bg-softwhite/5 text-mutedblue hover:text-softwhite'
                            }`}>
                            {myNetwork.includes(p) ? '✓ ' : '+ '}{p}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-softwhite font-body">
                    Tu red de apoyo tiene <span className="font-mono text-hope font-bold text-xl">{myNetwork.length}</span> personas.
                  </p>
                  {myNetwork.length > 0 && (
                    <p className="text-mutedblue text-sm font-body mt-2">
                      Recuerda: hablar con alguien de confianza es un acto de valentía.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {activeModule === 2 && (
              <motion.div key="transform" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Transformador de Pensamientos</h2>
                <p className="text-mutedblue font-body mb-8 text-sm">Reencuadra tus pensamientos negativos.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl p-6">
                    <p className="text-xs font-mono text-warm mb-3">PENSAMIENTO NEGATIVO</p>
                    <textarea value={negativeThought} onChange={(e) => setNegativeThought(e.target.value)}
                      placeholder="Escribe aquí lo que sientes..."
                      className="w-full bg-transparent text-softwhite font-body text-sm resize-none h-32 outline-none placeholder:text-mutedblue" />
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={handleTransform}
                      className="w-full py-3 rounded-xl gradient-trust-hope text-softwhite font-body font-semibold text-sm mt-4">
                      ✨ Transformar
                    </motion.button>
                  </div>
                  <div className="glass-card rounded-2xl p-6">
                    <p className="text-xs font-mono text-hope mb-3">REENCUADRE POSITIVO</p>
                    <AnimatePresence mode="wait">
                      {transformed ? (
                        <motion.div key={transformed} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <p className="text-softwhite font-display text-lg leading-relaxed italic mb-4">"{transformed}"</p>
                          <motion.button whileHover={{ scale: 1.03 }}
                            onClick={() => { saveAffirmation(transformed); }}
                            className="text-hope text-xs font-body underline underline-offset-4">
                            💾 Guardar mi afirmación
                          </motion.button>
                        </motion.div>
                      ) : (
                        <p className="text-mutedblue font-body text-sm italic">Tu pensamiento transformado aparecerá aquí...</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {activeModule === 3 && (
              <motion.div key="express" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Espacio de Expresión</h2>
                <p className="text-mutedblue font-body mb-6 text-sm">Un lugar seguro para escribir lo que sientes.</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {writingPrompts.map((prompt) => (
                    <button key={prompt} onClick={() => setJournalText(prompt + ' ')}
                      className="glass-card px-3 py-1.5 rounded-full text-xs text-mutedblue hover:text-softwhite font-body transition-colors">
                      {prompt}
                    </button>
                  ))}
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Escribe libremente..."
                    className="w-full bg-transparent text-softwhite font-body text-sm resize-none h-48 outline-none placeholder:text-mutedblue leading-relaxed" />
                  <div className="flex gap-3 mt-4">
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => { setShowCatharsis(true); setTimeout(() => { setShowCatharsis(false); setJournalText(''); }, 3000); }}
                      className="px-6 py-3 rounded-xl gradient-trust-hope text-softwhite font-body font-semibold text-sm">
                      Liberar ✨
                    </motion.button>
                  </div>
                </div>

                <AnimatePresence>
                  {showCatharsis && (
                    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, y: -100 }} transition={{ duration: 2.5 }}
                      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                      <p className="text-softwhite font-display text-2xl">Tus palabras han sido liberadas 🍃</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
