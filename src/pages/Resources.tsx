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
      id: 5,
      title: 'Video conmovedor sobre víctimas de bullying',
      description: 'Jóvenes leen mensajes de víctimas reales de bullying, mostrando el impacto emocional que deja el acoso.',
      duration: '~5 min',
      category: 'Impacto',
      url: 'https://www.youtube.com/watch?v=4zxvLu3UYP8',
      thumbnail: 'https://img.youtube.com/vi/4zxvLu3UYP8/hqdefault.jpg',
      youtubeId: '4zxvLu3UYP8',
    },
    {
      id: 3,
      title: 'Cortometraje sobre bullying (historia impactante)',
      description: 'Corto realista que muestra las consecuencias emocionales del bullying en estudiantes.',
      duration: '~7 min',
      category: 'Corto',
      url: 'https://www.youtube.com/watch?v=91HgatU6zL8',
      thumbnail: 'https://img.youtube.com/vi/91HgatU6zL8/hqdefault.jpg',
      youtubeId: '91HgatU6zL8',
    },
    {
      id: 6,
      title: 'Cortometraje bullying – No entiendo por qué',
      description: 'Historia reflexiva sobre el bullying y sus consecuencias emocionales en adolescentes.',
      duration: '~6 min',
      category: 'Conciencia',
      url: 'https://www.youtube.com/watch?v=ped-Vde_xwI',
      thumbnail: 'https://img.youtube.com/vi/ped-Vde_xwI/hqdefault.jpg',
      youtubeId: 'ped-Vde_xwI',
    },
    {
      id: 2,
      title: 'Testimonios contra el Acoso Escolar',
      description: 'Serie de testimonios en video de jóvenes que han vivido el acoso escolar, compartiendo sus experiencias y consejos.',
      duration: '~12 min',
      category: 'Testimonio',
      url: 'https://www.youtube.com/watch?v=TwnrKUceJbQ',
      thumbnail: 'https://img.youtube.com/vi/TwnrKUceJbQ/hqdefault.jpg',
      youtubeId: 'TwnrKUceJbQ',
    },
    {
      id: 4,
      title: 'Cortometraje sobre bullying (caso realista)',
      description: 'Corto impactante basado en situaciones reales de acoso escolar que refleja sus consecuencias emocionales.',
      duration: '~10 min',
      category: 'Corto',
      url: 'https://www.youtube.com/watch?v=Mp-8gRAWWqI',
      thumbnail: 'https://img.youtube.com/vi/Mp-8gRAWWqI/hqdefault.jpg',
      youtubeId: 'Mp-8gRAWWqI',
    },
    {
      id: 1,
      title: 'El bullying explicado: señales y consecuencias reales',
      description: 'Explicación clara del acoso escolar con ejemplos reales y señales de alerta que muchas veces pasan desapercibidas.',
      duration: '~6 min',
      category: 'Conciencia',
      url: 'https://www.youtube.com/watch?v=I-ihC-FXbbI',
      thumbnail: 'https://img.youtube.com/vi/I-ihC-FXbbI/hqdefault.jpg',
      youtubeId: 'I-ihC-FXbbI',
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
  { id: 1, icon: Shield,  title: 'Protección Activa',        description: 'Protocolos de seguridad verificados por expertos internacionales.', color: 'trust',  pilar: 'Prevención' },
  { id: 2, icon: Users,   title: 'Comunidad Unida',          description: 'Fomentar la empatía y el apoyo mutuo entre estudiantes.',             color: 'teal',   pilar: 'Cultura'    },
  { id: 3, icon: Zap,     title: 'Detección Ágil',           description: 'Identificar señales de alerta temprana en el entorno digital.',      color: 'amber',  pilar: 'Acción'     },
  { id: 4, icon: Target,  title: 'Intervención Focalizada',  description: 'Estrategias directas basadas en la evidencia recolectada.',          color: 'coral',  pilar: 'Estrategia' },
  { id: 5, icon: Heart,   title: 'Apoyo Emocional',          description: 'Recursos dedicados a la salud mental y la sanación.',                color: 'purple', pilar: 'Sanación'   },
  { id: 6, icon: Brain,   title: 'Educación Continua',        description: 'Formación constante para familias, docentes y alumnos.',             color: 'blue',   pilar: 'Formación'  },
];

