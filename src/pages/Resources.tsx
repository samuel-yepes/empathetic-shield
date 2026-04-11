import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Play, BarChart3, MessageSquare, BookOpen, TrendingUp, Users, Target,
  ExternalLink, Clock, Shield, FileText, Globe, AlertCircle, ArrowUpRight,
  LayoutGrid, Zap, Heart, Brain
} from 'lucide-react';

const resources = {
  videos: [
    {
      id: 1,
      title: 'Documental Acoso Escolar – Convivencia',
      description: 'Documental producido por EducaMadrid con testimonios reales de estudiantes y educadores sobre el impacto del bullying y cómo la comunidad escolar puede actuar.',
      duration: '~20 min',
      category: 'Documental',
      url: 'https://www.youtube.com/watch?v=lMm_FscDUKM',
      thumbnail: 'https://img.youtube.com/vi/lMm_FscDUKM/hqdefault.jpg',
      youtubeId: 'lMm_FscDUKM',
    },
    {
      id: 2,
      title: 'Testimonios contra el Acoso Escolar',
      description: 'Serie de testimonios en video de jóvenes que han vivido el acoso escolar, compartiendo sus experiencias y consejos para quienes están pasando por lo mismo.',
      duration: '~12 min',
      category: 'Testimonio',
      url: 'https://youtu.be/TwnrKUceJbQ?si=gUzRoVWP76tXbBz2',
      thumbnail: 'https://img.youtube.com/vi/TwnrKUceJbQ/hqdefault.jpg',
      youtubeId: 'TwnrKUceJbQ',
    },
    {
      id: 3,
      title: 'Ciberacoso: Cómo detectarlo y prevenirlo',
      description: 'UNICEF España explica qué es el ciberacoso, cómo afecta a los adolescentes en redes sociales y qué pueden hacer familias, docentes y estudiantes para detenerlo.',
      category: 'Digital',
      url: 'https://www.unicef.es/acoso-escolar-bullying',
      thumbnail: null,
      youtubeId: null,
    },
  ],
  studies: [
    {
      id: 1,
      title: 'Aprender y crecer con seguridad: acabar con la violencia escolar (2024)',
      author: 'UNESCO',
      year: 2024,
      description: 'Informe global presentado en la Conferencia Ministerial de Bogotá. Concluye que la violencia escolar afecta a ~1.000 millones de niños al año.',
      tags: ['Global', 'Estadística', 'Políticas'],
      url: 'https://www.unesco.org/es/articles/violencia-y-acoso-escolar-la-unesco-reclama-una-mejor-proteccion-de-los-estudiantes',
    },
    {
      id: 2,
      title: 'Más allá de los números: poner fin al acoso escolar',
      author: 'UNESCO',
      year: 2019,
      description: 'Análisis de 144 países con datos de encuestas GSHS y HBSC. Primer informe integral de la UNESCO sobre violencia escolar y bullying.',
      tags: ['Investigación', 'Datos', 'Prevención'],
      url: 'https://unesdoc.unesco.org/ark:/48223/pf0000378398',
    },
    {
      id: 3,
      title: 'Ocultos a plena luz: violencia contra la infancia',
      author: 'UNICEF',
      year: 2020,
      description: 'Compilación de datos sobre violencia física, sexual y emocional contra niños. Revela actitudes que perpetan y justifican la violencia.',
      tags: ['Salud Mental', 'Infancia', 'Derechos'],
      url: 'https://www.unicef.es/sites/unicef.es/files/informeocultosbajolaluz.pdf',
    },
    {
      id: 4,
      title: 'Acoso escolar y ciberacoso: propuestas para la acción',
      author: 'Save the Children España',
      year: 2023,
      description: 'Estudio con datos actualizados sobre prevalencia en España y propuestas de intervención para centros educativos y familias.',
      tags: ['España', 'Intervención', 'Ciberacoso'],
      url: 'https://www.savethechildren.es/sites/default/files/imce/docs/acoso_escolar_y_ciberacoso.pdf',
    },
  ],
  liveData: [
    {
      id: 1,
      title: '1 de cada 3 estudiantes sufre acoso mensualmente',
      value: '33%',
      description: 'De los estudiantes en el mundo reporta haber sido víctima de acoso escolar cada mes.',
      source: 'UNESCO, noviembre 2024',
      sourceUrl: 'https://news.un.org/es/story/2024/11/1534071',
      color: 'coral',
      icon: AlertCircle,
    },
    {
      id: 2,
      title: '1 de cada 10 niños sufre ciberacoso',
      value: '10%',
      description: 'De los niños en el mundo ha sido víctima de ciberacoso, cifra que aumenta cada año.',
      source: 'UNESCO, 2024',
      sourceUrl: 'https://www.unesco.org/es/articles/violencia-y-acoso-escolar-la-unesco-reclama-una-mejor-proteccion-de-los-estudiantes',
      color: 'amber',
      icon: Globe,
    },
    {
      id: 3,
      title: 'Solo 32 países tienen ley completa contra el bullying',
      value: '16%',
      description: 'Apenas el 16% de los Estados cuenta con un marco jurídico completo para combatir la violencia en las escuelas.',
      source: 'UNESCO, noviembre 2024',
      sourceUrl: 'https://articles.unesco.org/sites/default/files/medias/fichiers/2024/11/PR_Violence_and_bullying_in_schools_UNESCO_calls_for_better_protection_of_students_sp.pdf',
      color: 'blue',
      icon: Shield,
    },
    {
      id: 4,
      title: 'Doble riesgo de ideación suicida en víctimas',
      value: '2×',
      description: 'Las víctimas de acoso tienen el doble de probabilidades de sufrir soledad severa, insomnio y pensamientos suicidas.',
      source: 'UNESCO, 2024',
      sourceUrl: 'https://news.un.org/es/story/2024/11/1534071',
      color: 'purple',
      icon: TrendingUp,
    },
  ],
  stats: [
    { label: 'Países con datos', value: '144+', icon: Globe, color: 'text-blue-400' },
    { label: 'Niños afectados/año', value: '1B+', icon: Users, color: 'text-red-400' },
    { label: 'Publicaciones UNESCO', value: '12+', icon: FileText, color: 'text-teal-400' },
    { label: 'Tasa de reducción posible', value: '50%', icon: TrendingUp, color: 'text-green-400' },
  ],
};

