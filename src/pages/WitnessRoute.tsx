import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, ClipboardList, Zap } from 'lucide-react';

const witnessScenes = [
  {
    narration: 'En el pasillo, ves a un grupo rodeando a un compañero más pequeño. Le están quitando su mochila y se burlan de él.',
    options: [
      { text: 'Intervenir: te acercas y dices "Eso no está bien, déjenlo"', impact: 'intervenir', score: 20 },
      { text: 'Reportar: vas directamente a buscar un adulto', impact: 'reportar', score: 15 },
      { text: 'Ignorar: sigues caminando como si nada', impact: 'ignorar', score: -10 },
    ],
  },
  {
    narration: 'En el grupo de WhatsApp de la clase, empiezan a circular memes hirientes sobre una compañera.',
    options: [
      { text: 'Escribir "Esto no es gracioso, borren eso"', impact: 'intervenir', score: 20 },
      { text: 'Hacer screenshot y mostrárselo a un profesor', impact: 'reportar', score: 15 },
      { text: 'No hacer nada, solo observar', impact: 'ignorar', score: -10 },
    ],
  },
  {
    narration: 'Tu mejor amigo/a te confiesa que ha estado excluyendo a alguien del grupo. Te pide que no digas nada.',
    options: [
      { text: 'Hablar con tu amigo/a y explicarle el impacto', impact: 'intervenir', score: 25 },
      { text: 'Buscar orientación con un adulto', impact: 'reportar', score: 15 },
      { text: 'Guardar silencio por lealtad', impact: 'ignorar', score: -15 },
    ],
  },
];

const badges = [
  { name: 'Defensor Novato', icon: '🛡️', threshold: 0 },
  { name: 'Aliado Activo', icon: '⚔️', threshold: 30 },
  { name: 'Campeón Escolar', icon: '🌟', threshold: 60 },
  { name: 'Héroe Silencioso', icon: '👑', threshold: 85 },
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

const profiles: Record<string, { title: string; desc: string; color: string }> = {
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

export default function WitnessRoute() {
  const { allyLevel, updateAllyLevel, completeModule } = useAppStore();
  const [activeModule, setActiveModule] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [chosenOption, setChosenOption] = useState<{ impact: string; text: string } | null>(null);
  const [sufferingDays, setSufferingDays] = useState(0);
  const [profileStep, setProfileStep] = useState(0);
  const [profileAnswers, setProfileAnswers] = useState<string[]>([]);
  const [profileResult, setProfileResult] = useState<string | null>(null);

  const handleSceneChoice = (option: typeof witnessScenes[0]['options'][0]) => {
    setChosenOption(option);
    updateAllyLevel(option.score);
    if (option.impact === 'ignorar') setSufferingDays(d => d + 1);
    setTimeout(() => {
      setChosenOption(null);
      if (sceneIndex < witnessScenes.length - 1) setSceneIndex(sceneIndex + 1);
      else completeModule('testigo-simulator');
    }, 2500);
  };

  const handleProfileAnswer = (type: string) => {
    const newAnswers = [...profileAnswers, type];
    setProfileAnswers(newAnswers);
    if (profileStep < profileQuestions.length - 1) {
      setProfileStep(profileStep + 1);
    } else {
      const counts: Record<string, number> = {};
      newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
      const result = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setProfileResult(result);
    }
  };

  const currentBadge = badges.reduce((best, b) => allyLevel >= b.threshold ? b : best, badges[0]);

  const modules = [
    { icon: Zap, label: 'Simulador' },
    { icon: Award, label: 'Nivel' },
    { icon: ClipboardList, label: 'Test' },
  ];

  return (
    <div className="min-h-screen bg-midnight pt-24">
      <div className="flex">
        <div className="hidden lg:block w-72 min-h-screen border-r border-softwhite/5 p-6 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-mutedblue hover:text-trust text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
          <h3 className="font-display font-bold text-lg text-softwhite mb-6">Academia del Aliado</h3>

          <div className="mb-6 text-center glass-card rounded-xl p-4">
            <p className="text-3xl mb-1">{currentBadge.icon}</p>
            <p className="text-sm font-display font-bold text-softwhite">{currentBadge.name}</p>
            <div className="w-full h-2 bg-softwhite/5 rounded-full mt-3 overflow-hidden">
              <motion.div className="h-full rounded-full bg-hope" animate={{ width: `${Math.min(allyLevel, 100)}%` }} />
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

        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-softwhite/5 flex">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${activeModule === i ? 'text-hope' : 'text-mutedblue'}`}>
              <mod.icon className="w-4 h-4" />{mod.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 lg:p-10 max-w-4xl pb-24 lg:pb-10">
          <AnimatePresence mode="wait">
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 className="font-display font-bold text-3xl text-softwhite mb-2">¿Qué harías tú?</h2>
                <p className="text-mutedblue font-body mb-8 text-sm">Tus decisiones tienen un impacto real.</p>

                {sufferingDays > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-warm/10 rounded-xl p-3 mb-6 text-center">
                    <p className="text-warm text-sm font-mono">Días de sufrimiento acumulados: +{sufferingDays}</p>
                  </motion.div>
                )}

                {sceneIndex < witnessScenes.length ? (
                  <div className="glass-card rounded-2xl p-6 md:p-8">
                    <p className="text-xs font-mono text-mutedblue mb-4">Escena {sceneIndex + 1} de {witnessScenes.length}</p>
                    <p className="text-softwhite font-body leading-relaxed mb-8">{witnessScenes[sceneIndex].narration}</p>

                    {chosenOption ? (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl p-6 text-center" style={{
                          background: chosenOption.impact === 'intervenir' ? 'rgba(0,200,150,0.1)' :
                            chosenOption.impact === 'reportar' ? 'rgba(30,111,217,0.1)' : 'rgba(244,132,95,0.1)'
                        }}>
                        {chosenOption.impact === 'intervenir' && (
                          <><Shield className="w-10 h-10 text-hope mx-auto mb-3" />
                          <p className="text-hope font-body text-sm">Tu intervención marcó la diferencia.</p></>
                        )}
                        {chosenOption.impact === 'reportar' && (
                          <><p className="text-trust text-3xl mb-3">✓</p>
                          <p className="text-trust font-body text-sm">Proceso iniciado. Un adulto intervendrá.</p></>
                        )}
                        {chosenOption.impact === 'ignorar' && (
                          <><p className="text-warm font-mono text-2xl mb-3">+1 día</p>
                          <p className="text-warm font-body text-sm">El sufrimiento continúa un día más.</p></>
                        )}
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {witnessScenes[sceneIndex].options.map((opt, oi) => (
                          <motion.button key={oi} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            onClick={() => handleSceneChoice(opt)}
                            className="w-full text-left glass-card rounded-xl p-4 text-softwhite font-body text-sm hover:bg-softwhite/[0.06] transition-colors">
                            {opt.text}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-8 text-center">
                    <h3 className="font-display font-bold text-2xl text-softwhite mb-4">¡Simulación Completada!</h3>
                    <p className="text-mutedblue font-body">Tu poder de aliado: {allyLevel}</p>
                  </div>
                )}
              </motion.div>
            )}

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
                    <h3 className="font-display font-bold text-3xl text-softwhite mb-4">{profiles[profileResult].title}</h3>
                    <p className="text-mutedblue font-body leading-relaxed max-w-md mx-auto mb-6">{profiles[profileResult].desc}</p>
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
