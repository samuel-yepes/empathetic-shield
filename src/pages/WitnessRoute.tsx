import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Shield, Award, ClipboardList, Zap, MessageCircle,
  EyeOff, UserPlus, Megaphone, Smile, Handshake, ChevronRight,
  CheckCircle2, Eye, Sparkles, AlertTriangle, User, Phone, Send, Loader2
} from 'lucide-react';

import scene1 from '../assets/scene-1-hallway.jpg';
import scene2 from '../assets/scene-2-cyber.jpg';
import scene3 from '../assets/scene-3-exclusion.jpg';
import scene4 from '../assets/scene-4-locker.jpg';
import scene5 from '../assets/scene-5-extortion.jpg';

// ─── EmailJS config ───────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'empathix_service';
const EMAILJS_TEMPLATE_ID = 'template_pbyebs8';
const EMAILJS_PUBLIC_KEY  = 'tL7MQAxIUAAvjhDgw';

// ─── Data ─────────────────────────────────────────────────────────
const witnessScenes = [
  {
    id: 1, image: scene1,
    title: 'Exclusión en el Grupo',
    narration: 'Notas que un compañero de clase es sistemáticamente excluido de los grupos de trabajo y se sienta solo en la cafetería.',
    options: [
      { text: 'Unirme a la exclusión para no ser excluido yo también', impact: 'reir' },
      { text: 'Hacer como si no lo hubiera notado y seguir con mis amigos', impact: 'ignorar' },
      { text: 'Acercarme a saludarlo e invitarlo a unirse a mi mesa', impact: 'intervenir' },
      { text: 'Informar a un profesor o tutor sobre la situación', impact: 'reportar' },
    ],
  },
  {
    id: 2, image: scene2,
    title: 'Burlas en Redes Sociales',
    narration: 'Ves comentarios ofensivos y burlas dirigidas a un compañero de clase en un chat público del grupo.',
    options: [
      { text: 'Darle "me gusta" a la burla para encajar', impact: 'reir' },
      { text: 'Silenciar el chat y no decir nada', impact: 'ignorar' },
      { text: 'Defender a tu compañero respondiendo con respeto y cortando el rumor', impact: 'intervenir' },
      { text: 'Reportar el mensaje y al usuario por acoso en la plataforma', impact: 'reportar' },
    ],
  },
  {
    id: 3, image: scene3,
    title: 'Acoso Verbal',
    narration: 'Un compañero es constantemente insultado y menospreciado por su apariencia física en los pasillos.',
    options: [
      { text: 'Reírme junto con el grupo para evitar problemas', impact: 'reir' },
      { text: 'Pasar de largo y fingir que no escucho nada', impact: 'ignorar' },
      { text: 'Mostrarle apoyo a la persona afectada después del incidente', impact: 'intervenir' },
      { text: 'Intervenir en el momento o buscar a una autoridad escolar', impact: 'reportar' },
    ],
  },
  {
    id: 4, image: scene4,
    title: 'Intimidación en el Casillero',
    narration: 'Observas cómo un estudiante bloquea el paso a otro y le exige que entregue sus pertenencias.',
    options: [
      { text: 'Grabar el conflicto para subirlo a internet', impact: 'reir' },
      { text: 'Alejarme rápidamente del lugar', impact: 'ignorar' },
      { text: 'Hacer ruido o distraer al agresor para detener la situación', impact: 'intervenir' },
      { text: 'Llamar inmediatamente a un adulto o personal de seguridad', impact: 'reportar' },
    ],
  },
  {
    id: 5, image: scene5,
    title: 'Extorsión o Presión Grupal',
    narration: 'Notas que algunos compañeros obligan a otro a hacerles tareas o pagarles dinero para dejarlo en paz.',
    options: [
      { text: 'Aprovecharme de la situación para pedir también favores', impact: 'reir' },
      { text: 'No intervenir porque no es mi problema', impact: 'ignorar' },
      { text: 'Hablar con la víctima para brindarle apoyo y sugerir ayuda', impact: 'intervenir' },
      { text: 'Denunciar la situación con las autoridades del colegio de forma confidencial', impact: 'reportar' },
    ],
  },
];