const colorMap = {
  coral:  { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400',    value: 'text-red-300'    },
  amber:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  value: 'text-amber-300'  },
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   value: 'text-blue-300'   },
  purple: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', value: 'text-violet-300' },
};

const hexagonData = [
  { id: 1, icon: Shield,  title: 'Protección Activa',       description: 'Protocolos de seguridad verificados por expertos internacionales.', color: 'trust',  pilar: 'Prevención' },
  { id: 2, icon: Users,   title: 'Comunidad Unida',          description: 'Fomentar la empatía y el apoyo mutuo entre estudiantes.',            color: 'teal',   pilar: 'Cultura'    },
  { id: 3, icon: Zap,     title: 'Detección Ágil',           description: 'Identificar señales de alerta temprana en el entorno digital.',      color: 'amber',  pilar: 'Acción'     },
  { id: 4, icon: Target,  title: 'Intervención Focalizada',  description: 'Estrategias directas basadas en la evidencia recolectada.',          color: 'coral',  pilar: 'Estrategia' },
  { id: 5, icon: Heart,   title: 'Apoyo Emocional',          description: 'Recursos dedicados a la salud mental y la sanación.',                color: 'purple', pilar: 'Sanación'   },
  { id: 6, icon: Brain,   title: 'Educación Continua',       description: 'Formación constante para familias, docentes y alumnos.',             color: 'blue',   pilar: 'Formación'  },
];

