import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md border-b-2 border-accenture-purple">
        <div className="flex items-center gap-4">
          <div className="bg-accenture-purple w-8 h-8 flex items-center justify-center font-black italic text-lg transform -skew-x-12">
            A
          </div>
          <div className="h-6 w-[1px] bg-slate-700 hidden sm:block"></div>
          <h1 className="text-sm sm:text-lg font-bold tracking-tight uppercase">
            MEA <span className="text-accenture-purple">Talent Intelligence</span>
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-widest text-slate-400">
          <span className="hover:text-white cursor-pointer transition-colors">DASHBOARD</span>
          <span className="hover:text-white cursor-pointer transition-colors">ARCHIVE</span>
          <span className="text-accenture-purple border-b border-accenture-purple">NEWSLETTER</span>
        </nav>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-xs font-medium">
            © {new Date().getFullYear()} Accenture MEA. Internal Use Only.
          </div>
          <div className="flex gap-6 text-slate-400 text-xs font-bold tracking-widest uppercase">
            <span>KSA</span>
            <span>UAE</span>
            <span>Qatar</span>
            <span>South Africa</span>
            <span>Egypt</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;