const profileQuestions = [
  { q: '¿Qué haces cuando ves a alguien siendo excluido en el grupo?', opts: [
    { text: 'Paso de largo y no me meto', type: 'pasivo' },
    { text: 'Quisiera ayudar, pero me da miedo', type: 'temeroso' },
    { text: 'Busco una forma de apoyarlo indirectamente', type: 'aliado' },
    { text: 'Le ofrezco ayuda directamente', type: 'defensor' },
  ]},
  { q: 'Cuando escuchas rumores dañinos sobre alguien, tú:', opts: [
    { text: 'No me meto', type: 'pasivo' },
    { text: 'Me da miedo que me vean raro', type: 'temeroso' },
    { text: 'Le muestro apoyo a la persona', type: 'aliado' },
    { text: 'Rechazo el rumor y protejo a quien lo sufre', type: 'defensor' },
  ]},
  { q: 'Si un compañero te pide ayuda durante un conflicto, tú:', opts: [
    { text: 'Digo que no es asunto mío', type: 'pasivo' },
    { text: 'Quisiera ayudar, pero no sé si es seguro', type: 'temeroso' },
    { text: 'Busco a un adulto confiable', type: 'aliado' },
    { text: 'Actúo para calmar la situación', type: 'defensor' },
  ]},
  { q: 'En reuniones o en el recreo, cuando notas injusticias, tú:', opts: [
    { text: 'Guardo silencio', type: 'pasivo' },
    { text: 'Siento miedo a represalias', type: 'temeroso' },
    { text: 'Me acerco con cuidado', type: 'aliado' },
    { text: 'Uso mi voz para señalar lo que está mal', type: 'defensor' },
  ]},
  { q: 'Para ser mejor espectador, tú crees que necesitas:', opts: [
    { text: 'Evitar meterme', type: 'pasivo' },
    { text: 'Más seguridad', type: 'temeroso' },
    { text: 'Herramientas para apoyar', type: 'aliado' },
    { text: 'Más responsabilidad y liderazgo', type: 'defensor' },
  ]},
];

const profiles: Record<string, { title: string; desc: string; tips: string[]; analysis: string }> = {
  pasivo: {
    title: 'Espectador Pasivo',
    desc: 'Tu impulso es mantener distancia para no complicarte. Esto ayuda a protegerte individualmente, pero deja el espacio libre para que el acoso continúe.',
    tips: ['Empieza con pequeños gestos.', 'Habla con alguien de confianza.', 'Tu silencio puede ser interpretado como aprobación.'],
    analysis: `Esta persona muestra un perfil de ESPECTADOR PASIVO frente al bullying. Sus respuestas revelan una tendencia consistente a evitar el conflicto mediante la inacción y la distancia. No participa activamente en el acoso, pero tampoco interviene para detenerlo. Esta conducta puede estar motivada por miedo a ser victimizada, baja autoeficacia social o simplemente por falta de herramientas para manejar situaciones de conflicto. El riesgo de este perfil es que, al no intervenir, permite que el acoso se perpetúe y puede ser percibido por el agresor como una señal de aprobación implícita. Se recomienda trabajar en estrategias de intervención segura y fomentar la confianza para reportar situaciones a adultos de confianza.`,
  },
  temeroso: {
    title: 'Espectador Temeroso',
    desc: 'Sientes empatía, pero el miedo al "qué dirán" te frena. Eres un aliado potencial que solo necesita un poco más de seguridad.',
    tips: ['Busca otros compañeros que piensen como tú.', 'Identifica adultos confiables.', 'Apoyar después del evento también cuenta.'],
    analysis: `Esta persona muestra un perfil de ESPECTADOR TEMEROSO. Sus respuestas indican que reconoce las situaciones de bullying como injustas y siente empatía hacia las víctimas, pero el miedo a las repercusiones sociales (ser rechazado, convertirse en víctima) le impide actuar. Este perfil es especialmente importante porque representa un aliado potencial que, con el acompañamiento adecuado, puede convertirse en un agente de cambio. La persona tiene conciencia moral activa pero necesita desarrollar habilidades de intervención segura y construir redes de apoyo con compañeros que compartan sus valores. Se recomienda fortalecer su autoconfianza y enseñarle estrategias de denuncia anónima.`,
  },
  aliado: {
    title: 'Aliado en Proceso',
    desc: 'Ya estás tomando conciencia y actuando de forma indirecta. Buscas soluciones que protejan a la víctima y tu seguridad.',
    tips: ['Sigue brindando compañía.', 'Anímate a reportar de forma anónima.', 'Tu presencia positiva ya está cambiando el clima.'],
    analysis: `Esta persona muestra un perfil de ALIADO EN PROCESO. Sus respuestas demuestran una disposición clara a apoyar a las víctimas de bullying, aunque prefiere hacerlo de manera indirecta o buscando la mediación de adultos. Reconoce las situaciones de acoso, actúa con empatía y busca soluciones que minimicen el riesgo tanto para la víctima como para sí mismo. Es un perfil maduro y reflexivo que ya contribuye positivamente al clima escolar. Para seguir creciendo, esta persona puede fortalecer su capacidad de intervención directa y convertirse en un referente para sus compañeros. Su presencia y acciones ya generan un impacto real y positivo en su entorno.`,
  },
  defensor: {
    title: 'Defensor Activo',
    desc: 'Eres una pieza clave para detener el acoso. Usas tu voz y liderazgo para marcar límites claros frente a las injusticias.',
    tips: ['Lidera con el ejemplo.', 'Intervén siempre con respeto.', 'Comparte tus estrategias con otros.'],
    analysis: `Esta persona muestra un perfil de DEFENSOR ACTIVO, el más proactivo en la prevención del bullying. Sus respuestas revelan un alto nivel de empatía, valentía social y liderazgo. No solo reconoce las situaciones de acoso sino que actúa de forma inmediata, sea interviniendo directamente o reportando a las autoridades correspondientes. Este perfil es fundamental para crear entornos escolares seguros, ya que los defensores activos tienen un efecto disuasorio real sobre los agresores y brindan apoyo tangible a las víctimas. Se recomienda potenciar este liderazgo positivo, capacitarle en estrategias de intervención segura y convertirlo en un agente multiplicador dentro de su comunidad escolar.`,
  },
};

