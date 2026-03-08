import React from 'react';
import { Home, Sprout, TrendingUp, Mic, User } from 'lucide-react';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenVoice: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setCurrentTab, onOpenVoice }) => {
  const NavItem = ({ tab, icon: Icon, label }: { tab: string; icon: any; label: string }) => {
    const isActive = currentTab === tab;
    return (
      <div 
        className={`flex flex-col items-center justify-center p-2 cursor-pointer flex-1 transition-colors ${
          isActive ? 'text-primary-green' : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={() => setCurrentTab(tab)}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className={`text-[0.7rem] mt-1 ${isActive ? 'font-bold' : 'font-normal'}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[100] pb-safe flex justify-around items-center px-2 py-1">
      <NavItem tab="dashboard" icon={Home} label="Home" />
      <NavItem tab="crop" icon={Sprout} label="Crops" />

      {/* Massive Central Mic Button for Voice Assistant */}
      <div className="flex-1 relative flex justify-center pb-8">
        <button 
          onClick={onOpenVoice}
          className="absolute -top-6 w-16 h-16 bg-accent-yellow rounded-full flex items-center justify-center text-gray-900 border-4 border-white shadow-lg active:scale-95 transition-transform group"
          aria-label="Open Voice Assistant"
        >
          <Mic size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <NavItem tab="market" icon={TrendingUp} label="Market" />
      <NavItem tab="profile" icon={User} label="Profile" />
    </nav>
  );
};

export default Navigation;
