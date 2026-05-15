const Controls = ({ 
  t, 
  horas, setHoras, 
  precioKwh, setPrecioKwh, 
  moneda, ajustarPrecio, 
  isLoading, handleAnalizarLink,
  inputLink, setInputLink,
  isVariableRate, setIsVariableRate 
}) => {
  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16 border-t border-slate-800/50 pt-10">
      
      {/* CUADRO HORAS */}
      <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col justify-between min-h-[180px]">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-tighter">{t.hours} ({horas}h)</p>
          <input 
            type="range" min="1" max="24" value={horas} 
            onChange={(e) => setHoras(parseInt(e.target.value))} 
            className="w-full accent-blue-500 mb-4" 
          />
        </div>
        <p className="text-[12px] text-slate-400 italic leading-snug">{t.hoursDesc}</p>
      </div>

      {/* CUADRO PRECIO */}
      <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col justify-between min-h-[180px]">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">{t.price} ({moneda.sym}/kWh)</p>
          <div className="flex items-center justify-between bg-black/40 rounded-xl p-1 border border-slate-800 mb-3">
            <button onClick={() => ajustarPrecio(-0.01)} className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg hover:text-red-400 font-bold">-</button>
            <input type="number" step="0.01" value={precioKwh} onChange={(e) => setPrecioKwh(parseFloat(e.target.value) || 0)} className="bg-transparent text-lg font-black text-center outline-none w-20" />
            <button onClick={() => ajustarPrecio(0.01)} className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded-lg hover:text-green-400 font-bold">+</button>
          </div>
          
          <div className="flex gap-2 h-8"> 
            <button 
              onClick={() => setIsVariableRate(false)} 
              className={`flex-1 text-[10px] font-bold rounded-md border transition-all ${!isVariableRate ? 'bg-blue-600 border-blue-500' : 'border-slate-800 text-slate-500'}`}
            >
              {t.rateFixed}
            </button>
            <button 
              onClick={() => setIsVariableRate(true)} 
              className={`flex-1 text-[10px] font-bold rounded-md border transition-all ${isVariableRate ? 'bg-amber-600 border-amber-500' : 'border-slate-800 text-slate-500'}`}
            >
              {t.rateVariable}
            </button>
          </div>
        </div>
        <p className="text-[12px] text-slate-400 italic leading-snug mt-2">
          {isVariableRate ? t.rateDesc : t.priceDesc}
        </p>
      </div>

      {/* CUADRO AI SCAN */}
      <div className="p-5 bg-slate-900/80 rounded-3xl border border-slate-800 flex flex-col justify-between min-h-[180px]">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">AI {t.scan}</p>
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={inputLink} 
              onChange={(e) => setInputLink(e.target.value)} 
              placeholder={t.placeholder} 
              disabled={isLoading} // <-- Bloqueado mientras carga
              className={`flex-1 bg-slate-950 p-2 rounded-xl text-xs border border-slate-800 text-white outline-none focus:border-blue-500 transition-opacity ${isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} 
            />
            <button 
              onClick={handleAnalizarLink} 
              disabled={isLoading} 
              className={`px-3 rounded-xl font-bold text-[10px] uppercase transition-all min-w-[70px] ${isLoading ? 'bg-slate-700 animate-pulse cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
            >
              {isLoading ? "..." : t.scan}
            </button>
          </div>
        </div>
        <p className="text-[12px] text-slate-400 italic leading-snug">{t.scanDesc}</p>
      </div>
    </div>
  )
}

export default Controls