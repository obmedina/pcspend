import React from 'react'

const Controls = ({ 
  t, 
  horas, setHoras, 
  precioKwh, setPrecioKwh, 
  moneda, 
  ajustarPrecio, 
  isVariableRate, setIsVariableRate
}) => {
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-16 border-t border-slate-800/50 pt-10 relative z-10">
      
      {/* CUADRO HORAS */}
      <div className="p-5 bg-slate-900/40 rounded-3xl border border-slate-800/60 flex flex-col justify-between min-h-[180px] backdrop-blur-sm shadow-xl">
        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">{t.hours}</p>
          <input 
            type="range" min="1" max="24" value={horas} 
            onChange={(e) => setHoras(parseInt(e.target.value))} 
            className="w-full accent-blue-500 mb-3 cursor-pointer" 
          />
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-xl mb-1">
            <span className="text-2xl font-black font-mono text-blue-400">{horas}h</span>
          </div>
        </div>
        <p className="text-[12px] text-slate-400 font-medium leading-snug text-center mt-2">{t.hoursDesc}</p>
      </div>

      {/* CUADRO PRECIO */}
      <div className="p-5 bg-slate-900/40 rounded-3xl border border-slate-800/60 flex flex-col justify-between min-h-[180px] backdrop-blur-sm shadow-xl">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-3 text-center tracking-[0.2em]">{t.price} ({moneda.sym}/kWh)</p>
          <div className="flex items-center justify-between bg-black/40 rounded-xl p-1 border border-slate-800/80 mb-3 max-w-xs mx-auto w-full">
            <button onClick={() => ajustarPrecio(-0.01)} className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg hover:text-red-400 font-black transition-colors">-</button>
            
            {/* CORRECCIÓN: Clases arbitrarias inyectadas al final de la línea para forzar la eliminación de flechas nativas */}
            <input 
              type="number" 
              step="0.01" 
              value={precioKwh} 
              onChange={(e) => setPrecioKwh(parseFloat(e.target.value) || 0)} 
              className="bg-transparent text-lg font-black text-center outline-none w-24 text-white font-mono appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
            />
            
            <button onClick={() => ajustarPrecio(0.01)} className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg hover:text-green-400 font-black transition-colors">+</button>
          </div>
          
          <div className="flex gap-2 h-8 max-w-xs mx-auto w-full"> 
            <button 
              onClick={() => setIsVariableRate(false)} 
              className={`flex-1 text-[10px] font-bold rounded-md border transition-all ${!isVariableRate ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/10' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}
            >
              {t.rateFixed}
            </button>
            <button 
              onClick={() => setIsVariableRate(true)} 
              className={`flex-1 text-[10px] font-bold rounded-md border transition-all ${isVariableRate ? 'bg-amber-600 border-amber-500 text-white shadow-md shadow-amber-600/10' : 'border-slate-800 text-slate-500 hover:text-slate-300'}`}
            >
              {t.rateVariable}
            </button>
          </div>
        </div>
        <p className="text-[12px] text-slate-400 font-medium leading-snug text-center mt-4">
          {isVariableRate ? t.rateDesc : t.priceDesc}
        </p>
      </div>

    </div>
  )
}

export default Controls;