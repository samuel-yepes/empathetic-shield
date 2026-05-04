import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Clock, ShieldCheck, Heart, Info, AlertCircle, ArrowRight } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

const countries = [
  {
    code: 'colombia',
    name: 'Colombia',
    flag: '🇨🇴',
    countryCode: 'CO',
    resources: [
      { name: 'Línea 106 (Salud Mental)', number: '106', hours: '24/7', type: 'Jóvenes' },
      { name: 'Protección ICBF', number: '141', hours: '24/7', type: 'Emergencia' },
    ],
  },
  {
    code: 'mexico',
    name: 'México',
    flag: '🇲🇽',
    countryCode: 'MX',
    resources: [
      { name: 'SAPTEL Crisis', number: '55-5259-8121', hours: '24/7', type: 'Psicológico' },
      { name: 'Línea de la Vida', number: '800-911-2000', hours: '24/7', type: 'Apoyo' },
    ],
  },
  {
    code: 'espana',
    name: 'España',
    flag: '🇪🇸',
    countryCode: 'ES',
    resources: [
      { name: 'Fundación ANAR', number: '900-20-20-10', hours: '24/7', type: 'Menores' },
      { name: 'Teléfono Esperanza', number: '717-003-717', hours: '24/7', type: 'Crisis' },
    ],
  },
  {
    code: 'argentina',
    name: 'Argentina',
    flag: '🇦🇷',
    countryCode: 'AR',
    resources: [
      { name: 'Línea 102', number: '102', hours: '24/7', type: 'Niñez' },
      { name: 'Asistencia Suicida', number: '135', hours: '24/7', type: 'Prevención' },
    ],
  },
  {
    code: 'chile',
    name: 'Chile',
    flag: '🇨🇱',
    countryCode: 'CL',
    resources: [
      { name: 'Línea Libre', number: '1515', hours: '24/7', type: 'Escucha' },
      { name: 'Salud Responde', number: '600-360-7777', hours: '24/7', type: 'Salud' },
    ],
  }
];

export default function EmergencyDirectory() {
  const [selectedCountry, setSelectedCountry] = useState('colombia');
  const country = countries.find((c) => c.code === selectedCountry);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#aaf1f7_0%,_#6fe5f1_35%,_#ffffff_100%)] text-slate-900 font-body pt-28">

      {/* Banner 911 - Ubicación debajo del Navbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-500/10 border-b border-red-500/20 py-3 px-4 flex items-center justify-center gap-3 text-xs md:text-sm"
      >
        <AlertCircle size={14} className="text-red-500" />
        <span className="text-red-200/80">¿Peligro inmediato?</span>
        <a href="tel:911" className="font-bold text-red-500 hover:underline flex items-center gap-1">
          Llama al 911 <ArrowRight size={12} />
        </a>
      </motion.div>

      <div className="container mx-auto px-6 py-12 max-w-5xl">

        {/* Encabezado Compacto */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Centro de <span className="text-teal-600">Ayuda Directa</span>
          </h1>
          <p className="text-slate-700 text-base max-w-lg mx-auto">
            Recursos confidenciales y gratuitos. No estás solo en esto, hay personas listas para escucharte hoy mismo.
          </p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* Columna Izquierda: Mensaje y Selector */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-200 bg-white/20">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
                <ShieldCheck size={18} className="text-teal-600" />
                Espacio Seguro
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                  <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Heart size={12} className="text-teal-600" />
                  </div>
                  <span>Tu llamada es <strong>anónima</strong>. No necesitas dar tu nombre real si no quieres.</span>
                </li>
                <li className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                  <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                    <Info size={12} className="text-teal-600" />
                  </div>
                  <span>Puedes colgar en cualquier momento. Tú llevas el ritmo de la conversación.</span>
                </li>
              </ul>
            </div>

            {/* Selector de Países Vertical / Grid Compacto */}
            <div className="flex flex-wrap lg:flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-slate-700 font-bold ml-2 mb-1 w-full">Selecciona tu país</p>
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`flex-1 lg:flex-none flex items-center justify-between px-4 py-3 rounded-xl transition-all border ${selectedCountry === c.code
                      ? 'bg-teal-100 border-teal-600 text-teal-800'
                      : 'bg-white/50 border-slate-300 text-slate-700 hover:border-teal-400'
                    }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ReactCountryFlag
                      countryCode={c.countryCode}
                      svg
                      style={{ width: '1.2em', height: '1.2em', flexShrink: 0 }}
                    />
                    <span className="text-sm md:text-base font-semibold truncate">
                      {c.name}
                    </span>
                  </div>
                  {selectedCountry === c.code && <div className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse" />}
                </button>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Tarjetas de Números */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCountry}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid gap-4"
              >
                {country?.resources.map((res) => (
                  <div
                    key={res.name}
                    className="group glass-card p-5 rounded-2xl border border-slate-200 bg-white/20 hover:border-teal-400 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-teal-800 uppercase tracking-tighter bg-teal-100 px-2 py-0.5 rounded">
                          {res.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-600 uppercase">
                          <Clock size={10} /> {res.hours}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{res.name}</h3>
                    </div>

                    <a
                      href={`tel:${res.number.replace(/\s/g, '')}`}
                      className="flex flex-col items-end group"
                    >
                      <div className="bg-slate-900 text-white p-3 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-lg">
                        <Phone size={20} className="fill-current" />
                      </div>
                      <span className="text-xs font-bold mt-2 text-slate-700 group-hover:text-teal-800 transition-colors tracking-tighter">
                        {res.number}
                      </span>
                    </a>
                  </div>
                ))}

                {/* Nota de pie informativa */}
                <p className="text-center text-base text-slate-700 mt-4 px-10 leading-relaxed">
                  * Los números presentados son servicios públicos o de ONGs reconocidas.
                  El costo de la llamada depende de tu operador local (la mayoría son gratuitos).
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}