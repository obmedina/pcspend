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
  periSeleccionados, 
  aiPeriCustom,
  ramSeleccionada,
  ramCantidad,
  storageCantidades,
  txtNinguno,
  compartirImagen,
  descargarImagen,
  generarCanvas 
}) => {
  const formatPrecio = (valor) => valor.toFixed(moneda.id === 'JPY' ? 0 : 2);

  const [showShareModal, setShowShareModal] = useState(false);
  
  // ESTADO: Controla la visibilidad de la ventana de agradecimiento / donación
  const [showDonationModal, setShowDonationModal] = useState(false);

  // Lógica de Almacenamiento
  const storageActivos = ALMACENAMIENTO.filter(s => (storageCantidades[s.id] || 0) > 0);
  const totalVatiosStorage = storageActivos.reduce((sum, s) => sum + (s.consumo * storageCantidades[s.id]), 0);
  const textoStorage = storageActivos.map(s => `${s.name.split(' ')[0]} x${storageCantidades[s.id]}`).join(' + ') || txtNinguno;

  // Lógica de vatios de periféricos multielección para el cálculo de vatios totales del reporte
  const vatiosPerifericosReport = Object.keys(periSeleccionados || {}).reduce((total, id) => {
    if (periSeleccionados[id] === 1) {
      if (id === 'p6' && aiPeriCustom) return total + (aiPeriCustom.consumo || 25);
      const pFijo = p1 => p1.id === id;
      return total + (ALMACENAMIENTO.find(pFijo)?.consumo || 10); // fallback genérico por seguridad
    }
    return total;
  }, 0);

  const consumoTotalVatios = 
    (gpuSeleccionada?.consumo || 0) + 
    (cpuSeleccionada?.consumo || 0) + 
    (monitorSeleccionado?.consumo || 0) + 
    vatiosPerifericosReport +
    ((ramSeleccionada?.consumo || 0) * ramCantidad) + 
    totalVatiosStorage;

  const rangePercentage = Math.min(100, Math.max(0, (costeMensual / 50) * 100));
  const getIndicadorColor = () => {
    if (rangePercentage < 35) return 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.8)]';
    if (rangePercentage < 70) return 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]';
    return 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]';
  };

  const rawMsg = `¡Mi PC gaming me cuesta ${formatPrecio(costeMensual)}${moneda.sym}/mes de luz! Calcula el tuyo en pcspend.com ⚡`;
  const shareText = encodeURIComponent(rawMsg);
  const shareUrl = encodeURIComponent("https://pcspend.com");

  // INTERCEPTOR PARA EL BOTÓN SISTEMA COMPARTIR
  const handleShareSystem = async () => {
    const canvas = generarCanvas();
    if (navigator.share && canvas) {
      try {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (!blob) throw new Error("No se pudo generar el archivo de imagen");
        const file = new File([blob], 'pc-spend-report.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'PC Spend Report', text: rawMsg, url: 'https://pcspend.com', files: [file] });
          setShowDonationModal(true);
          return;
        }
        await navigator.share({ title: 'PC Spend Report', text: rawMsg, url: 'https://pcspend.com' });
        setShowDonationModal(true);
      } catch (error) {
        console.log("Menú nativo cancelado o no disponible, abriendo respaldo:", error);
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  // INTERCEPTOR PARA EL BOTÓN GUARDAR (DESCARGAR)
  const handleDescargarConAgradecimiento = () => {
    descargarImagen();
    setTimeout(() => {
      setShowDonationModal(true);
    }, 600);
  };

  const copiarEnlacePortapapeles = () => {
    navigator.clipboard.writeText("https://pcspend.com");
    alert("¡Enlace copiado al portapapeles!");
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
            {lang === 'EN' ? "BILL IMPACT" : "IMPACTO EN LA FACTURA"}
          </p>
        </div>
      </div>

      {/* 2. FILA MEDIA: CPU Y GPU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        <div className={`${cardBase} p-5 flex items-center gap-5`}>
          <img src={getReportImg('cpu_icon.png')} alt="CPU" className="w-10 h-10 object-contain opacity-90 filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.2)]" />
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

        <div className={`${cardBase} p-5 flex items-center gap-5`}>
          <img src={getReportImg('gpu_icon.png')} alt="GPU" className="w-10 h-10 object-contain opacity-90 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]" />
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

      {/* 3. FILA INFERIOR: DETALLES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-purple-400 uppercase block mb-1">MONITOR</span>
          <p className="text-sm font-black text-white truncate px-1 uppercase">{monitorSeleccionado ? monitorSeleccionado.name : txtNinguno}</p>
          <span className="text-[10px] font-bold text-slate-500">{monitorSeleccionado?.consumo || 0}W</span>
        </div>

        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-orange-400 uppercase block mb-1">PERIFÉRICOS</span>
          <p className="text-sm font-black text-white truncate px-1 uppercase">
            {Object.values(periSeleccionados || {}).some(v => v === 1) ? (lang === 'EN' ? 'CONNECTED' : 'CONECTADOS') : txtNinguno}
          </p>
          <span className="text-[10px] font-bold text-slate-500">{vatiosPerifericosReport}W</span>
        </div>

        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-emerald-400 uppercase block mb-1">ALMACENAMIENTO</span>
          <p className="text-sm font-black text-white truncate px-1 uppercase">{textoStorage}</p>
          <span className="text-[10px] font-bold text-slate-500">{totalVatiosStorage}W</span>
        </div>

        <div className={`${cardBase} p-4 text-center`}>
          <span className="text-[9px] font-black text-pink-400 uppercase block mb-1">RAM</span>
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
        <button 
          onClick={handleDescargarConAgradecimiento} 
          className="flex items-center justify-center gap-3 bg-[#1b2234] border border-slate-700 hover:bg-slate-800 text-white font-black py-4 rounded-xl transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          💾 {lang === 'EN' ? "SAVE" : "GUARDAR"}
        </button>
      </div>

      {/* MODAL DE RESPALDO MANUAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0f1422] border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-center">
            <button 
              onClick={() => { setShowShareModal(false); setShowDonationModal(true); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-black bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent uppercase tracking-tighter mb-1">
              Compartir tu setup
            </h3>
            <p className="text-xs text-slate-400 mb-6">Elige tu red social preferida.</p>

            <button
              onClick={() => { compartirImagen(); setShowShareModal(false); setShowDonationModal(true); }}
              className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black text-xs py-3.5 rounded-xl transition-all uppercase tracking-wider"
            >
              📋 Copiar Imagen del Informe
            </button>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <a onClick={() => { setShowShareModal(false); setShowDonationModal(true); }} href={`whatsapp://send?text=${shareText}%20${shareUrl}`} className="flex items-center justify-center gap-2 bg-[#128c7e]/20 border border-[#128c7e]/40 text-green-400 font-bold text-xs py-3 rounded-xl uppercase">🟢 WhatsApp</a>
              <a onClick={() => { setShowShareModal(false); setShowDonationModal(true); }} href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-white font-bold text-xs py-3 rounded-xl uppercase">𝕏 Twitter</a>
              <a onClick={() => { setShowShareModal(false); setShowDonationModal(true); }} href={`https://t.me/share/url?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#0088cc]/20 border border-[#0088cc]/40 text-sky-400 font-bold text-xs py-3 rounded-xl uppercase">🔵 Telegram</a>
              <a onClick={() => { setShowShareModal(false); setShowDonationModal(true); }} href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-xs py-3 rounded-xl uppercase">📘 Facebook</a>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL EMERGENTE: EDICIÓN EN TONOS AZULES/BLANCOS CON RAYO CYA ================= */}
      {showDonationModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#070d19] border border-cyan-500/30 rounded-3xl p-8 w-full max-w-lg shadow-[0_0_50px_rgba(6,182,212,0.15)] relative text-center border-t-cyan-500/50 animate-in scale-in duration-200">
            
            {/* Botón X de Cierre */}
            <button 
              onClick={() => setShowDonationModal(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 rounded-full text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>

            {/* Icono del Rayo Eléctrico Animado con Efecto Glow Azul de la Interfaz */}
            <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_25px_rgba(34,211,238,0.3)] animate-pulse">
              <Zap className="w-10 h-10 text-cyan-400 fill-cyan-400/20 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>

            {/* Título adaptado al degradado Blanco/Azul de PC Spend */}
            <h3 className="text-2xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent uppercase tracking-tight mb-3">
              ¡Gracias por usar PC Spend!
            </h3>
            
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed px-2">
              <p>
                He diseñado esta plataforma para que sea <span className="text-cyan-400 font-bold">gratuita</span> y <span className="text-cyan-400 font-bold">sin molestos anuncios intrusivos</span>. Mantener los servidores y mejorar los algoritmos requiere recursos.
              </p>
              <p className="text-slate-200 font-medium">
                Si te fue útil y quieres apoyar el desarrollo de nuevas funciones, considera <span className="text-cyan-300 font-semibold">invitarme a un café</span>. ¡Cualquier ayuda marca la diferencia!
              </p>
            </div>

            {/* Botón de Donación con Diseño Integrado a PC Spend (Glow Azul, Texto Blanco y Rayo) */}
            <div className="mt-8 pt-2">
              <a 
                href="https://www.buymeacoffee.com/pcspend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black px-8 py-4 rounded-xl transition-all shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] active:scale-95 text-xs uppercase tracking-wider"
              >
                <span>Invítame a un café | PC Spend</span>
                <Zap className="w-4 h-4 text-white fill-white" />
              </a>
            </div>

            <button 
              onClick={() => setShowDonationModal(false)}
              className="mt-5 text-[10px] font-bold text-slate-500 hover:text-slate-400 transition-colors uppercase tracking-widest block mx-auto hover:underline"
            >
              Quizás en otro momento
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Report;