import React from 'react'
import { GPUS, CPUS, MONITORES, PERIFERICOS, RAM, ALMACENAMIENTO } from '../data/hardware'

const HardwareGrid = ({ 
  t, 
  theme, 
  gpuSeleccionada, setGpuSeleccionada, 
  cpuSeleccionada, setCpuSeleccionada,
  monitorSeleccionado, setMonitorSeleccionado,
  periSeleccionados, setPeriSeleccionados,
  aiPeriCustom, setAiPeriCustom,
  ramSeleccionada, setRamSeleccionada,
  ramCantidad, setRamCantidad,
  storageCantidades, setStorageCantidades,
  txtNinguno
}) => {
  
  const updateStorageCount = (id, delta) => {
    setStorageCantidades(prev => ({
      ...prev,
      [id]: Math.max(0, Math.min(8, (prev[id] || 0) + delta))
    }));
  };

  const totalVatiosStorage = ALMACENAMIENTO.reduce((sum, s) => sum + (s.consumo * (storageCantidades[s.id] || 0)), 0);

  // MODIFICADO: Comprobación reactiva para el estado del botón "NINGUNO" de periféricos
  const algunPeriActivo = Object.values(periSeleccionados).some(v => v > 0);

  // ================= SISTEMA DE TRADUCCIÓN REACTIVA POR ID ASOCIADO A TU I18N =================
  const translateHardwareName = (item) => {
    if (!item) return '';
    
    // Si es un componente customizado inyectado dinámicamente por la IA, respetamos su nombre rastreado real
    if (item.isAiGenerated) return item.name;

    // Diccionario reactivo dinámico mapeado por las IDs exactas de tus arrays de hardware.js
    const diccionarioNombres = {
      // Monitores
      'm1': t.mon_m1 || '24" ESTÁNDAR',
      'm2': t.mon_m2 || '24" GAMING',
      'm3': t.mon_m3 || '27" 1440p IPS',
      'm4': t.mon_m4 || '32" 4K OLED',
      'm5': t.mon_m5 || '34" ULTRA-WIDE',
      'm6': t.aiScanLabel || 'AI SCAN',

      // Periféricos
      'p1': t.peri_p1 || 'BÁSICO (TECLADO + RATÓN ESTÁNDAR)',
      'p2': t.peri_p2 || 'GAMING ESTÁNDAR (RATÓN + TECLADO RGB)',
      'p3': t.peri_p3 || 'GAMING AVANZADO (RGB INALÁMBRICO + ALFOMBRILLA RGB)',
      'p4': t.peri_p4 || 'STREAMING STARTER (MICRÓFONO USB + WEBCAM)',
      'p5': t.peri_p5 || 'SIMRACING COCKPIT (VOLANTE + PEDALES BASE)',
      'p6': t.aiScanLabel || 'AI SCAN',

      // Memoria RAM
      'r1': t.ram_r1 || 'DDR3 ESTÁNDAR',
      'r2': t.ram_r2 || 'DDR4 ESTÁNDAR',
      'r3': t.ram_r3 || 'DDR5 PERFORMANCE',
      'r4': t.ram_r4 || 'DDR4/DDR5 RGB',
      'r5': t.ram_r5 || 'DDR4/DDR5 OVERCLOCK',
      'r6': t.aiScanLabel || 'AI SCAN',

      // Almacenamiento
      's1': t.st_s1 || 'SSD SATA 2.5"',
      's2': t.st_s2 || 'SSD NVMe M.2',
      's3': t.st_s3 || 'HDD MECÁNICO 3.5"',
      's4': t.st_s4 || 'SSD M.2 NVMe Gen4 Pro',
      's5': t.st_s5 || 'SSD M.2 NVMe Gen5 NextGen',
      's6': t.aiScanLabel || 'AI SCAN'
    };

    return diccionarioNombres[item.id] || item.name;
  };

  // ================= ESTADOS DE COLOR Y ALTURA UNIFICADOS =================
  const cardInactive = "border-slate-700/60 bg-[#161f33] opacity-90 hover:opacity-100 hover:bg-[#1c2842] hover:border-slate-600/60 shadow-md transition-all duration-200 p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-between h-[175px] relative overflow-hidden select-none";
  const cardActive = "bg-gradient-to-br from-[#1664c0] to-[#0b3c7a] text-white shadow-[0_12px_30px_rgba(22,100,192,0.4)] border-[#4da2ff] p-4 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-between h-[175px] relative overflow-hidden select-none";
  
  const btnNingunoStyle = "bg-[#161f33] border-slate-700/60 text-slate-300 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/40";
  const titleGamerStyle = "text-lg md:text-xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent uppercase tracking-tighter filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]";

  const groupDividerStyle = "py-10 my-6 border-t border-white/15 relative group";

  return (
    <section className="max-w-7xl mx-auto space-y-16 px-4 relative">
      
      {/* ================= 1. SECCIÓN: GPU ================= */}
      <div className="relative group pb-6">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[110%] rounded-full blur-[140px] pointer-events-none opacity-[0.06] transition-all duration-750 group-hover:opacity-[0.10]"
          style={{ backgroundColor: theme.primary }}
        ></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6 min-h-[40px]">
            <h2 className={titleGamerStyle}>{t.step1}</h2>
            <button 
              onClick={() => setGpuSeleccionada(null)} 
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all border backdrop-blur-sm shadow-md shrink-0 ${!gpuSeleccionada ? 'bg-red-500/20 border-red-500 text-red-400' : btnNingunoStyle}`}
            >
              ❌ {txtNinguno}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {GPUS.map(gpu => {
              const isActive = gpuSeleccionada && (gpuSeleccionada.id === gpu.id || (gpu.id === 'gpu-custom' && gpuSeleccionada.id === 'gpu-custom'));
              return (
                <div key={gpu.id} onClick={() => setGpuSeleccionada(gpu)} className={isActive ? cardActive : cardInactive} style={{ borderColor: isActive ? '#4da2ff' : 'transparent' }}>
                  <p className="text-[13px] font-black text-center uppercase leading-tight z-10">
                    {isActive && gpuSeleccionada.id === 'gpu-custom' ? gpuSeleccionada.name : (gpu.name === 'AI SCAN' ? t.aiScanLabel || 'AI SCAN' : gpu.name.replace('RTX', ''))}
                  </p>
                  <div className={`absolute w-16 h-16 rounded-full blur-2xl pointer-events-none transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isActive ? 'opacity-15 scale-150 bg-white' : 'opacity-[0.04] bg-blue-500'}`}></div>
                  <img src={gpu.img} alt={gpu.name} className={`w-20 h-20 object-contain my-1 transition-all duration-500 z-10 ${isActive ? 'scale-110 opacity-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]' : 'opacity-65 grayscale-0'}`} />
                  <p className={`text-[12px] font-black font-mono z-10 px-3 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-black/40 text-slate-200'}`}>
                    {isActive && gpuSeleccionada.id === 'gpu-custom' ? gpuSeleccionada.consumo : gpu.consumo}W
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ================= 2. SECCIÓN: CPU ================= */}
      <div className={groupDividerStyle}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[110%] bg-blue-600/[0.04] rounded-full blur-[140px] pointer-events-none transition-all duration-750 group-hover:bg-blue-500/[0.08]"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-4 mb-6 min-h-[40px]">
            <h2 className={titleGamerStyle}>{t.step2}</h2>
            <button 
              onClick={() => setCpuSeleccionada(null)} 
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-wider transition-all border backdrop-blur-sm shadow-md shrink-0 ${!cpuSeleccionada ? 'bg-red-500/20 border-red-500 text-red-400' : btnNingunoStyle}`}
            >
              ❌ {txtNinguno}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CPUS.map(cpu => {
               const isActive = cpuSeleccionada && (cpuSeleccionada.id === cpu.id || (cpu.id === 'cpu-custom' && cpuSeleccionada.id === 'cpu-custom'));
               return (
                <div key={cpu.id} onClick={() => setCpuSeleccionada(cpu)} className={isActive ? cardActive : cardInactive} style={{ borderColor: isActive ? '#4da2ff' : 'transparent' }}>
                  <p className="text-[13px] font-black text-center uppercase leading-tight z-10">
                    {isActive && cpuSeleccionada.id === 'cpu-custom' ? cpuSeleccionada.name : (cpu.name === 'AI SCAN' ? t.aiScanLabel || 'AI SCAN' : cpu.name.replace('Ryzen', 'R'))}
                  </p>
                  <div className={`absolute w-16 h-16 rounded-full blur-2xl pointer-events-none transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isActive ? 'opacity-15 scale-150 bg-white' : 'opacity-[0.04] bg-blue-500'}`}></div>
                  <img src={cpu.img} alt={cpu.name} className={`w-16 h-16 object-contain my-2 transition-all duration-500 z-10 ${isActive ? 'scale-110 opacity-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]' : 'opacity-65 grayscale-0'}`} />
                  <p className={`text-[12px] font-black font-mono z-10 px-3 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-black/40 text-slate-200'}`}>
                    {isActive && cpuSeleccionada.id === 'cpu-custom' ? cpuSeleccionada.consumo : cpu.consumo}W
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ================= 3 & 4. SECCIÓN: MONITOR Y PERIFÉRICOS ================= */}
      <div className={groupDividerStyle}>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40%] h-[110%] bg-blue-600/[0.03] rounded-full blur-[140px] pointer-events-none group-hover:bg-blue-500/[0.05] transition-all duration-750"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[40%] h-[110%] bg-blue-600/[0.03] rounded-full blur-[140px] pointer-events-none group-hover:bg-blue-500/[0.05] transition-all duration-750"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2"></div>

          {/* Monitor */}
          <section>
            <div className="flex items-center justify-center gap-4 mb-4 min-h-[36px] px-2">
              <h2 className={titleGamerStyle}>{t.step3}</h2>
              <button 
                onClick={() => setMonitorSeleccionado(null)} 
                className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider transition-all border backdrop-blur-sm shadow-md shrink-0 ${!monitorSeleccionado ? 'bg-red-500/20 border-red-500 text-red-400' : btnNingunoStyle}`}
              >
                ❌ {txtNinguno}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {MONITORES.map(mon => {
                const isActive = monitorSeleccionado && monitorSeleccionado.id === mon.id;
                return (
                  <div key={mon.id} onClick={() => setMonitorSeleccionado(mon)} className={isActive ? cardActive : cardInactive} style={{ borderColor: isActive ? '#4da2ff' : 'transparent' }}>
                    <p className="text-[12px] font-black uppercase text-center leading-tight z-10 px-1">
                      {isActive && monitorSeleccionado.id === 'm6' ? monitorSeleccionado.name : translateHardwareName(mon)}
                    </p>
                    <div className={`absolute w-16 h-16 rounded-full blur-2xl pointer-events-none transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isActive ? 'opacity-15 scale-150 bg-white' : 'opacity-[0.04]'}`}></div>
                    <img src={mon.img} alt={mon.name} className={`w-16 h-16 object-contain transition-all z-10 ${isActive ? 'scale-110 opacity-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]' : 'opacity-65'}`} />
                    <p className={`text-[12px] font-black font-mono z-10 px-3 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-purple-200'}`}>
                      {isActive && monitorSeleccionado.id === 'm6' ? monitorSeleccionado.consumo : mon.consumo}W
                    </p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Periféricos - COMPORTAMIENTO MULTIELECCIÓN TOGGLE COMPLETADO */}
          <section>
            <div className="flex items-center justify-center gap-4 mb-4 min-h-[36px] px-2">
              <h2 className={titleGamerStyle}>{t.step4}</h2>
              <button 
                onClick={() => {
                  setPeriSeleccionados({ 'p1': 0, 'p2': 0, 'p3': 0, 'p4': 0, 'p5': 0, 'p6': 0 });
                  setAiPeriCustom(null); 
                }} 
                className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider transition-all border backdrop-blur-sm shadow-md shrink-0 ${!algunPeriActivo ? 'bg-red-500/20 border-red-500 text-red-400' : btnNingunoStyle}`}
              >
                ❌ {txtNinguno}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PERIFERICOS.map(peri => {
                // MODIFICADO: Comprobación binaria reactiva al mapa de estados indexados del padre
                const isActive = (periSeleccionados[peri.id] || 0) === 1;
                return (
                  <div 
                    key={peri.id} 
                    onClick={() => {
                      setPeriSeleccionados(prev => {
                        const nuevoEstado = prev[peri.id] === 1 ? 0 : 1;
                        // Si apagamos la tarjeta comodín p6 a mano, vaciamos su memoria
                        if (peri.id === 'p6' && nuevoEstado === 0) setAiPeriCustom(null);
                        return { ...prev, [peri.id]: nuevoEstado };
                      });
                    }} 
                    className={isActive ? cardActive : cardInactive} 
                    style={{ borderColor: isActive ? '#4da2ff' : 'transparent' }}
                  >
                    <p className="text-[12px] font-black uppercase text-center leading-tight z-10 px-1">
                      {peri.id === 'p6' && aiPeriCustom ? aiPeriCustom.name : translateHardwareName(peri)}
                    </p>
                    <div className={`absolute w-16 h-16 rounded-full blur-2xl pointer-events-none transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isActive ? 'opacity-15 scale-150 bg-white' : 'opacity-[0.04]'}`}></div>
                    <img src={peri.img} alt={peri.name} className={`w-16 h-16 object-contain transition-all z-10 ${isActive ? 'scale-110 opacity-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]' : 'opacity-65'}`} />
                    <p className={`text-[12px] font-black font-mono z-10 px-3 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-orange-200'}`}>
                      {peri.id === 'p6' && aiPeriCustom ? aiPeriCustom.consumo : peri.consumo}W
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>

      {/* ================= 5. SECCIÓN: RAM Y ALMACENAMIENTO ================= */}
      <div className={groupDividerStyle}>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40%] h-[110%] bg-blue-600/[0.03] rounded-full blur-[140px] pointer-events-none group-hover:bg-blue-500/[0.05] transition-all duration-750"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[40%] h-[110%] bg-blue-600/[0.03] rounded-full blur-[140px] pointer-events-none group-hover:bg-blue-500/[0.05] transition-all duration-750"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2"></div>

          {/* Memoria RAM */}
          <section>
            <div className="flex items-center justify-center gap-4 mb-4 min-h-[36px] px-2">
              <h2 className={titleGamerStyle}>{t.ram || "MEMORIA RAM"}</h2>
              <button 
                onClick={() => setRamSeleccionada(null)} 
                className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider transition-all border backdrop-blur-sm shadow-md shrink-0 ${!ramSeleccionada ? 'bg-red-500/20 border-red-500 text-red-400' : btnNingunoStyle}`}
              >
                ❌ {txtNinguno}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {RAM.map(ram => {
                const isThisActive = ramSeleccionada && ramSeleccionada.id === ram.id;
                return (
                  <div key={ram.id} onClick={() => { setRamSeleccionada(ram); if (!isThisActive) setRamCantidad(1); }} className={isThisActive ? cardActive : cardInactive} style={{ borderColor: isThisActive ? '#4da2ff' : 'transparent' }}>
                    <div className={`absolute w-16 h-16 rounded-full blur-2xl pointer-events-none transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isThisActive ? 'opacity-15 scale-150 bg-white' : 'opacity-[0.04]'}`}></div>
                    
                    <p className="text-[12px] font-black uppercase text-center mt-1 leading-tight z-10">
                      {isThisActive && ramSeleccionada.id === 'r6' ? ramSeleccionada.name : translateHardwareName(ram)}
                    </p>
                    <img src={ram.img} alt={ram.name} className={`w-12 h-12 object-contain transition-all z-10 mb-2 ${isThisActive ? 'scale-110 opacity-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]' : 'opacity-65'}`} />
                    
                    <p className={`text-[12px] font-black font-mono z-10 mb-4 px-3 py-0.5 rounded-full ${isThisActive ? 'bg-white/20 text-white' : 'bg-black/30 text-pink-200'}`}>
                      {isThisActive ? `${(ramSeleccionada.consumo || ram.consumo) * ramCantidad}W` : `${ram.consumo}W/u`}
                    </p>

                    {isThisActive && (
                      <div className="absolute bottom-2 right-2 flex items-center bg-black/40 border border-white/20 rounded-lg p-0.5 z-20 gap-1 shadow-md transition-all">
                        <button onClick={(e) => { e.stopPropagation(); setRamCantidad(p => Math.max(1, p - 1)) }} className="w-4 h-4 flex items-center justify-center text-[10px] font-black bg-white/10 rounded hover:bg-white/20 text-white transition-colors">-</button>
                        <span className="text-[13px] font-mono font-black text-white px-1 leading-none">{ramCantidad}</span>
                        <button onClick={(e) => { e.stopPropagation(); setRamCantidad(p => Math.min(8, p + 1)) }} className="w-4 h-4 flex items-center justify-center text-[10px] font-black bg-white/10 rounded hover:bg-white/20 text-white transition-colors">+</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Almacenamiento */}
          <section>
            <div className="flex items-center justify-center gap-4 mb-4 min-h-[36px] px-2">
              <h2 className={titleGamerStyle}>{t.storage || "ALMACENAMIENTO"}</h2>
              <button 
                onClick={() => setStorageCantidades({ 's1': 0, 's2': 0, 's3': 0, 's4': 0, 's5': 0, 's6': 0 })} 
                className={`px-3 py-1 rounded-xl text-[10px] font-black tracking-wider transition-all border backdrop-blur-sm shadow-md shrink-0 ${totalVatiosStorage === 0 ? 'bg-red-500/20 border-red-500 text-red-400' : btnNingunoStyle}`}
              >
                ❌ {txtNinguno}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ALMACENAMIENTO.map(st => {
                const cantidad = storageCantidades[st.id] || 0;
                const isDiskActive = cantidad > 0;
                return (
                  <div key={st.id} onClick={() => { if (cantidad === 0) { updateStorageCount(st.id, 1); } else { setStorageCantidades(prev => ({ ...prev, [st.id]: 0 })); } }} className={isDiskActive ? cardActive : cardInactive} style={{ borderColor: isDiskActive ? '#4da2ff' : 'transparent' }}>
                    <div className={`absolute w-16 h-16 rounded-full blur-2xl pointer-events-none transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDiskActive ? 'opacity-15 scale-150 bg-white' : 'opacity-[0.04]'}`}></div>
                    
                    <p className="text-[12px] font-black uppercase text-center mt-1 leading-tight z-10 px-1">
                      {isDiskActive && st.id === 's6' ? t.aiScanLabel || 'AI SCAN' : translateHardwareName(st)}
                    </p>
                    <img src={st.img} alt={st.name} className={`w-12 h-12 object-contain transition-all z-10 mb-2 ${isDiskActive ? 'scale-110 opacity-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]' : 'opacity-35 grayscale'}`} />
                    
                    <p className={`text-[12px] font-black font-mono z-10 mb-4 px-3 py-0.5 rounded-full ${isDiskActive ? 'bg-white/20 text-white' : 'bg-black/30 text-emerald-300'}`}>{st.consumo * cantidad}W</p>

                    {isDiskActive && (
                      <div className="absolute bottom-2 right-2 flex items-center bg-black/40 border border-white/20 rounded-lg p-0.5 z-20 gap-1 shadow-md transition-all">
                        <button onClick={(e) => { e.stopPropagation(); updateStorageCount(st.id, -1) }} className="w-4 h-4 flex items-center justify-center text-[10px] font-black bg-white/10 rounded hover:bg-white/20 text-white transition-colors">-</button>
                        <span className="text-[13px] font-mono font-black text-white px-1 leading-none">{cantidad}</span>
                        <button onClick={(e) => { e.stopPropagation(); updateStorageCount(st.id, 1) }} className="w-4 h-4 flex items-center justify-center text-[10px] font-black bg-white/10 rounded hover:bg-white/20 text-white transition-colors">+</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </div>

    </section>
  )
}

export default HardwareGrid