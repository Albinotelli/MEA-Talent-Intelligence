import React, { useState, useEffect } from 'react';
import { AppState, Article, Newsletter } from './types';
import { searchHRArticles, generateNewsletterContent } from './services/geminiService';
import ArticleCard from './components/ArticleCard';
import NewsletterPreview from './components/NewsletterPreview';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [isPublicView, setIsPublicView] = useState(false);

  const encodeData = (data: Newsletter): string => {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      ));
    } catch (e) {
      console.error("Encoding failed", e);
      return "";
    }
  };

  const decodeData = (encoded: string): Newsletter | null => {
    try {
      const decoded = decodeURIComponent(Array.prototype.map.call(atob(encoded), (c) => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(decoded);
    } catch (e) {
      console.error("Decoding failed", e);
      return null;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('data');
    if (params.get('view') === 'newsletter' && dataParam) {
      const decodedNewsletter = decodeData(dataParam);
      if (decodedNewsletter) {
        setNewsletter(decodedNewsletter);
        setIsPublicView(true);
        setState(AppState.PUBLISHED);
      } else {
        setError("Invalid newsletter link.");
      }
    }
  }, []);

  const startWorkflow = async () => {
    setState(AppState.SEARCHING);
    setError(null);
    try {
      const results = await searchHRArticles();
      setArticles(results);
      setState(AppState.CURATING);
    } catch (err: any) {
      setError(err.message || "Failed to fetch articles.");
      setState(AppState.IDLE);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 10) return prev;
      return [...prev, id];
    });
  };

  const handleGenerate = async () => {
    if (selectedIds.length < 7 || selectedIds.length > 10) return;
    setState(AppState.GENERATING);
    setError(null);
    try {
      const selectedArticles = articles.filter(a => selectedIds.includes(a.id));
      const result = await generateNewsletterContent(selectedArticles);
      setNewsletter(result);
      setState(AppState.PUBLISHING);
      setTimeout(() => setState(AppState.PUBLISHED), 2500);
    } catch (err: any) {
      setError(err.message || "Synthesis failed.");
      setState(AppState.CURATING);
    }
  };

  const getShareUrl = () => {
    if (!newsletter) return "";
    return `${window.location.origin}${window.location.pathname}?view=newsletter&data=${encodeData(newsletter)}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(getShareUrl());
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const reset = () => {
    setState(AppState.IDLE);
    setArticles([]);
    setSelectedIds([]);
    setNewsletter(null);
    window.history.pushState({}, '', window.location.pathname);
    setIsPublicView(false);
  };

  if (isPublicView && newsletter) {
    return (
      <div className="bg-slate-50 min-h-screen pb-20">
        <div className="bg-black text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-accenture-purple/30 backdrop-blur-md bg-black/95">
          <div className="flex items-center gap-3">
             <div className="bg-accenture-purple w-8 h-8 flex items-center justify-center font-black italic text-lg transform -skew-x-12">A</div>
             <div className="h-6 w-[1px] bg-slate-700 mx-2"></div>
             <span className="text-xs font-bold tracking-[0.2em] uppercase">MEA Talent Intelligence</span>
          </div>
          <div className="flex gap-4">
             <button onClick={() => window.print()} className="text-[10px] font-black border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors uppercase tracking-widest">Print / PDF</button>
             <button onClick={reset} className="text-[10px] font-black bg-accenture-purple px-4 py-2 hover:opacity-90 transition-colors uppercase tracking-widest">Create New</button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto pt-10 px-4 animate-slide-in">
          <div className="mb-6 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">
            <span>Confidential & Internal Only</span>
            <span>Published: {newsletter.generatedDate}</span>
          </div>
          <NewsletterPreview newsletter={newsletter} />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      {state === AppState.IDLE && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-in">
          <div className="mb-8 relative">
             <div className="w-24 h-24 bg-accenture-purple rounded-full flex items-center justify-center shadow-lg shadow-purple-200">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
             </div>
             <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full border-4 border-white flex items-center justify-center font-bold text-white text-[10px]">MEA</div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tighter uppercase">MEA <span className="text-accenture-purple">Talent Intelligence</span></h1>
          <p className="text-lg text-slate-600 max-w-xl mb-10 font-medium">Generate strategic Accenture HR newsletters from 15 real-time talent & legal data points across KSA, UAE, Qatar, South Africa, and Egypt.</p>
          <button onClick={startWorkflow} className="px-8 py-4 bg-black text-white font-bold rounded-none hover:bg-slate-800 transition-all border-b-4 border-accenture-purple shadow-xl tracking-widest uppercase text-sm">INITIATE DISCOVERY</button>
        </div>
      )}

      {state === AppState.SEARCHING && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-in">
          <div className="w-16 h-16 border-4 border-accenture-purple border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight uppercase">Scanning 15 Strategic Sources...</h2>
          <p className="text-slate-500 mt-2 font-medium">Aggregating competitive intelligence for the MEA region</p>
        </div>
      )}

      {state === AppState.CURATING && (
        <div className="animate-slide-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-8">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Curation Lab</h2>
              <p className="text-slate-500 mt-1 font-medium italic">Select 7 to 10 articles to build your briefing.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-black tracking-widest uppercase px-4 py-2 rounded-full border ${selectedIds.length >= 7 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                {selectedIds.length} / 10 Selected
              </span>
              <button
                disabled={selectedIds.length < 7}
                onClick={handleGenerate}
                className={`px-8 py-3 rounded-none font-bold tracking-widest uppercase transition-all text-sm ${selectedIds.length >= 7 ? 'bg-accenture-purple text-white hover:opacity-90 shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                GENERATE NEWSLETTER
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                isSelected={selectedIds.includes(article.id)}
                onToggle={() => toggleSelection(article.id)}
                isDisabled={!selectedIds.includes(article.id) && selectedIds.length >= 10}
              />
            ))}
          </div>
        </div>
      )}

      {(state === AppState.GENERATING || state === AppState.PUBLISHING) && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-slide-in">
          <div className="w-24 h-24 relative mb-8">
            <div className="absolute inset-0 border-4 border-accenture-purple border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-black border-b-transparent rounded-full animate-spin [animation-direction:reverse]"></div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            {state === AppState.GENERATING ? 'Synthesizing Strategic Content...' : 'Finalizing Insights Portal...'}
          </h2>
          <p className="text-slate-500 mt-2 font-medium italic">Constructing synopses and cross-regional insights</p>
        </div>
      )}

      {state === AppState.PUBLISHED && newsletter && (
        <div className="animate-slide-in pb-20">
          <div className="flex justify-between items-center mb-8 sticky top-[72px] z-40 bg-white/90 backdrop-blur-md p-4 shadow-sm border border-slate-200">
            <h2 className="text-sm font-black text-accenture-purple flex items-center gap-2 tracking-[0.2em] uppercase">
               <span className="bg-green-500 text-white px-2 py-1 text-[10px]">LIVE</span> ACCENTURE MEA PORTAL
            </h2>
            <div className="flex gap-2">
                <button onClick={handleShare} className="px-6 py-2 border-2 border-slate-900 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">COPY SHARE LINK</button>
                <button onClick={reset} className="px-6 py-2 bg-black text-white font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">NEW WORKFLOW</button>
            </div>
          </div>
          <NewsletterPreview newsletter={newsletter} />
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 rounded-none font-bold text-sm tracking-widest shadow-2xl z-[100] animate-slide-in border-b-4 border-accenture-purple">
          SHARE LINK COPIED TO CLIPBOARD
        </div>
      )}

      {error && (
        <div className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 text-red-700 flex justify-between items-center animate-slide-in shadow-md">
          <div className="flex items-center gap-3">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <div>
               <p className="font-black uppercase text-xs tracking-widest">Workflow Error</p>
               <p className="text-sm opacity-80">{error}</p>
             </div>
          </div>
          <button onClick={() => setError(null)} className="font-bold underline text-xs uppercase tracking-widest">Dismiss</button>
        </div>
      )}
    </Layout>
  );
};

export default App;