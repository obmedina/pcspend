// Helpers para resolver dinámicamente las rutas de imágenes en Vite sin romper el empaquetado
const getGpuImg = (name) => new URL(`../assets/gpu/${name}`, import.meta.url).href;
const getCpuImg = (name) => new URL(`../assets/cpu/${name}`, import.meta.url).href;
const getRamImg = (name) => new URL(`../assets/RAM/${name}`, import.meta.url).href;
const getMonitorImg = (name) => new URL(`../assets/monitor/${name}`, import.meta.url).href;
const getPeriImg = (name) => new URL(`../assets/perifericos/${name}`, import.meta.url).href;
const getStorageImg = (name) => new URL(`../assets/storage/${name}`, import.meta.url).href;

export const GPUS = [
  { id: 'g1', name: 'RTX 3060', consumo: 170, brand: 'nvidia', img: getGpuImg('RTX_3060.png') },
  { id: 'g2', name: 'RTX 4060', consumo: 115, brand: 'nvidia', img: getGpuImg('RTX_4060.png') },
  { id: 'g3', name: 'RTX 4070 SUPER', consumo: 220, brand: 'nvidia', img: getGpuImg('RTX_4070_Super.png') },
  { id: 'g11', name: 'RTX 4070 Ti SUPER', consumo: 285, brand: 'nvidia', img: getGpuImg('RTX_4070_Ti_Super.png') },
  { id: 'g4', name: 'RX 6600', consumo: 132, brand: 'amd', img: getGpuImg('RX_6600.png') },
  { id: 'g5', name: 'RTX 4090', consumo: 450, brand: 'nvidia', img: getGpuImg('RTX_4090.png') },
  { id: 'g6', name: 'RTX 4060 Ti', consumo: 160, brand: 'nvidia', img: getGpuImg('RTX_4060_Ti.png') },
  { id: 'g7', name: 'RX 7800 XT', consumo: 263, brand: 'amd', img: getGpuImg('RX_7800_XT.png') },
  { id: 'g8', name: 'RX 7900 XTX', consumo: 355, brand: 'amd', img: getGpuImg('RX_7900_XTX.png') },
  { id: 'g9', name: 'Arc A770', consumo: 225, brand: 'intel', img: getGpuImg('ARC_A770.png') },
  { id: 'g10', name: 'GTX 1650', consumo: 75, brand: 'nvidia', img: getGpuImg('GTX_1650.png') },
  { id: 'gpu-custom', name: 'AI SCAN', consumo: 0, brand: 'nvidia', img: getGpuImg('RANDOM_GPU.png') }
];

export const CPUS = [
  { id: 'c1', name: 'RYZEN 7 7800X3D', consumo: 120, brand: 'amd', img: getCpuImg('R7_7800X3D.png') },
  { id: 'c2', name: 'RYZEN 5 5600X', consumo: 65, brand: 'amd', img: getCpuImg('R5_5600X.png') },
  { id: 'c3', name: 'INTEL i5-12400F', consumo: 65, brand: 'intel', img: getCpuImg('i5.jpg') },
  { id: 'c4', name: 'RYZEN 5 7600X', consumo: 105, brand: 'amd', img: getCpuImg('R5_7600X.png') },
  { id: 'c11', name: 'RYZEN 5 7600', consumo: 65, brand: 'amd', img: getCpuImg('R5_7600X.png') },
  { id: 'c5', name: 'INTEL i5-13600K', consumo: 150, brand: 'intel', img: getCpuImg('i5.jpg') },
  { id: 'c6', name: 'RYZEN 5 5600G', consumo: 65, brand: 'amd', img: getCpuImg('R5.jpg') },
  { id: 'c7', name: 'INTEL i7-14700K', consumo: 180, brand: 'intel', img: getCpuImg('i7.jpg') },
  { id: 'c8', name: 'RYZEN 7 5700X3D', consumo: 105, brand: 'amd', img: getCpuImg('R7_7800X3D.png') },
  { id: 'c9', name: 'INTEL i9-14900K', consumo: 230, brand: 'intel', img: getCpuImg('i9.jpg') },
  { id: 'c10', name: 'RYZEN 9 7950X', consumo: 170, brand: 'amd', img: getCpuImg('R9_7000SERIES.png') },
  { id: 'cpu-custom', name: 'AI SCAN', consumo: 0, img: getCpuImg('RANDOM_CPU.png') }
];