// ─── Impact icon helper ───────────────────────────────────────────
const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'reir':      return <Smile    className="w-5 h-5 text-orange-400" />;
    case 'ignorar':   return <EyeOff   className="w-5 h-5 text-orange-400" />;
    case 'intervenir':return <Handshake className="w-5 h-5 text-emerald-400" />;
    case 'reportar':  return <Megaphone className="w-5 h-5 text-sky-400" />;
    default:          return <Zap      className="w-5 h-5 text-slate-400" />;
  }
};

const impactLabel: Record<string, string> = {
  reir: 'Participó en el acoso',
  ignorar: 'Ignoró la situación',
  intervenir: 'Intervino activamente',
  reportar: 'Reportó / buscó ayuda',
};

// ─── Email sender ─────────────────────────────────────────────────
async function sendResultEmail(params: {
  nombre: string;
  numero: string;
  simAnswers: string[];
  profileAnswers: string[];
  profileResult: string;
}) {
  const emailjs = await import('@emailjs/browser');
  const { nombre, numero, simAnswers, profileAnswers, profileResult } = params;
  const profile = profiles[profileResult];

  const simLines = witnessScenes.map((s, i) => {
    const answer = simAnswers[i] ?? '—';
    const option = s.options.find(o => o.impact === answer);
    return `  Escena ${i + 1} — ${s.title}:\n    Eligió: "${option?.text ?? answer}" (${impactLabel[answer] ?? answer})`;
  }).join('\n\n');

  const testLines = profileQuestions.map((q, i) => {
    const answerType = profileAnswers[i] ?? '—';
    const opt = q.opts.find(o => o.type === answerType);
    return `  Pregunta ${i + 1}: ${q.q}\n    Respuesta: "${opt?.text ?? answerType}"`;
  }).join('\n\n');

  const contenido =
`REPORTE DE ACTIVIDAD — PROYECTO EMPATHIX
==========================================

DATOS DE LA PERSONA
  Nombre:  ${nombre}
  Número:  ${numero}
  Fecha:   ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}

------------------------------------------
ACTIVIDAD 1 — ENTRENAMIENTO
------------------------------------------

${simLines}

------------------------------------------
ACTIVIDAD 2 — TEST DE PERFIL
------------------------------------------

${testLines}

------------------------------------------
PERFIL RESULTANTE: ${profile.title.toUpperCase()}
------------------------------------------

${profile.analysis}

==========================================
Reporte generado automáticamente por Empathix`;

  await emailjs.default.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    { nombre, contenido },
    { publicKey: EMAILJS_PUBLIC_KEY }
  );
}

