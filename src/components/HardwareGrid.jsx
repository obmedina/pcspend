import { GPUS, CPUS, MONITORES, PERIFERICOS } from '../data/hardware'

const HardwareGrid = ({ 
  t, 
  theme, 
  gpuSeleccionada, setGpuSeleccionada, 
  cpuSeleccionada, setCpuSeleccionada,
  monitorSeleccionado, setMonitorSeleccionado,
  periSeleccionado, setPeriSeleccionado 
}) => {
  
  const placeholderImg = "https://w7.pngwing.com/pngs/43/80/png-transparent-rtx-3090-gpu.png";

  return (
    <section className="max-w-6xl mx-auto space-y-10">
      {/* 1. GPU */}
      <div>
        <h2 className="text-[12px] font-black uppercase mb-4 tracking-[0.2em] text-center" style={{ color: theme.primary }}>
          {t.step1}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {GPUS.map(gpu => {
            const isActive = gpuSeleccionada.id === gpu.id || 
                             (gpu.id === 'gpu-custom' && !GPUS.find(g => g.name === gpuSeleccionada.name && g.id !== 'gpu-custom'));

            return (
              <div 
                key={gpu.id} 
                onClick={() => setGpuSeleccionada(gpu)} 
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[140px] relative overflow-hidden ${
                  isActive ? 'bg-white/10 shadow-lg' : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
                }`}
                style={{ borderColor: isActive ? theme.primary : 'transparent' }}
              >
                <p className="text-[11px] font-black text-center uppercase leading-tight z-10">
                  {gpu.name === 'OTRA' ? gpu.name : gpu.name.replace('RTX', '')}
                </p>
                
                <img 
                  src={placeholderImg} 
                  alt={gpu.name} 
                  className={`w-16 h-16 object-contain my-2 transition-all duration-500 ${isActive ? 'scale-110 opacity-100' : 'opacity-30 grayscale'}`}
                />

                <p className="text-[10px] text-slate-200 font-black font-mono z-10 bg-black/20 px-2 rounded-full">
                  {gpu.id === 'gpu-custom' && gpuSeleccionada.id === 'gpu-custom' ? gpuSeleccionada.consumo : gpu.consumo}W
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 2. CPU */}
      <div className="pt-8 border-t border-slate-800/50">
        <h2 className="text-[12px] font-black text-blue-500 uppercase mb-4 tracking-[0.2em] text-center">
          {t.step2}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {CPUS.map(cpu => {
             const isActive = cpuSeleccionada.id === cpu.id || 
                              (cpu.id === 'cpu-custom' && !CPUS.find(c => c.name === cpuSeleccionada.name && c.id !== 'cpu-custom'));

             return (
              <div 
                key={cpu.id} 
                onClick={() => setCpuSeleccionada(cpu)} 
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between min-h-[140px] ${
                  isActive ? 'border-blue-500 bg-blue-500/10 shadow-lg' : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'
                }`}
              >
                <p className="text-[11px] font-black text-center uppercase leading-tight z-10">
                  {cpu.name === 'OTRA' ? cpu.name : cpu.name.replace('Ryzen', 'R')}
                </p>

                <img 
                  src={placeholderImg} 
                  alt={cpu.name} 
                  className={`w-14 h-14 object-contain my-2 transition-all duration-500 ${isActive ? 'scale-110 opacity-100' : 'opacity-30 grayscale'}`}
                />

                <p className="text-[10px] text-slate-200 font-black font-mono z-10 bg-black/20 px-2 rounded-full">
                  {cpu.id === 'cpu-custom' && cpuSeleccionada.id === 'cpu-custom' ? cpuSeleccionada.consumo : cpu.consumo}W
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3 & 4. Monitor y Periféricos */}
      <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-slate-800/50">
        <section>
          <h2 className="text-[12px] font-black text-purple-400 uppercase mb-4 tracking-[0.2em] text-center">
            {t.step3}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {MONITORES.map(mon => (
              <div 
                key={mon.id} 
                onClick={() => setMonitorSeleccionado(mon)} 
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[140px] ${monitorSeleccionado.id === mon.id ? 'border-purple-500 bg-purple-500/10 shadow-lg' : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'}`}
              >
                <p className="text-[12px] font-black uppercase text-center">{mon.name}</p>
                <img 
                  src={placeholderImg} 
                  className={`w-16 h-16 object-contain transition-all ${monitorSeleccionado.id === mon.id ? 'scale-110 opacity-100' : 'opacity-30'}`} 
                />
                <p className="text-[11px] text-purple-300 font-black font-mono bg-purple-950/30 px-3 rounded-full">{mon.consumo}W</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[12px] font-black text-orange-400 uppercase mb-4 tracking-[0.2em] text-center">
            {t.step4}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {PERIFERICOS.map(peri => (
              <div 
                key={peri.id} 
                onClick={() => setPeriSeleccionado(peri)} 
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[140px] ${periSeleccionado.id === peri.id ? 'border-orange-500 bg-orange-500/10 shadow-lg' : 'border-slate-800 bg-slate-900/40 opacity-70 hover:opacity-100'}`}
              >
                <p className="text-[12px] font-black uppercase text-center">{peri.name}</p>
                <img 
                  src={placeholderImg} 
                  className={`w-16 h-16 object-contain transition-all ${periSeleccionado.id === peri.id ? 'scale-110 opacity-100' : 'opacity-30'}`} 
                />
                <p className="text-[11px] text-orange-300 font-black font-mono bg-orange-950/30 px-3 rounded-full">{peri.consumo}W</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default HardwareGrid