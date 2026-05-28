import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({ t }) => {
  return (
    <footer className="mt-20 py-12 border-t border-slate-800/60 bg-[#0a0f1d]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Columna 1: Branding */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-white">PC Spend</h3>
          <p className="text-slate-500 text-sm">
            {t.disclaimer || "Calculadora de consumo energético para setups de alto rendimiento."}
          </p>
        </div>

        {/* Columna 2: Sobre nosotros */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-300">Sobre nosotros</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            PC Spend es una herramienta independiente, sin anuncios ni rastreo de datos. 
            Si te resulta útil y quieres apoyar el desarrollo de más herramientas técnicas, 
            puedes <a href="https://buymeacoffee.com/tu-usuario" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">invitarnos a un café aquí</a>.
          </p>
        </div>

        {/* Columna 3: Contacto */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-300">Contacto</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li>Email: dev@pcspend.com</li>
            <li>GitHub: /tu-usuario</li>
          </ul>
        </div>

        {/* Columna 4: Otros Micro-SaaS */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-300">Mis otras webs</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><a href="https://ejemplo1.com" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Calculadora PSU</a></li>
            <li><Link to="/privacy" className="hover:text-blue-400 transition-colors">Política de Privacidad</Link></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800/40 text-center text-xs text-slate-600">
        © 2026 PC Spend. Desarrollado por y para para la comunidad técnica.
      </div>
    </footer>
  )
}

export default Footer