// ─── Component ────────────────────────────────────────────────────
export default function WitnessRoute() {
  const { completeModule } = useAppStore();

  // Registration
  const [registered, setRegistered] = useState(false);
  const [userName, setUserName]     = useState('');
  const [userPhone, setUserPhone]   = useState('');
  const [regError, setRegError]     = useState('');

  // Navigation
  const [activeModule, setActiveModule] = useState(0);
  const [completedSim, setCompletedSim] = useState(false);
  const [completedTest, setCompletedTest] = useState(false);

  // Simulator
  const [sceneIndex, setSceneIndex]     = useState(0);
  const [chosenOption, setChosenOption] = useState<typeof witnessScenes[0]['options'][0] | null>(null);
  const [simAnswers, setSimAnswers]     = useState<string[]>([]);
  const [isSimFinished, setIsSimFinished] = useState(false);

  // Test
  const [profileStep, setProfileStep]       = useState(0);
  const [profileAnswers, setProfileAnswers] = useState<string[]>([]);
  const [profileResult, setProfileResult]   = useState<string | null>(null);

  // Email
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // ── Registration submit ──
  const handleRegister = () => {
    if (!userName.trim()) { setRegError('Por favor ingresa tu nombre.'); return; }
    if (!userPhone.trim()) { setRegError('Por favor ingresa tu número.'); return; }
    setRegError('');
    setRegistered(true);
  };

  // ── Simulator ──
  const handleSceneChoice = (option: typeof witnessScenes[0]['options'][0]) => {
    setChosenOption(option);
    const newAnswers = [...simAnswers, option.impact];
    setSimAnswers(newAnswers);
    setTimeout(() => {
      setChosenOption(null);
      if (sceneIndex < witnessScenes.length - 1) {
        setSceneIndex(sceneIndex + 1);
      } else {
        setIsSimFinished(true);
        setCompletedSim(true);
        completeModule('testigo-simulator');
      }
    }, 1800);
  };

  const getSimFinalMessage = () => {
    const positives = simAnswers.filter(a => a === 'intervenir' || a === 'reportar').length;
    if (positives === 5) return { title: 'Defensor Ejemplar', msg: 'Has demostrado un compromiso total con la convivencia. Tu valentía para actuar y reportar es lo que transforma una escuela en un lugar seguro.', color: 'text-emerald-600' };
    if (positives >= 3) return { title: 'Aliado en camino', msg: 'Tienes la intención clara de ayudar. En algunas situaciones dudas, pero tu tendencia es proteger a los demás. ¡Sigue fortaleciendo esa seguridad!', color: 'text-sky-600' };
    return { title: 'Observador en Reflexión', msg: 'Parece que el miedo o la duda te frenaron en varias situaciones. Recuerda que no actuar también tiene un impacto.', color: 'text-orange-500' };
  };

  // ── Test ──
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
    const result = Object.entries(counts).sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })[0][0];
    setProfileResult(result);
    setCompletedTest(true);
  };

  // ── Send email when both done ──
  const handleSendEmail = async () => {
    if (!profileResult) return;
    setEmailStatus('sending');
    try {
      await sendResultEmail({
        nombre: userName,
        numero: userPhone,
        simAnswers,
        profileAnswers,
        profileResult,
      });
      setEmailStatus('sent');
    } catch (e) {
      console.error(e);
      setEmailStatus('error');
    }
  };

  const modules = [
    { icon: Zap, label: 'Entrenamiento' },
    { icon: ClipboardList, label: 'Test' },
  ];

  // ══════════════════════════════════════════════
  // PANTALLA DE REGISTRO
  // ══════════════════════════════════════════════
  if (!registered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #6fe5f1 0%, #aaf1f7 60%, #d4f5f5 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-cyan-200/50 p-8 border border-white/80">
            {/* Logo / Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 shadow-lg shadow-cyan-300/50 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Empathix</h1>
              <p className="text-slate-500 text-sm mt-1">Centro de Apoyo contra el Bullying</p>
            </div>

            <div className="space-y-2 mb-8 text-center">
              <p className="text-slate-700 font-semibold text-lg">¡Bienvenido/a!</p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Antes de comenzar las actividades, necesitamos algunos datos básicos.
              </p>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                    placeholder="Ej: María García"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/80 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Número de teléfono / contacto
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={userPhone}
                    onChange={e => setUserPhone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleRegister()}
                    placeholder="Ej: 300 123 4567"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/80 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {regError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-red-500 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> {regError}
                </motion.p>
              )}

              <button
                onClick={handleRegister}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold text-base shadow-lg shadow-cyan-300/40 hover:shadow-cyan-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                Comenzar actividades
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 text-xs text-center mt-6">
              Tus datos se usan únicamente para el registro del proyecto.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // BANNER: AMBAS ACTIVIDADES COMPLETADAS
  // ══════════════════════════════════════════════
  const allDone = completedSim && completedTest && profileResult;

  // ══════════════════════════════════════════════
  // MAIN APP
  // ══════════════════════════════════════════════
  return (
    <div className="min-h-screen pt-24" style={{ background: 'linear-gradient(180deg, #6fe5f1 0%, #aaf1f7 100%)' }}>
      <div className="flex flex-col lg:flex-row">

        {/* Sidebar */}
        <div className="hidden lg:block w-72 min-h-screen border-r border-white/20 p-8 sticky top-24 self-start">
          <Link to="/caminos" className="flex items-center gap-2 text-slate-800 hover:text-indigo-900 text-base mb-10 transition-colors group font-medium">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Volver
          </Link>
          {/* User info badge */}
          <div className="mb-8 p-4 rounded-2xl bg-white/50 border border-white/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm truncate max-w-[140px]">{userName}</p>
                <p className="text-slate-500 text-xs">{userPhone}</p>
              </div>
            </div>
          </div>
          <h3 className="font-bold text-2xl text-slate-900 mb-6 tracking-tight">Centro de Apoyo</h3>
          <div className="space-y-3">
            {modules.map((mod, i) => (
              <button key={i} onClick={() => setActiveModule(i)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${
                  activeModule === i
                    ? 'bg-indigo-600/20 text-indigo-900 border border-indigo-200 shadow-sm'
                    : 'text-slate-700 hover:bg-white/40 hover:text-slate-900'
                }`}>
                <mod.icon className="w-5 h-5" />
                {mod.label}
                {i === 0 && completedSim && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                {i === 1 && completedTest && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 lg:p-10 max-w-4xl pb-24 lg:pb-10 mx-auto w-full">

          {/* Mobile nav */}
          <div className="lg:hidden flex flex-col gap-4 mb-8">
            <Link to="/caminos" className="flex items-center gap-2 text-slate-600 text-sm">
              <ArrowLeft className="w-4 h-4" /> Volver a Caminos
            </Link>
            {/* Mobile user badge */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/60">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{userName}</p>
                <p className="text-slate-500 text-xs">{userPhone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {modules.map((mod, i) => (
                <button key={i} onClick={() => setActiveModule(i)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all ${
                    activeModule === i
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white/30 text-slate-800 border border-white/40'
                  }`}>
                  <mod.icon className="w-4 h-4" />
                  {mod.label}
                  {((i === 0 && completedSim) || (i === 1 && completedTest)) &&
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* ── Success modal ── */}
          <AnimatePresence>
            {emailStatus === 'sent' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-4"
                style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              >
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Listo!</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Tus respuestas fueron enviadas correctamente.
                  </p>
                  <button
                    onClick={() => setEmailStatus('idle')}
                    className="mt-6 px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold hover:opacity-90 transition-all"
                  >
                    Cerrar
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Both completed banner ── */}
          <AnimatePresence>
            {allDone && emailStatus !== 'sent' && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-2xl bg-white/50 border border-white/70 flex flex-col sm:flex-row items-center gap-3"
              >
                <div className="flex items-center gap-2 flex-1">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p className="text-slate-700 text-sm font-medium">
                    ¡Completaste las dos actividades! Envía tus resultados cuando estés listo.
                  </p>
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={emailStatus === 'sending'}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold text-sm shadow hover:scale-105 active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap"
                >
                  {emailStatus === 'sending'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    : <><Send className="w-4 h-4" /> Enviar resultados</>}
                </button>
                {emailStatus === 'error' && (
                  <p className="text-red-500 text-xs">Error al enviar. Intenta de nuevo.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {/* ── SIMULADOR ── */}
            {activeModule === 0 && (
              <motion.div key="sim" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {!isSimFinished ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-3xl text-slate-900 flex items-center gap-3">
                        <Eye className="text-sky-600" /> Entrenamiento
                      </h2>
                      <span className="text-slate-600 font-mono text-sm bg-white/50 px-3 py-1 rounded-full">
                        {sceneIndex + 1} / {witnessScenes.length}
                      </span>
                    </div>

                    <motion.div key={witnessScenes[sceneIndex].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                      <div className="relative aspect-video sm:aspect-auto sm:h-[400px]">
                        <img src={witnessScenes[sceneIndex].image} className="w-full h-full object-cover" alt="Situación" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800/50 to-transparent" />
                        <div className="absolute bottom-0 p-4 sm:p-8">
                          <p className="text-white text-xl sm:text-2xl font-bold leading-snug">{witnessScenes[sceneIndex].title}</p>
                          <p className="text-slate-300 text-sm sm:text-base mt-2">{witnessScenes[sceneIndex].narration}</p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {witnessScenes[sceneIndex].options.map((opt, i) => (
                        <button key={i} onClick={() => !chosenOption && handleSceneChoice(opt)}
                          disabled={!!chosenOption}
                          className={`p-4 rounded-xl border text-left transition-all flex gap-3 items-center
                            ${chosenOption === opt ? 'border-emerald-400 bg-emerald-400/10' : 'border-white/30 bg-white/20 hover:bg-white/40'}
                            ${chosenOption && chosenOption !== opt ? 'opacity-40' : 'opacity-100'}`}>
                          {getImpactIcon(opt.impact)}
                          <span className="text-slate-800 text-sm sm:text-base">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="p-6 sm:p-12 text-center rounded-3xl border border-white/20 bg-white/40 backdrop-blur-md">
                    <Award className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                    <h3 className={`text-2xl sm:text-4xl font-bold mb-4 ${getSimFinalMessage().color}`}>
                      {getSimFinalMessage().title}
                    </h3>
                    <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-8">
                      {getSimFinalMessage().msg}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button onClick={() => { setIsSimFinished(false); setSceneIndex(0); setSimAnswers([]); setCompletedSim(false); }}
                        className="px-6 py-4 rounded-xl bg-white/40 text-slate-800 font-bold hover:bg-white/60 transition-all border border-white/40">
                        REPETIR ENTRENAMIENTO
                      </button>
                      <button onClick={() => setActiveModule(1)}
                        className="px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold hover:opacity-90 transition-all shadow-lg">
                        REALIZAR TEST DE PERFIL
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── TEST DE PERFIL ── */}
            {activeModule === 1 && (
              <motion.div key="test" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {profileResult ? (
                  <div className="rounded-3xl border border-white/20 bg-white/40 backdrop-blur-md p-6 sm:p-10 text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-slate-800/80 border border-white/10 mb-6">
                      <Shield className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
                      {profiles[profileResult].title}
                    </h3>
                    <p className="text-slate-700 italic mb-8 text-lg leading-relaxed max-w-lg mx-auto">
                      "{profiles[profileResult].desc}"
                    </p>
                    <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                      <h4 className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">
                        Consejos para crecer:
                      </h4>
                      {profiles[profileResult].tips.map((tip, idx) => (
                        <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white/40 border border-white/40">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <p className="text-slate-700 text-sm sm:text-base">{tip}</p>
                        </div>
                      ))}
                    </div>



                    <button onClick={() => { setProfileResult(null); setProfileStep(0); setProfileAnswers([]); setCompletedTest(false); }}
                      className="mt-2 w-full sm:w-auto px-10 py-4 rounded-xl bg-white/40 text-slate-800 font-bold hover:bg-white/60 transition-all border border-white/40">
                      REINICIAR TEST
                    </button>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                      <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest">
                        Pregunta {profileStep + 1} de {profileQuestions.length}
                      </span>
                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-white/30 rounded-full mt-2 mb-4 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full transition-all duration-500"
                          style={{ width: `${((profileStep) / profileQuestions.length) * 100}%` }}
                        />
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                        {profileQuestions[profileStep].q}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {profileQuestions[profileStep].opts.map((opt, i) => (
                        <button key={i} onClick={() => handleProfileAnswer(opt.type)}
                          className="w-full p-5 rounded-2xl border border-white/30 bg-white/30 hover:border-sky-400/60 hover:bg-white/50 transition-all text-left flex justify-between items-center group">
                          <span className="text-slate-800 group-hover:text-slate-900 text-base sm:text-lg">{opt.text}</span>
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-500 shrink-0 ml-4 transition-colors" />
                        </button>
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