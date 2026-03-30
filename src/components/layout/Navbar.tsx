import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';

const links = [
  { label: 'Inicio', to: '/' },
  { label: 'Aprende', to: '/#conceptos' },
  { label: 'Tu Camino', to: '/caminos' },
  { label: 'Recursos', to: '/emergencia' },
  { label: 'Emergencia', to: '/emergencia' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-midnight/80 backdrop-blur-xl border-b border-softwhite/5'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ rotate: 12 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Shield className="w-8 h-8 text-trust" />
          </motion.div>
          <span className="font-display font-bold text-xl text-softwhite">Escudo</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
            >
              <Link
                to={link.to}
                className={`text-sm font-body transition-colors hover:text-trust ${
                  location.pathname === link.to ? 'text-trust' : 'text-mutedblue'
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="hidden md:block">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/caminos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-trust-hope text-softwhite font-body font-semibold text-sm shadow-lg shadow-trust/20"
            >
              Encuentra tu Ruta
              <span>→</span>
            </Link>
          </motion.div>
        </div>

        <button className="md:hidden text-softwhite" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card mx-4 mt-2 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-body text-mutedblue hover:text-trust transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/caminos"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full gradient-trust-hope text-softwhite font-body font-semibold text-sm mt-2"
              >
                Encuentra tu Ruta →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
