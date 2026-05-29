import React from 'react';

// Helper para resolver dinámicamente las rutas de imágenes en el sticky usando Vite
const getReportImg = (name) => new URL(`../assets/report/${name}`, import.meta.url).href;

const StickyTotal = ({ 
  lang = 'ES',
  costeMensual = 0, 
  costeDiario = 0, 
  moneda = { sym: '€', id: 'EUR' }, 
  consumoTotal = 0, 
  visible = true,
  gpuSeleccionada = null,
  cpuSeleccionada = null,
  monitorSeleccionado = null,
  textoPerifericos = '',
  ramSeleccionada = null,
  textoStorage = '',
  txtNinguno = 'NINGUNO'
}) => {

  const scrollToReport = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  const formatPrecio = (valor) => valor?.toFixed(moneda?.id === 'JPY' ? 0 : 2) || "0";

  // MAPEO DE TEXTOS SEGURO EN BASE AL VALOR DE LANG
  const txtConsumo = 
    lang === 'EN' ? "CONS." : 
    lang === 'FR' ? "CONS." : 
    lang === 'JP' ? "消費" : 
    lang === 'DE' ? "VERB." : 
    lang === 'PT' ? "CONS." : "CONS.";

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
    lang === 'EN' ? "View" : 
    lang === 'FR' ? "Voir" : 
    lang === 'JP' ? "見る" : 
    lang === 'DE' ? "Show" : 
    lang === 'PT' ? "Ver" : "Ver";

  const pildorasActivas = [];
  
  if (cpuSeleccionada?.name) {
    pildorasActivas.push(
      <span key="cpu" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap flex items-center justify-center gap-1.5 h-full truncate">
        <img src={getReportImg('cpu_icon.png')} alt="CPU" className="w-3.5 h-3.5 object-contain shrink-0" />
        <span className="truncate">{cpuSeleccionada.name === 'OTRA' ? txtNinguno : cpuSeleccionada.name.replace('Ryzen', 'R')}</span>
      </span>
    );
  }
  if (gpuSeleccionada?.name) {
    pildorasActivas.push(
      <span key="gpu" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap flex items-center justify-center gap-1.5 h-full truncate">
        <img src={getReportImg('gpu_icon.png')} alt="GPU" className="w-3.5 h-3.5 object-contain shrink-0" />
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
  if (textoPerifericos && textoPerifericos !== txtNinguno) {
    pildorasActivas.push(
      <span key="peri" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap block text-center truncate">
        ⌨️ {textoPerifericos}
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
  if (textoStorage && textoStorage !== txtNinguno) {
    pildorasActivas.push(
      <span key="st" className="text-[10px] font-bold bg-slate-900/60 border border-slate-800/80 text-slate-400 px-2 py-0.5 rounded-lg whitespace-nowrap block text-center truncate">
        💽 {textoStorage}
      </span>
    );
  }

  return (
    <div className={`fixed bottom-3 left-4 right-4 md:bottom-0 md:left-0 md:right-0 z-50 mx-auto max-w-[290px] md:max-w-6xl transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
      <div className="bg-[#111726]/95 backdrop-blur-xl border border-slate-800/80 shadow-[0_6px_24px_rgba(0,0,0,0.5)] rounded-full md:rounded-2xl p-1 md:p-4 flex flex-row items-center justify-between gap-1.5 md:gap-6 h-9 md:h-auto w-full">
        
        {/* COLUMNA 1 (IZQUIERDA): SÓLO PC */}
        <div className="hidden md:block w-[220px] lg:w-[280px] shrink-0">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-6 flex items-center justify-stretch">
                {pildorasActivas[index] ? <div className="w-full h-full">{pildorasActivas[index]}</div> : <div className="w-full h-full bg-slate-900/10 border border-transparent rounded-lg"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA 2: LOS VATIOS MINI */}
        <div className="flex flex-row md:flex-col items-center justify-center pl-2 pr-1 md:px-4 md:border-x md:border-slate-800/60 shrink-0 gap-1 md:gap-0">
          <p className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{txtConsumo}</p>
          <span className="text-[10px] md:text-xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-mono whitespace-nowrap">
            {consumoTotal}W
          </span>
        </div>

        {/* COLUMNA 3 (DERECHA): ÁREA DE PRECIOS ADAPTADA */}
        <div className="flex items-center gap-1.5 md:gap-5 justify-end flex-1 md:flex-grow md:min-w-[420px] min-w-0 pr-1">
          <div className="text-right flex-1 md:flex-initial min-w-0">
            <div className="flex items-baseline gap-0.5 justify-end">
              <span className="text-[11px] md:text-4xl font-black tracking-tight bg-gradient-to-b from-white to-cyan-300 bg-clip-text text-transparent font-mono leading-none">
                {formatPrecio(costeMensual)}{moneda?.sym || '€'}
              </span>
              <span className="text-cyan-400/70 text-[7px] md:text-xs font-bold whitespace-nowrap">/{txtMes}</span>
              <span className="hidden md:inline text-slate-800 font-light px-0.5">|</span>
              <span className="hidden md:inline text-xs font-medium font-mono text-slate-400/40 whitespace-nowrap">
                {formatPrecio(costeDiario)}{moneda?.sym || '€'}/{txtDia}
              </span>
            </div>
          </div>
          
          {/* MICRO BOTÓN REDONDEADO (w-6 h-6) */}
          <button 
            onClick={scrollToReport}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[10px] md:text-xs w-6 h-6 md:w-auto md:min-w-[115px] md:h-auto flex items-center justify-center rounded-full md:rounded-xl transition-all active:scale-95 uppercase tracking-wider shadow-md shadow-cyan-500/10 shrink-0"
          >
            <span className="hidden md:inline">{txtBoton}</span>
            <span className="inline md:hidden text-[9px]">✨</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default StickyTotal;