export const MONITORES = [
  { id: 'm1', name: '24" ESTÁNDAR', consumo: 15, img: getMonitorImg('monitor_24.png') },
  { id: 'm2', name: '24" GAMING', consumo: 35, img: getMonitorImg('monitor_24_gaming.png') },
  { id: 'm3', name: '27" 1440p IPS', consumo: 45, img: getMonitorImg('monitor_27.png') },
  { id: 'm4', name: '32" 4K OLED', consumo: 80, img: getMonitorImg('monitor_32.png') },
  { id: 'm5', name: '34" ULTRA-WIDE', consumo: 70, img: getMonitorImg('monitor_34_ultrawide.png') },
  { id: 'm6', name: 'AI SCAN', consumo: 0, img: getMonitorImg('AI_SCAN.png') }
];

export const PERIFERICOS = [
  { id: 'p1', name: 'BÁSICO (TECLADO + RATÓN ESTÁNDAR)', consumo: 10, img: getPeriImg('standard.png') },
  { id: 'p2', name: 'GAMING ESTÁNDAR (RATÓN + TECLADO RGB)', consumo: 25, img: getPeriImg('rgb.png') },
  { id: 'p3', name: 'GAMING AVANZADO (RGB INALÁMBRICO + ALFOMBRILLA RGB)', consumo: 45, img: getPeriImg('advanced.png') },
  { id: 'p4', name: 'STREAMING STARTER (MICRÓFONO USB + WEBCAM)', consumo: 15, img: getPeriImg('STREAMER.png') },
  { id: 'p5', name: 'SIMRACING COCKPIT (VOLANTE + PEDALES BASE)', consumo: 60, img: getPeriImg('VOLANTE.png') },
  { id: 'p6', name: 'AI SCAN', consumo: 0, img: getPeriImg('AI_SCAN_T.png') }
];

export const RAM = [
  { id: 'r1', name: 'DDR3 ESTÁNDAR', consumo: 3, img: getRamImg('DDR3.png') },
  { id: 'r2', name: 'DDR4 ESTÁNDAR', consumo: 4, img: getRamImg('DDR4.png') },
  { id: 'r3', name: 'DDR5 PERFORMANCE', consumo: 5, img: getRamImg('DDR5.png') },
  { id: 'r4', name: 'DDR4/DDR5 RGB', consumo: 5, img: getRamImg('RAM_RGB.png') },
  { id: 'r5', name: 'DDR4/DDR5 Overclock', consumo: 8, img: getRamImg('DDR5_OC.png') },
  { id: 'r6', name: 'AI SCAN', consumo: 0, img: getRamImg('AI_SCAN.png') }
];

export const ALMACENAMIENTO = [
  { id: 's1', name: 'SSD SATA 2.5"', consumo: 3, img: getStorageImg('sata_ssd.png') },
  { id: 's2', name: 'SSD NVMe M.2', consumo: 6, img: getStorageImg('ssd_m2.png') },
  { id: 's3', name: 'HDD Mecánico 3.5"', consumo: 7, img: getStorageImg('hdd.png') },
  { id: 's4', name: 'SSD M.2 NVMe Gen4 Pro', consumo: 8, img: getStorageImg('SSD_M2_GEN4.png') },
  { id: 's5', name: 'SSD M.2 NVMe Gen5 NextGen', consumo: 11, img: getStorageImg('SSD_M2_GEN5.png') },
  { id: 's6', name: 'AI SCAN', consumo: 0, img: getStorageImg('AI_SCAN.png') }
];