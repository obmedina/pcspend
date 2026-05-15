const Report = ({ 
  t, 
  theme, 
  costeMensual, 
  costeDiario, 
  moneda, 
  gpuSeleccionada, 
  cpuSeleccionada, 
  monitorSeleccionado, 
  periSeleccionado, 
  datoViralActivo,
  compartirImagen,
  descargarImagen
}) => {
  const formatPrecio = (valor) => valor.toFixed(moneda.id === 'JPY' ? 0 : 2);

  // Clase para los nombres de los componentes (tamaño estándar, 2 líneas)
  const hardwareNameClass = "text-[12px] font-bold text-slate-100 leading-tight line-clamp-2 min-h-[32px] flex items-center";
  
  // Clase para los TÍTULOS (GPU, CPU, etc.) - Más grandes y marcados
  const titleClass = "text-[13px] font-black uppercase tracking-tighter";

  return (
    <div className="max-w-xl mx-auto">
      {/* Tarjeta Principal del Informe */}
      <div 
        className="p-8 rounded-[3rem] bg-[#0c1222] border text-center mb-6 relative overflow-hidden shadow-2xl transition-all duration-500" 
        style={{ borderColor: theme.primary, boxShadow: `0 20px 50px ${theme.shadow}` }}
      >
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: theme.primary }}></div>
        
        <h2 className="text-7xl font-black leading-none" style={{ color: theme.primary }}>
          {formatPrecio(costeMensual)}{moneda.sym}
        </h2>
        <p className="text-slate-600 text-xl font-light uppercase tracking-widest">{t.perMonth}</p>
        
        <p className="text-green-500/60 font-bold mt-2 text-sm italic">
          {formatPrecio(costeDiario)}{moneda.sym} {t.perDay}
        </p>

        {/* Resumen del Hardware */}
        <div className="grid grid-cols-2 gap-3 mt-8 text-left mb-6">
          
          {/* GPU */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[95px]">
            <div className="flex justify-between items-center mb-2">
              <p className={titleClass} style={{ color: theme.primary }}>GPU</p>
              <span className="text-[10px] font-black text-white/30">{gpuSeleccionada.consumo}W</span>
            </div>
            <p className={hardwareNameClass}>{gpuSeleccionada.name}</p>
          </div>

          {/* CPU */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[95px]">
            <div className="flex justify-between items-center mb-2">
              <p className={`${titleClass} text-blue-500`}>CPU</p>
              <span className="text-[10px] font-black text-white/30">{cpuSeleccionada.consumo}W</span>
            </div>
            <p className={hardwareNameClass}>{cpuSeleccionada.name}</p>
          </div>

          {/* MONITOR */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[95px]">
            <div className="flex justify-between items-center mb-2">
              <p className={`${titleClass} text-purple-500`}>
                {t.step3.includes('.') ? t.step3.split('.')[1].trim() : t.step3}
              </p>
              <span className="text-[10px] font-black text-white/30">{monitorSeleccionado.consumo}W</span>
            </div>
            <p className={hardwareNameClass}>{monitorSeleccionado.name}</p>
          </div>

          {/* PERIFÉRICOS */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col justify-between min-h-[95px]">
            <div className="flex justify-between items-center mb-2">
              <p className={`${titleClass} text-orange-500`}>
                {t.step4.includes('.') ? t.step4.split('.')[1].trim() : t.step4}
              </p>
              <span className="text-[10px] font-black text-white/30">{periSeleccionado.consumo}W</span>
            </div>
            <p className={hardwareNameClass}>{periSeleccionado.name}</p>
          </div>

        </div>

        {/* Dato Curioso / Viral */}
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
           <p className="text-sm italic text-slate-300">"{datoViralActivo}"</p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="grid grid-cols-4 gap-3">
        <button 
          onClick={compartirImagen} 
          className="col-span-3 text-white font-bold py-5 rounded-3xl transition-all shadow-xl text-xl uppercase flex justify-center items-center gap-3 active:scale-95" 
          style={{ backgroundColor: theme.primary }}
        >
          🔗 {t.share}
        </button>
        <button 
          onClick={descargarImagen} 
          className="col-span-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 rounded-3xl transition-all shadow-xl text-xl flex justify-center items-center active:scale-95"
        >
          💾
        </button>
      </div>
    </div>
  );
};

export default Report;