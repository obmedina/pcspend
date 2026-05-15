const Footer = ({ t }) => {
  return (
    <footer className="max-w-5xl mx-auto mt-20 pb-10 px-4 border-t border-slate-800/50 pt-8 text-center">
      {/* Texto de descargo de responsabilidad */}
      <p className="text-slate-500 text-[10px] leading-relaxed max-w-2xl mx-auto uppercase tracking-widest mb-6 italic">
        {t.disclaimer}
      </p>
      
      {/* Identidad de marca */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
          <span className="w-8 h-[1px] bg-slate-800"></span>
          PC SPEND ⚡ {new Date().getFullYear()}
          <span className="w-8 h-[1px] bg-slate-800"></span>
        </div>
        <p className="text-[10px] text-blue-500/50 font-black tracking-[0.2em] uppercase">
          Developed with ⚡ by ZANG
        </p>
      </div>
    </footer>
  );
};

export default Footer;