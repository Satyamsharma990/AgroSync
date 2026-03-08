import React, { useState } from 'react';
import { Activity, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import ReactMarkdown from 'react-markdown';

const PriceForecast: React.FC = () => {
  const [analyzingCrop, setAnalyzingCrop] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});

  const fetchAiForecast = async (crop: string, context: string) => {
    if (aiAnalysis[crop]) return; // Already fetched
    setAnalyzingCrop(crop);
    try {
      const promptText = `Analyze the market forecast for ${crop} given this context: ${context}`;
      const res = await api.post('/ai/chat', { message: promptText });
      setAiAnalysis(prev => ({ ...prev, [crop]: res.data.response }));
    } catch (e: any) {
      alert("AI Market Forecast Failed: " + (e.response?.data?.detail || e.message));
    } finally {
      setAnalyzingCrop(null);
    }
  };

  const renderMarketCard = (
    crop: string,
    currentPrice: string,
    context: string,
    Icon: any,
    colorClass: string,
    bgClass: string,
    borderClass: string
  ) => {
    const isAnalyzing = analyzingCrop === crop;
    const analysis = aiAnalysis[crop];

    return (
      <div className={`glass-card p-5 border-l-4 ${borderClass} shadow-md mb-4`}>
        <div className="flex justify-between items-center mb-3 border-b pb-3 border-gray-100">
          <div>
            <h3 className={`text-xl font-extrabold ${colorClass}`}>{crop}</h3>
            <span className="text-sm font-bold text-gray-500">Current: {currentPrice} / quintal</span>
          </div>
          <div className={`flex flex-col items-center justify-center p-3 rounded-xl ${bgClass}`}>
            <Icon className={colorClass} size={32} />
          </div>
        </div>

        {!analysis && !isAnalyzing && (
          <button
            onClick={() => fetchAiForecast(crop, context)}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-white ${colorClass.replace('text-', 'bg-')} shadow-sm`}
          >
            <Sparkles size={18} /> Analyze with Gemini AI
          </button>
        )}

        {isAnalyzing && (
          <div className={`flex items-center justify-center gap-2 py-4 ${colorClass} animate-pulse font-bold`}>
            <Activity size={20} className="animate-spin-slow" /> Running AI Market Analysis...
          </div>
        )}

        {analysis && (
          <div className="bg-white/80 p-4 rounded-xl border border-gray-100 mt-2">
            <div className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-purple-600 mb-2 drop-shadow-sm">
              <Sparkles size={14} /> AI Market Intelligence
            </div>
            <div className="prose prose-sm max-w-none text-gray-800 font-medium">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    );
  };

  const [customCrop, setCustomCrop] = useState('');
  const [customContext, setCustomContext] = useState('');

  return (
    <div className="p-4 animate-fade-in relative z-10 h-full">
      <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm mb-1">
        AI Market Pulse
      </h2>
      <p className="text-gray-600 font-medium mb-5 leading-relaxed">
        Live market data powered by predictive AI analysis to help you decide exactly when to sell.
      </p>

      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 mb-6 flex flex-col gap-4">
        <label className="block font-bold text-gray-700 text-lg">Query Custom Crop</label>

        <div>
          <label className="block font-bold text-gray-600 text-sm mb-1">Crop Name</label>
          <input
            type="text"
            placeholder="e.g. Tomato, Soybean, Onion"
            value={customCrop}
            onChange={e => setCustomCrop(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-green bg-gray-50 shadow-sm font-medium"
          />
        </div>

        <div>
          <label className="block font-bold text-gray-600 text-sm mb-1">Market Context / Location</label>
          <input
            type="text"
            placeholder="e.g. Pune market, heavy rains expected"
            value={customContext}
            onChange={e => setCustomContext(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-green bg-gray-50 shadow-sm font-medium"
          />
        </div>

        <button
          onClick={() => customCrop && fetchAiForecast(customCrop, customContext)}
          disabled={!customCrop}
          className="w-full py-4 mt-2 rounded-xl font-extrabold text-white bg-gradient-to-r from-primary-green to-emerald-600 shadow-md active:scale-95 transition-all disabled:opacity-50"
        >
          Generate AI Price Forecast
        </button>
      </div>

      {customCrop && aiAnalysis[customCrop] && renderMarketCard(
        customCrop,
        "Scanning...",
        customContext,
        Activity,
        "text-primary-green",
        "bg-primary-green/10",
        "border-l-primary-green"
      )}

      {/* Adding a placeholder if scanning */}
      {analyzingCrop && !aiAnalysis[analyzingCrop] && (
        <div className="flex items-center justify-center gap-2 py-4 text-primary-green animate-pulse font-bold mt-4">
          <Activity size={24} className="animate-spin-slow" /> Requesting Gemini Market Forecast...
        </div>
      )}

    </div>
  );
};

export default PriceForecast;
