import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, ClipboardList, Zap, MessageCircle, EyeOff, UserPlus, Megaphone, Smile, Handshake } from 'lucide-react';

const witnessScenes = [
  {
    id: 1,
    // GIF animado de pasillo escolar/burlas
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXp4cnphZndpYmFyeXlnaHlsYmxkZzJ4M3B6ZGR3ZXJ0YjRwY29iOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKo4S31EAI2jEAE/giphy.gif",
    narration: 'En el pasillo, ves a un grupo rodeando a un compañero más pequeño. Le están quitando su mochila y se burlan de él.',
    options: [
      { text: 'Unirse a las burlas', impact: 'reir', score: -25 },
      { text: 'Pasar de largo sin mirar', impact: 'ignorar', score: -15 },
      { text: 'Ponerse al lado del compañero', impact: 'intervenir', score: 25 },
      { text: 'Buscar rápido a un profesor', impact: 'reportar', score: 20 },
    ],
  },
  {
    id: 2,
    // GIF animado de manos escribiendo rápido en celular
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZtM253ZzByNnc0b3VsNzE4cXA4YnVyeGd1Z3ZmejR5N2F4cjNrMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/chy6D606Q2V6U/giphy.gif",
    narration: 'En el grupo de WhatsApp de la clase, empiezan a circular memes hirientes y fotos retocadas sobre una compañera.',
    options: [
      { text: 'Reenviar el mensaje a otros', impact: 'reir', score: -30 },
      { text: 'Silenciar el grupo y no leer', impact: 'ignorar', score: -10 },
      { text: 'Escribir que paren el acoso', impact: 'intervenir', score: 30 },
      { text: 'Reportar el grupo a la escuela', impact: 'reportar', score: 20 },
    ],
  },
  {
    id: 3,
    // GIF animado de grupo de amigos excluyendo a uno
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjkza2gwaHNyNmUzMXp6ZGF1dmFqZjh0dWx1MjdicGplNmN6c3ZtOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7aubgMBSU5d562Yg/giphy.gif",
    narration: 'Estás almorzando y notas que tu grupo de amigos está ignorando totalmente a un compañero nuevo que intentó sentarse con ustedes.',
    options: [
      { text: 'Hacer bromas sobre el compañero', impact: 'reir', score: -20 },
      { text: 'Seguir la conversación sin integrarlo', impact: 'ignorar', score: -15 },
      { text: 'Presentarlo y hacerle espacio', impact: 'intervenir', score: 25 },
      { text: 'Contarle a un tutor sobre el clima del grupo', impact: 'reportar', score: 15 },
    ],
  },
  {
    id: 4,
    // GIF animado de vestuario/burlas físicas
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWV4MDltdDJ1ZzR2bTdtYXJnaWJkbmZrbTV1NjYwOTUxaGp5ajN6OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BkMxKHL3S70hQk0/giphy.gif",
    narration: 'En el vestuario después de deportes, ves que le escondieron la ropa a alguien y lo están grabando mientras la busca desesperado.',
    options: [
      { text: 'Grabar también con tu celular', impact: 'reir', score: -35 },
      { text: 'Cambiarse rápido e irse', impact: 'ignorar', score: -20 },
      { text: 'Ayudarlo a buscar y pedir que paren', impact: 'intervenir', score: 30 },
      { text: 'Llamar inmediatamente al entrenador', impact: 'reportar', score: 25 },
    ],
  },
  {
    id: 5,
    // GIF animado de patio escolar/empujones
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHExdzBwdmt5cnAweGR5MHB1OHQyZXAwdnNxazB5MDU3MmtidGlqZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3vQYMlU8V8cO3w5O/giphy.gif",
    narration: 'Durante el recreo, en una zona apartada, ves que están empujando e intimidando a alguien para que les dé su dinero.',
    options: [
      { text: 'Alentar a los agresores', impact: 'reir', score: -40 },
      { text: 'Alejarse para no meterse en problemas', impact: 'ignorar', score: -25 },
      { text: 'Interponerte físicamente (si es seguro)', impact: 'intervenir', score: 35 },
      { text: 'Gritar pidiendo ayuda de adultos', impact: 'reportar', score: 30 },
    ],
  },
];

const badges = [
  { name: 'Defensor Novato', icon: '🛡️', threshold: 0 },
  { name: 'Aliado Activo', icon: '⚔️', threshold: 40 }, // Ajustado umbral por más preguntas
  { name: 'Campeón Escolar', icon: '🌟', threshold: 80 },
  { name: 'Héroe de la Convivencia', icon: '👑', threshold: 120 },
];

