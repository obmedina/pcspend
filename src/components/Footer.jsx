import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Footer = ({ t }) => {

  useEffect(() => {
    if (document.getElementById('bmc-widget-script')) return;

    const script = document.createElement('script');
    script.id = 'bmc-widget-script';
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-id', 'pcspend');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute('data-message', 'Gracias por tu apoyo.');
    
    // Configuración estética azul/blanco integrada
    script.setAttribute('data-color', '#22d3ee'); 
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('bmc-widget-script');
      if (existingScript) existingScript.remove();
      
      const bmcContainer = document.getElementById('bmc-wbtn');
      if (bmcContainer) bmcContainer.remove();

      // Limpiamos el iframe lateral del widget si existiera al desmontar
      const bmcFrame = document.querySelector('iframe[id^="bmc-"]');
      if (bmcFrame) bmcFrame.remove();
    };
  }, []);

  // MODIFICADO: Uso de la API nativa del objeto global window para forzar la apertura del widget
  const handleOpenWidget = (e) => {
    e.preventDefault();
    
    // Comprobamos si la API de Buy Me a Coffee ya se ha registrado en el objeto window
    if (window.BMCWidget && typeof window.BMCWidget.toggle === 'function') {
      window.BMCWidget.toggle();
    } else {
      // Fallback clásico por si el usuario hace click muy rápido antes de que cargue el CDN
      window.open('https://buymeacoffee.com/pcspend', '_blank');
    }
  };

  return (
    <footer className="mt-20 py-12 border-t border-slate-800/60 bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Columna 2: Sobre nosotros */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-300">PC SPEND</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            PC Spend es una herramienta independiente, sin anuncios ni rastreo de datos. 
            Si te resulta útil y quieres apoyar el desarrollo de más herramientas técnicas, 
            puedes <button onClick={handleOpenWidget} className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 bg-transparent border-none p-0 cursor-pointer inline transition-colors">invitarnos a un café aquí</button>.
          </p>
        </div>

        {/* Columna 3: Contacto */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-300">Sobre nosotros</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Email: contact@pcspend.com</li>
            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Política de Privacidad</Link></li>
          </ul>
        </div>

        {/* Columna 4: Otros Micro-SaaS */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-300">Otras herramientas</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><a href="https://ejemplo1.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Calculadora Consumo PC</a></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800/40 text-center text-xs text-slate-600">
        © 2026 PC Spend. Desarrollado por y para la comunidad técnica.
      </div>
    </footer>
  )
}

export default Footer