const hexColorMap = {
  trust:  { text: 'text-blue-400',   bg: 'bg-blue-500/20',   border: 'border-blue-500/30',   stop: '#3b82f6' },
  teal:   { text: 'text-teal-400',   bg: 'bg-teal-500/20',   border: 'border-teal-500/30',   stop: '#14b8a6' },
  amber:  { text: 'text-amber-400',  bg: 'bg-amber-500/20',  border: 'border-amber-500/30',  stop: '#f59e0b' },
  coral:  { text: 'text-red-400',    bg: 'bg-red-500/20',    border: 'border-red-500/30',    stop: '#ef4444' },
  purple: { text: 'text-violet-400', bg: 'bg-violet-500/20', border: 'border-violet-500/30', stop: '#8b5cf6' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/20',   border: 'border-blue-500/30',   stop: '#60a5fa' },
};

// ─── InteractiveHexagon ────────────────────────────────────────────────────────
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
            <stop offset="0%" stopColor="#082f49" stopOpacity="0.95" />
            <stop offset="100%" stopColor={c.stop} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M50 0 L100 28.87 L100 86.6 L50 115.47 L0 86.6 L0 28.87 Z"
          fill={`url(#grad-${item.id})`}
          stroke="currentColor"
          strokeWidth="3.5"
          className="opacity-90 group-hover:opacity-100 transition-opacity duration-500"
        />
      </svg>

      {/* Contenido interior del hexágono */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6 text-center z-10">
        {/* Icono */}
        <div className={`
          w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12
          rounded-full ${c.bg} flex items-center justify-center
          mb-1 sm:mb-2 md:mb-2.5 lg:mb-3
          border ${c.border}
          group-hover:scale-110 transition-transform shrink-0
          shadow-lg
        `}>
          <Icon className={`w-5 h-5 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 ${c.text}`} strokeWidth={2} />
        </div>

        {/* Pilar — visible en todos los tamaños */}
        <p className={`
          text-[10px] sm:text-[10px] md:text-[11px] lg:text-[12px]
          font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.2em]
          ${c.text} mb-1 sm:mb-1
          drop-shadow-md
        `}>
          {item.pilar}
        </p>

        {/* Título — grande y visible en desktop */}
        <h3 className="
          font-display font-black text-white leading-tight
          text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px]
          mb-1 sm:mb-1 md:mb-1.5 lg:mb-2
          px-1 drop-shadow-sm
        ">
          {item.title}
        </h3>

        {/* Descripción — visible desde sm en adelante y con texto más grande */}
        <p className="
          text-slate-200 leading-relaxed
          hidden sm:block
          text-[10px] sm:text-[10.5px] md:text-[11.5px] lg:text-[12px]
          max-w-[110px] sm:max-w-[130px] md:max-w-[135px] lg:max-w-[145px]
          font-medium
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
    className="group flex flex-col bg-white/90 border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm shadow-slate-500/10 hover:shadow-md hover:shadow-slate-500/15 transition-all duration-300"
  >
    <div className="relative aspect-video bg-slate-100 overflow-hidden">
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6fe5f1]/20 to-[#aaf1f7]/20">
          <Play className="w-10 h-10 text-teal-700/70" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-teal-900 rounded-full flex items-center justify-center shadow-lg shadow-teal-900/20 hover:scale-110 transition-transform"
        >
          <Play className="w-5 h-5 text-white" />
        </a>
      </div>
      <div className="absolute top-3 left-3">
        <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
          {video.category}
        </span>
      </div>
      {video.duration && (
        <div className="absolute bottom-3 right-3">
          <span className="bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded-lg flex items-center gap-1">
            <Clock size={9} /> {video.duration}
          </span>
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 transition-colors">
        {video.title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">{video.description}</p>
      <a
        href={video.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex items-center gap-2 text-teal-900 text-sm font-bold hover:gap-3 transition-all"
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
    className="group flex gap-4 items-start bg-white/90 border border-slate-200/60 p-5 rounded-3xl hover:shadow-lg hover:shadow-slate-400/15 transition-all duration-200 cursor-pointer"
  >
    <div className="w-12 h-12 shrink-0 bg-[#6fe5f1]/15 rounded-xl flex items-center justify-center group-hover:bg-[#6fe5f1]/25 transition-colors">
      <BookOpen className="text-teal-800" size={22} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {study.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-bold text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-tight"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 transition-colors">
        {study.title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{study.description}</p>
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="font-semibold text-teal-700/90">{study.author}</span>
        <span>·</span>
        <span>{study.year}</span>
      </div>
    </div>
    <div className="shrink-0 pt-1">
      <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-teal-100 transition-all text-slate-500">
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
      className={`relative rounded-3xl border p-6 flex flex-col gap-4 bg-white/85 border-slate-200/50`}
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
        <p className="font-bold text-slate-900 text-sm leading-snug">{item.title}</p>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
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
    { id: 'videos',   label: 'Multimedia',     icon: Play      },
    { id: 'studies',  label: 'Investigaciones', icon: BarChart3 },
    { id: 'liveData', label: 'Datos en Vivo',   icon: MessageSquare },
  ];

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,_#aaf1f7_0%,_#6fe5f1_35%,_#e6fbff_100%)] text-slate-900 font-body pt-24 pb-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/70 blur-3xl opacity-80 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#0d7ea2]/15 blur-3xl opacity-90 pointer-events-none" />

      {/* ── HERO ── */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 text-center mb-16 sm:mb-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-5 tracking-tight leading-none text-slate-900">
            Biblioteca de<br />
            <span className="text-teal-800">Evidencia</span>
          </h1>
          <p className="text-slate-700 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
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
                className="bg-white/90 border border-slate-200/60 rounded-3xl p-5 sm:p-6 text-center shadow-sm shadow-slate-400/10"
              >
                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl sm:text-2xl font-display font-bold mb-1 text-slate-900">{stat.value}</div>
                <div className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-slate-500 leading-tight">
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
        <div className="flex justify-center mb-10 sm:mb-14 relative z-10">
          <div className="flex flex-wrap justify-center gap-2 bg-white/90 p-2 rounded-3xl border border-slate-200/60 shadow-sm shadow-slate-400/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-7 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-900 text-white shadow-lg shadow-teal-900/20'
                    : 'text-slate-600 hover:text-slate-900'
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
                <div className="mt-4 flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                  <Shield size={17} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-800 leading-relaxed">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-sky-300/10 blur-[120px] pointer-events-none rounded-full" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 lg:mb-20 relative z-10"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Pilares de la <span className="text-teal-800">Resiliencia</span>
            </h2>
            <p className="text-slate-700 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed px-2">
              Basado en el modelo ecológico de la OMS, este diagrama representa cómo la evidencia
              se transforma en un ecosistema de seguridad para los estudiantes.
            </p>
          </motion.div>

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