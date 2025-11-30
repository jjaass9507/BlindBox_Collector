
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, Box, Sparkles, Tag, Hash } from 'lucide-react';
import { CollectionItem, Series, ITEM_STATUS_LABELS, ItemStatusType } from '../types';

interface AddBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<CollectionItem, 'id'>) => void;
  editItem?: CollectionItem | null;
  seriesList: Series[];
}

const AddBoxModal: React.FC<AddBoxModalProps> = ({ isOpen, onClose, onAdd, editItem, seriesList }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    seriesId: '',
    description: '',
    price: '',
    notes: '',
    status: 'displayed' as ItemStatusType,
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
        if (editItem) {
            setFormData({
                name: editItem.name,
                seriesId: editItem.seriesId,
                description: editItem.description,
                price: editItem.price ? editItem.price.toString() : '',
                notes: editItem.notes || '',
                status: editItem.status || 'displayed'
            });
            setTags(editItem.tags || []);
            setImagePreview(editItem.imageUrl);
        } else {
            setImagePreview(null);
            setFormData({ 
                name: '', 
                seriesId: seriesList.length > 0 ? seriesList[0].id : '', 
                description: '', 
                price: '', 
                notes: '',
                status: 'displayed'
            });
            setTags([]);
        }
    }
  }, [isOpen, editItem, seriesList]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
        e.preventDefault();
        if (!tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
        }
        setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      seriesId: formData.seriesId,
      description: formData.description,
      imageUrl: imagePreview || '',
      dateAcquired: editItem ? editItem.dateAcquired : new Date().toISOString(),
      price: formData.price ? Number(formData.price) : 0,
      notes: formData.notes,
      status: formData.status,
      tags: tags
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-dark-800 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col max-h-[90vh] animate-float">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-primary/20 to-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <h2 className="text-2xl font-game font-bold text-white flex items-center gap-2 relative z-10 drop-shadow-md">
            <Sparkles className="text-accent" size={24} />
            {editItem ? '修改收藏資訊' : '獲得新戰利品'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X size={24} className="text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="add-box-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Top Section: Image & Basic Info */}
              <div className="flex gap-6">
                  {/* Image Uploader */}
                  <div 
                    className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-dark-900 border-2 border-dashed border-gray-600 hover:border-primary hover:bg-dark-700 transition-all cursor-pointer relative group shadow-inner"
                    onClick={() => fileInputRef.current?.click()}
                  >
                      {imagePreview ? (
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                             <Camera size={24} />
                             <span className="text-[10px] font-bold uppercase">上傳照片</span>
                          </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="text-white" size={24} />
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                  </div>

                  {/* Name, Series & Status */}
                  <div className="flex-grow space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-primary mb-1 uppercase tracking-wider">角色名稱</label>
                        <input 
                            required
                            type="text" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-600 outline-none transition-all font-bold"
                            placeholder="例如：Labubu"
                        />
                      </div>
                       <div>
                        <label className="block text-xs font-bold text-secondary mb-1 uppercase tracking-wider">所屬系列</label>
                        <div className="relative">
                            <Box className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <select
                                required
                                value={formData.seriesId}
                                onChange={e => setFormData({...formData, seriesId: e.target.value})}
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-900 border border-white/10 focus:border-secondary focus:ring-1 focus:ring-secondary text-white outline-none appearance-none cursor-pointer font-bold"
                            >
                                <option value="" disabled>選擇系列...</option>
                                {seriesList.map(series => (
                                    <option key={series.id} value={series.id}>{series.name}</option>
                                ))}
                            </select>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">收藏狀態</label>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as ItemStatusType})}
                            className="w-full px-4 py-2 rounded-xl bg-dark-900 border border-white/10 focus:border-white focus:ring-1 focus:ring-white text-white outline-none appearance-none cursor-pointer font-bold"
                        >
                            {Object.entries(ITEM_STATUS_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                      </div>
                  </div>
              </div>

              {/* Price & Tags Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-dark-900/50 p-3 rounded-2xl border border-white/5">
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">入手價格</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input 
                            type="number" 
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            className="w-full pl-7 pr-3 py-2 rounded-lg bg-dark-800 border border-white/10 focus:border-primary text-white outline-none font-medium"
                            placeholder="0"
                        />
                    </div>
                </div>
                
                 <div className="bg-dark-900/50 p-3 rounded-2xl border border-white/5">
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">自訂標籤</label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input 
                            type="text" 
                            value={tagInput} 
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="w-full pl-8 pr-3 py-2 rounded-lg bg-dark-800 border border-white/10 focus:border-primary text-white outline-none font-medium text-sm"
                            placeholder="按 Enter 新增"
                        />
                    </div>
                </div>
              </div>

              {/* Tags Display */}
              {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                      {tags.map((tag, idx) => (
                          <span key={idx} className="bg-primary/20 text-primary border border-primary/30 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 animate-in fade-in zoom-in">
                              #{tag}
                              <button type="button" onClick={() => removeTag(tag)} className="hover:text-white"><X size={12} /></button>
                          </span>
                      ))}
                  </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase flex items-center gap-1">
                    <Tag size={12} /> 描述
                </label>
                <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:border-primary text-white placeholder-gray-600 outline-none transition-all resize-none text-sm leading-relaxed"
                    placeholder="描述一下這個公仔的外觀特色..."
                ></textarea>
              </div>

            </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-dark-900/50 flex justify-end gap-3">
             <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 text-gray-400 font-bold hover:text-white hover:bg-white/5 rounded-xl transition-colors"
             >
                取消
             </button>
             <button 
                type="submit" 
                form="add-box-form"
                className="game-border px-8 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-game font-bold rounded-xl hover:brightness-110 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
             >
                <Check size={20} strokeWidth={3} /> 
                {editItem ? '確認修改' : '確認登錄'}
             </button>
        </div>
      </div>
    </div>
  );
};

export default AddBoxModal;
