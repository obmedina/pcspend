import { useState, useEffect } from 'react'
import { GPUS, CPUS, MONITORES, PERIFERICOS, RAM, ALMACENAMIENTO } from '../data/hardware'
import { I18N } from '../constants/i18n'
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // IMPORTADO PARA SEO

// Importación de componentes
import HardwareGrid from '../components/HardwareGrid'
import Controls from '../components/Controls'
import Report from '../components/Report'
import Footer from '../components/Footer'
import StickyTotal from '../components/StickyTotal' 
import AiScanExpress from '../components/AiScanExpress' 

// Importación del logo desde tus assets de web
import logoWeb from '../assets/web/logo.png' 

function Home() {
  // LÓGICA DE DETECCIÓN AUTOMÁTICA Y PERSISTENCIA DE IDIOMA
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('pcspend_lang');
    if (savedLang) return savedLang;

    const browserLang = navigator.language || navigator.userLanguage;
    const primaryLang = browserLang.split('-')[0].toUpperCase();
    const idiomasSoportados = ['ES', 'EN', 'FR', 'JP', 'DE', 'PT'];
    
    return idiomasSoportados.includes(primaryLang) ? primaryLang : 'ES';
  });

  const t = I18N[lang]
  const txtNinguno = t.none || "NINGUNO";

  // Estados de selection individuales tradicionales (Arrancan limpios en NINGUNO)
  const [gpuSeleccionada, setGpuSeleccionada] = useState(null)
  const [cpuSeleccionada, setCpuSeleccionada] = useState(null)
  const [monitorSeleccionado, setMonitorSeleccionado] = useState(null)
  const [ramSeleccionada, setRamSeleccionada] = useState(null)
  const [ramCantidad, setRamCantidad] = useState(0)

  // Periféricos convertidos en estructura indexada multielección (On: 1 / Off: 0)
  const [periSeleccionados, setPeriSeleccionados] = useState({ 'p1': 0, 'p2': 0, 'p3': 0, 'p4': 0, 'p5': 0, 'p6': 0 })
  
  // Estado de respaldo dinámico para cuando la IA inyecte un periférico customizado en el slot 'p6'
  const [aiPeriCustom, setAiPeriCustom] = useState(null)
  
  // Estructura indexada compatible inicializada a cero unidades
  const [storageCantidades, setStorageCantidades] = useState({ 's1': 0, 's2': 0, 's3': 0, 's4': 0, 's5': 0, 's6': 0 })
  
  // Estados de configuration
  const [horas, setHoras] = useState(4)
  const [precioKwh, setPrecioKwh] = useState(0.15)
  const [moneda, setMoneda] = useState({ sym: '€', id: 'EUR', tasa: 1 })
  const [isVariableRate, setIsVariableRate] = useState(false) 
  const [templateIndex, setTemplateIndex] = useState(0)
  const [inputLink, setInputLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [scanStatus, setScanStatus] = useState(null)

  // ESTADO PARA CONTROLAR LA VISIBILIDAD DE LA BARRA FLOTANTE
  const [showSticky, setShowSticky] = useState(true);

  const divisas = [
    { sym: '€', id: 'EUR', tasa: 1 },
    { sym: '$', id: 'USD', tasa: 1.08 },
    { sym: '£', id: 'GBP', tasa: 0.86 },
    { sym: '¥', id: 'JPY', tasa: 165.50 },
    { sym: 'R$', id: 'BRL', tasa: 6.15 } 
  ]

  // Lógica de cálculo acumulativa para el Almacenamiento Múltiple de 6 slots
  const vatiosStorage = ALMACENAMIENTO.reduce((total, s) => total + (s.consumo * (storageCantidades[s.id] || 0)), 0)

  // Lógica de cálculo acumulativo para la multielección de Periféricos
  const vatiosPerifericos = PERIFERICOS.reduce((total, p) => {
    const estáActivo = periSeleccionados[p.id] || 0;
    if (p.id === 'p6' && aiPeriCustom) {
      return total + (aiPeriCustom.consumo * estáActivo);
    }
    return total + (p.consumo * estáActivo);
  }, 0);

  const consumoTotal = 
    (gpuSeleccionada?.consumo || 0) + 
    (cpuSeleccionada?.consumo || 0) + 
    (monitorSeleccionado?.consumo || 0) + 
    vatiosPerifericos + 
    ((ramSeleccionada?.consumo || 0) * ramCantidad) + 
    vatiosStorage

  const precioFinalKwh = isVariableRate ? precioKwh * 1.15 : precioKwh 
  const costeDiario = ((consumoTotal * horas) / 1000) * precioFinalKwh
  const costeMensual = costeDiario * 30
  const appUrl = "pcspend.com"

  // Procesamos el almacenamiento de forma reactiva al idioma dinámico t
  const storageActivos = ALMACENAMIENTO.filter(s => (storageCantidades[s.id] || 0) > 0);
  const textoStorageCompacto = storageActivos.map(s => {
    const cant = storageCantidades[s.id];
    const nombreTraducido = s.id === 's6' ? `AI SCAN: STORAGE DRIVE` : s.name;
    const nom = nombreTraducido.split(' ')[0] + ' ' + (nombreTraducido.split(' ')[1] || '');
    return `${nom}${cant > 1 ? ` x${cant}` : ''}`;
  }).join(' + ');

  // Construcción de cadena de texto compacta de periféricos activos para el StickyTotal
  const perifericosActivos = PERIFERICOS.filter(p => (periSeleccionados[p.id] || 0) > 0);
  const textoPeriCompacto = perifericosActivos.map(p => {
    if (p.id === 'p6' && aiPeriCustom) return 'AI SCAN';
    return p.name.split(' ')[0]; 
  }).join(' + ') || txtNinguno;

  useEffect(() => {
    setTemplateIndex(Math.floor(Math.random() * t.templates.length));
  }, [lang, t.templates.length]);

  // LÓGICA DE SCROLL COMPATIBLE CON MÓVILES Y PANTALLAS GRANDES
  useEffect(() => {
    const handleScroll = () => {
      const alturaTotalDoc = document.documentElement.scrollHeight;
      const alturaVentana = window.innerHeight;
      const scrollActual = window.scrollY;
      
      const distanciaAlFondo = alturaTotalDoc - alturaVentana - scrollActual;
      
      if (distanciaAlFondo < 250) {
        setShowSticky(false);
      } else {
        setShowSticky(true);
      }
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Funciones auxiliares
  const cambiarMoneda = (nuevaMoneda) => {
    const precioBaseEUR = precioKwh / moneda.tasa;
    const nuevoPrecioAdaptado = parseFloat((precioBaseEUR * nuevaMoneda.tasa).toFixed(nuevaMoneda.id === 'JPY' ? 0 : 2));
    setPrecioKwh(nuevoPrecioAdaptado);
    setMoneda(nuevaMoneda);
  };

  const ajustarPrecio = (delta) => {
    const magnitude = moneda.id === 'JPY' ? Math.sign(delta) * 1 : delta;
    setPrecioKwh(prev => Math.max(0, parseFloat((prev + magnitude).toFixed(moneda.id === 'JPY' ? 0 : 2))));
  };

  const seleccionarIdioma = (nuevoIdioma) => {
    setLang(nuevoIdioma);
    localStorage.setItem('pcspend_lang', nuevoIdioma);
  };

  const getBrandColor = () => {
    const brand = gpuSeleccionada?.brand?.toLowerCase() || 'nvidia'; 
    if (brand === 'amd') return { primary: '#ff4444', shadow: 'rgba(255, 68, 68, 0.2)' };
    if (brand === 'intel') return { primary: '#00c2ff', shadow: 'rgba(0, 194, 255, 0.2)' };
    return { primary: '#4ade80', shadow: 'rgba(74, 222, 128, 0.2)' }; 
  };

  const theme = getBrandColor();

  // ================= LÓGICA DE ASIGNACIÓN MULTI-COMPONENTE CON CORRECCIÓN EN CASCADA AI SCAN =================
  const handleAnalizarLink = async () => {
    if (!inputLink) return;
    setIsLoading(true);
    setScanStatus(null);

    let urlProcesada = inputLink.trim();
    if (urlProcesada.includes('amazon.')) {
      const matchAsin = urlProcesada.match(/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/i);
      if (matchAsin && matchAsin[1]) {
        urlProcesada = `https://www.amazon.es/dp/${matchAsin[1]}`;
      }
    }

    const API_URL = import.meta.env.VITE_API_URL || 'https://pc-spend-backend-production.up.railway.app';

    try {
      const response = await fetch(`${API_URL}/api/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlProcesada }) 
      });

      if (!response.ok) throw new Error("Error en el servidor al escanear");

      const data = await response.json(); 

      if (!data) throw new Error("No se recibieron datos válidos del servidor");

      if (data.components && data.components[0]?.name === 'Security Block') {
        throw new Error("La tienda bloqueó el acceso automatizado del escáner (Security Block).");
      }

      const tieneComponentes = data.components && data.components.length > 0;
      const tieneDiscos = data.storageDrives && data.storageDrives.length > 0;

      if (!tieneComponentes && !tieneDiscos && !data.ramGB) {
        throw new Error("El enlace no contiene datos de hardware compatibles para la matriz.");
      }

      // ---------------- SECCIÓN MEMORIA RAM ----------------
      if (data.ramGB && data.ramGB > 0) {
        if (data.ramModulesCount && data.ramModulesCount > 0) {
          setRamCantidad(Number(data.ramModulesCount));
        } else {
          setRamCantidad(data.ramGB <= 8 ? 1 : 2);
        }

        const tipoDdrDetectado = data.ramType ? data.ramType.toLowerCase() : 'ddr4';
        const ramCoincidente = RAM.find(r => r.name.toLowerCase().includes(tipoDdrDetectado) && r.id !== 'r6');

        if (ramCoincidente) {
          setRamSeleccionada(ramCoincidente);
        } else {
          setRamSeleccionada({
            id: 'r6',
            isAiGenerated: true,
            name: `AI SCAN: ${tipoDdrDetectado.toUpperCase()} ${data.ramGB}GB`,
            consumo: 4 * (data.ramModulesCount || 1), 
            img: RAM.find(r => r.id === 'r6')?.img
          });
        }
      }

      // ---------------- SECCIÓN: ALMACENAMIENTO MULTISLOT ----------------
      if (tieneDiscos) {
        const copiaDiscos = { 's1': 0, 's2': 0, 's3': 0, 's4': 0, 's5': 0, 's6': 0 };

        data.storageDrives.forEach(drive => {
          const type = drive.interface ? drive.interface.toLowerCase() : 'nvme';

          if (type === 'nvme_gen5') {
            copiaDiscos['s5'] += 1;
          } else if (type === 'nvme_gen4') {
            copiaDiscos['s4'] += 1;
          } else if (type === 'nvme') {
            copiaDiscos['s2'] += 1;
          } else if (type === 'sata_ssd') {
            copiaDiscos['s1'] += 1;
          } else if (type === 'hdd') {
            copiaDiscos['s3'] += 1;
          } else {
            copiaDiscos['s6'] += 1;
          }
        });

        setStorageCantidades(copiaDiscos);

        if (!tieneComponentes) {
          setGpuSeleccionada(null);
          setCpuSeleccionada(null);
        }
      }

      // ---------------- SECCIÓN: COMPONENTES TRADICIONALES Y PERIFÉRICOS MULTI ----------------
      if (tieneComponentes) {
        data.components.forEach(comp => {
          if (!comp || !comp.type || !comp.name) return; 

          const rawType = String(comp.type).toLowerCase();
          const compTdp = Number(comp.tdp) || 0;

          if (rawType === 'gpu') {
            const coincidenciaLocal = GPUS.find(g => comp.name.toLowerCase().includes(g.name.toLowerCase()) && g.id !== 'gpu-custom');
            if (coincidenciaLocal) {
              setGpuSeleccionada(coincidenciaLocal);
            } else {
              setGpuSeleccionada({
                id: 'gpu-custom',
                isAiGenerated: true,
                name: comp.name,
                consumo: compTdp || 150,
                brand: comp.name.toLowerCase().includes('amd') ? 'amd' : comp.name.toLowerCase().includes('intel') ? 'intel' : 'nvidia',
                img: GPUS.find(g => g.id === 'gpu-custom')?.img
              });
            }
          } 
          else if (rawType === 'cpu') {
            const coincidenciaLocal = CPUS.find(c => comp.name.toLowerCase().includes(c.name.toLowerCase()) && c.id !== 'cpu-custom');
            if (coincidenciaLocal) {
              setCpuSeleccionada(coincidenciaLocal);
            } else {
              setCpuSeleccionada({
                id: 'cpu-custom',
                isAiGenerated: true,
                name: comp.name,
                consumo: compTdp || 65,
                img: CPUS.find(c => c.id === 'cpu-custom')?.img
              });
            }
          } 
          else if (rawType === 'monitor') {
            const listaMonitoresFijos = MONITORES.filter(m => m.id !== 'm6');
            const coincidenciaFija = listaMonitoresFijos.find(m => comp.name.toLowerCase().includes(m.name.toLowerCase().replace(/"/g, '')));

            if (coincidenciaFija) {
              setMonitorSeleccionado(coincidenciaFija);
            } else {
              setMonitorSeleccionado({
                id: 'm6',
                isAiGenerated: true,
                name: comp.name,
                consumo: compTdp || 35,
                img: MONITORES.find(m => m.id === 'm6')?.img
              });
            }
          } 
          else if (rawType === 'periferico') {
            const listaPerifericosFijos = PERIFERICOS.filter(p => p.id !== 'p6');
            const coincidenciaFija = listaPerifericosFijos.find(p => comp.name.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]));

            if (coincidenciaFija) {
              setPeriSeleccionados(prev => ({ ...prev, [coincidenciaFija.id]: 1 }));
            } else {
              const customObjeto = {
                id: 'p6',
                isAiGenerated: true,
                name: comp.name,
                consumo: compTdp || 25,
                img: PERIFERICOS.find(p => p.id === 'p6')?.img
              };
              setAiPeriCustom(customObjeto);
              setPeriSeleccionados(prev => ({ ...prev, 'p6': 1 }));
            }
          }
        });
      }

      const mensajeExito = data.isPrebuilt 
        ? `¡Ordenador premontado detectado! Se ha auto-configurado el hardware, la RAM y sus discos.`
        : `¡Hardware vinculado con éxito a la matriz de consumo!`;

      setScanStatus({ text: mensajeExito, type: 'success' });

    } catch (error) {
      console.error("Error en el escáner:", error);
      const msg = error.message.includes("fetch") || error.message.includes("servidor")
        ? "Hubo un problemilla al conectar con el servidor de escaneo. Revisa la conexión en un rato."
        : error.message;
      setScanStatus({ text: msg, type: 'error' });
    } finally {
      setIsLoading(false);
      setInputLink("");
    }
  };

  const generarCanvas = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 600; 
    canvas.height = 740;
    
    ctx.fillStyle = '#0a0f1d';
    ctx.beginPath(); 
    ctx.roundRect(0, 0, 600, 740, 40); 
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; ctx.lineWidth = 1;
    ctx.stroke();

    ctx.textAlign = 'center'; 
    ctx.textBaseline = 'middle';
    ctx.font = '900 13px sans-serif'; 
    ctx.fillStyle = '#64748b'; 
    ctx.letterSpacing = '4px';
    ctx.fillText('INFORME ENERGÉTICO GAMER', 300, 50);
    ctx.letterSpacing = '0px';

    const centroX = 300;
    const centroY = 145; 
    
    ctx.save();
    ctx.shadowColor = 'rgba(34, 211, 238, 0.25)';
    ctx.shadowBlur = 20;
    ctx.font = '900 68px sans-serif'; 
    ctx.fillStyle = '#22d3ee'; 
    const textoPrecio = `${costeMensual.toFixed(moneda.id === 'JPY' ? 0 : 2)}${moneda.sym}`;
    ctx.fillText(textoPrecio, centroX, centroY);
    ctx.restore();

    ctx.font = '700 15px sans-serif'; 
    ctx.fillStyle = '#475569'; 
    ctx.fillText('/ mes', centroX, centroY + 46);

    ctx.font = '800 13px sans-serif';
    ctx.fillStyle = '#4ade80'; 
    ctx.fillText(`${costeDiario.toFixed(moneda.id === 'JPY' ? 0 : 2)}${moneda.sym}/día`, centroX, centroY + 74);

    const nombreRamCanvas = ramSeleccionada?.id === 'r6' ? 'AI SCAN' : (ramSeleccionada ? ramSeleccionada.name.split(' ')[0] : txtNinguno);
    const strRam = ramSeleccionada ? `${nombreRamCanvas} x${ramCantidad}` : txtNinguno;
    const strStorage = storageActivos.map(s => `${s.id === 's6' ? 'AI SCAN' : s.name.split(' ')[0]} (x${storageCantidades[s.id]})`).join(' + ') || txtNinguno;
    const strPerifericosCanvas = perifericosActivos.map(p => p.id === 'p6' ? 'AI SCAN' : p.name.split(' ')[0]).join(' + ') || txtNinguno;

    const itemsGrid = [
      { label: 'GPU', val: gpuSeleccionada ? (gpuSeleccionada.id === 'gpu-custom' ? 'AI SCAN' : gpuSeleccionada.name.replace('RTX', '')) : txtNinguno, watt: `${gpuSeleccionada?.consumo || 0}W`, color: '#4ade80', icon: '🎨' },
      { label: 'CPU', val: cpuSeleccionada ? (cpuSeleccionada.id === 'cpu-custom' ? 'AI SCAN' : cpuSeleccionada.name) : txtNinguno, watt: `${cpuSeleccionada?.consumo || 0}W`, color: '#3b82f6', icon: '🔳' },
      { label: 'MONITOR', val: monitorSeleccionado ? (monitorSeleccionado.id === 'm6' ? 'AI SCAN' : monitorSeleccionado.name) : txtNinguno, watt: `${monitorSeleccionado?.consumo || 0}W`, color: '#a855f7', icon: '🖥️' },
      { label: 'PERIFÉRICOS', val: strPerifericosCanvas, watt: `${vatiosPerifericos}W`, color: '#f97316', icon: '⌨️' },
      { label: 'RAM', val: strRam, watt: `${(ramSeleccionada?.consumo || 0) * ramCantidad}W`, color: '#ec4899', icon: '💾' },
      { label: 'ALMACENAMIENTO', val: strStorage, watt: `${vatiosStorage}W`, color: '#10b981', icon: '💽' } 
    ];

    const inicioY = 300; const altoFila = 85; const colA_X = 65; const colB_X = 335; const anchoCol = 200;

    itemsGrid.forEach((item, index) => {
      const esColB = index % 2 !== 0;
      const fila = Math.floor(index / 2);
      
      const posX = esColB ? colB_X : colA_X;
      const posY = inicioY + (fila * altoFila);

      ctx.textAlign = 'left'; ctx.font = '24px sans-serif'; ctx.fillText(item.icon, posX, posY + 20);
      ctx.font = '900 11px sans-serif'; ctx.fillStyle = item.color; ctx.fillText(item.label, posX + 40, posY);
      ctx.font = '700 11px sans-serif'; ctx.fillStyle = '#475569'; ctx.fillText(`(${item.watt})`, posX + 45 + ctx.measureText(item.label).width, posY);
      ctx.font = '700 15px sans-serif'; ctx.fillStyle = '#f8fafc'; 
      
      let cleanVal = item.val.toUpperCase();
      if (ctx.measureText(cleanVal).width > anchoCol) {
        while (ctx.measureText(cleanVal + '...').width > anchoCol && cleanVal.length > 0) {
          cleanVal = cleanVal.substring(0, cleanVal.length - 1);
        }
        cleanVal += '...';
      }
      ctx.fillText(cleanVal, posX + 40, posY + 26);
    });

    const divisorY = 585; 
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(50, divisorY); ctx.lineTo(550, divisorY); ctx.stroke();

    ctx.textAlign = 'center'; ctx.font = '700 12px sans-serif'; ctx.fillStyle = '#475569';
    ctx.fillText(`CONSUMO ESTIMADO: ${consumoTotal}W  |  TARIFA APLICADA: ${precioKwh}${moneda.sym}/kWh`, 300, divisorY + 30);

    ctx.save();
    ctx.shadowColor = 'rgba(34, 211, 238, 0.4)'; ctx.shadowBlur = 15;
    ctx.font = '900 22px sans-serif'; ctx.fillStyle = '#22d3ee'; ctx.letterSpacing = '2px';
    ctx.fillText(appUrl, 300, divisorY + 75);
    ctx.restore();

    return canvas;
  };

  const descargarImagen = () => {
    try {
      const canvas = generarCanvas();
      const link = document.createElement('a');
      link.download = `pc-spend-report.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) { console.error("Error al descargar el reporte visual:", error); }
  };

  const compartirImagen = async () => {
    try {
      const canvas = generarCanvas();
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([ new ClipboardItem({ "image/png": blob }) ]);
          alert("¡Reporte copiado como imagen al portapapeles! Ya puedes pegarlo directamente.");
        }
      });
    } catch (err) { console.error("No se pudo copiar la imagen automáticamente:", err); }
  };

  return (
    <>
      {/* ================= INYECCIÓN DE METAETIQUETAS DINÁMICAS Y ESTILOS GLOBALES (SEO + FIXES MÓVIL) ================= */}
      <Helmet>
        <title>
          {lang === 'ES' 
            ? 'Calculadora de Consumo Eléctrico PC Gaming | PC Spend' 
            : 'PC Power Consumption Calculator - Gaming PC Wattage | PC Spend'}
        </title>
        <meta 
          name="description" 
          content={
            lang === 'ES'
              ? 'Calcula cuánto consume tu PC en vatios (W) y el coste real en tu factura de la luz. Escanea componentes por IA desde Amazon o PcComponentes.'
              : 'Calculate your gaming PC power consumption in watts (W) and its real electricity bill cost. Scan hardware components with AI from Amazon.'
          } 
        />
        <meta 
          name="keywords" 
          content="calculadora consumo pc, vatios pc gamer, pc power consumption calculator, gaming pc wattage, electricity cost pc, pc spend" 
        />
        <link rel="canonical" href="https://pcspend.com" />

        {/* MODIFICADO: Inyección de micro-estilos CSS definitivos de fuerza bruta con selectores comodín para Buy Me a Coffee en móviles */}
        <style>
          {`
            @media (max-w: 768px) {
              /* Forzar encogimiento masivo del widget flotante de BMC y su contenedor principal */
              iframe[src*="buymeacoffee.com"], 
              #bmc-wbtn, 
              [id*="bmc-overlay"], 
              [class*="bmc-overlay"],
              div[style*="buymeacoffee"] {
                transform: scale(0.65) !important;
                transform-origin: bottom right !important;
                bottom: 58px !important; /* Lo levantamos sobre la cápsula central mini del StickyTotal */
                right: -5px !important;
                max-width: 80vw !important; /* Capa de protección para que el chat flotante no se desborde */
              }
              
              /* Si el widget desplegado se sale de la pantalla, controlamos su iframe interior de respuesta */
              [id*="bmc"] iframe, .bmc-iframe {
                max-height: 65vh !important;
                max-width: 100% !important;
              }
            }
          `}
        </style>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-[#0a0f24] via-[#070b19] to-[#040610] text-white p-4 md:p-6 font-sans transition-all flex flex-col">
        <div className="flex-grow">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto mb-8 gap-4">
            
            {/* Logo e isotipo más grandes y llamativos en móviles (w-14 h-14) */}
            <RouterLink to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <img 
                src={logoWeb} 
                alt="PC Spend Logo" 
                className="w-14 h-14 md:w-12 md:h-12 object-contain filter drop-shadow-[0_2px_10px_rgba(34,211,238,0.4)]" 
              />
              <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent uppercase tracking-tighter filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                {t.title}
              </h1>
            </RouterLink>

            {/* Contenedor flex horizontal que iguala alturas y simetría en móviles */}
            <div className="flex flex-row gap-3 w-full md:w-auto justify-center items-center">
              
              {/* Idiomas: Mapeo lineal idéntico al de las monedas en lugar de rejilla alta */}
              <div className="flex bg-slate-900/60 rounded-xl p-1 border border-slate-800/80 backend-blur-md h-9 items-center overflow-x-auto scrollbar-none max-w-[155px] xs:max-w-none">
                {['ES', 'EN', 'FR', 'JP', 'DE', 'PT'].map(l => (
                  <button 
                    key={l} 
                    onClick={() => seleccionarIdioma(l)} 
                    className={`px-2 py-1 rounded-lg text-[10px] md:text-xs font-black transition-all shrink-0 h-7 flex items-center justify-center ${lang === l ? 'bg-blue-600 text-white shadow-md font-black' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Monedas: Ahora mide exactamente los mismos h-9 y se comporta igual */}
              <div className="flex bg-slate-900/60 rounded-xl p-1 border border-slate-800/80 backdrop-blur-md h-9 items-center overflow-x-auto scrollbar-none">
                {divisas.map(d => (
                  <button 
                    key={d.id} 
                    onClick={() => cambiarMoneda(d)} 
                    className={`px-3 py-1 rounded-lg text-[10px] md:text-xs font-black transition-all shrink-0 h-7 flex items-center justify-center ${moneda.id === d.id ? 'bg-blue-600 text-white shadow-md font-black' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {d.id}
                  </button>
                ))}
              </div>

            </div>
          </div>
          
          <AiScanExpress t={t} inputLink={inputLink} setInputLink={setInputLink} isLoading={isLoading} handleAnalizarLink={handleAnalizarLink} scanStatus={scanStatus} />

          <HardwareGrid 
            t={t} theme={theme}
            gpuSeleccionada={gpuSeleccionada} setGpuSeleccionada={setGpuSeleccionada}
            cpuSeleccionada={cpuSeleccionada} setCpuSeleccionada={setCpuSeleccionada}
            monitorSeleccionado={monitorSeleccionado} setMonitorSeleccionado={setMonitorSeleccionado}
            periSeleccionados={periSeleccionados} setPeriSeleccionados={setPeriSeleccionados}
            aiPeriCustom={aiPeriCustom} setAiPeriCustom={setAiPeriCustom}
            ramSeleccionada={ramSeleccionada} setRamSeleccionada={setRamSeleccionada}
            ramCantidad={ramCantidad} setRamCantidad={setRamCantidad}
            storageCantidades={storageCantidades} setStorageCantidades={setStorageCantidades}
            txtNinguno={txtNinguno}
          />

          <Controls t={t} horas={horas} setHoras={setHoras} precioKwh={precioKwh} setPrecioKwh={setPrecioKwh} moneda={moneda} ajustarPrecio={ajustarPrecio} isVariableRate={isVariableRate} setIsVariableRate={setIsVariableRate} />

          <Report t={t} lang={lang} theme={theme} costeMensual={costeMensual} costeDiario={costeDiario} moneda={moneda} gpuSeleccionada={gpuSeleccionada} cpuSeleccionada={cpuSeleccionada} monitorSeleccionado={monitorSeleccionado} periSeleccionados={periSeleccionados} aiPeriCustom={aiPeriCustom} ramSeleccionada={ramSeleccionada} ramCantidad={ramCantidad} storageCantidades={storageCantidades} txtNinguno={txtNinguno} compartirImagen={compartirImagen} descargarImagen={descargarImagen} generarCanvas={generarCanvas} />
        </div>

        {/* ================= SECCIÓN DE PREGUNTAS FRECUENTES (FAQ) INTERACTIVA Y TRADUCIBLE ================= */}
        {t.faq && (
          <section className="max-w-4xl w-full mx-auto my-16 px-4 relative z-10">
            <h2 className="text-xl md:text-2xl font-black bg-gradient-to-r from-white via-blue-200 to-cyan-100 bg-clip-text text-transparent uppercase tracking-tight text-center mb-8">
              {t.faqTitle || "Preguntas Frecuentes"}
            </h2>
            <div className="space-y-4">
              {t.faq.map((item, index) => (
                <details 
                  key={index} 
                  className="group bg-[#131a2e]/60 border border-slate-800/70 rounded-2xl p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition-all duration-300 hover:border-cyan-500/30 select-none"
                >
                  <summary className="flex justify-between items-center font-bold text-slate-200 text-sm md:text-base gap-4">
                    <span>{item.q}</span>
                    <span className="text-cyan-400 text-xs transition-transform duration-300 group-open:-rotate-180 shrink-0">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-xs md:text-sm text-slate-400 leading-relaxed border-t border-slate-800/50 pt-3 animate-in fade-in duration-200">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Mapeo de propiedades cortocutadas blindado contra nulos */}
        <StickyTotal 
          lang={lang || 'ES'} 
          costeMensual={costeMensual || 0} 
          costeDiario={costeDiario || 0} 
          moneda={moneda || { sym: '€', id: 'EUR', tasa: 1 }} 
          consumoTotal={consumoTotal || 0} 
          visible={showSticky} 
          gpuSeleccionada={gpuSeleccionada || null} 
          cpuSeleccionada={cpuSeleccionada || null} 
          monitorSeleccionado={monitorSeleccionado || null} 
          textoPerifericos={textoPeriCompacto || ''} 
          ramSeleccionada={ramSeleccionada || null} 
          textoStorage={textoStorageCompacto || ''} 
          txtNinguno={txtNinguno || 'NINGUNO'} 
        />

        <Footer t={t} />
      </div>
    </>
  )
}

export default Home