import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Phone, Clock, Lock, AlertTriangle } from 'lucide-react';

const countries = [
  {
    code: 'colombia',
    name: 'Colombia',
    flag: '🇨🇴',
    resources: [
      { name: 'Línea 106', number: '106', hours: '24 horas', free: true, confidential: true },
      { name: 'ICBF', number: '01-8000-918080', hours: 'Lun-Vie 8am-5pm', free: true, confidential: true },
    ],
  },
  {
    code: 'mexico',
    name: 'México',
    flag: '🇲🇽',
    resources: [
      { name: 'CNDH', number: '800-906-3900', hours: '24 horas', free: true, confidential: true },
      { name: 'SAPTEL', number: '55-5259-8121', hours: '24 horas', free: true, confidential: true },
    ],
  },
  {
    code: 'espana',
    name: 'España',
    flag: '🇪🇸',
    resources: [
      { name: 'Teléfono de la Esperanza', number: '717 003 717', hours: '24 horas', free: true, confidential: true },
      { name: 'ANAR', number: '900 20 20 10', hours: '24 horas', free: true, confidential: true },
    ],
  },
  {
    code: 'argentina',
    name: 'Argentina',
    flag: '🇦🇷',
    resources: [
      { name: 'Centro de Asistencia al Suicida', number: '135', hours: '24 horas', free: true, confidential: true },
      { name: 'Línea 102', number: '102', hours: '24 horas', free: true, confidential: true },
    ],
  },
  {
    code: 'chile',
    name: 'Chile',
    flag: '🇨🇱',
    resources: [
      { name: 'Fono Infancia', number: '800-200-818', hours: 'Lun-Vie 8:30am-9pm', free: true, confidential: true },
      { name: 'Línea Libre', number: '1515', hours: '24 horas', free: true, confidential: true },
    ],
  },
  {
    code: 'peru',
    name: 'Perú',
    flag: '🇵🇪',
    resources: [
      { name: 'Línea 100', number: '100', hours: '24 horas', free: true, confidential: true },
    ],
  },
];

export default function EmergencyDirectory() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [selectedCountry, setSelectedCountry] = useState('colombia');

  const country = countries.find((c) => c.code === selectedCountry)!;

  return (
    <div className="min-h-screen bg-midnight pt-28 pb-20">
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-16 left-0 right-0 z-40 bg-warm/90 text-softwhite py-2.5 px-4 text-center font-body text-sm flex items-center justify-center gap-2"
      >
        <AlertTriangle className="w-4 h-4" />
        ¿Estás en peligro ahora?
        <a href="tel:911" className="underline font-bold ml-1">Llama al 911 →</a>
      </motion.div>

      <div ref={ref} className="container mx-auto px-4 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h1 className="font-display font-bold text-4xl md:text-5xl text-softwhite mb-4">
            Directorio de <span className="text-trust">Emergencia</span>
          </h1>
          <p className="text-mutedblue font-body max-w-xl mx-auto">
            Encuentra líneas de ayuda gratuitas y confidenciales en tu país.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {countries.map((c) => (
              <motion.button
                key={c.code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCountry(c.code)}
                className={`px-4 py-2.5 rounded-xl text-sm font-body flex items-center gap-2 transition-colors ${
                  selectedCountry === c.code
                    ? 'bg-trust/20 text-trust'
                    : 'glass-card text-mutedblue hover:text-softwhite'
                }`}
              >
                <span>{c.flag}</span>
                {c.name}
              </motion.button>
            ))}
          </div>

          <motion.div
            key={selectedCountry}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {country.resources.map((resource, i) => (
              <motion.div
                key={resource.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 md:p-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-softwhite mb-2">{resource.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {resource.free && (
                        <span className="text-xs bg-hope/10 text-hope px-2.5 py-1 rounded-full font-body">Gratuito</span>
                      )}
                      <span className="text-xs bg-trust/10 text-trust px-2.5 py-1 rounded-full font-body flex items-center gap-1">
                        <Clock className="w-3 h-3" />{resource.hours}
                      </span>
                      {resource.confidential && (
                        <span className="text-xs bg-softwhite/5 text-mutedblue px-2.5 py-1 rounded-full font-body flex items-center gap-1">
                          <Lock className="w-3 h-3" />Confidencial
                        </span>
                      )}
                    </div>
                  </div>
                  <motion.a
                    href={`tel:${resource.number.replace(/\s/g, '')}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-trust text-softwhite font-body font-semibold text-sm whitespace-nowrap"
                  >
                    <Phone className="w-4 h-4" />
                    {resource.number}
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
