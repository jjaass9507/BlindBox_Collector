
import React from 'react';
import { Package, ChevronRight, Star, Settings, CheckCircle2 } from 'lucide-react';

interface SeriesCardProps {
  seriesName: string;
  count: number;
  totalCollected: number;
  coverImage: string;
  onClick: () => void;
  onEdit: () => void;
  totalInSeries?: number;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ seriesName, count, totalCollected, coverImage, onClick, onEdit, totalInSeries = 12 }) => {
  const percentage = Math.min((count / totalInSeries) * 100, 100);
  const isComplete = count >= totalInSeries;

  return (
    <div className="group relative h-80 w-full perspective-1000">
      {/* Card Container */}
      <div className="relative h-full w-full rounded-3xl bg-dark-800 border-2 border-white/10 shadow-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_-15px_rgba(167,139,250,0.5)] overflow-hidden cursor-pointer" onClick={onClick}>
        
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img 
            src={coverImage} 
            alt={seriesName} 
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80 ${isComplete ? 'grayscale-0' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          
          {/* Top Row: Badge & Edit */}
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start z-20">
             <div className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                <Package size={14} className="text-primary" />
                <span>系列</span>
             </div>
             
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
                className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                title="設定系列"
            >
                <Settings size={16} />
             </button>
          </div>

          <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
            <h3 className="text-2xl font-game font-bold text-white mb-1 leading-tight drop-shadow-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
              {seriesName}
            </h3>
            <p className="text-gray-300 text-xs font-bold tracking-wider uppercase mb-4 opacity-80 flex items-center gap-2">
              POP MART 收藏
              {isComplete && <span className="text-success flex items-center gap-1"><CheckCircle2 size={12}/> 全收集達成</span>}
            </p>

            {/* Progress Bar */}
            <div className="bg-dark-900/80 backdrop-blur rounded-xl p-3 border border-white/10">
              <div className="flex justify-between items-center text-xs font-bold text-gray-400 mb-2">
                <span className="flex items-center gap-1"><Star size={12} className={isComplete ? "text-success" : "text-accent"} /> 收集進度</span>
                <span className="text-white">{count} / {totalInSeries}</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                 <div 
                    className={`h-full bg-gradient-to-r ${isComplete ? 'from-success to-emerald-400' : 'from-primary to-secondary'}`}
                    style={{ width: `${percentage}%` }} 
                 ></div>
              </div>
            </div>

            {/* Action Call */}
            <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
               <span>查看收藏</span>
               <ChevronRight size={16} />
            </div>
          </div>
        </div>
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundSize: '200% 200%' }}></div>
      </div>
    </div>
  );
};

export default SeriesCard;
