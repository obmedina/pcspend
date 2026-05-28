import React from 'react'
import { Link } from 'react-router-dom'

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#0a0f24] text-slate-300 p-8 md:p-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-8">Privacidad y Aviso Legal</h1>
        <div className="space-y-6 text-sm leading-relaxed">
          <p>PC Spend es una herramienta técnica independiente. No almacenamos registros de usuarios ni guardamos cookies de rastreo.</p>
          
          <h2 className="text-xl font-bold text-blue-400">Donaciones</h2>
          <p>Utilizamos pasarelas externas para las donaciones. No tenemos acceso a tus datos bancarios.</p>
          
          <h2 className="text-xl font-bold text-blue-400">IA y Datos</h2>
          <p>Para la funcionalidad de "AI SCAN", enviamos la URL pública a Google Gemini para extraer datos técnicos. No se envían datos personales.</p>
          
          <Link to="/" className="block mt-10 text-blue-400 hover:text-white transition-colors font-bold">
            ← Volver a la calculadora
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Privacy