const dailyMissions = [
  'Saluda a alguien que siempre está solo/a en el recreo.',
  'Si ves algo injusto, dile a un adulto de confianza.',
  'Invita a alguien nuevo a sentarse contigo en el almuerzo.',
];

const profileQuestions = [
  { q: '¿Qué haces cuando ves a alguien siendo molestado?', opts: [
    { text: 'Intervengo directamente', type: 'activo' },
    { text: 'Busco ayuda de un adulto', type: 'activo' },
    { text: 'Quiero ayudar pero no sé cómo', type: 'silencioso' },
    { text: 'Generalmente no hago nada', type: 'transicion' },
  ]},
  { q: '¿Cómo te sientes cuando ves bullying?', opts: [
    { text: 'Enojado/a, quiero pararlo', type: 'activo' },
    { text: 'Triste y preocupado/a', type: 'silencioso' },
    { text: 'Incómodo/a pero paralizado/a', type: 'transicion' },
    { text: 'Indiferente', type: 'transicion' },
  ]},
  { q: '¿Alguna vez has defendido a alguien?', opts: [
    { text: 'Sí, varias veces', type: 'activo' },
    { text: 'Sí, una vez', type: 'silencioso' },
    { text: 'No, pero quiero aprender', type: 'transicion' },
    { text: 'No me he atrevido', type: 'silencioso' },
  ]},
  { q: '¿Qué crees que detiene el bullying?', opts: [
    { text: 'Que los testigos hablen', type: 'activo' },
    { text: 'Apoyo emocional a la víctima', type: 'silencioso' },
    { text: 'Consecuencias para el agresor', type: 'transicion' },
    { text: 'Educación y prevención', type: 'activo' },
  ]},
];

const profiles = {
  activo: {
    title: 'Defensor Activo',
    desc: 'Tienes un fuerte sentido de justicia y no dudas en actuar. Tu valentía inspira a otros. Sigue desarrollando tus habilidades de mediación.',
    color: 'hope',
  },
  silencioso: {
    title: 'Aliado Silencioso',
    desc: 'Te importa profundamente pero prefieres actuar de formas sutiles. Tu empatía es tu superpoder. Aprende a amplificar tu impacto.',
    color: 'trust',
  },
  transicion: {
    title: 'Espectador en Transición',
    desc: 'Estás comenzando a entender tu poder como testigo. Cada pequeño paso cuenta. Aquí tienes un plan de 7 días para comenzar.',
    color: 'warm',
  },
};

