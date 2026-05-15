import { useState, useEffect } from 'react'
import { GPUS, CPUS, MONITORES, PERIFERICOS } from './data/hardware'
import { I18N } from './constants/i18n'

// Importación de componentes
import HardwareGrid from './components/HardwareGrid'
import Controls from './components/Controls'
import Report from './components/Report'
import Footer from './components/Footer'

function App() {
  const [lang, setLang] = useState('ES')
  const t = I18N[lang]
  
  // Estados de selección
  const [gpuSeleccionada, setGpuSeleccionada] = useState(GPUS[0])
  const [cpuSeleccionada, setCpuSeleccionada] = useState(CPUS[0])
  const [monitorSeleccionado, setMonitorSeleccionado] = useState(MONITORES[0])
  const [periSeleccionado, setPeriSeleccionado] = useState(PERIFERICOS[1])
  
  // Estados de configuración
  const [horas, setHoras] = useState(4)
  const [precioKwh, setPrecioKwh] = useState(0.15)
  const [moneda, setMoneda] = useState({ sym: '€', id: 'EUR', tasa: 1 })
  const [isVariableRate, setIsVariableRate] = useState(false) 
  const [templateIndex, setTemplateIndex] = useState(0)
  const [inputLink, setInputLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const divisas = [
    { sym: '€', id: 'EUR', tasa: 1 },
    { sym: '$', id: 'USD', tasa: 1.08 },
    { sym: '£', id: 'GBP', tasa: 0.86 },
    { sym: '¥', id: 'JPY', tasa: 165.50 }
  ]

  // Lógica de cálculo
  const consumoTotal = gpuSeleccionada.consumo + cpuSeleccionada.consumo + monitorSeleccionado.consumo + periSeleccionado.consumo
  const precioFinalKwh = isVariableRate ? precioKwh * 1.15 : precioKwh 
  const costeDiario = ((consumoTotal * horas) / 1000) * precioFinalKwh
  const costeMensual = costeDiario * 30
  const appUrl = "pcspend.com"

  useEffect(() => {
    setTemplateIndex(Math.floor(Math.random() * t.templates.length));
  }, [lang, t.templates.length]);

  const datoViralActivo = t.templates[templateIndex] ? t.templates[templateIndex](costeMensual) : "";

  // Funciones auxiliares
  const cambiarMoneda = (nuevaMoneda) => {
    const precioBaseEUR = precioKwh / moneda.tasa;
    const nuevoPrecioAdaptado = parseFloat((precioBaseEUR * nuevaMoneda.tasa).toFixed(nuevaMoneda.id === 'JPY' ? 0 : 2));
    setPrecioKwh(nuevoPrecioAdaptado);
    setMoneda(nuevaMoneda);
  };

  const ajustarPrecio = (delta) => {
    const magnitud = moneda.id === 'JPY' ? Math.sign(delta) * 1 : delta;
    setPrecioKwh(prev => Math.max(0, parseFloat((prev + magnitud).toFixed(moneda.id === 'JPY' ? 0 : 2))));
  };

  const getBrandColor = () => {
    const brand = gpuSeleccionada.brand?.toLowerCase() || 'nvidia'; 
    if (brand === 'amd') return { primary: '#ff4444', shadow: 'rgba(255, 68, 68, 0.2)' };
    if (brand === 'intel') return { primary: '#00c2ff', shadow: 'rgba(0, 194, 255, 0.2)' };
    return { primary: '#4ade80', shadow: 'rgba(74, 222, 128, 0.2)' }; 
  };

  const theme = getBrandColor();

  // Lógica de IA - CONECTADA AL BACKEND REAL
  const handleAnalizarLink = async () => {
    if (!inputLink) return;
    setIsLoading(true);

    try {
      // Llamada a tu servidor local
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputLink })
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json(); 

      // Si es una GPU, creamos un objeto nuevo con los vatios de la IA
      if (data.type === 'gpu') {
        setGpuSeleccionada({
          id: 'gpu-ia',
          name: data.name,
          consumo: data.tdp,
          brand: data.name.toLowerCase().includes('amd') ? 'amd' : 'nvidia'
        });
      } else if (data.type === 'cpu') {
        setCpuSeleccionada({
          id: 'cpu-ia',
          name: data.name,
          consumo: data.tdp
        });
      }

      setInputLink(""); // Limpiar input
      alert(`¡${data.type.toUpperCase()} detectada con éxito!`);

    } catch (error) {
      console.error("Error en el servidor:", error);
      alert("Error: Asegúrate de que el backend (node index.js) esté encendido en el puerto 3001.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Lógica de Canvas, Descarga y Compartir (Sin cambios) ---
  const generarCanvas = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800; canvas.height = 850;
    ctx.fillStyle = '#060b18';
    ctx.beginPath(); ctx.roundRect(0, 0, 800, 850, 50); ctx.fill();
    ctx.save(); 
    ctx.beginPath(); ctx.roundRect(0, 0, 800, 850, 50); ctx.clip();
    const gradient = ctx.createLinearGradient(0, 0, 800, 0);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, theme.primary); 
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 800, 12);
    ctx.restore();
    ctx.textAlign = 'center'; ctx.font = 'bold 22px sans-serif'; ctx.fillStyle = '#64748b';
    ctx.fillText(t.report, 400, 75);
    ctx.font = '900 120px sans-serif'; ctx.fillStyle = theme.primary;
    ctx.fillText(`${costeMensual.toFixed(moneda.id === 'JPY' ? 0 : 2)}${moneda.sym}`, 400, 200);
    ctx.font = '300 40px sans-serif'; ctx.fillStyle = '#475569';
    ctx.fillText(t.perMonth, 400, 260);
    
    const drawComp = (x, y, label, name, color) => {
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.roundRect(x, y, 350, 100, 20); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.stroke();
      ctx.textAlign = 'left'; ctx.font = 'bold 16px sans-serif'; ctx.fillStyle = color; ctx.fillText(label, x + 25, y + 35);
      ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = '#ffffff';
      const cleanName = name.length > 25 ? name.substring(0, 22) + "..." : name;
      ctx.fillText(cleanName, x + 25, y + 75);
    };

    drawComp(40, 330, 'GPU', gpuSeleccionada.name, theme.primary);
    drawComp(410, 330, 'CPU', cpuSeleccionada.name, '#3b82f6');
    drawComp(40, 450, t.step3.includes('.') ? t.step3.split('.')[1].trim().toUpperCase() : t.step3.toUpperCase(), monitorSeleccionado.name, '#a855f7');
    drawComp(410, 450, t.step4.includes('.') ? t.step4.split('.')[1].trim().toUpperCase() : t.step4.toUpperCase(), periSeleccionado.name, '#f97316');
    
    ctx.textAlign = 'center'; ctx.font = 'bold 24px sans-serif'; ctx.fillStyle = '#ffffff';
    ctx.fillText(`"${datoViralActivo}"`, 400, 620);
    ctx.font = 'italic 18px sans-serif'; ctx.fillStyle = '#475569';
    ctx.fillText(`Consumo: ${consumoTotal}W | ${t.price}: ${precioKwh}${moneda.sym}/kWh`, 400, 720);
    ctx.font = 'bold 28px sans-serif'; ctx.fillStyle = theme.primary;
    ctx.fillText(appUrl, 400, 790);
    return canvas;
  };

  const descargarImagen = () => {
    const canvas = generarCanvas();
    const link = document.createElement('a');
    link.download = `informe-pcspend.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const compartirImagen = async () => {
    const canvas = generarCanvas();
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'informe.png', { type: 'image/png' });
      if (navigator.share) {
        try {
          await navigator.share({
            title: t.title,
            text: `Cost: ${costeMensual.toFixed(moneda.id === 'JPY' ? 0 : 2)}${moneda.sym}${t.perMonth}! ${datoViralActivo}. ${appUrl}`,
            files: [file],
          });
        } catch (err) { console.log(err); }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#060b18] text-white p-4 md:p-6 font-sans transition-all flex flex-col">
      <div className="flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto mb-10 gap-4">
          <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent uppercase tracking-tighter">
            {t.title}
          </h1>
          <div className="flex gap-4">
            <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-800">
              {['ES', 'EN', 'FR', 'JP'].map(l => (
                <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${lang === l ? 'bg-green-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{l}</button>
              ))}
            </div>
            <div className="flex bg-slate-900/50 rounded-xl p-1 border border-slate-800">
              {divisas.map(d => (
                <button key={d.id} onClick={() => cambiarMoneda(d)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${moneda.id === d.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{d.id}</button>
              ))}
            </div>
          </div>
        </div>
        
        <HardwareGrid 
          t={t}
          theme={theme}
          gpuSeleccionada={gpuSeleccionada} setGpuSeleccionada={setGpuSeleccionada}
          cpuSeleccionada={cpuSeleccionada} setCpuSeleccionada={setCpuSeleccionada}
          monitorSeleccionado={monitorSeleccionado} setMonitorSeleccionado={setMonitorSeleccionado}
          periSeleccionado={periSeleccionado} setPeriSeleccionado={setPeriSeleccionado}
        />

        <Controls 
          t={t}
          horas={horas} setHoras={setHoras}
          precioKwh={precioKwh} setPrecioKwh={setPrecioKwh}
          moneda={moneda}
          ajustarPrecio={ajustarPrecio}
          isLoading={isLoading}
          handleAnalizarLink={handleAnalizarLink}
          inputLink={inputLink}
          setInputLink={setInputLink}
          isVariableRate={isVariableRate}
          setIsVariableRate={setIsVariableRate}
        />

        <Report 
          t={t}
          theme={theme}
          costeMensual={costeMensual}
          costeDiario={costeDiario}
          moneda={moneda}
          gpuSeleccionada={gpuSeleccionada}
          cpuSeleccionada={cpuSeleccionada}
          monitorSeleccionado={monitorSeleccionado}
          periSeleccionado={periSeleccionado}
          datoViralActivo={datoViralActivo}
          compartirImagen={compartirImagen}
          descargarImagen={descargarImagen}
        />
      </div>

      <Footer t={t} />
    </div>
  )
}

export default App