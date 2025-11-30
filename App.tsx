
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { CollectionItem, SortOption, Series, ITEM_STATUS_LABELS, ItemStatusType } from './types';
import CollectionItemCard from './components/CollectionItemCard';
import AddBoxModal from './components/AddBoxModal';
import SeriesModal from './components/SeriesModal';
import CollectionStats from './components/CollectionStats';
import SeriesCard from './components/SeriesCard';
import EmptySlotCard from './components/EmptySlotCard';
import { Plus, Search, Filter, Box, Gamepad2, Sparkles, ArrowLeft, LayoutGrid, LayoutList } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_ITEMS = 'boxjoy_items_v5';
const STORAGE_KEY_SERIES = 'boxjoy_series_v5';

// --- SEED DATA DEFINITIONS ---

const SEED_SERIES: Series[] = [
    { id: 's1', name: 'DIMOO 水族館系列', coverImage: 'https://images.unsplash.com/photo-1513035068991-537c355c3c0d?auto=format&fit=crop&q=80&w=800', totalRegular: 12, totalSecret: 1 },
    { id: 's2', name: 'DIMOO 森林之夜', coverImage: 'https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&q=80&w=800', totalRegular: 12, totalSecret: 1 },
    { id: 's3', name: 'DIMOO 星座系列', coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800', totalRegular: 12, totalSecret: 1 },
    { id: 's4', name: 'DIMOO 侏羅紀', coverImage: 'https://images.unsplash.com/photo-1606138673479-7098418728a5?auto=format&fit=crop&q=80&w=800', totalRegular: 12, totalSecret: 1 },
    { id: 's5', name: 'DIMOO 寵物度假', coverImage: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=800', totalRegular: 12, totalSecret: 1 },
];

const SEED_ITEMS: Omit<CollectionItem, 'id'>[] = [
    { seriesId: 's1', name: '北極熊潛水員', description: '頭上戴著北極熊帽子的潛水員。', imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 3500, status: 'displayed', tags: ['熱門'] },
    { seriesId: 's1', name: '章魚', description: '粉紅色的章魚觸手非常可愛。', imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 300, status: 'stored', tags: [] },
    { seriesId: 's1', name: '水母', description: '透明感的水母造型，夢幻又神祕。', imageUrl: 'https://images.unsplash.com/photo-1548425550-b37d446bf70a?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 300, status: 'displayed', tags: [] },
    { seriesId: 's1', name: '海龜', description: '背著小龜殼的慵懶造型。', imageUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 320, status: 'not_owned', tags: ['重複'] },
    { seriesId: 's2', name: '獨角獸', description: '獨角獸造型，配色非常夢幻。', imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 800, status: 'not_owned', tags: ['想要'] },
    { seriesId: 's2', name: '狼人', description: '披著狼皮的小可愛。', imageUrl: 'https://images.unsplash.com/photo-1596796929949-a2128e08d6c7?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 350, status: 'displayed', tags: [] },
    { seriesId: 's3', name: '獅子座', description: '霸氣十足的獅子座造型。', imageUrl: 'https://images.unsplash.com/photo-1562569633-622303bafef5?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 600, status: 'displayed', tags: [] },
    { seriesId: 's4', name: '霸王龍', description: '恐龍霸主！穿著恐龍裝。', imageUrl: 'https://images.unsplash.com/photo-1614726365318-7f55b95cb325?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 4000, status: 'displayed', tags: ['隱藏款'] },
    { seriesId: 's4', name: '翼龍', description: '準備起飛的翼龍。', imageUrl: 'https://images.unsplash.com/photo-1518134701235-985227d894b4?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 320, status: 'displayed', tags: [] },
    { seriesId: 's5', name: '泡泡浴', description: '正在洗泡泡浴的悠閒時光。', imageUrl: 'https://images.unsplash.com/photo-1585325701165-351af916e581?auto=format&fit=crop&q=80&w=800', dateAcquired: new Date().toISOString(), price: 320, status: 'stored', tags: [] },
];

type ViewMode = 'series_list' | 'items_list';

const App: React.FC = () => {
  // Data State
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);

  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
  
  const [isSeriesModalOpen, setIsSeriesModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);

  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('series_list');
  const [activeSeriesId, setActiveSeriesId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');
  const [statusFilter, setStatusFilter] = useState<ItemStatusType | 'all'>('all');

  // Load / Seed Data
  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
    const savedSeries = localStorage.getItem(STORAGE_KEY_SERIES);

    if (savedSeries) {
      setSeriesList(JSON.parse(savedSeries));
    } else {
      setSeriesList(SEED_SERIES);
    }

    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      const seededItems = SEED_ITEMS.map(item => ({ ...item, id: uuidv4() }));
      setItems(seededItems as CollectionItem[]);
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    localStorage.setItem(STORAGE_KEY_SERIES, JSON.stringify(seriesList));
  }, [items, seriesList]);

  // --- HANDLERS: ITEMS ---

  const handleSaveItem = (itemData: Omit<CollectionItem, 'id'>) => {
    if (editingItem) {
      setItems(prev => prev.map(item => item.id === editingItem.id ? { ...itemData, id: item.id } : item));
    } else {
      const item: CollectionItem = { ...itemData, id: uuidv4() };
      setItems(prev => [item, ...prev]);
    }
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleEditItem = (item: CollectionItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // --- HANDLERS: SERIES ---

  const handleSaveSeries = (seriesData: Omit<Series, 'id'>) => {
    if (editingSeries) {
      setSeriesList(prev => prev.map(s => s.id === editingSeries.id ? { ...seriesData, id: s.id } : s));
    } else {
      const newSeries: Series = { ...seriesData, id: uuidv4() };
      setSeriesList(prev => [...prev, newSeries]);
    }
    setIsSeriesModalOpen(false);
    setEditingSeries(null);
  };

  const handleDeleteSeries = (id: string) => {
      setSeriesList(prev => prev.filter(s => s.id !== id));
      // Delete all items in this series
      setItems(prev => prev.filter(item => item.seriesId !== id));
      
      // Reset view if we were viewing this series
      if (activeSeriesId === id) {
          handleBackToSeries();
      }
      setIsSeriesModalOpen(false);
      setEditingSeries(null);
  };

  const handleEditSeries = (series: Series) => {
    setEditingSeries(series);
    setIsSeriesModalOpen(true);
  };

  const handleResetData = () => {
    if(window.confirm("確定要重置所有資料並恢復預設 DIMOO 收藏嗎？您的自訂資料將會消失。")) {
       setSeriesList(SEED_SERIES);
       setItems(SEED_ITEMS.map(item => ({ ...item, id: uuidv4() })) as CollectionItem[]);
       setViewMode('series_list');
       setActiveSeriesId(null);
    }
  }

  // --- HELPERS ---

  const getSeriesName = (id: string) => seriesList.find(s => s.id === id)?.name || '未知系列';

  // --- COMPUTED ---

  // Filter Items based on View Mode and Selection
  const filteredItems = useMemo(() => {
    let result = [...items];

    if (activeSeriesId) {
      result = result.filter(item => item.seriesId === activeSeriesId);
    }

    if (statusFilter !== 'all') {
        result = result.filter(item => (item.status || 'displayed') === statusFilter);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(lower) || 
        item.description.toLowerCase().includes(lower) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(lower)))
      );
    }

    result.sort((a, b) => {
      switch (sortOption) {
        case 'date_desc': return new Date(b.dateAcquired).getTime() - new Date(a.dateAcquired).getTime();
        case 'date_asc': return new Date(a.dateAcquired).getTime() - new Date(b.dateAcquired).getTime();
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        default: return 0;
      }
    });

    return result;
  }, [items, activeSeriesId, searchTerm, sortOption, statusFilter]);

  const activeSeries = useMemo(() => 
    seriesList.find(s => s.id === activeSeriesId), 
  [activeSeriesId, seriesList]);

  // Calculate missing slots (Ghost Cards)
  const missingSlots = useMemo(() => {
    if (!activeSeries || !activeSeriesId || statusFilter !== 'all' || searchTerm !== '') return { regular: 0, secret: 0 };
    
    // Count ALL items in this series (owned or not owned) to determine filled slots
    const itemsInSeries = items.filter(i => i.seriesId === activeSeriesId);
    
    // Detect Secret items to separate counts
    const secretKeywords = ['隱藏', 'Secret', 'secret', 'hidden'];
    const filledSecretsCount = itemsInSeries.filter(i => 
        i.tags?.some(t => secretKeywords.includes(t)) || 
        i.name.includes('隱藏') || 
        i.description.includes('隱藏')
    ).length;
    
    const filledRegularCount = itemsInSeries.length - filledSecretsCount;

    const totalRegular = activeSeries.totalRegular || 12;
    const totalSecret = activeSeries.totalSecret || 1;

    // Remaining empty slots
    const missingRegular = Math.max(0, totalRegular - filledRegularCount);
    const missingSecret = Math.max(0, totalSecret - filledSecretsCount);

    return { regular: missingRegular, secret: missingSecret };
  }, [activeSeries, items, activeSeriesId, statusFilter, searchTerm]);


  const handleSeriesClick = (seriesId: string) => {
    setActiveSeriesId(seriesId);
    setViewMode('items_list');
    setStatusFilter('all'); // Reset filter when entering a series
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSeries = () => {
    setViewMode('series_list');
    setActiveSeriesId(null);
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleAddEmptySlot = (type: 'regular' | 'secret') => {
      setEditingItem(null);
      setIsAddModalOpen(true);
      // In a real app we might pass "initialTags" like "Secret" if type is secret
  };

  return (
    <Router>
      <div className="min-h-screen pb-20 font-sans selection:bg-primary selection:text-white bg-dark-900 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        
        {/* Navbar */}
        <nav className="bg-dark-800/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-3 group cursor-pointer" onClick={handleResetData} title="點擊重置資料">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 bg-primary blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white border-2 border-white/20 shadow-inner transform group-hover:rotate-12 transition-transform">
                                <Gamepad2 size={24} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-game font-bold text-white tracking-wide drop-shadow-md">
                                BoxJoy
                            </span>
                            <span className="text-xs text-primary font-bold uppercase tracking-widest -mt-1">盲盒收藏家</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="game-border bg-gradient-to-r from-success to-emerald-600 text-white pl-4 pr-5 py-2.5 rounded-xl font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20 active:translate-y-1 active:shadow-none"
                    >
                        <Plus size={20} strokeWidth={3} />
                        <span className="font-game tracking-wide">登錄新收藏</span>
                    </button>
                </div>
            </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            <CollectionStats items={items} />

            {/* Controls */}
            <div className="mb-6 flex flex-col space-y-4">
                
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {viewMode === 'items_list' ? (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-300">
                             <button 
                                onClick={handleBackToSeries}
                                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-white/10 text-gray-400 hover:text-white hover:bg-dark-700 transition-all"
                             >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="font-bold">返回系列列表</span>
                             </button>
                             <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
                             <h2 className="text-2xl font-game font-bold text-white flex items-center gap-2">
                                <Box className="text-primary" />
                                {activeSeriesId ? getSeriesName(activeSeriesId) : '所有收藏'}
                             </h2>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 w-full justify-between">
                            <h2 className="text-2xl font-game font-bold text-white flex items-center gap-2">
                                <LayoutGrid className="text-primary" />
                                系列選擇
                            </h2>
                            <button 
                                onClick={() => setIsSeriesModalOpen(true)}
                                className="px-4 py-2 rounded-xl border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors flex items-center gap-2 text-sm font-bold"
                            >
                                <Plus size={16} /> 建立新系列
                            </button>
                        </div>
                    )}
                </div>

                {/* Filters */}
                {viewMode === 'items_list' && (
                     <div className="flex flex-col md:flex-row gap-4 bg-dark-800/90 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2">
                        <div className="relative flex-grow group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                            </div>
                            <input 
                                type="text" 
                                placeholder="搜尋此系列中的盲盒..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-900 border-2 border-transparent focus:border-primary focus:bg-dark-900/50 text-white placeholder-gray-500 outline-none transition-all font-medium"
                            />
                        </div>
                        
                        <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as ItemStatusType | 'all')}
                                className="px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:border-primary text-white text-sm font-bold min-w-[140px] appearance-none cursor-pointer hover:bg-dark-700 transition-colors"
                            >
                                <option value="all">所有狀態</option>
                                {Object.entries(ITEM_STATUS_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>

                            <select 
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="px-4 py-3 rounded-xl bg-dark-900 border border-white/10 focus:border-primary text-white text-sm font-bold min-w-[180px] appearance-none cursor-pointer hover:bg-dark-700 transition-colors"
                            >
                                <option value="date_desc">獲得時間 (新到舊)</option>
                                <option value="date_asc">獲得時間 (舊到新)</option>
                                <option value="price_desc">價格 (高到低)</option>
                                <option value="price_asc">價格 (低到高)</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <div className="min-h-[400px]">
                
                {/* SERIES GALLERY */}
                {viewMode === 'series_list' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                        {seriesList.map((series, index) => {
                            // Count only owned items (displayed or stored) for the series progress
                            const count = items.filter(i => 
                                i.seriesId === series.id && 
                                (i.status === 'displayed' || i.status === 'stored')
                            ).length;
                            
                            const total = (series.totalRegular || 12) + (series.totalSecret || 1);
                            
                            return (
                                <div key={series.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-float">
                                    <SeriesCard 
                                        seriesName={series.name} 
                                        count={count} 
                                        totalCollected={total}
                                        totalInSeries={total}
                                        coverImage={series.coverImage}
                                        onClick={() => handleSeriesClick(series.id)}
                                        onEdit={() => handleEditSeries(series)}
                                    />
                                </div>
                            )
                        })}
                        
                        {seriesList.length === 0 && (
                             <div className="col-span-full text-center py-24 bg-dark-800/50 rounded-3xl border-2 border-dashed border-white/10">
                                <h3 className="text-2xl font-game font-bold text-white mb-2">尚未有任何系列</h3>
                                <button onClick={() => setIsSeriesModalOpen(true)} className="text-primary hover:underline">建立第一個系列</button>
                            </div>
                        )}
                    </div>
                )}

                {/* ITEMS GALLERY */}
                {viewMode === 'items_list' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 animate-in zoom-in-95 duration-300">
                        {/* Owned / Listed Items */}
                        {filteredItems.map((item) => (
                            <div key={item.id} className="h-full">
                                <CollectionItemCard 
                                    item={item} 
                                    seriesName={getSeriesName(item.seriesId)}
                                    onDelete={handleDeleteItem}
                                    onEdit={handleEditItem}
                                />
                            </div>
                        ))}

                        {/* Ghost Cards (Empty Slots) - Only show when filtering logic allows (e.g. searching/filtering might hide them) */}
                        {(activeSeriesId && statusFilter === 'all' && searchTerm === '') && (
                            <>
                                {/* Regular Missing Slots */}
                                {Array.from({ length: missingSlots.regular }).map((_, i) => (
                                    <div key={`missing-reg-${i}`} className="h-full">
                                        <EmptySlotCard type="regular" onClick={() => handleAddEmptySlot('regular')} />
                                    </div>
                                ))}

                                {/* Secret Missing Slots */}
                                {Array.from({ length: missingSlots.secret }).map((_, i) => (
                                    <div key={`missing-sec-${i}`} className="h-full">
                                        <EmptySlotCard type="secret" onClick={() => handleAddEmptySlot('secret')} />
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Empty State if no items and no missing slots shown */}
                        {filteredItems.length === 0 && (!activeSeriesId || (statusFilter !== 'all' || searchTerm !== '')) && (
                            <div className="col-span-full text-center py-24 bg-dark-800/50 rounded-3xl border-2 border-dashed border-white/10 animate-in fade-in">
                                <div className="inline-block p-8 rounded-full bg-dark-700 shadow-inner mb-6">
                                    <Search size={64} className="text-gray-500" />
                                </div>
                                <h3 className="text-2xl font-game font-bold text-white mb-2">找不到相關收藏</h3>
                                <p className="text-gray-400">嘗試調整搜尋關鍵字、狀態篩選，或點擊「登錄新收藏」增加項目。</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </main>

        {/* MODALS */}
        <AddBoxModal 
            isOpen={isAddModalOpen} 
            onClose={() => {
                setIsAddModalOpen(false);
                setEditingItem(null);
            }} 
            onAdd={handleSaveItem} 
            editItem={editingItem}
            seriesList={seriesList}
        />

        <SeriesModal
            isOpen={isSeriesModalOpen}
            onClose={() => {
                setIsSeriesModalOpen(false);
                setEditingSeries(null);
            }}
            onSave={handleSaveSeries}
            onDelete={handleDeleteSeries}
            editSeries={editingSeries}
        />
        
      </div>
    </Router>
  );
};

export default App;