// Función auxiliar para obtener el ícono según el impacto
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
  const { allyLevel, updateAllyLevel, completeModule } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState<typeof witnessScenes[0]['options'][0] | null>(null);
  const [sufferingDays, setSufferingDays] = useState(0);
  const [profileStep, setProfileStep] = useState(0);
  const [profileAnswers, setProfileAnswers] = useState<string[]>([]);
  const [profileResult, setProfileResult] = useState<string | null>(null);

  const handleSceneChoice = (option: typeof witnessScenes[0]['options'][0]) => {
    setChosenOption(option);
    updateAllyLevel(option.score);
    // Asumimos que reírse o ignorar aumenta el sufrimiento
    if (option.impact === 'ignorar' || option.impact === 'reir') setSufferingDays(d => d + 1);
    
    setTimeout(() => {
      setChosenOption(null);
      if (sceneIndex < witnessScenes.length - 1) setSceneIndex(sceneIndex + 1);
      else completeModule('testigo-simulator');
    }, 3000);
  };

  const handleProfileAnswer = (type: string) => {
    const newAnswers = [...profileAnswers, type];
    setProfileAnswers(newAnswers);
    if (profileStep < profileQuestions.length - 1) {
      setProfileStep(profileStep + 1);
    } else {
      const counts: Record<string, number> = {};
      newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
      const result = Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0];
      setProfileResult(result);
    }
  };

  const currentBadge = badges.reduce((best, b) => allyLevel >= b.threshold ? b : best, badges[0]);
  const modules = [{ icon: Zap, label: 'Simulador' }, { icon: Award, label: 'Nivel' }, { icon: ClipboardList, label: 'Test' }];

  return (
    <div className="min-h-screen bg-midnight pt-24">
      <div className="flex">
        {/* Sidebar - Se mantiene igual */}
        <div className="hidden lg:block w-72 min-h-screen border-r border-softwhite/5 p-6 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-mutedblue hover:text-trust text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <h3 className="font-display font-bold text-lg text-softwhite mb-6">Academia del Aliado</h3>

          <div className="mb-6 text-center glass-card rounded-xl p-4">
            <p className="text-3xl mb-1">{currentBadge.icon}</p>
            <p className="text-sm font-display font-bold text-softwhite">{currentBadge.name}</p>
            <div className="w-full h-2 bg-softwhite/5 rounded-full mt-3 overflow-hidden">
              <motion.div className="h-full rounded-full bg-hope" animate={{ width: `${Math.min((allyLevel / 120) * 100, 100)}%` }} />
            </div>
            <p className="text-xs font-mono text-mutedblue mt-1">Poder: {allyLevel}</p>
          </div>

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

        {/* Mobile Nav - Se mantiene igual */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-softwhite/5 flex">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${activeModule === i ? 'text-hope' : 'text-mutedblue'}`}>
              <mod.icon className="w-4 h-4" />{mod.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 lg:p-10 max-w-5xl pb-24 lg:pb-10 mx-auto">
          <AnimatePresence mode="wait">
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="mb-8">
                    <h2 className="font-display font-bold text-3xl text-softwhite mb-2">¿Qué harías tú?</h2>
                    <p className="text-mutedblue font-body text-sm">Tus decisiones influyen directamente en la vida de los demás. Elige con sabiduría.</p>
                </div>

                {sufferingDays > 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-warm/10 border border-warm/20 rounded-xl p-3 mb-6 text-center">
                    <p className="text-warm text-sm font-mono font-bold uppercase tracking-widest">
                        ⚠️ Impacto Negativo Acumulado: +{sufferingDays} días de acoso permitidos
                    </p>
                  </motion.div>
                )}

                {sceneIndex < witnessScenes.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Visual de la Escena (Comic Style con GIFs) */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-hope/20 to-trust/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative aspect-video lg:aspect-square overflow-hidden rounded-2xl border border-white/10 glass-card bg-midnight">
                            <img 
                                src={witnessScenes[sceneIndex].image} 
                                alt="Escena animada de simulación" 
                                className="w-full h-full object-cover opacity-90"
                                style={{ imageRendering: 'pixelated' }} // Opcional: toque retro/comic
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 decorative-cracks">
                                <span className="inline-block px-3 py-1 bg-hope text-midnight text-[10px] font-bold uppercase rounded-full mb-3 shadow-lg">
                                    Escena {sceneIndex + 1} de {witnessScenes.length}
                                </span>
                                <p className="text-softwhite font-body text-lg leading-snug drop-shadow-xl p-3 bg-midnight/60 rounded-xl backdrop-blur-sm border border-white/5">
                                    {witnessScenes[sceneIndex].narration}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Opciones de Acción */}
                    <div className="space-y-4">
                        <h4 className="text-mutedblue text-xs font-bold uppercase tracking-tighter mb-4">Elige tu reacción (afecta tu nivel):</h4>
                        
                        {chosenOption ? (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }} 
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card rounded-2xl p-8 text-center border-2"
                            style={{ 
                                borderColor: chosenOption.impact === 'intervenir' ? 'rgba(0,255,150,0.4)' : 
                                            chosenOption.impact === 'reportar' ? 'rgba(30,144,255,0.4)' : 'rgba(255,100,100,0.4)',
                                background: chosenOption.impact === 'intervenir' ? 'rgba(0,255,150,0.05)' : 
                                            chosenOption.impact === 'reportar' ? 'rgba(30,144,255,0.05)' : 'rgba(255,100,100,0.05)',
                            }}
                          >
                            <div className="flex justify-center mb-4 p-4 bg-midnight/50 rounded-full w-fit mx-auto border border-white/5">
                                {getImpactIcon(chosenOption.impact)}
                            </div>
                            <h3 className="text-softwhite font-display font-bold text-xl mb-2">Acción: {chosenOption.text}</h3>
                            <div className="h-px bg-white/10 w-16 mx-auto mb-4" />
                            
                            {chosenOption.impact === 'intervenir' && (
                              <p className="text-hope font-body text-sm leading-relaxed">¡Acción Valiente! Tu intervención directa corta el poder del agresor y apoya a la víctima inmediatamente.</p>
                            )}
                            {chosenOption.impact === 'reportar' && (
                              <p className="text-trust font-body text-sm leading-relaxed">Acción Responsable. Involucrar a adultos activa los protocolos de ayuda y busca una solución sistémica.</p>
                            )}
                            {chosenOption.impact === 'reir' && (
                              <p className="text-warm font-body text-sm leading-relaxed">Refuerzo Negativo. Al reírte, te conviertes en cómplice, validas la agresión y aumentas el dolor de la víctima.</p>
                            )}
                            {chosenOption.impact === 'ignorar' && (
                              <p className="text-warm font-body text-sm leading-relaxed">Permisividad. El silencio es interpretado como aprobación por el agresor. El acoso continuará.</p>
                            )}
                          </motion.div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {witnessScenes[sceneIndex].options.map((opt, oi) => (
                              <motion.button 
                                key={oi} 
                                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }} 
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSceneChoice(opt)}
                                className="group w-full text-left glass-card border border-white/5 hover:border-transparent rounded-xl p-5 flex items-center gap-4 transition-all duration-300"
                              >
                                <div className="p-3 bg-midnight/50 rounded-lg border border-white/5 group-hover:border-hope/20 transition-colors">
                                    {getImpactIcon(opt.impact)}
                                </div>
                                <span className="text-softwhite font-body text-sm font-medium flex-1">{opt.text}</span>
                              </motion.button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-12 text-center border border-hope/20 relative overflow-hidden">
                    {/* Efecto de fondo */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-hope/10 to-transparent blur-2xl opacity-50"></div>
                    
                    <div className="relative z-10">
                        <div className="w-20 h-20 bg-hope/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-hope/30 shadow-lg">
                            <Award className="w-10 h-10 text-hope" />
                        </div>
                        <h3 className="font-display font-bold text-3xl text-softwhite mb-2 Decoración">¡Entrenamiento Completado!</h3>
                        <p className="text-mutedblue font-body mb-8 max-w-md mx-auto">Has pasado por todas las situaciones. Tu capacidad de análisis y empatía como aliado ha crecido.</p>
                        <div className="inline-block px-8 py-4 bg-midnight/50 rounded-2xl border border-hope/20 shadow-inner">
                            <p className="text-mutedblue text-xs uppercase tracking-widest mb-1">Poder de Aliado Total</p>
                            <p className="text-hope font-mono font-bold text-3xl">{allyLevel}</p>
                        </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Los demás bloques (activeModule 1 y 2) se mantienen igual que en tu código original */}
            {activeModule === 1 && (
              <motion.div key="level" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Tu Nivel de Aliado</h2>
                <p className="text-mutedblue font-body mb-8 text-sm">Desbloquea badges completando misiones.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {badges.map((badge) => {
                    const unlocked = allyLevel >= badge.threshold;
                    return (
                      <motion.div key={badge.name}
                        whileHover={unlocked ? { scale: 1.05 } : {}}
                        className={`glass-card rounded-2xl p-6 text-center ${!unlocked ? 'opacity-30' : ''}`}>
                        <p className="text-4xl mb-2">{badge.icon}</p>
                        <p className="text-sm font-display font-bold text-softwhite">{badge.name}</p>
                        <p className="text-xs font-mono text-mutedblue mt-1">{badge.threshold}+ pts</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-display font-bold text-lg text-softwhite mb-4">Misiones Diarias</h3>
                  <div className="space-y-3">
                    {dailyMissions.map((m, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="text-hope mt-0.5">◯</span>
                        <p className="text-mutedblue font-body">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeModule === 2 && (
              <motion.div key="test" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">Test de Perfil</h2>
                <p className="text-mutedblue font-body mb-8 text-sm">Descubre qué tipo de aliado eres.</p>

                {profileResult ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-2xl p-8 md:p-12 text-center">
                    <h3 className="font-display font-bold text-3xl text-softwhite mb-4">{profiles[profileResult as keyof typeof profiles].title}</h3>
                    <p className="text-mutedblue font-body leading-relaxed max-w-md mx-auto mb-6">{profiles[profileResult as keyof typeof profiles].desc}</p>
                    <button onClick={() => { setProfileResult(null); setProfileStep(0); setProfileAnswers([]); }}
                      className="px-6 py-2 rounded-full glass-card text-mutedblue text-sm font-body hover:text-softwhite transition-colors">
                      Volver a hacer el test
                    </button>
                  </motion.div>
                ) : (
                  <div className="glass-card rounded-2xl p-6 md:p-8">
                    <div className="w-full bg-softwhite/5 rounded-full h-1.5 mb-6">
                      <motion.div className="h-full rounded-full bg-hope"
                        animate={{ width: `${((profileStep + 1) / profileQuestions.length) * 100}%` }} />
                    </div>
                    <p className="text-xs font-mono text-mutedblue mb-4">
                      Pregunta {profileStep + 1} de {profileQuestions.length}
                    </p>
                    <h3 className="font-display font-bold text-xl text-softwhite mb-6">
                      {profileQuestions[profileStep].q}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {profileQuestions[profileStep].opts.map((opt, oi) => (
                        <motion.button key={oi} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => handleProfileAnswer(opt.type)}
                          className="glass-card rounded-xl p-4 text-left text-softwhite font-body text-sm hover:bg-softwhite/[0.06] transition-colors">
                          {opt.text}
                        </motion.button>
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