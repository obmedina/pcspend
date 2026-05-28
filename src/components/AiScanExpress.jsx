import React from 'react';

const AiScanExpress = ({ t, inputLink, setInputLink, isLoading, handleAnalizarLink, scanStatus }) => {
  return (
    <div className="max-w-5xl mx-auto mb-12 relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-xl rounded-3xl pointer-events-none"></div>
      
      {/* CORRECCIÓN: items-stretch en móvil e items-center en escritorio para que nada baile verticalmente */}
      <div className="bg-[#111726]/40 backdrop-blur-md border border-slate-800/80 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between relative z-10">
        
        {/* Texto lateral */}
        {/* CORRECCIÓN: Ampliado el ancho máximo de max-w-xs a max-w-md para que el portugués/francés quepan perfectamente */}
        <div className="w-full md:max-w-md text-left shrink-0">
          <p className="text-xs font-black text-cyan-400 tracking-widest uppercase mb-1">⚡ AI {t.scan}</p>
          <p className="text-[11px] text-slate-400 leading-snug">{t.scanDesc}</p>
        </div>

        {/* Input */}
        <div className="w-full flex-grow flex flex-col justify-center">
          <div className="flex gap-2 w-full">
            <input 
              type="text" 
              value={inputLink} 
              onChange={(e) => setInputLink(e.target.value)} 
              placeholder={t.placeholder} 
              disabled={isLoading} 
              className={`flex-grow bg-slate-950/80 p-3 rounded-xl text-xs border border-slate-800/80 text-white outline-none focus:border-cyan-500/80 transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} 
            />
            <button 
              onClick={handleAnalizarLink} 
              disabled={isLoading} 
              className={`px-5 rounded-xl font-black text-xs uppercase tracking-wider transition-all min-w-[95px] ${isLoading ? 'bg-slate-700 animate-pulse cursor-not-allowed' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/10'}`}
            >
              {isLoading ? "..." : t.scan}
            </button>
          </div>

          {scanStatus && (
            <p className={`text-[11px] font-bold mt-2 tracking-tight transition-all leading-none text-left pl-1 ${
              scanStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}>
              {scanStatus.type === 'success' ? '✅' : '❌'} {scanStatus.text}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AiScanExpress;