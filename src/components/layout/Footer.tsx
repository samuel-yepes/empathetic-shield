import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-midnight border-t border-softwhite/5 pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Empathix Logo" className="w-16 h-16" />
              <span className="font-display font-bold text-2xl text-softwhite">Empathix</span>
            </div>
            <p className="text-sm text-mutedblue leading-relaxed">
              Plataforma educativa interactiva para la prevención del bullying. Construyendo entornos seguros.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-softwhite mb-4 text-sm">Módulos</h4>
            <ul className="space-y-2 text-sm text-mutedblue">
              <li><Link to="/ruta/agresor" className="hover:text-trust transition-colors">Ruta del Agresor</Link></li>
              <li><Link to="/ruta/victima" className="hover:text-trust transition-colors">Centro de Apoyo</Link></li>
              <li><Link to="/ruta/testigo" className="hover:text-trust transition-colors">Academia del Aliado</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-softwhite mb-4 text-sm">Recursos</h4>
            <ul className="space-y-2 text-sm text-mutedblue">
              <li><Link to="/emergencia" className="hover:text-trust transition-colors">Directorio de Emergencia</Link></li>
              <li><Link to="/caminos" className="hover:text-trust transition-colors">Selector de Caminos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-softwhite mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-mutedblue">
              <li><a href="#" className="hover:text-trust transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-trust transition-colors">Accesibilidad</a></li>
              <li><a href="#" className="hover:text-trust transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-softwhite/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-mutedblue font-body italic">
            "Cada intervención cuenta. Cada voz importa."
          </p>
          <p className="text-xs text-mutedblue flex items-center gap-1">
            Diseñado con <Heart className="w-3 h-3 text-warm" /> propósito educativo
          </p>
        </div>
      </div>
    </footer>
  );
}
