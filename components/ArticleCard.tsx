
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  isSelected: boolean;
  onToggle: () => void;
  isDisabled: boolean;
}

const categoryColors: Record<string, string> = {
  'Talent Trend': 'bg-blue-100 text-blue-700',
  'Layoffs': 'bg-red-100 text-red-700',
  'C-Suite': 'bg-purple-100 text-purple-700',
  'Acquisition': 'bg-amber-100 text-amber-700',
  'Labor Law': 'bg-emerald-100 text-emerald-700',
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isSelected, onToggle, isDisabled }) => {
  return (
    <div 
      onClick={!isDisabled || isSelected ? onToggle : undefined}
      className={`group relative bg-white border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full
        ${isSelected 
          ? 'border-accenture-purple ring-4 ring-purple-50 shadow-xl scale-[1.02]' 
          : isDisabled 
            ? 'border-slate-100 opacity-60 grayscale cursor-not-allowed' 
            : 'border-white hover:border-slate-200 hover:shadow-lg'
        }`}
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className={`text-[10px] uppercase font-extrabold px-2 py-1 rounded tracking-widest ${categoryColors[article.category] || 'bg-slate-100 text-slate-700'}`}>
            {article.category}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            {article.date}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3 group-hover:text-accenture-purple transition-colors">
          {article.title}
        </h3>
        
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed italic">
          "{article.snippet}"
        </p>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {article.source}
          </span>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-black text-black hover:text-accenture-purple underline underline-offset-4"
          >
            VIEW SOURCE
          </a>
        </div>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2 bg-accenture-purple text-white p-1 rounded-full shadow-md animate-slide-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;
