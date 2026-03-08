import React, { useEffect, useState } from 'react';
import BigButton from '../components/BigButton';
import { api } from '../services/api';
import {
  Leaf, CloudRain, TrendingDown, TrendingUp, Scan, ShieldAlert,
  Droplets, Activity, Tractor, Warehouse, Truck, BookOpen, History
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [marketPulse, setMarketPulse] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(true);

  useEffect(() => {
    api.get('/dashboard/')
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching dashboard data", err));

    api.get('/ai/dashboard-market-pulse')
      .then(res => {
        if (Array.isArray(res.data)) {
          setMarketPulse(res.data);
        }
        setLoadingMarket(false);
      })
      .catch(err => {
        console.error("AI Market Pulse Error", err);
        setLoadingMarket(false);
      });
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative z-10">

      {/* Header Info */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="text-3xl premium-gradient-text font-extrabold tracking-tight drop-shadow-sm">Namaste, {data?.user_name || 'Farmer'}</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Dashboard Overview</p>
        </div>
        <div className="text-right flex flex-col items-end glass-card p-3 px-4 bg-white/50">
          <p className="font-bold text-2xl text-gray-800 drop-shadow-md">32°C</p>
          <span className="text-xs text-primary-green font-bold flex items-center gap-1 cursor-pointer hover:underline mt-1" onClick={() => onNavigate('weather')}>
            <CloudRain size={14} /> Forecast
          </span>
        </div>
      </div>

      {/* Today's Farming Advice Layer 1 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 drop-shadow-sm">Latest AI Recommendations</h2>
        <div className="glass-card bg-gradient-to-br from-primary-green/5 to-primary-green/20 border-l-4 border-l-primary-green p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Leaf className="text-primary-green" size={24} />
            </div>
            <h3 className="font-extrabold text-gray-900 text-lg">Crop Suggestion: {data?.recent_crop_recommendation || 'No data yet. Get a recommendation!'}</h3>
          </div>
          <p className="text-gray-700 font-medium text-sm leading-relaxed">
            {data?.recent_disease_detected && `Latest Disease Scanned: ${data.recent_disease_detected}`}
          </p>
        </div>
      </div>

      {/* Smart Tools Grid (All modules) */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 drop-shadow-sm">Smart Tools</h2>
        <div className="grid grid-cols-4 gap-y-6 gap-x-3">
          <ToolIcon icon={Scan} label="Disease" color="text-alert-red" bg="bg-alert-red/10" border="border-alert-red/20" onClick={() => onNavigate('disease')} />
          <ToolIcon icon={Droplets} label="Irrigation" color="text-blue-600" bg="bg-blue-500/10" border="border-blue-500/20" onClick={() => onNavigate('irrigation')} />
          <ToolIcon icon={Activity} label="Expenses" color="text-amber-600" bg="bg-amber-500/10" border="border-amber-500/20" onClick={() => onNavigate('expense')} />
          <ToolIcon icon={History} label="Records" color="text-slate-600" bg="bg-slate-500/10" border="border-slate-500/20" onClick={() => onNavigate('records')} />

          <ToolIcon icon={Tractor} label="Rentals" color="text-orange-600" bg="bg-orange-500/10" border="border-orange-500/20" onClick={() => onNavigate('equipment')} />
          <ToolIcon icon={Warehouse} label="Storage" color="text-indigo-600" bg="bg-indigo-500/10" border="border-indigo-500/20" onClick={() => onNavigate('storage')} />
          <ToolIcon icon={Truck} label="Transport" color="text-purple-600" bg="bg-purple-500/10" border="border-purple-500/20" onClick={() => onNavigate('transport')} />
          <ToolIcon icon={BookOpen} label="Learn" color="text-primary-green" bg="bg-primary-green/10" border="border-primary-green/20" onClick={() => onNavigate('learning')} />
        </div>
      </div>

      {/* Market Traffic Light Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex justify-between items-center drop-shadow-sm">
          Market Pulse
          <span className="text-xs text-primary-green font-bold uppercase cursor-pointer hover:underline" onClick={() => onNavigate('market')}>See All &gt;</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {loadingMarket ? (
            <div className="col-span-2 text-center text-sm font-bold text-gray-400 p-4">Gemini AI analyzing markets...</div>
          ) : marketPulse.length > 0 ? (
            marketPulse.map((item, idx) => (
              <div key={idx} className={`glass-card p-4 border-t-4 flex flex-col items-center justify-center text-center transition-transform hover:scale-105 cursor-pointer ${item.trend.toLowerCase() === 'down' ? 'bg-alert-red/5 border-t-alert-red' : 'bg-primary-green/5 border-t-primary-green'}`} onClick={() => onNavigate('market')}>
                <div className="flex items-center gap-1 drop-shadow-sm">
                  {item.trend.toLowerCase() === 'down' ? <TrendingDown className="text-alert-red" size={24} /> : <TrendingUp className="text-primary-green" size={24} />}
                  <span className="font-extrabold text-gray-800 text-lg">{item.crop}</span>
                </div>
                <p className={`text-xs font-black mt-1 uppercase tracking-wider bg-white px-2 py-1 rounded-md shadow-sm ${item.trend.toLowerCase() === 'down' ? 'text-alert-red' : 'text-primary-green'}`}>{item.advice}</p>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-sm text-gray-400 p-4">Market data unavailable.</div>
          )}
        </div>
      </div>

      <BigButton
        variant="success"
        label="Check Govt Schemes"
        icon={<ShieldAlert size={20} />}
        onClick={() => onNavigate('schemes')}
        className="text-md py-4 mt-2 shadow-lg shadow-primary-green/30"
      />

    </div>
  );
};

// Mini Tool Icon Component for Grid
const ToolIcon = ({ icon: Icon, label, color, bg, border, onClick }: any) => (
  <div className="flex flex-col items-center justify-start gap-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 group" onClick={onClick}>
    <div className={`w-[4.5rem] h-[4.5rem] rounded-[1.2rem] flex items-center justify-center ${bg} shadow-md border ${border} backdrop-blur-sm group-hover:shadow-lg transition-shadow`}>
      <Icon size={28} className={color} strokeWidth={2.5} />
    </div>
    <span className="text-[11px] font-bold text-gray-700 text-center leading-tight max-w-[70px] break-words drop-shadow-sm">{label}</span>
  </div>
);

export default Dashboard;
