
import React from 'react';
import { CollectionItem } from '../types';
import { Wallet, Box, Trophy } from 'lucide-react';

interface CollectionStatsProps {
  items: CollectionItem[];
}

const CollectionStats: React.FC<CollectionStatsProps> = ({ items }) => {
  // Only count items that are actually owned (displayed or stored)
  const activeItems = items.filter(i => i.status === 'displayed' || i.status === 'stored');
  const totalValue = activeItems.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Level calculation based on owned items count
  const ownedCount = activeItems.length;
  const level = Math.floor(ownedCount / 5) + 1;
  const progress = (ownedCount % 5) * 20;

  if (items.length === 0) return null;

  return (
    <div className="bg-dark-800 rounded-3xl p-1 shadow-2xl border border-white/10 mb-8 overflow-hidden">
      <div className="bg-dark-900/50 p-6 rounded-[20px] backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Player Profile / Level */}
            <div className="flex items-center gap-6 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-white/20">
                        {level}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-dark-900 text-xs font-bold px-2 py-0.5 rounded border border-white/20 text-gray-400">
                        LVL
                    </div>
                </div>
                <div className="flex-grow">
                    <h2 className="text-xl font-game font-bold text-white mb-1">收藏家等級</h2>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                        <span>經驗值</span>
                        <span>{ownedCount} / {(level) * 5} 收藏</span>
                    </div>
                    <div className="h-3 w-full bg-dark-900 rounded-full overflow-hidden border border-white/10">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 col-span-2">
                
                {/* Stat 1: Value */}
                <div className="bg-dark-900 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Wallet size={48} />
                    </div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">現有資產價值</div>
                    <div className="text-2xl font-game font-bold text-success flex items-baseline gap-1">
                        <span className="text-sm">$</span>
                        <span>{totalValue.toLocaleString()}</span>
                    </div>
                </div>

                 {/* Stat 2: Total Items */}
                 <div className="bg-dark-900 rounded-xl p-4 border border-white/5 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Box size={48} />
                    </div>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">目前持有</div>
                    <div className="text-2xl font-game font-bold text-secondary flex items-baseline gap-2">
                        {ownedCount} <span className="text-sm text-gray-600 font-normal">個</span>
                        {items.length - ownedCount > 0 && (
                            <span className="text-xs text-gray-500 font-normal border-l border-white/10 pl-2">
                                + {items.length - ownedCount} (未擁有)
                            </span>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionStats;
