
import React from 'react';
import { Lock, Plus, HelpCircle, Star } from 'lucide-react';

interface EmptySlotCardProps {
  type: 'regular' | 'secret';
  onClick: () => void;
}

const EmptySlotCard: React.FC<EmptySlotCardProps> = ({ type, onClick }) => {
  const isSecret = type === 'secret';

  return (
    <div 
        onClick={onClick}
        className={`group relative h-full min-h-[300px] rounded-2xl border-2 border-dashed transition-all duration-300 hover:-translate-y-2 cursor-pointer flex flex-col overflow-hidden
        ${isSecret 
            ? 'bg-dark-900/30 border-yellow-500/30 hover:border-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
            : 'bg-dark-900/30 border-white/10 hover:border-white/30 hover:shadow-lg'
        }`}
    >
      
      {/* Visual Center */}
      <div className="flex-grow flex items-center justify-center relative">
        <div className={`text-6xl font-game font-bold opacity-10 group-hover:scale-110 transition-transform duration-500 select-none
            ${isSecret ? 'text-yellow-500' : 'text-gray-500'}`}>
            ?
        </div>
        
        <div className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-colors
             ${isSecret ? 'bg-yellow-500/10 text-yellow-500' : 'bg-white/5 text-gray-500 group-hover:text-white'}`}>
            <Lock size={16} />
        </div>
      </div>

      {/* Label */}
      <div className="p-4 border-t border-white/5 bg-black/20 text-center">
         <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isSecret ? 'text-yellow-500' : 'text-gray-500'}`}>
            {isSecret ? '未解鎖隱藏款' : '未解鎖收藏'}
         </div>
         <div className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors
            ${isSecret 
                ? 'bg-yellow-500/10 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black' 
                : 'bg-white/5 text-gray-400 group-hover:bg-white group-hover:text-black'}`}>
            <Plus size={12} strokeWidth={3} />
            <span>登錄 / 許願</span>
         </div>
      </div>

    </div>
  );
};

export default EmptySlotCard;