const hexColorMap = {
  trust:  { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   stop: '#3b82f6' },
  teal:   { text: 'text-teal-400',   bg: 'bg-teal-500/10',   border: 'border-teal-500/30',   stop: '#14b8a6' },
  amber:  { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  stop: '#f59e0b' },
  coral:  { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    stop: '#ef4444' },
  purple: { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30', stop: '#8b5cf6' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   stop: '#60a5fa' },
};

// ─── InteractiveHexagon ────────────────────────────────────────────────────────
// CAMBIOS:
//   • Padding reducido en mobile (p-2 sm:p-4 md:p-6) para que quepa el contenido
//   • Icono más pequeño en mobile (w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12)
//   • Título: text-xs sm:text-sm md:text-base (visible en desktop y mobile)
//   • Descripción: visible a partir de md (antes era sm)
//   • Pilar: visible en todos los tamaños con texto ligeramente más grande

const InteractiveHexagon = ({ item, index }) => {
  const c = hexColorMap[item.color];
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="relative aspect-[100/115] group cursor-default"
    >
      <svg viewBox="0 0 100 115.47" className={`absolute inset-0 w-full h-full drop-shadow-2xl transition-all duration-300 ${c.text}`}>
        <defs>
          <linearGradient id={`grad-${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="1" />
            <stop offset="100%" stopColor={c.stop} stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <path
          d="M50 0 L100 28.87 L100 86.6 L50 115.47 L0 86.6 L0 28.87 Z"
          fill={`url(#grad-${item.id})`}
          stroke="currentColor"
          strokeWidth="1.5"
          className="opacity-30 group-hover:opacity-100 transition-opacity duration-500"
        />
      </svg>

      {/* Contenido interior del hexágono */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 text-center z-10">
        {/* Icono */}
        <div className={`
          w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
          rounded-full ${c.bg} flex items-center justify-center
          mb-2 sm:mb-2 md:mb-2.5 lg:mb-3
          border ${c.border}
          group-hover:scale-110 transition-transform shrink-0
        `}>
          <Icon className={`w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 ${c.text}`} strokeWidth={1.5} />
        </div>

        {/* Pilar — visible en todos los tamaños */}
        <p className={`
          text-[9px] sm:text-[9px] md:text-[10px] lg:text-[11px]
          font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]
          ${c.text} mb-1 sm:mb-1
          opacity-70 group-hover:opacity-100 transition-opacity
        `}>
          {item.pilar}
        </p>

        {/* Título — grande y visible en desktop */}
        <h3 className="
          font-display font-bold text-softwhite leading-tight
          text-[11px] sm:text-sm md:text-sm lg:text-base
          mb-1 sm:mb-1 md:mb-1.5 lg:mb-2
          px-1
        ">
          {item.title}
        </h3>

        {/* Descripción — visible desde sm en adelante */}
        <p className="
          text-softwhite/90 leading-relaxed
          hidden sm:block
          text-[9px] sm:text-[10px] md:text-[10px] lg:text-[11px]
          max-w-[110px] sm:max-w-[130px] md:max-w-[130px] lg:max-w-[145px]
        ">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
};

// ─── VideoCard ─────────────────────────────────────────────────────────────────
const VideoCard = ({ video, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="group flex flex-col bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-trust/30 hover:bg-white/[0.05] transition-all duration-300"
  >
    <div className="relative aspect-video bg-black/40 overflow-hidden">
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-trust/10 to-hope/10">
          <Play className="w-10 h-10 text-trust/40" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-trust rounded-full flex items-center justify-center shadow-lg shadow-trust/30 hover:scale-110 transition-transform"
        >
          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
        </a>
      </div>
      <div className="absolute top-3 left-3">
        <span className="bg-trust/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
          {video.category}
        </span>
      </div>
      {video.duration && (
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/70 backdrop-blur text-softwhite text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
            <Clock size={9} /> {video.duration}
          </span>
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-softwhite text-base leading-snug mb-2 group-hover:text-trust transition-colors">
        {video.title}
      </h3>
      <p className="text-sm text-mutedblue/70 leading-relaxed flex-1">{video.description}</p>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center gap-2 text-trust text-sm font-bold hover:gap-3 transition-all"
      >
        Ver recurso <ArrowUpRight size={14} />
      </a>
    </div>
  </motion.div>
);

// ─── StudyCard ─────────────────────────────────────────────────────────────────
const StudyCard = ({ study, index }) => (
  <motion.a
    href={study.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.07 }}
    className="group flex gap-4 items-start bg-white/[0.03] border border-white/8 p-5 rounded-2xl hover:bg-white/[0.05] hover:border-trust/30 transition-all duration-200 cursor-pointer"
  >
    <div className="w-12 h-12 shrink-0 bg-trust/10 rounded-xl flex items-center justify-center group-hover:bg-trust/20 transition-colors">
      <BookOpen className="text-trust" size={22} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-bold text-mutedblue/70 border border-white/15 px-2.5 py-0.5 rounded-full uppercase tracking-tight"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="font-bold text-softwhite text-base leading-snug mb-2 group-hover:text-trust transition-colors">
        {study.title}
      </h3>
      <p className="text-sm text-mutedblue/80 leading-relaxed mb-3">{study.description}</p>
      <div className="flex items-center gap-3 text-sm text-mutedblue/70">
        <span className="font-semibold text-trust/80">{study.author}</span>
        <span>·</span>
        <span>{study.year}</span>
      </div>
    </div>
    <div className="shrink-0 pt-1">
      <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-trust/20 group-hover:text-trust transition-all text-mutedblue/60">
        <ExternalLink size={15} />
      </div>
    </div>
  </motion.a>
);

// ─── LiveDataCard ──────────────────────────────────────────────────────────────
const LiveDataCard = ({ item, index }) => {
  const c = colorMap[item.color];
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08 }}
      className={`relative rounded-2xl border p-6 flex flex-col gap-4 ${c.bg} ${c.border}`}
    >
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${c.text}`}>
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${c.text.replace('text', 'bg')}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${c.text.replace('text', 'bg')}`} />
          </span>
          Dato verificado
        </div>
        <Icon size={18} className={c.text} />
      </div>
      <div>
        <p className={`text-5xl font-display font-bold leading-none mb-2 ${c.value}`}>{item.value}</p>
        <p className="font-bold text-softwhite text-sm leading-snug">{item.title}</p>
      </div>
      <p className="text-sm text-mutedblue/80 leading-relaxed">{item.description}</p>
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto flex items-center gap-1.5 text-xs font-semibold ${c.text} hover:opacity-80 transition-opacity`}
      >
        <Globe size={12} />
        {item.source}
        <ArrowUpRight size={11} />
      </a>
    </motion.div>
  );
};

// ─── Resources (página principal) ─────────────────────────────────────────────
export default function Resources() {
  const [activeTab, setActiveTab] = useState('videos');
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  const tabs = [
    { id: 'videos',    label: 'Multimedia',      icon: Play      },
    { id: 'studies',   label: 'Investigaciones', icon: BarChart3 },
    { id: 'liveData',  label: 'Datos en Vivo',   icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-midnight text-softwhite font-body pt-24 pb-24">

      {/* ── HERO ── */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 text-center mb-16 sm:mb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-5 tracking-tight leading-none">
            Biblioteca de<br />
            <span className="text-trust">Evidencia</span>
          </h1>
          <p className="text-mutedblue text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Un repositorio de datos reales, investigaciones revisadas por expertos y recursos multimedia
            para la prevención del acoso escolar.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div ref={headerRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 max-w-3xl mx-auto">
          {resources.stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-4 sm:p-5 text-center"
              >
                <Icon className={`w-4 h-4 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl sm:text-2xl font-display font-bold mb-1">{stat.value}</div>
                <div className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-mutedblue/60 leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">

        {/* Tabs */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="flex flex-wrap justify-center gap-1.5 bg-white/[0.03] p-1.5 rounded-2xl border border-white/8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-trust text-white shadow-lg shadow-trust/20'
                    : 'text-mutedblue hover:text-softwhite'
                }`}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido de tabs */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.videos.map((v, i) => <VideoCard key={v.id} video={v} index={i} />)}
              </div>
            )}

            {activeTab === 'studies' && (
              <div className="flex flex-col gap-4">
                {resources.studies.map((s, i) => <StudyCard key={s.id} study={s} index={i} />)}
                <div className="mt-4 flex items-start gap-3 bg-trust/5 border border-trust/15 rounded-2xl p-5">
                  <Shield size={17} className="text-trust shrink-0 mt-0.5" />
                  <p className="text-sm text-mutedblue/80 leading-relaxed">
                    Todas las investigaciones provienen de organismos internacionales reconocidos.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'liveData' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {resources.liveData.map((item, i) => <LiveDataCard key={item.id} item={item} index={i} />)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── SECCIÓN HEXÁGONOS ── */}
        <section className="mt-20 sm:mt-32 md:mt-40 mb-16 sm:mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-trust/5 blur-[120px] pointer-events-none rounded-full" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20 relative z-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Pilares de la <span className="text-trust">Resiliencia</span>
            </h2>
            <p className="text-mutedblue text-sm sm:text-base max-w-3xl mx-auto leading-relaxed px-2">
              Basado en el modelo ecológico de la OMS, este diagrama representa cómo la evidencia
              se transforma en un ecosistema de seguridad para los estudiantes.
            </p>
          </motion.div>

          {/*
            GRID DE HEXÁGONOS:
            • Mobile (< sm): 2 columnas con hexágonos en tamaño normal
            • sm → md: 3 columnas con más espacio
            • md+: 3 columnas full con espaciado amplio
            • Se ajusta el max-w para mejor legibilidad
          */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-3 sm:px-4">
            {hexagonData.map((item, index) => (
              <InteractiveHexagon key={item.id} item={item} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-12 sm:mt-16 lg:mt-20 text-center"
          >
          </motion.div>
        </section>
      </div>
    </div>
  );
}