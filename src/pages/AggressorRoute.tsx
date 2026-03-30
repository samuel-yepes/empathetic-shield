import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, BookOpen, Users, Trophy } from 'lucide-react';

const scenes = [
  {
    id: 1,
    narration: 'Es tu primer día en una escuela nueva. En el recreo, ves a un chico más pequeño sentado solo. Tus nuevos "amigos" te sugieren que sería gracioso quitarle su almuerzo.',
    options: [
      { text: 'Le quitas el almuerzo para impresionar al grupo', score: -15, reaction: 'El chico baja la mirada. Sus ojos se llenan de lágrimas. El grupo ríe.' },
      { text: 'Te niegas y te sientas con el chico solo', score: 20, reaction: 'El chico sonríe con sorpresa. "¿Puedo sentarme contigo?" te pregunta.' },
      { text: 'Ignoras la situación y te alejas', score: -5, reaction: 'El chico sigue solo. El grupo busca a otro para hacerlo.' },
    ],
  },
  {
    id: 2,
    narration: 'En clase, el profesor pide formar equipos. Notas que siempre excluyen a la misma compañera. Tu grupo no la quiere.',
    options: [
      { text: 'Dices "nadie la quiere en su equipo" en voz alta', score: -20, reaction: 'La compañera escucha. Pide ir al baño y no regresa en 20 minutos.' },
      { text: 'La invitas a tu equipo sin hacer alarde', score: 20, reaction: 'Ella se integra nerviosamente pero al final del trabajo está sonriendo.' },
      { text: 'No dices nada, tu grupo decide', score: -5, reaction: 'La compañera queda sola otra vez. El profesor la asigna pero ella se siente humillada.' },
    ],
  },
  {
    id: 3,
    narration: 'Alguien creó un grupo de chat donde se burlan de un compañero. Te invitan a unirte. Ya hay 15 personas dentro.',
    options: [
      { text: 'Te unes y envías un meme burlándote', score: -20, reaction: 'Tu compañero descubre el grupo. Deja de ir a la escuela por una semana.' },
      { text: 'Rechazas y le cuentas a un adulto de confianza', score: 25, reaction: 'El grupo se elimina. Varios compañeros te agradecen en privado.' },
      { text: 'No te unes pero no haces nada', score: -5, reaction: 'El grupo sigue creciendo. Las burlas se intensifican cada día.' },
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

const chatResponses: Record<string, string> = {
  hola: 'Hola... gracias por hablarme. No muchos lo hacen.',
  perdón: 'Escuchar eso significa mucho. No sabes cuánto.',
  perdon: 'Escuchar eso significa mucho. No sabes cuánto.',
  'lo siento': 'Gracias... llevo mucho tiempo esperando que alguien dijera eso.',
  amigos: 'No tengo muchos amigos. La gente me evita después de lo que pasó.',
  ayuda: 'Me gustaría creer que las cosas pueden cambiar. ¿Tú crees?',
  mal: 'Sí... ha sido muy difícil. Pero hablar contigo ayuda un poco.',
  bien: 'Ojalá yo pudiera decir lo mismo. Pero estoy intentando.',
  escuela: 'La escuela es el lugar que más miedo me da. Cada día es una batalla.',
  solo: 'Sí, me siento muy solo/a. A veces pienso que a nadie le importo.',
  default_positive: 'Gracias por ser amable. Significa más de lo que imaginas.',
  default_negative: 'Eso... eso duele. ¿Por qué dirías algo así?',
};

const negativeWords = ['tonto', 'feo', 'idiota', 'estúpido', 'gordo', 'perdedor', 'inútil', 'cállate', 'nadie', 'basura'];
const positiveWords = ['ayuda', 'bien', 'perdón', 'perdon', 'lo siento', 'amigo', 'quiero', 'importa', 'valiente', 'gracias', 'apoyo', 'hola'];

export default function AggressorRoute() {
  const { reputationScore, updateReputation, completeModule } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [perspective, setPerspective] = useState<'agresor' | 'victima'>('agresor');
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string }[]>([
    { from: 'maya', text: 'Hola... soy Maya. Me dijeron que querías hablar conmigo.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [decisions, setDecisions] = useState<string[]>([]);

  const handleChoice = (optionIndex: number) => {
    const option = scenes[sceneIndex].options[optionIndex];
    setChosenOption(optionIndex);
    updateReputation(option.score);
    setDecisions([...decisions, option.text]);
    setTimeout(() => {
      setChosenOption(null);
      if (sceneIndex < scenes.length - 1) {
        setSceneIndex(sceneIndex + 1);
      } else {
        completeModule('agresor-simulator');
      }
    }, 3000);
  };

  const handleChat = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.toLowerCase().trim();
    setChatMessages((m) => [...m, { from: 'user', text: chatInput }]);
    setChatInput('');

    const isNegative = negativeWords.some((w) => msg.includes(w));
    const isPositive = positiveWords.some((w) => msg.includes(w));

    let response = '';
    for (const key of Object.keys(chatResponses)) {
      if (key !== 'default_positive' && key !== 'default_negative' && msg.includes(key)) {
        response = chatResponses[key]; break;
      }
    }
    if (!response) response = isNegative ? chatResponses.default_negative : chatResponses.default_positive;

    if (isNegative) updateReputation(-5);
    if (isPositive) updateReputation(5);

    setTimeout(() => {
      setChatMessages((m) => [...m, { from: 'maya', text: response }]);
    }, 1000);
  };

  const modules = [
    { icon: BookOpen, label: 'Simulador' },
    { icon: Users, label: 'Perspectivas' },
    { icon: MessageCircle, label: 'Chat' },
    { icon: Trophy, label: 'Consecuencias' },
  ];

  const getScenario = () => {
    if (reputationScore >= 70) return { title: 'Integración Social', desc: 'Has demostrado empatía. Tus compañeros confían en ti y te ven como líder positivo.', color: 'hope' };
    if (reputationScore >= 40) return { title: 'Oportunidad de Cambio', desc: 'Estás en un punto intermedio. La mediación podría ayudarte a mejorar tus relaciones.', color: 'trust' };
    return { title: 'Consecuencias', desc: 'El patrón de agresión ha generado consecuencias disciplinarias y aislamiento social.', color: 'warm' };
  };

  return (
    <div className="min-h-screen bg-midnight pt-24">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 min-h-screen border-r border-softwhite/5 p-6 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-mutedblue hover:text-trust text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <h3 className="font-display font-bold text-lg text-softwhite mb-6">Dashboard de Empatía</h3>

          <div className="mb-8">
            <p className="text-xs text-mutedblue font-mono mb-2">REPUTACIÓN SOCIAL</p>
            <div className="relative w-full h-3 bg-softwhite/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${reputationScore}%` }}
                style={{
                  background: reputationScore >= 70 ? '#00C896' : reputationScore >= 40 ? '#1E6FD9' : '#F4845F',
                }}
              />
            </div>
            <p className="text-right text-sm font-mono text-softwhite mt-1">{reputationScore}/100</p>
          </div>

          <div className="space-y-2">
            {modules.map((mod, i) => (
              <button
                key={i}
                onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body transition-colors ${
                  activeModule === i ? 'bg-trust/10 text-trust' : 'text-mutedblue hover:text-softwhite hover:bg-softwhite/5'
                }`}
              >
                <mod.icon className="w-4 h-4" />
                {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-softwhite/5 flex">
          {modules.map((mod, i) => (
            <button
              key={i}
              onClick={() => setActiveModule(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${
                activeModule === i ? 'text-trust' : 'text-mutedblue'
              }`}
            >
              <mod.icon className="w-4 h-4" />
              {mod.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-6 lg:p-10 max-w-4xl pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Simulador de Decisiones</h2>
                <p className="text-mutedblue font-body mb-8 text-sm">Alex, 14 años. Primer día en escuela nueva.</p>

                {sceneIndex < scenes.length ? (
                  <div className="glass-card rounded-2xl p-6 md:p-8">
                    <p className="text-xs font-mono text-mutedblue mb-4">Escena {sceneIndex + 1} de {scenes.length}</p>
                    <p className="text-softwhite font-body leading-relaxed mb-8">{scenes[sceneIndex].narration}</p>

                    {chosenOption !== null ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-softwhite/5 rounded-xl p-6">
                        <p className="text-softwhite font-body text-sm italic">{scenes[sceneIndex].options[chosenOption].reaction}</p>
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {scenes[sceneIndex].options.map((opt, oi) => (
                          <motion.button
                            key={oi}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleChoice(oi)}
                            className="w-full text-left glass-card rounded-xl p-4 text-softwhite font-body text-sm hover:bg-softwhite/[0.06] transition-colors"
                          >
                            {opt.text}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-8 text-center">
                    <h3 className="font-display font-bold text-2xl text-softwhite mb-4">Simulación Completada</h3>
                    <p className="text-mutedblue font-body mb-4">Has tomado {decisions.length} decisiones. Tu puntaje: {reputationScore}/100</p>
                    <button onClick={() => { setSceneIndex(0); setDecisions([]); }} className="px-6 py-2 rounded-full gradient-trust-hope text-softwhite text-sm font-semibold">
                      Reiniciar
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeModule === 1 && (
              <motion.div key="persp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Ponte en sus Zapatos</h2>
                <p className="text-mutedblue font-body mb-6 text-sm">La misma historia, dos perspectivas.</p>

                <div className="flex gap-2 mb-8">
                  {(['agresor', 'victima'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPerspective(p)}
                      className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
                        perspective === p
                          ? p === 'agresor' ? 'bg-warm text-softwhite' : 'bg-trust text-softwhite'
                          : 'glass-card text-mutedblue'
                      }`}
                    >
                      {p === 'agresor' ? 'Agresor' : 'Víctima'}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={perspective}
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {comicPanels[perspective].map((panel, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-xl p-6"
                      >
                        <p className="text-xs font-mono text-mutedblue mb-2">Panel {i + 1}</p>
                        <p className="text-softwhite font-body text-sm leading-relaxed italic">"{panel}"</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}

            {activeModule === 2 && (
              <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Chat con Maya</h2>
                <p className="text-mutedblue font-body mb-6 text-sm">Maya es una víctima virtual. Habla con ella.</p>

                <div className="glass-card rounded-2xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body ${
                          msg.from === 'user'
                            ? 'bg-trust/20 text-softwhite rounded-br-md'
                            : 'bg-softwhite/5 text-softwhite rounded-bl-md'
                        }`}>
                          {msg.from === 'maya' && <p className="text-xs text-mutedblue mb-1 font-medium">Maya</p>}
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-softwhite/5 p-4 flex gap-3">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                      placeholder="Escribe un mensaje..."
                      className="flex-1 bg-softwhite/5 rounded-xl px-4 py-3 text-sm text-softwhite font-body placeholder:text-mutedblue border-0 outline-none focus:ring-1 focus:ring-trust/50"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleChat}
                      className="px-5 py-3 rounded-xl bg-trust text-softwhite text-sm font-semibold"
                    >
                      Enviar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeModule === 3 && (
              <motion.div key="conseq" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">6 Meses Después</h2>
                <p className="text-mutedblue font-body mb-8 text-sm">Tu escenario basado en tus decisiones.</p>

                {(() => {
                  const scenario = getScenario();
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-card rounded-2xl p-8 md:p-12 text-center"
                    >
                      <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                        scenario.color === 'hope' ? 'bg-hope/10' : scenario.color === 'trust' ? 'bg-trust/10' : 'bg-warm/10'
                      }`}>
                        <Trophy className={`w-8 h-8 ${
                          scenario.color === 'hope' ? 'text-hope' : scenario.color === 'trust' ? 'text-trust' : 'text-warm'
                        }`} />
                      </div>
                      <h3 className="font-display font-bold text-2xl text-softwhite mb-3">{scenario.title}</h3>
                      <p className="text-mutedblue font-body leading-relaxed max-w-md mx-auto mb-6">{scenario.desc}</p>
                      <p className="font-mono text-sm text-mutedblue">Puntaje final: <span className="text-softwhite">{reputationScore}/100</span></p>
                    </motion.div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
