import React from 'react';

// Helper para resolver dinámicamente las rutas de imágenes en el sticky usando Vite
const getReportImg = (name) => new URL(`../assets/report/${name}`, import.meta.url).href;

const StickyTotal = ({ 
  lang,
  costeMensual, 
  costeDiario, 
  moneda, 
  consumoTotal, 
  visible,
  gpuSeleccionada,
  cpuSeleccionada,
  monitorSeleccionado,
  periSeleccionado,
  ramSeleccionada,
  textoStorage,
  txtNinguno
}) => {

  const scrollToReport = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  const formatPrecio = (valor) => valor?.toFixed(moneda.id === 'JPY' ? 0 : 2) || "0";

  // MAPEO DE TEXTOS SEGURO EN BASE AL VALOR DE LANG
  const txtConsumo = 
    lang === 'EN' ? "CONSUMPTION" : 
    lang === 'FR' ? "CONSOMMATION" : 
    lang === 'JP' ? "消費量" : 
    lang === 'DE' ? "VERBRAUCH" : 
    lang === 'PT' ? "CONSUMO" : "CONSUMO";

  const txtCostoEstimado = 
    lang === 'EN' ? "ESTIMATED COST" : 
    lang === 'FR' ? "COÛT ESTIMÉ" : 
    lang === 'JP' ? "見積もりコスト" : 
    lang === 'DE' ? "GESCHÄTZTE KOSTEN" : 
    lang === 'PT' ? "CUSTO ESTIMADO" : "COSTO ESTIMADO";

  const txtMes = 
    lang === 'EN' ? "mo" : 
    lang === 'FR' ? "mois" : 
    lang === 'JP' ? "月" : 
    lang === 'DE' ? "Mon." : 
    lang === 'PT' ? "mês" : "mes";

  const txtDia = 
    lang === 'EN' ? "day" : 
    lang === 'FR' ? "jour" : 
    lang === 'JP' ? "日" : 
    lang === 'DE' ? "Tag" : 
    lang === 'PT' ? "dia" : "día";

  const txtBoton = 
    lang === 'EN' ? "View Report" : 
    lang === 'FR' ? "Voir le Rapport" : 
    lang === 'JP' ? "レポートを見る" : 
    lang === 'DE' ? "Bericht anzeigen" : 
    lang === 'PT' ? "Ver Relatório" : "Ver Informe";

  const pildorasActivas = [];
  
  if (cpuSeleccionada?.name) {
    pildorasActivas.push(
      <span key="cpu" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap flex items-center justify-center gap-1.5 h-full truncate">
        <img 
          src={getReportImg('cpu_icon.png')} 
          alt="CPU" 
          className="w-3.5 h-3.5 object-contain shrink-0" 
        />
        <span className="truncate">{cpuSeleccionada.name === 'OTRA' ? txtNinguno : cpuSeleccionada.name.replace('Ryzen', 'R')}</span>
      </span>
    );
  }
  if (gpuSeleccionada?.name) {
    pildorasActivas.push(
      <span key="gpu" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap flex items-center justify-center gap-1.5 h-full truncate">
        <img 
          src={getReportImg('gpu_icon.png')} 
          alt="GPU" 
          className="w-3.5 h-3.5 object-contain shrink-0" 
        />
        <span className="truncate">{gpuSeleccionada.name === 'OTRA' ? txtNinguno : gpuSeleccionada.name.replace('RTX', '')}</span>
      </span>
    );
  }
  if (monitorSeleccionado?.name) {
    pildorasActivas.push(
      <span key="mon" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap block text-center truncate">
        🖥️ {monitorSeleccionado.name.split(' ')[0]}
      </span>
    );
  }
  if (periSeleccionado?.name) {
    pildorasActivas.push(
      <span key="peri" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap block text-center truncate">
        ⌨️ {periSeleccionado.name.split(' ')[0]}
      </span>
    );
  }
  if (ramSeleccionada) {
    pildorasActivas.push(
      <span key="ram" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap block text-center truncate">
        💾 RAM
      </span>
    );
  }
  if (textoStorage) {
    pildorasActivas.push(
      <span key="st" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap block text-center truncate" title={textoStorage}>
        💽 {textoStorage}
      </span>
    );
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 transition-all duration-500 transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-6xl mx-auto bg-[#111726]/85 backdrop-blur-lg border border-slate-800/80 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* COLUMNA 1 (IZQUIERDA): REJILLA FIJA DE 3x2 COMPONENTE QUE NUNCA CAMBIA DE TAMAÑO */}
        <div className="w-full md:w-[320px] lg:w-[380px] shrink-0">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-6 flex items-center justify-stretch">
                {pildorasActivas[index] ? (
                  <div className="w-full h-full">{pildorasActivas[index]}</div>
                ) : (
                  <div className="w-full h-full bg-slate-900/10 border border-transparent rounded-lg"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA 2 (CENTRO): LOS VATIOS TOTALES INDEPENDIENTES CON ANCHO FIJO */}
        <div className="flex flex-col items-center justify-center px-4 md:border-x md:border-slate-800/60 w-[140px] shrink-0">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">
            {txtConsumo}
          </p>
          <span className="text-xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-mono whitespace-nowrap">
            ⚡ {consumoTotal}W
          </span>
        </div>

        {/* COLUMNA 3 (DERECHA): AREA DE PRECIOS Y BOTÓN CON ANCHO MÍNIMO AMPLIO */}
        <div className="flex items-center gap-5 justify-between w-full md:w-auto md:justify-end flex-grow md:min-w-[420px]">
          
          <div className="text-right min-w-[210px] lg:min-w-[240px] shrink-0">
            {/* CORRECCIÓN DE LA VARIABLE: txtCostoEstimado */}
            <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-1 whitespace-nowrap">
              {txtCostoEstimado}
            </p>
            <div className="flex items-baseline gap-1.5 justify-end">
              <span className="text-4xl font-black tracking-tight bg-gradient-to-b from-white to-cyan-300 bg-clip-text text-transparent font-mono leading-none">
                {formatPrecio(costeMensual)}{moneda.sym}
              </span>
              <span className="text-cyan-400/70 text-xs font-bold whitespace-nowrap">
                /{txtMes}
              </span>
              <span className="text-slate-800 font-light px-0.5">|</span>
              <span className="text-xs font-medium font-mono text-slate-400/40 whitespace-nowrap">
                {formatPrecio(costeDiario)}{moneda.sym}/{txtDia}
              </span>
            </div>
          </div>
          
          <button 
            onClick={scrollToReport}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs min-w-[115px] text-center py-3 rounded-xl transition-all active:scale-95 uppercase tracking-wider shadow-lg shadow-cyan-500/10 whitespace-nowrap shrink-0 px-2"
          >
            {txtBoton}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StickyTotal;