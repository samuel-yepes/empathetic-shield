import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Play,
  BarChart3,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Users,
  Target,
  Download,
  ExternalLink,
  Clock,
  ChevronRight,
  Shield,
  FileText,
  Globe,
  AlertCircle,
  ArrowUpRight,
  LayoutGrid,
} from 'lucide-react';

const resources = {
  videos: [
    {
      id: 1,
      title: 'Documental Acoso Escolar – Convivencia',
      description:
        'Documental producido por EducaMadrid con testimonios reales de estudiantes y educadores sobre el impacto del bullying y cómo la comunidad escolar puede actuar.',
      duration: '~20 min',
      category: 'Documental',
      url: 'https://www.youtube.com/watch?v=lMm_FscDUKM',
      thumbnail: 'https://img.youtube.com/vi/lMm_FscDUKM/hqdefault.jpg',
      youtubeId: 'lMm_FscDUKM',
    },
    {
      id: 2,
      title: 'Testimonios contra el Acoso Escolar',
      description:
        'Serie de testimonios en video de jóvenes que han vivido el acoso escolar, compartiendo sus experiencias y consejos para quienes están pasando por lo mismo.',
      duration: '~12 min',
      category: 'Testimonio',
      url: 'https://youtu.be/TwnrKUceJbQ?si=gUzRoVWP76tXbBz2',
      thumbnail: 'https://img.youtube.com/vi/TwnrKUceJbQ/hqdefault.jpg',
      youtubeId: 'TwnrKUceJbQ',
    },
    {
      id: 3,
      title: 'Ciberacoso: Cómo detectarlo y prevenirlo',
      description:
        'UNICEF España explica qué es el ciberacoso, cómo afecta a los adolescentes en redes sociales y qué pueden hacer familias, docentes y estudiantes para detenerlo.',
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
      description:
        'Informe global presentado en la Conferencia Ministerial de Bogotá. Concluye que la violencia escolar afecta a ~1.000 millones de niños al año.',
      tags: ['Global', 'Estadística', 'Políticas'],
      url: 'https://www.unesco.org/es/articles/violencia-y-acoso-escolar-la-unesco-reclama-una-mejor-proteccion-de-los-estudiantes',
    },
    {
      id: 2,
      title: 'Más allá de los números: poner fin al acoso escolar',
      author: 'UNESCO',
      year: 2019,
      description:
        'Análisis de 144 países con datos de encuestas GSHS y HBSC. Primer informe integral de la UNESCO sobre violencia escolar y bullying.',
      tags: ['Investigación', 'Datos', 'Prevención'],
      url: 'https://unesdoc.unesco.org/ark:/48223/pf0000378398',
    },
    {
      id: 3,
      title: 'Ocultos a plena luz: violencia contra la infancia',
      author: 'UNICEF',
      year: 2020,
      description:
        'Compilación de datos sobre violencia física, sexual y emocional contra niños. Revela actitudes que perpetan y justifican la violencia.',
      tags: ['Salud Mental', 'Infancia', 'Derechos'],
      url: 'https://www.unicef.es/sites/unicef.es/files/informeocultosbajolaluz.pdf',
    },
    {
      id: 4,
      title: 'Acoso escolar y ciberacoso: propuestas para la acción',
      author: 'Save the Children España',
      year: 2023,
      description:
        'Estudio con datos actualizados sobre prevalencia en España y propuestas de intervención para centros educativos y familias.',
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
    { label: 'Niños afectados/año', value: '1B+', icon: Users, color: 'text-coral-400' },
    { label: 'Publicaciones UNESCO', value: '12+', icon: FileText, color: 'text-teal-400' },
    { label: 'Tasa de reducción posible', value: '50%', icon: TrendingUp, color: 'text-green-400' },
  ],
};

const colorMap = {
  coral: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', value: 'text-red-300' },
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', value: 'text-amber-300' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', value: 'text-blue-300' },
  purple: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', value: 'text-violet-300' },
};

// --- Subcomponentes de Tarjetas ---
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
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
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
      <p className="text-[10px] font-bold text-trust/60 uppercase tracking-widest mb-2">{video.source}</p>
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

export default function Resources() {
  const [activeTab, setActiveTab] = useState('videos');
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true });

  const tabs = [
    { id: 'videos', label: 'Multimedia', icon: Play },
    { id: 'studies', label: 'Investigaciones', icon: BarChart3 },
    { id: 'liveData', label: 'Datos en Vivo', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-midnight text-softwhite font-body pt-24 pb-24">
      {/* --- HERO --- */}
      <section className="container mx-auto max-w-6xl px-4 sm:px-6 text-center mb-16 sm:mb-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 bg-trust/10 border border-trust/20 text-trust text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <Shield size={12} /> Fuentes verificadas y reales
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-5 tracking-tight leading-none">
            Biblioteca de<br />
            <span className="text-trust">Evidencia</span>
          </h1>
          <p className="text-mutedblue text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Un repositorio de datos reales, investigaciones revisadas por expertos y recursos multimedia 
            para la prevención del acoso escolar.
          </p>
        </motion.div>

        {/* Stats Grid */}
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

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        {/* Tab Nav */}
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
                {resources.videos.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            )}

            {activeTab === 'studies' && (
              <div className="flex flex-col gap-4">
                {resources.studies.map((s, i) => (
                  <StudyCard key={s.id} study={s} index={i} />
                ))}
                <div className="mt-4 flex items-start gap-3 bg-trust/5 border border-trust/15 rounded-2xl p-5">
                  <Shield size={17} className="text-trust shrink-0 mt-0.5" />
                  <p className="text-sm text-mutedblue/80 leading-relaxed">
                    Todas las investigaciones provienen de organismos internacionales reconocidos. Haz clic en cada tarjeta para acceder directamente al documento original.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'liveData' && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  {resources.liveData.map((item, i) => (
                    <LiveDataCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* --- NUEVA SECCIÓN: GUÍAS RÁPIDAS (REEMPLAZO DEL CTA ANTERIOR) --- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 sm:mt-28 rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/8 p-8 sm:p-12 relative overflow-hidden"
        >
          {/* Decoración visual */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-trust/10 blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-trust text-[11px] font-bold uppercase tracking-widest mb-4">
                <LayoutGrid size={13} /> Kit de herramientas
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold mb-4">
                Material de apoyo para descarga inmediata
              </h2>
              <p className="text-mutedblue text-sm sm:text-base leading-relaxed max-w-xl">
                Hemos preparado guías prácticas diseñadas para ser utilizadas en el aula o el hogar. 
                Sin registros, sin correos, acceso directo a la prevención.
              </p>
            </div>
            
            <div className="lg:col-span-5 flex flex-col gap-3">
              {[
                { title: 'Guía de actuación inmediata', type: 'PDF • 1.2MB' },
                { title: 'Protocolo de convivencia digital', type: 'PDF • 850KB' },
                { title: 'Manual para padres y tutores', type: 'PDF • 2.4MB' }
              ].map((doc, idx) => (
                <button 
                  key={idx}
                  className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-trust/10 hover:border-trust/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-mutedblue group-hover:text-trust transition-colors">
                      <Download size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-softwhite group-hover:text-trust transition-colors">{doc.title}</div>
                      <div className="text-[10px] font-semibold text-mutedblue/50 uppercase">{doc.type}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-white/20 group-hover:text-trust group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}