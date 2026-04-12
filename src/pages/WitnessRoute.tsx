import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Award, ClipboardList, Zap, MessageCircle, EyeOff, UserPlus, Megaphone, Smile, Handshake, ChevronRight, CheckCircle2 } from 'lucide-react';

const witnessScenes = [
  {
    id: 1,
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
  { name: 'Aliado Activo', icon: '⚔️', threshold: 40 },
  { name: 'Campeón Escolar', icon: '🌟', threshold: 80 },
  { name: 'Héroe de la Convivencia', icon: '👑', threshold: 120 },
];

const profileQuestions = [
  { q: '¿Qué haces cuando ves a alguien siendo excluido en el grupo?', opts: [
    { text: 'Paso de largo y no me meto', type: 'pasivo' },
    { text: 'Quisiera ayudar, pero me da miedo ser el siguiente', type: 'temeroso' },
    { text: 'Busco una forma de apoyarlo sin llamar mucho la atención', type: 'aliado' },
    { text: 'Le ofrezco ayuda directamente y cuido que no quede solo', type: 'defensor' },
  ]},
  { q: 'Cuando escuchas rumores dañinos sobre alguien, tú:', opts: [
    { text: 'No me meto, no quiero problemas', type: 'pasivo' },
    { text: 'Me da miedo que me vean como raro', type: 'temeroso' },
    { text: 'Le muestro apoyo a la persona afectada', type: 'aliado' },
    { text: 'Rechazo el rumor y protejo a quien lo sufre', type: 'defensor' },
  ]},
  { q: 'Si un compañero te pide ayuda durante un conflicto, tú:', opts: [
    { text: 'Digo que no es asunto mío', type: 'pasivo' },
    { text: 'Quisiera ayudar, pero no sé si es seguro', type: 'temeroso' },
    { text: 'Busco a un adulto confiable y respaldo en lo que pueda', type: 'aliado' },
    { text: 'Actúo para calmar la situación y proteger a la víctima', type: 'defensor' },
  ]},
  { q: 'En reuniones o en el recreo, cuando notas injusticias, tú:', opts: [
    { text: 'Guardo silencio para no llamar la atención', type: 'pasivo' },
    { text: 'Siento miedo a que me castiguen si hablo', type: 'temeroso' },
    { text: 'Me acerco con cuidado para ofrecer compañía', type: 'aliado' },
    { text: 'Uso mi voz para señalar lo que no está bien', type: 'defensor' },
  ]},
  { q: 'Para ser mejor espectador, tú crees que necesitas:', opts: [
    { text: 'Evitar meterme y esperar que pase', type: 'pasivo' },
    { text: 'Más seguridad para dar el primer paso', type: 'temeroso' },
    { text: 'Herramientas claras para apoyar sin miedo', type: 'aliado' },
    { text: 'Más responsabilidad y liderazgo en el grupo', type: 'defensor' },
  ]},
];

const profiles = {
  pasivo: {
    title: 'Espectador Pasivo',
    desc: 'Tu impulso es mantener distancia para no complicarte. Esto ayuda a protegerte individualmente, pero deja el espacio libre para que el acoso continúe.',
    icon: <EyeOff className="w-8 h-8 text-warm" />,
    color: 'warm',
    tips: [
      'Empieza con pequeños gestos: una mirada de apoyo puede significar mucho.',
      'Habla con alguien de confianza sobre lo que viste.',
      'Recuerda que el silencio es interpretado como aprobación por el agresor.',
    ],
  },
  temeroso: {
    title: 'Espectador Temeroso',
    desc: 'Sientes empatía, pero el miedo al "qué dirán" o a represalias te frena. Eres un aliado potencial que solo necesita un poco más de seguridad.',
    icon: <MessageCircle className="w-8 h-8 text-mutedblue" />,
    color: 'trust',
    tips: [
      'No necesitas actuar solo; busca otros compañeros que piensen como tú.',
      'Identifica a los adultos que realmente escuchan en tu escuela.',
      'Apoyar a la víctima después del evento es una forma segura de ayudar.',
    ],
  },
  aliado: {
    title: 'Aliado en Proceso',
    desc: 'Ya estás tomando conciencia y actuando de forma indirecta. Buscas soluciones que protejan tanto a la víctima como a tu propia seguridad.',
    icon: <UserPlus className="w-8 h-8 text-hope" />,
    color: 'hope',
    tips: [
      'Sigue brindando compañía a quienes son excluidos.',
      'Anímate a reportar situaciones digitales de forma anónima si es necesario.',
      'Tu presencia positiva ya está cambiando el clima del salón.',
    ],
  },
  defensor: {
    title: 'Defensor Activo',
    desc: 'Eres una pieza clave para detener el acoso. Usas tu voz y liderazgo para marcar límites claros frente a las injusticias.',
    icon: <Shield className="w-8 h-8 text-hope" />,
    color: 'trust',
    tips: [
      'Lidera con el ejemplo, invitando a otros espectadores a no reírse de las burlas.',
      'Asegúrate de que tu intervención siempre sea a través de la comunicación y el respeto.',
      'Comparte tus estrategias con otros para que no sientan miedo de actuar.',
    ],
  },
};

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
      return;
    }

    const counts: Record<string, number> = {};
    newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
    const order = ['defensor', 'aliado', 'temeroso', 'pasivo'];
    const result = Object.entries(counts)
      .sort((a, b) => {
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

        {/* Mobile Nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-softwhite/5 flex">
          {modules.map((mod, i) => (
            <button key={i} onClick={() => setActiveModule(i)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs ${activeModule === i ? 'text-hope' : 'text-mutedblue'}`}>
              <mod.icon className="w-4 h-4" />{mod.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 lg:p-10 max-w-4xl pb-24 lg:pb-10 mx-auto">
          <AnimatePresence mode="wait">
            {/* MODULO 0: SIMULADOR (Se mantiene lógica, solo ajuste visual menor) */}
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-6">
                  <h2 className="font-display font-bold text-2xl lg:text-3xl text-softwhite mb-1">Entrenamiento Real</h2>
                  <p className="text-mutedblue text-sm">Escoge tu respuesta ante estas situaciones.</p>
                </div>

                {sceneIndex < witnessScenes.length ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 glass-card">
                      <img src={witnessScenes[sceneIndex].image} className="w-full h-full object-cover" alt="Simulación" />
                      <div className="absolute bottom-0 p-4 bg-gradient-to-t from-midnight to-transparent w-full">
                        <p className="text-softwhite text-sm leading-snug">{witnessScenes[sceneIndex].narration}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {chosenOption ? (
                        <div className="glass-card p-6 border-hope/30 text-center rounded-2xl">
                          <CheckCircle2 className="w-8 h-8 text-hope mx-auto mb-2" />
                          <p className="text-softwhite text-sm">{chosenOption.text}</p>
                        </div>
                      ) : (
                        witnessScenes[sceneIndex].options.map((opt, i) => (
                          <button key={i} onClick={() => handleSceneChoice(opt)}
                            className="w-full text-left p-4 rounded-xl border border-white/5 bg-softwhite/5 hover:bg-softwhite/10 transition-all text-sm text-softwhite flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-midnight flex items-center justify-center text-[10px] font-bold text-mutedblue border border-white/10">{i + 1}</span>
                            {opt.text}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="glass-card p-10 text-center rounded-3xl border-hope/20">
                    <Award className="w-12 h-12 text-hope mx-auto mb-4" />
                    <h3 className="text-2xl font-display font-bold text-softwhite">Simulación Finalizada</h3>
                    <p className="text-mutedblue text-sm mt-2">Nivel de Aliado: <span className="text-hope font-bold">{allyLevel}</span></p>
                  </div>
                )}
              </motion.div>
            )}

            {/* MODULO 1: TEST INTERACTIVO (REDISEÑADO) */}
            {activeModule === 1 && (
              <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {profileResult ? (
                  /* DISEÑO DE RESULTADOS AL FINAL DEL TEST */
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="max-w-2xl mx-auto">
                    <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                      {/* Cabecera del Resultado */}
                      <div className="bg-gradient-to-b from-hope/10 to-transparent p-8 text-center border-b border-white/5">
                        <div className="inline-flex p-4 rounded-2xl bg-midnight border border-white/10 mb-4 shadow-xl">
                          {profiles[profileResult as keyof typeof profiles].icon}
                        </div>
                        <p className="text-hope text-[10px] uppercase tracking-[0.3em] font-bold mb-1">Perfil Identificado</p>
                        <h3 className="text-3xl font-display font-bold text-softwhite">{profiles[profileResult as keyof typeof profiles].title}</h3>
                      </div>

                      {/* Cuerpo del Resultado */}
                      <div className="p-6 lg:p-8 space-y-6">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                          <h4 className="text-xs font-bold text-mutedblue uppercase mb-2 tracking-wider">Sobre ti</h4>
                          <p className="text-softwhite/80 text-sm leading-relaxed italic">
                            "{profiles[profileResult as keyof typeof profiles].desc}"
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-hope uppercase mb-4 tracking-wider flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Plan de Acción para mejorar
                          </h4>
                          <div className="space-y-3">
                            {profiles[profileResult as keyof typeof profiles].tips.map((tip, idx) => (
                              <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-midnight/50 border border-white/5">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-hope/20 text-hope text-[10px] flex items-center justify-center font-bold">{idx + 1}</span>
                                <p className="text-mutedblue text-sm leading-snug">{tip}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer de Acción */}
                      <div className="p-6 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <button onClick={() => { setProfileResult(null); setProfileStep(0); setProfileAnswers([]); }}
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-softwhite text-xs font-bold hover:bg-white/20 transition-colors">
                          REPETIR EXAMEN
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* DISEÑO DE PREGUNTAS MODO EXAMEN */
                  <div className="max-w-2xl mx-auto">
                    {/* Barra de Progreso Minimalista */}
                    <div className="mb-8">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-hope tracking-widest uppercase">Evaluación de Perfil</span>
                        <span className="text-xs font-mono text-mutedblue">{profileStep + 1} / {profileQuestions.length}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-hope shadow-[0_0_10px_rgba(0,255,150,0.5)]"
                          initial={{ width: 0 }} animate={{ width: `${((profileStep + 1) / profileQuestions.length) * 100}%` }} />
                      </div>
                    </div>

                    {/* La Pregunta */}
                    <div className="mb-8">
                      <h3 className="text-xl lg:text-2xl font-display font-medium text-softwhite leading-tight">
                        {profileQuestions[profileStep].q}
                      </h3>
                    </div>

                    {/* Opciones Verticales (Estilo Examen) */}
                    <div className="space-y-3">
                      {profileQuestions[profileStep].opts.map((opt, oi) => (
                        <motion.button key={oi}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleProfileAnswer(opt.type)}
                          className="w-full group flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-hope/40 hover:bg-hope/5 transition-all text-left"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-midnight border border-white/10 flex items-center justify-center font-display font-bold text-mutedblue group-hover:text-hope group-hover:border-hope/30 transition-colors">
                            {String.fromCharCode(65 + oi)}
                          </div>
                          <div className="flex-1">
                            <p className="text-softwhite text-sm lg:text-base font-body leading-tight group-hover:text-white transition-colors">
                              {opt.text}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-hope transition-colors" />
                        </motion.button>
                      ))}
                    </div>

                    <p className="mt-8 text-center text-mutedblue text-[10px] uppercase tracking-widest opacity-50 font-bold">
                      Selecciona la opción más honesta
                    </p>
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