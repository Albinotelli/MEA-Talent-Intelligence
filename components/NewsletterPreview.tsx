import React from 'react';
import { Newsletter } from '../types';

const NewsletterPreview: React.FC<{ newsletter: Newsletter }> = ({ newsletter }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl overflow-hidden border border-slate-200 print:shadow-none print:border-none">
      {/* Brand Header */}
      <div className="bg-black text-white p-10 flex justify-between items-end border-b-8 border-accenture-purple">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accenture-purple w-12 h-12 flex items-center justify-center font-black italic text-2xl transform -skew-x-12">A</div>
            <div className="h-8 w-[2px] bg-slate-700"></div>
            <span className="font-bold tracking-[0.2em] uppercase text-sm">Accenture MEA</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase leading-none tracking-tighter max-w-xl italic">
            {newsletter.title}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-accenture-purple font-black text-2xl uppercase tracking-tighter italic whitespace-nowrap">
            {newsletter.generatedDate}
          </p>
        </div>
      </div>

      <div className="p-12 space-y-16">
        {/* Executive Intro */}
        <section>
          <div className="w-12 h-1 bg-accenture-purple mb-6"></div>
          <p className="text-xl text-slate-800 leading-relaxed font-medium italic">
            {newsletter.intro}
          </p>
        </section>

        {/* Sections and Detailed Articles */}
        {newsletter.sections.map((section, idx) => (
          <section key={idx} className="space-y-10">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <span className="text-accenture-purple font-black text-3xl">0{idx + 1}</span>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight italic">
                {section.heading}
              </h2>
            </div>
            
            <p className="text-slate-600 font-medium leading-relaxed mb-8">
              {section.content}
            </p>

            <div className="space-y-12">
              {section.articles.map((art, artIdx) => (
                <div key={artIdx} className="group border-l-4 border-slate-100 pl-8 hover:border-accenture-purple transition-colors duration-300">
                  {/* Article Headline */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-accenture-purple transition-colors">
                      {art.title}
                    </h3>
                    <a href={art.url} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-2 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all ml-4 shrink-0">
                      Link
                    </a>
                  </div>
                  
                  {/* Source Attribution */}
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    SOURCE: {art.source}
                  </p>

                  {/* Synopsis (3-4 lines) */}
                  <p className="text-slate-700 leading-relaxed text-sm italic mb-6 border-b border-slate-50 pb-6">
                    {art.synopsis}
                  </p>

                  {/* Strategic Insights Segment (Exactly 3 lines) */}
                  <div className="bg-slate-50 p-6 border-r-4 border-accenture-purple">
                    <h4 className="text-[10px] font-black text-accenture-purple uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.657 15.657a1 1 0 001.414-1.414l-.707-.707a1 1 0 10-1.414 1.414l.707.707zM16 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" />
                      </svg>
                      Strategic Insights for Accenture
                    </h4>
                    <div className="text-slate-800 text-xs font-bold leading-relaxed whitespace-pre-line border-l border-slate-200 pl-4">
                      {art.strategicInsights}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Final Executive Summary */}
        <section className="bg-black text-white p-10 mt-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accenture-purple opacity-10 transform translate-x-16 -translate-y-16 rotate-45"></div>
          <h3 className="text-[10px] font-black text-accenture-purple uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-accenture-purple"></span>
            Closing Strategic Outlook
          </h3>
          <p className="text-slate-300 leading-relaxed font-medium italic mb-8 relative z-10">
            {newsletter.conclusion}
          </p>
          <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-[9px] font-bold tracking-[0.2em] text-slate-500 uppercase">
            <span>Confidential & Proprietary</span>
            <span>MEA HR Excellence Hub</span>
          </div>
        </section>
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:block text-center py-6 text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] border-t border-slate-100">
        Accenture MEA HR Intelligence Hub • Regional Governance & Strategy
      </div>
    </div>
  );
};

export default NewsletterPreview;