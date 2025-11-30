
import React from 'react';
import { CollectionItem, ITEM_STATUS_LABELS, ItemStatusType } from '../types';
import { Calendar, Trash2, Box, Pencil } from 'lucide-react';

interface Props {
  item: CollectionItem;
  seriesName: string;
  onDelete: (id: string) => void;
  onEdit: (item: CollectionItem) => void;
}

const getStatusColor = (status?: ItemStatusType) => {
    switch(status) {
        case 'not_owned': return 'bg-gray-600/80 text-gray-300 border border-gray-500/50';
        case 'stored': return 'bg-blue-500/80 text-white';
        case 'displayed': 
        default: return 'bg-emerald-500/80 text-white'; 
    }
};

const CollectionItemCard: React.FC<Props> = ({ item, seriesName, onDelete, onEdit }) => {
  const status = item.status || 'displayed';
  const isNotOwned = status === 'not_owned';

  return (
    <div className={`group relative bg-dark-800 rounded-2xl border-2 hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] flex flex-col h-full overflow-hidden shadow-xl ${isNotOwned ? 'border-dashed border-gray-700 opacity-80 hover:opacity-100' : 'border-dark-700'}`}>
      
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-dark-900 border-b border-white/5 group">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isNotOwned ? 'grayscale contrast-125' : ''}`} 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gradient-to-br from-dark-800 to-dark-900">
            <Box size={48} className={`mb-2 opacity-50`} />
            <span className="text-xs font-medium opacity-50">無圖片</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-md shadow-sm uppercase tracking-wide z-10 ${getStatusColor(status)}`}>
            {ITEM_STATUS_LABELS[status]}
        </div>

        {/* Shine effect overlay - z-0 to be behind buttons */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full group-hover:translate-x-full z-0" style={{ transitionDuration: '1s' }}></div>

        {/* Action Buttons - High Z-index */}
        <div className="absolute top-2 right-2 flex gap-2 z-20">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                }}
                className="p-2 bg-dark-900/80 text-blue-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-500 hover:text-white backdrop-blur-sm shadow-lg transform translate-y-[-10px] group-hover:translate-y-0"
                title="編輯"
            >
                <Pencil size={16} />
            </button>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    if(window.confirm('確定要移除這個收藏嗎？')) onDelete(item.id);
                }}
                className="p-2 bg-dark-900/80 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white backdrop-blur-sm shadow-lg transform translate-y-[-10px] group-hover:translate-y-0 delay-75"
                title="移除"
            >
                <Trash2 size={16} />
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow relative">
        <div className="mb-1 flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/10 uppercase tracking-wide truncate max-w-full`}>
                {seriesName}
            </span>
        </div>
        
        <h3 className={`text-lg font-game font-bold mb-1 leading-tight group-hover:text-primary transition-colors ${isNotOwned ? 'text-gray-400' : 'text-gray-100'}`}>
            {item.name}
        </h3>
        
        <div className="bg-dark-900/50 rounded-lg p-2 mb-3 flex-grow border border-white/5">
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                {item.description || "暫無描述。"}
            </p>
            {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/5">
                    {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">#{tag}</span>
                    ))}
                    {item.tags.length > 3 && <span className="text-[9px] text-gray-500">+{item.tags.length - 3}</span>}
                </div>
            )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5 text-xs">
            <div className="flex items-center gap-1 text-gray-500">
                <Calendar size={12} />
                <span>{new Date(item.dateAcquired).toLocaleDateString('zh-TW')}</span>
            </div>
            {item.price ? (
                <div className={`font-bold px-2 py-1 rounded ${isNotOwned ? 'bg-gray-700/50 text-gray-400' : 'bg-accent/10 text-accent'}`}>
                    ${item.price}
                </div>
            ) : null}
        </div>
      </div>
    </div>
  );
};

export default CollectionItemCard;
