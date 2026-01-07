
import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Moon, 
  Sun, 
  Globe, 
  Upload, 
  Copy, 
  Check, 
  Loader2, 
  Sparkles,
  Info,
  Palette,
  RefreshCw,
  Camera,
  ChevronRight,
  User,
  Users
} from 'lucide-react';
import { 
  AppMode, 
  Language, 
  Theme, 
  PhotographyConfig, 
  AppState 
} from './types';
import { 
  TRANSLATIONS, 
  MENU_ICONS, 
  CAMERA_OPTIONS, 
  LENS_OPTIONS, 
  FILTER_OPTIONS, 
  MOOD_OPTIONS, 
  ASPECT_RATIOS, 
  ANGLES, 
  SHOT_SIZES,
  TIMES_OF_DAY,
  EXPRESSIONS
} from './constants';
import { generateAppPrompt } from './services/geminiService';

const INITIAL_CONFIG: PhotographyConfig = {
  objectType: 'Single',
  gender: 'Female',
  hijab: false,
  outfitMode: 'Automatic',
  outfitManualText: '',
  poseMode: 'Automatic',
  poseManualText: '',
  backgroundMode: 'Automatic',
  backgroundManualText: '',
  timeOfDay: 'Morning',
  expression: 'Neutral',
  cameraType: CAMERA_OPTIONS[0],
  lensType: LENS_OPTIONS[0],
  filter: FILTER_OPTIONS[0],
  sceneMood: MOOD_OPTIONS[0],
  aspectRatio: ASPECT_RATIOS[0],
  cameraAngle: ANGLES[0],
  shotSize: SHOT_SIZES[0],
  styleMode: 'Automatic',
  styleManualText: '',
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    mode: AppMode.PHOTOGRAPHY,
    language: Language.ID,
    theme: Theme.DARK,
    image: null,
    config: INITIAL_CONFIG,
    generatedPrompt: '',
    isLoading: false,
  });

  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = TRANSLATIONS[state.language];
  const isDark = state.theme === Theme.DARK;

  // Auto-handle gender selection and hijab status based on object type (Fix 13.2 & 14.2)
  useEffect(() => {
    if (state.config.objectType === 'Single') {
      if (!['Male', 'Female'].includes(state.config.gender)) {
        setState(prev => ({ ...prev, config: { ...prev.config, gender: 'Female' } }));
      }
      // If gender is Male, force hijab to false (Fix 14.2)
      if (state.config.gender === 'Male' && state.config.hijab) {
        setState(prev => ({ ...prev, config: { ...prev.config, hijab: false } }));
      }
    } else {
      // For Couples, Hijab MUST be disabled and set to Not Applicable logic
      if (['Male', 'Female'].includes(state.config.gender)) {
        setState(prev => ({ ...prev, config: { ...prev.config, gender: 'Male & Female', hijab: false } }));
      } else if (state.config.hijab) {
        setState(prev => ({ ...prev, config: { ...prev.config, hijab: false } }));
      }
    }
  }, [state.config.objectType, state.config.gender]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!state.image) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const prompt = await generateAppPrompt(state.image, state.mode, state.config);
      setState(prev => ({ ...prev, generatedPrompt: prompt, isLoading: false }));
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(state.generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateConfig = (key: keyof PhotographyConfig, value: any) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-zinc-900'}`}>
      
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Header */}
      <header className={`sticky top-0 z-50 px-6 py-4 border-b flex items-center justify-between backdrop-blur-xl transition-colors ${isDark ? 'bg-zinc-950/70 border-zinc-800/50' : 'bg-white/70 border-zinc-200'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-xl transition-all ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'}`}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/30 transform hover:rotate-6 transition-transform cursor-default">
              M
            </div>
            <div>
              <h1 className="font-black text-xl tracking-tight leading-none">{t.appName}</h1>
              <p className="text-[10px] opacity-50 tracking-[0.2em] font-bold uppercase mt-1">{t.tagline}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center p-1 rounded-2xl border ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-100'}`}>
            <button 
              onClick={() => setState(prev => ({ ...prev, language: Language.ID }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${state.language === Language.ID ? 'bg-blue-600 text-white shadow-md' : 'opacity-40 hover:opacity-100'}`}
            >
              ID
            </button>
            <button 
              onClick={() => setState(prev => ({ ...prev, language: Language.EN }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${state.language === Language.EN ? 'bg-blue-600 text-white shadow-md' : 'opacity-40 hover:opacity-100'}`}
            >
              EN
            </button>
          </div>
          <button 
            onClick={() => setState(prev => ({ ...prev, theme: isDark ? Theme.LIGHT : Theme.DARK }))}
            className={`p-2.5 rounded-2xl border transition-all ${isDark ? 'border-zinc-800 hover:bg-zinc-800 hover:text-yellow-400' : 'border-zinc-200 hover:bg-zinc-100 hover:text-blue-600'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-81px)] overflow-hidden">
        
        {/* Navigation Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 w-80 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-500 ease-out z-50 border-r ${isDark ? 'bg-zinc-950 border-zinc-800/50' : 'bg-white border-zinc-200'} flex flex-col`}>
          <div className="p-6 border-b flex items-center justify-between lg:hidden">
            <span className="font-black text-lg">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full"><X size={20} /></button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            <p className="text-[10px] font-black tracking-widest opacity-40 uppercase px-3 py-2">Service Modes</p>
            {Object.values(AppMode).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setState(prev => ({ ...prev, mode }));
                  setSidebarOpen(false);
                }}
                className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl transition-all overflow-hidden ${
                  state.mode === mode 
                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 ring-2 ring-blue-400/20' 
                    : isDark ? 'hover:bg-zinc-900 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${state.mode === mode ? 'bg-white/20' : isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                  {MENU_ICONS[mode]}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm">
                    {mode === AppMode.PHOTOGRAPHY ? t.photography : mode === AppMode.DIGITAL_ART ? t.digitalArt : t.restoration}
                  </span>
                  <span className={`text-[10px] opacity-60 font-medium ${state.mode === mode ? 'text-white' : ''}`}>
                    {mode === AppMode.PHOTOGRAPHY ? 'Realistic Recreation' : mode === AppMode.DIGITAL_ART ? 'Style Replication' : 'Historical Repair'}
                  </span>
                </div>
                {state.mode === mode && <div className="absolute right-4 w-1 h-1 bg-white rounded-full animate-ping" />}
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className={`p-5 rounded-3xl border text-[11px] leading-relaxed relative overflow-hidden group ${isDark ? 'bg-zinc-900/50 border-zinc-800/50 text-zinc-500' : 'bg-blue-50/50 border-blue-100 text-zinc-600'}`}>
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform">
                <Info size={40} />
              </div>
              <p className="relative z-10 font-medium">Magic Clik ensures absolute identity locking. Prompts are generated in optimized English for professional AI engines.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-10">
            
            {/* Left Column: Image & Config */}
            <div className="xl:col-span-7 space-y-10">
              
              {/* Image Upload Area */}
              <div className={`relative group border-2 border-dashed rounded-[2.5rem] overflow-hidden aspect-video flex flex-col items-center justify-center transition-all shadow-sm ${
                state.image ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : isDark ? 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/20' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-100/50'
              }`}>
                {state.image ? (
                  <>
                    <img src={state.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-1000" />
                    <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] flex items-center justify-center">
                      <label className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm cursor-pointer shadow-2xl flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all active:scale-95">
                        <Upload size={20} />
                        {t.changeImage}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-10 text-center">
                    <div className="w-20 h-20 bg-blue-600/10 text-blue-600 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                      <Upload size={32} />
                    </div>
                    <span className="text-xl font-black block mb-2">{t.uploadImage}</span>
                    <span className="text-sm opacity-40 font-medium max-w-xs leading-relaxed">Select a photo to begin analysis. Supports PNG, JPG, and WEBP.</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              {/* Dynamic Configuration Form */}
              <div className={`p-8 lg:p-10 rounded-[2.5rem] border transition-all ${isDark ? 'bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm' : 'bg-white border-zinc-200 shadow-xl shadow-zinc-200/50'}`}>
                {state.mode === AppMode.PHOTOGRAPHY ? (
                  <div className="space-y-12">
                    {/* Identity Submenu */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-600/50" />
                        <h3 className="text-lg font-black tracking-tight uppercase">{t.identity}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Object Type */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] px-1">{t.objectType}</label>
                          <div className={`flex p-1 rounded-2xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                            <button
                              onClick={() => updateConfig('objectType', 'Single')}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black rounded-xl transition-all ${
                                state.config.objectType === 'Single' 
                                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                                  : 'opacity-40 hover:opacity-100'
                              }`}
                            >
                              <User size={14} />
                              {t.single}
                            </button>
                            <button
                              onClick={() => updateConfig('objectType', 'Couple')}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black rounded-xl transition-all ${
                                state.config.objectType === 'Couple' 
                                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' 
                                  : 'opacity-40 hover:opacity-100'
                              }`}
                            >
                              <Users size={14} />
                              {t.couple}
                            </button>
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] px-1">{t.gender}</label>
                          <div className="relative group">
                            <select 
                              value={state.config.gender}
                              onChange={(e) => updateConfig('gender', e.target.value)}
                              className={`w-full appearance-none py-3.5 px-5 text-sm font-bold rounded-2xl border outline-none transition-all cursor-pointer ${
                                isDark ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                              }`}
                            >
                              {state.config.objectType === 'Single' ? (
                                <>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </>
                              ) : (
                                <>
                                  <option value="Male & Female">Male & Female</option>
                                  <option value="Female & Female">Female & Female</option>
                                  <option value="Male & Male">Male & Male</option>
                                </>
                              )}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                              <ChevronRight size={16} className="rotate-90" />
                            </div>
                          </div>
                        </div>

                        {/* Hijab Toggle - ONLY AVAILABLE FOR SINGLE FEMALE (Fix 13.2 & 14.2) */}
                        {(state.config.objectType === 'Single' && state.config.gender === 'Female') && (
                          <div className={`md:col-span-2 flex items-center justify-between p-5 rounded-2xl border transition-all ${
                            state.config.hijab ? 'bg-blue-600/5 border-blue-500/20' : isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-100'
                          }`}>
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl transition-colors ${state.config.hijab ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-zinc-800 text-zinc-500'}`}>
                                <Sparkles size={18} />
                              </div>
                              <span className="font-black text-sm">{t.hijab}</span>
                            </div>
                            <button
                              onClick={() => updateConfig('hijab', !state.config.hijab)}
                              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${state.config.hijab ? 'bg-blue-600' : 'bg-zinc-700'}`}
                            >
                              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${state.config.hijab ? 'left-8 scale-110' : 'left-1'}`} />
                            </button>
                          </div>
                        )}
                        
                        {/* Information about hijab being disabled (Fix 13.2 & 14.2) */}
                        {(state.config.objectType === 'Couple' || (state.config.objectType === 'Single' && state.config.gender === 'Male')) && (
                          <div className={`md:col-span-2 p-4 rounded-xl border flex items-center gap-3 text-xs opacity-50 ${isDark ? 'border-zinc-800' : 'border-zinc-200 bg-zinc-50'}`}>
                            <Info size={14} className="text-blue-500 shrink-0" />
                            <span>Hijab options are disabled for {state.config.objectType === 'Couple' ? 'Couple' : 'Male'} subjects.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Overrides */}
                    <div className="space-y-10">
                      {[
                        { key: 'outfitMode', label: t.outfit, textKey: 'outfitManualText' },
                        { key: 'poseMode', label: t.pose, textKey: 'poseManualText' },
                        { key: 'backgroundMode', label: t.background, textKey: 'backgroundManualText' }
                      ].map((field) => (
                        <div key={field.key} className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">{field.label}</label>
                            <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                              {['Automatic', 'Manual'].map(m => (
                                <button
                                  key={m}
                                  onClick={() => updateConfig(field.key as any, m)}
                                  className={`px-4 py-1.5 text-[10px] uppercase font-black rounded-lg transition-all ${
                                    state.config[field.key as keyof PhotographyConfig] === m 
                                      ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' 
                                      : 'text-zinc-500 hover:text-zinc-300'
                                  }`}
                                >
                                  {m === 'Automatic' ? t.automatic : t.manual}
                                </button>
                              ))}
                            </div>
                          </div>
                          {state.config[field.key as keyof PhotographyConfig] === 'Manual' && (
                            <textarea
                              value={state.config[field.textKey as keyof PhotographyConfig] as string}
                              onChange={(e) => updateConfig(field.textKey as any, e.target.value)}
                              placeholder={t.manualPlaceholder}
                              className={`w-full p-5 text-sm font-bold rounded-2xl border min-h-[100px] outline-none transition-all focus:ring-4 focus:ring-blue-500/10 ${
                                isDark ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Cinematography */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-600/50" />
                        <h3 className="text-lg font-black tracking-tight uppercase">{t.cinematography}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          { label: t.camera, key: 'cameraType', options: CAMERA_OPTIONS },
                          { label: t.lens, key: 'lensType', options: LENS_OPTIONS },
                          { label: t.filter, key: 'filter', options: FILTER_OPTIONS },
                          { label: t.sceneMood, key: 'sceneMood', options: MOOD_OPTIONS },
                          { label: t.aspectRatio, key: 'aspectRatio', options: ASPECT_RATIOS },
                          { label: t.angle, key: 'cameraAngle', options: ANGLES },
                          { label: t.shotSize, key: 'shotSize', options: SHOT_SIZES },
                          { label: t.timeOfDay, key: 'timeOfDay', options: TIMES_OF_DAY },
                          { label: t.expression, key: 'expression', options: EXPRESSIONS }
                        ].map(item => (
                          <div key={item.key} className="space-y-3">
                            <label className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] px-1">{item.label}</label>
                            <select 
                              value={state.config[item.key as keyof PhotographyConfig] as string}
                              onChange={(e) => updateConfig(item.key as any, e.target.value)}
                              className={`w-full py-3 px-4 text-xs font-bold rounded-xl border outline-none transition-all cursor-pointer ${
                                isDark ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                              }`}
                            >
                              {item.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : state.mode === AppMode.DIGITAL_ART ? (
                  <div className="space-y-12">
                    {/* Style Configuration for Digital Art Mode v1 */}
                    <div className="space-y-8">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/50" />
                        <h3 className="text-lg font-black tracking-tight uppercase">Artistic Style</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Style Input</label>
                          <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                            {['Automatic', 'Manual'].map(m => (
                              <button
                                key={m}
                                onClick={() => updateConfig('styleMode', m)}
                                className={`px-4 py-1.5 text-[10px] uppercase font-black rounded-lg transition-all ${
                                  state.config.styleMode === m 
                                    ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                {m === 'Automatic' ? t.automatic : t.manual}
                              </button>
                            ))}
                          </div>
                        </div>
                        {state.config.styleMode === 'Manual' ? (
                          <textarea
                            value={state.config.styleManualText}
                            onChange={(e) => updateConfig('styleManualText', e.target.value)}
                            placeholder="Describe art style, line quality, palette..."
                            className={`w-full p-5 text-sm font-bold rounded-2xl border min-h-[100px] outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 ${
                              isDark ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-100 hover:border-zinc-200'
                            }`}
                          />
                        ) : (
                          <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-zinc-50 border-zinc-100'}`}>
                            <p className="text-xs opacity-40 font-medium leading-relaxed">System will automatically detect art style, lines, and color palette from the image.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-600/5 text-blue-600 rounded-[2.5rem] flex items-center justify-center animate-pulse">
                      <RefreshCw size={48} />
                    </div>
                    <div className="max-w-md space-y-2">
                      <h4 className="text-lg font-black tracking-tight">Fully Autonomous Analysis</h4>
                      <p className="text-sm opacity-40 font-medium leading-relaxed">
                        Our system will identify tears, stains, noise, and blur in your historical photo for precise reconstruction with period-accurate colorization.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Output */}
            <div className="xl:col-span-5 flex flex-col gap-8">
              
              <button
                disabled={!state.image || state.isLoading}
                onClick={handleGenerate}
                className={`w-full py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 transition-all transform active:scale-[0.98] ${
                  !state.image 
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-700/50' 
                    : state.isLoading 
                      ? 'bg-blue-600/50 text-white cursor-wait ring-4 ring-blue-600/20'
                      : 'bg-blue-600 text-white hover:bg-blue-500 shadow-2xl shadow-blue-600/40 hover:-translate-y-1'
                }`}
              >
                {state.isLoading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span className="animate-pulse">{t.processing}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    {t.generate}
                  </>
                )}
              </button>

              <div className={`flex-1 min-h-[500px] xl:min-h-0 flex flex-col p-8 lg:p-10 rounded-[2.5rem] border transition-all ${
                isDark ? 'bg-zinc-900/40 border-zinc-800/50 backdrop-blur-md' : 'bg-white border-zinc-200 shadow-2xl shadow-zinc-200/50'
              }`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Prompt Architecture</span>
                  </div>
                  <button 
                    disabled={!state.generatedPrompt}
                    onClick={handleCopy}
                    className={`px-5 py-2.5 rounded-2xl transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${
                      !state.generatedPrompt 
                        ? 'opacity-20 cursor-not-allowed' 
                        : isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200 shadow-md'
                    }`}
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
                
                <div className={`flex-1 p-8 rounded-3xl font-mono text-sm leading-loose overflow-y-auto custom-scrollbar border transition-all ${
                  isDark ? 'bg-zinc-950/50 border-zinc-800/50 text-zinc-400' : 'bg-zinc-50 border-zinc-100 text-zinc-700'
                }`}>
                  {state.generatedPrompt ? (
                    <div className="space-y-6">
                      {state.generatedPrompt.split('\n\n').map((para, i) => (
                        <p key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-700">{para}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
                      <Camera size={48} strokeWidth={1} />
                      <p className="text-xs font-black uppercase tracking-widest">{t.outputPlaceholder}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="text-center">
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.3em]">&copy; 2025 MAGIC CLIK &bull; PRECISION PROMPT SYSTEM</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
