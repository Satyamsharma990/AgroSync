import React from 'react';
import { Camera, Send, MessageCircle, Heart, Share2 } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 -mx-4 -mt-4">
      {/* Header Sticky Area */}
      <div className="bg-primary-green p-4 sticky top-16 z-40 text-white flex justify-between items-center shadow-md">
        <h2 className="text-xl font-bold">Kisan Community</h2>
        <div className="flex gap-4">
          <Camera size={24} className="cursor-pointer" />
        </div>
      </div>

      {/* Feed Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-20 animate-fade-in">
        
        {/* Post 1 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-accent-yellow text-white rounded-full flex items-center justify-center font-bold">
                 AM
               </div>
               <div>
                  <h3 className="font-bold text-gray-800 text-sm">Arjun M.</h3>
                  <p className="text-xs text-gray-500">2 hours ago • Satara</p>
               </div>
             </div>
          </div>
          <p className="text-gray-700 text-sm mb-3">Has anyone tried the new organic pesticide for cotton? Is it effective against whiteflies?</p>
          <div className="bg-gray-100 rounded-xl h-40 flex items-center justify-center mb-3">
             <span className="text-gray-400 font-bold">Photo Attached</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 text-gray-500">
            <button className="flex items-center gap-1 text-sm"><Heart size={18}/> 12 Likes</button>
            <button className="flex items-center gap-1 text-sm"><MessageCircle size={18}/> 4 Comments</button>
            <button className="flex items-center gap-1 text-sm"><Share2 size={18}/> Share</button>
          </div>
        </div>

        {/* Post 2 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
             <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-secondary-green text-white rounded-full flex items-center justify-center font-bold">
                 SP
               </div>
               <div>
                  <h3 className="font-bold text-gray-800 text-sm">Suresh Patil</h3>
                  <p className="text-xs text-gray-500">Yesterday • Pune</p>
               </div>
             </div>
          </div>
          <p className="text-gray-700 text-sm mb-3">Just harvested 50 quintals of wheat! The weather was perfect this season.</p>
          <div className="flex justify-between border-t border-gray-100 pt-3 text-gray-500">
            <button className="flex items-center gap-1 text-sm text-alert-red font-bold"><Heart size={18} className="fill-alert-red"/> 48 Likes</button>
            <button className="flex items-center gap-1 text-sm"><MessageCircle size={18}/> 12 Comments</button>
            <button className="flex items-center gap-1 text-sm"><Share2 size={18}/> Share</button>
          </div>
        </div>

      </div>

      {/* Floating Action / Input Area */}
      <div className="fixed bottom-[80px] left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 py-3 bg-white border-t border-gray-200 flex gap-2 items-center">
         <button className="p-3 bg-gray-100 rounded-full text-gray-600"><Camera size={20}/></button>
         <input type="text" placeholder="Ask a question..." className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-primary-green" />
         <button className="p-3 bg-primary-green rounded-full text-white"><Send size={20}/></button>
      </div>
    </div>
  );
};

export default Community;
