import React from 'react';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';

const LearningCenter: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      <h2 className="text-2xl font-bold text-secondary-green flex items-center gap-2">
        <BookOpen /> Learning Center
      </h2>
      <p className="text-gray-600">Watch short videos on best practices, organic farming, and increasing your yield.</p>

      {/* Featured Video */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 relative group cursor-pointer">
        <div className="bg-gray-800 h-48 w-full flex items-center justify-center relative">
          <PlayCircle size={64} className="text-white opacity-80 group-hover:scale-110 transition-transform" />
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            04:15
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1">How to make Organic Fertilizer at home</h3>
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-1"><Clock size={14}/> 2 days ago • 1.2k views</p>
          <span className="bg-primary-green/10 text-primary-green px-2 py-1 rounded-md text-xs font-bold uppercase">Organic Farming</span>
        </div>
      </div>

      {/* Video List */}
      <h3 className="font-bold text-gray-800 mt-2">Recommended for You</h3>
      
      <div className="flex flex-col gap-4">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden cursor-pointer active:bg-gray-50">
          <div className="bg-gray-800 w-1/3 min-h-[100px] flex items-center justify-center relative">
             <PlayCircle size={32} className="text-white opacity-80" />
             <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">02:30</div>
          </div>
          <div className="p-3 w-2/3 flex flex-col justify-center">
            <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">Drip Irrigation Setup Guide</h4>
            <span className="text-xs text-secondary-green font-bold">Water Management</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden cursor-pointer active:bg-gray-50">
          <div className="bg-gray-800 w-1/3 min-h-[100px] flex items-center justify-center relative">
             <PlayCircle size={32} className="text-white opacity-80" />
             <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1 rounded">05:10</div>
          </div>
          <div className="p-3 w-2/3 flex flex-col justify-center">
            <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">Identifying early Cotton Pests</h4>
            <span className="text-xs text-alert-red font-bold">Pest Control</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningCenter;
