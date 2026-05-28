import React, { useState } from 'react';
import { ALMACENAMIENTO } from '../data/hardware';
import { Zap } from 'lucide-react'; 

// Helper para resolver dinámicamente las rutas de imágenes en el reporte usando Vite
const getReportImg = (name) => new URL(`../assets/report/${name}`, import.meta.url).href;

const Report = ({ 
  t, 
  lang, 
  theme, 
  costeMensual, 
  costeDiario, 
  moneda, 
  gpuSeleccionada, 
  cpuSeleccionada, 
  monitorSeleccionado, 
  periSeleccionado, 
  ramSeleccionada,
  ramCantidad,
  storageCantidades,
  txtNinguno,
  compartirImagen,
  descargarImagen,
  generarCanvas // <-- RECIBIMOS LA PROP DE APP.JSX
}) => {
  const formatPrecio = (valor) => valor.toFixed(moneda.id === 'JPY' ? 0 : 2);

  // Estado de respaldo para entornos de escritorio incompatibles (como Chrome en Windows/Linux)
  const [showShareModal, setShowShareModal] = useState(false);

  // Lógica de Almacenamiento
  const storageActivos = ALMACENAMIENTO.filter(s => (storageCantidades[s.id] || 0) > 0);
  const totalVatiosStorage = storageActivos.reduce((sum, s) => sum + (s.consumo * storageCantidades[s.id]), 0);
  const textoStorage = storageActivos.map(s => `${s.name.split(' ')[0]} x${storageCantidades[s.id]}`).join(' + ') || txtNinguno;

  // Lógica para calcular los vatios totales consumidos
  const consumoTotalVatios = 
    (gpuSeleccionada?.consumo || 0) + 
    (cpuSeleccionada?.consumo || 0) + 
    (monitorSeleccionado?.consumo || 0) + 
    (periSeleccionado?.consumo || 0) + 
    ((ramSeleccionada?.consumo || 0) * ramCantidad) + 
    totalVatiosStorage;

  // Barra mide el dinero al mes. 50€/mes es el 100% de la barra.
  const limiteGastoMaximo = 50; 
  const rangePercentage = Math.min(100, Math.max(0, (costeMensual / limiteGastoMaximo) * 100));

  const getIndicadorColor = () => {
    if (rangePercentage < 35) return 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]';
    if (rangePercentage < 70) return 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]';
    return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]';
  };

  // Mensaje optimizado en texto plano para redes sociales
  const rawMsg = lang === 'EN' ? `My gaming PC costs me ${formatPrecio(costeMensual)}${moneda.sym}/month in electricity! Check yours on pcspend.com ⚡` :
                 lang === 'FR' ? `Mon PC gamer me coûte ${formatPrecio(costeMensual)}${moneda.sym}/mois en électricité ! Calculez le vôtre sur pcspend.com ⚡` :
                 lang === 'JP' ? `私のゲーミングPCの電気代は月額 ${formatPrecio(costeMensual)}${moneda.sym} です！ pcspend.com で確認する ⚡` :
                 lang === 'DE' ? `Mein Gaming-PC kostet mich ${formatPrecio(costeMensual)}${moneda.sym}/Monat an Strom! Prüfe deinen auf pcspend.com ⚡` :
                 lang === 'PT' ? `Meu PC gamer me custa ${formatPrecio(costeMensual)}${moneda.sym}/mês em eletricidade! Calcule o seu em pcspend.com ⚡` :
                 `¡Mi PC gaming me cuesta ${formatPrecio(costeMensual)}${moneda.sym}/mes de luz! Calcula el tuyo en pcspend.com ⚡`;

  const shareText = encodeURIComponent(rawMsg);
  const shareUrl = encodeURIComponent("https://pcspend.com");

  // ================= MODIFICACIÓN CLAVE: COMPARTIR LA IMAGEN REAL GENERADA POR EL CANVAS =================
  const handleShareSystem = async () => {
    // Generamos el canvas dinámico con los datos actuales usando la función heredada de App.jsx
    const canvas = generarCanvas();
    
    if (navigator.share && canvas) {
      try {
        // Extraemos el blob del canvas mediante la promesa
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error("No se pudo generar el archivo de imagen");

        // Creamos un archivo real compatible con el sistema operativo que contiene el diseño de la tarjeta
        const file = new File([blob], 'pc-spend-report.png', { type: 'image/png' });

        // Si el dispositivo acepta compartir archivos (móviles, tablets, Safari Mac, etc.)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'PC Spend Report',
            text: rawMsg,
            url: 'https://pcspend.com',
            files: [file] // <-- SE COMPARTE LA IMAGEN GENERADA DEL INFORME CON TODO EL DISEÑO
          });
          return;
        }
        
        // Fallback nativo si solo acepta texto
        await navigator.share({
          title: 'PC Spend Report',
          text: rawMsg,
          url: 'https://pcspend.com'
        });
        
      } catch (error) {
        console.log("Menú nativo cancelado o no disponible en este entorno, abriendo respaldo:", error);
        setShowShareModal(true);
      }
    } else {
      // Si entran desde ordenadores de sobremesa que no tienen menú de compartir nativo
      setShowShareModal(true);
    }
  };

  const copiarEnlacePortapapeles = () => {
    navigator.clipboard.writeText("https://pcspend.com");
    alert(lang === 'EN' ? "Link copied to clipboard!" : "¡Enlace copiado al portapapeles!");
  };

  const cardBase = "bg-[#1b2234]/90 backdrop-blur-md border border-slate-800/50 shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-2xl relative z-10";

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 font-sans relative group">
      
      {/* Resplandores de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-r from-blue-600/15 via-indigo-500/5 to-purple-600/15 rounded-[5rem] blur-[100px] pointer-events-none opacity-90 transition-opacity duration-700 group-hover:opacity-100"></div>
      <div className="absolute top-12 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 1. CUADRO SUPERIOR: PRECIO TOTAL Y BARRA FINANCIERA */}
      <div className={`${cardBase} p-8 overflow-hidden`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
          <div className="flex items-baseline gap-3">
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-cyan-400">
              {formatPrecio(costeMensual)}{moneda.sym}
            </h2>
            <span className="text-slate-500 text-xl font-bold">{t.perMonth || "/ mes"}</span>
          </div>
          
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl backdrop-blur-sm flex items-center gap-2">
               <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
               <p className="text-amber-500 font-black text-xl font-mono leading-none">
                 {consumoTotalVatios}W
               </p>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl backdrop-blur-sm">
               <p className="text-green-400 font-black text-xl leading-none">
                 {formatPrecio(costeDiario)}{moneda.sym} {t.perDay || "al día"}
               </p>
            </div>
          </div>
        </div>

        {/* Barra de Estrés del Gasto */}
        <div className="space-y-3 px-2 relative z-10">
          <div className="w-full h-2 bg-black/40 rounded-full relative">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-green-500 via-amber-400 to-red-500 transition-all duration-1000"
              style={{ width: `${rangePercentage}%` }}
            ></div>
            <div 
              className="absolute -top-1 transition-all duration-1000"
              style={{ left: `calc(${rangePercentage}% - 8px)` }}
            >
              <div className={`w-4 h-4 bg-white rounded-full border-4 transition-all duration-500 ${getIndicadorColor()}`}></div>
            </div>
          </div>
          <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            {lang === 'EN' ? "BILL IMPACT" : lang === 'FR' ? "IMPACT SUR LA FACTURE" : lang === 'JP' ? "請求書への影響" : lang === 'DE' ? "RECHNUNGS-IMPACT" : lang === 'PT' ? "IMPACTO NA FATURA" : "IMPACTO EN LA FACTURA"}
          </p>
        </div>
      </div>

      {/* 2. FILA MEDIA: CPU Y GPU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {/* FILA CPU */}
        <div className={`${cardBase} p-5 flex items-center gap-5`}>
          <img 
            src={getReportImg('cpu_icon.png')} 
            alt="CPU Icon" 
            className="w-10 h-10 object-contain opacity-90 filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.2)]"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">CPU</span>
              <span className="text-xs font-black text-slate-100 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {cpuSeleccionada?.consumo || 0}W
              </span>
            </div>
            <p className="text-xl font-black text-white leading-none uppercase">
              {cpuSeleccionada ? cpuSeleccionada.name : txtNinguno}
            </p>
          </div>
        </div>

        {/* FILA GPU */}
        <div className={`${cardBase} p-5 flex items-center gap-5`}>
          <img 
            src={getReportImg('gpu_icon.png')} 
            alt="GPU Icon" 
            className="w-10 h-10 object-contain opacity-90 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]"
          />
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">GPU</span>
              <span className="text-xs font-black text-slate-100 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                {gpuSeleccionada?.consumo || 0}W
              </span>
            </div>
            <p className="text-xl font-black text-white leading-none uppercase">
              {gpuSeleccionada ? gpuSeleccionada.name : txtNinguno}
            </p>
          </div>
        </div>
      </div>

      {/* 3. FILA INFERIOR: LOS 4 PEQUEÑOS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-purple-400 uppercase block mb-1">
            {t.step3 ? t.step3.replace(/[\d.\s]/g, '') : "MONITOR"}
          </span>
          <p className="text-sm font-black text-white truncate px-1 uppercase">{monitorSeleccionado ? monitorSeleccionado.name : txtNinguno}</p>
          <span className="text-[10px] font-bold text-slate-500">{monitorSeleccionado?.consumo || 0}W</span>
        </div>

        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-orange-400 uppercase block mb-1">
            {t.step4 ? t.step4.replace(/[\d.\s]/g, '') : "PERIFÉRICOS"}
          </span>
          <p className="text-sm font-black text-white truncate px-1 uppercase">{periSeleccionado ? periSeleccionado.name : txtNinguno}</p>
          <span className="text-[10px] font-bold text-slate-500">{periSeleccionado?.consumo || 0}W</span>
        </div>

        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-emerald-400 uppercase block mb-1">{t.storage || "ALMACENAMIENTO"}</span>
          <p className="text-sm font-black text-white truncate px-1 uppercase">{textoStorage}</p>
          <span className="text-[10px] font-bold text-slate-500">{totalVatiosStorage}W</span>
        </div>

        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-pink-400 uppercase block mb-1">{t.ram || "RAM"}</span>
          <p className="text-sm font-black text-white truncate px-1 uppercase">
            {ramSeleccionada ? `${ramSeleccionada.name.split(' ')[0]} x${ramCantidad}` : txtNinguno}
          </p>
          <span className="text-[10px] font-bold text-slate-500">{(ramSeleccionada?.consumo || 0) * ramCantidad}W</span>
        </div>
      </div>

      {/* 4. BOTONES DE ACCIÓN FINAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 relative z-10">
        <button 
          onClick={handleShareSystem} 
          className="flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-xl transition-all active:scale-95 text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        >
          🔗 {t.share || "COMPARTIR INFORME"}
        </button>
        <button onClick={descargarImagen} className="flex items-center justify-center gap-3 bg-[#1b2234] border border-slate-700 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all active:scale-95 text-sm uppercase tracking-widest">
          💾 {lang === 'EN' ? "SAVE" : lang === 'FR' ? "SAUVEGARDER" : lang === 'JP' ? "保存する" : lang === 'DE' ? "SPEICHERN" : lang === 'PT' ? "SALVAR" : "GUARDAR"}
        </button>
      </div>

      {/* MODAL DE RESPALDO MANUAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[#0f1422] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-center animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            <h3 className="text-lg font-black bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent uppercase tracking-tighter mb-1">
              {lang === 'EN' ? "Share your build" : lang === 'FR' ? "Partager votre config" : lang === 'JP' ? "構成を共有する" : lang === 'DE' ? "Build teilen" : lang === 'PT' ? "Compartilhar config" : "Compartir tu setup"}
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-normal">
              {lang === 'EN' ? "Choose your favorite network to show your electricity spending." : "Elige tu red social preferida para mostrar tu consumo estimado."}
            </p>

            <button
              onClick={() => { compartirImagen(); setShowShareModal(false); }}
              className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-xs py-3.5 rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-cyan-500/15"
            >
              📋 {lang === 'EN' ? "Copy Report Image" : "Copiar Imagen del Informe"}
            </button>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <a 
                href={`whatsapp://send?text=${shareText}%20${shareUrl}`}
                className="flex items-center justify-center gap-2 bg-[#128c7e]/20 border border-[#128c7e]/40 hover:bg-[#128c7e]/30 text-green-400 font-bold text-xs py-3 rounded-xl transition-all uppercase tracking-wider"
              >
                🟢 WhatsApp
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all uppercase tracking-wider"
              >
                𝕏 Twitter
              </a>
              <a 
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0088cc]/20 border border-[#0088cc]/40 hover:bg-[#0088cc]/30 text-sky-400 font-bold text-xs py-3 rounded-xl transition-all uppercase tracking-wider"
              >
                🔵 Telegram
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#3b5998]/20 border border-[#3b5998]/40 hover:bg-[#3b5998]/30 text-indigo-400 font-bold text-xs py-3 rounded-xl transition-all uppercase tracking-wider"
              >
                📘 Facebook
              </a>
            </div>

            <div className="border-t border-slate-900 pt-4 flex gap-2">
              <input 
                type="text" 
                readOnly 
                value="pcspend.com" 
                className="flex-grow bg-slate-950 p-2.5 rounded-xl text-xs text-slate-400 border border-slate-900 outline-none text-center font-mono font-bold select-all"
              />
              <button 
                onClick={copiarEnlacePortapapeles}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 font-black text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0"
              >
                {lang === 'EN' ? "Copy" : "Copiar"}
              </button>
            </div>

            <button 
              onClick={() => { descargarImagen(); setShowShareModal(false); }}
              className="mt-4 text-[11px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest block mx-auto underline decoration-slate-600 hover:decoration-slate-400"
            >
              {lang === 'EN' ? "Or download image report" : "O descargar reporte como imagen"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Report;