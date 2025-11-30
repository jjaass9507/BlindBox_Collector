
import React, { useState, useEffect } from 'react';
import { X, Check, Box, Image as ImageIcon, Trash2, Hash, Star } from 'lucide-react';
import { Series } from '../types';

interface SeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (series: Omit<Series, 'id'>) => void;
  onDelete?: (id: string) => void;
  editSeries?: Series | null;
}

const SeriesModal: React.FC<SeriesModalProps> = ({ isOpen, onClose, onSave, onDelete, editSeries }) => {
  const [formData, setFormData] = useState({
    name: '',
    coverImage: '',
    totalRegular: 12,
    totalSecret: 1
  });

  useEffect(() => {
    if (isOpen) {
      if (editSeries) {
        setFormData({
          name: editSeries.name,
          coverImage: editSeries.coverImage,
          totalRegular: editSeries.totalRegular || 12,
          totalSecret: editSeries.totalSecret !== undefined ? editSeries.totalSecret : 1
        });
      } else {
        setFormData({ name: '', coverImage: '', totalRegular: 12, totalSecret: 1 });
      }
    }
  }, [isOpen, editSeries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (editSeries && onDelete) {
        if (window.confirm(`確定要刪除「${editSeries.name}」系列嗎？\n注意：該系列下的所有收藏品也會一併被刪除！`)) {
            onDelete(editSeries.id);
            onClose();
        }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-dark-800 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col animate-float">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-accent/20 to-orange-500/20">
          <h2 className="text-xl font-game font-bold text-white flex items-center gap-2">
            <Box className="text-accent" size={24} />
            {editSeries ? '編輯系列設定' : '建立新系列'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
            <form id="series-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-accent mb-1 uppercase tracking-wider">系列名稱</label>
                <input 
                    required
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent text-white placeholder-gray-600 outline-none transition-all font-bold"
                    placeholder="例如：DIMOO 水族館"
                />
              </div>

              {/* Series Counts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <Hash size={12} /> 常規款總數
                    </label>
                    <input 
                        type="number" 
                        min="1"
                        value={formData.totalRegular} 
                        onChange={e => setFormData({...formData, totalRegular: Number(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:border-accent text-white outline-none transition-all font-bold"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                        <Star size={12} className="text-yellow-500" /> 隱藏款總數
                    </label>
                    <input 
                        type="number" 
                        min="0"
                        value={formData.totalSecret} 
                        onChange={e => setFormData({...formData, totalSecret: Number(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:border-accent text-white outline-none transition-all font-bold"
                    />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon size={12} /> 封面圖片網址 (URL)
                </label>
                <input 
                    required
                    type="url" 
                    value={formData.coverImage} 
                    onChange={e => setFormData({...formData, coverImage: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:border-accent focus:ring-1 focus:ring-accent text-white placeholder-gray-600 outline-none transition-all"
                    placeholder="https://..."
                />
                {formData.coverImage && (
                    <div className="mt-3 h-32 w-full rounded-xl overflow-hidden border border-white/10 bg-dark-900 relative group">
                         <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                )}
              </div>

            </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-dark-900/50 flex justify-between gap-3 items-center">
             
             {editSeries && (
                 <button 
                    type="button" 
                    onClick={handleDelete}
                    className="px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-2 font-bold text-sm"
                 >
                    <Trash2 size={16} /> 刪除系列
                 </button>
             )}
             {!editSeries && <div></div>} {/* Spacer */}

             <div className="flex gap-3">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="px-5 py-2.5 text-gray-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                    取消
                </button>
                <button 
                    type="submit" 
                    form="series-form"
                    className="game-border px-8 py-2.5 bg-gradient-to-r from-accent to-orange-500 text-dark-900 font-game font-bold rounded-xl hover:brightness-110 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                    <Check size={20} strokeWidth={3} /> 
                    儲存
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesModal;
