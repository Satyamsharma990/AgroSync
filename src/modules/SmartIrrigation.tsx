import React, { useState } from 'react';
import BigButton from '../components/BigButton';
import { Droplet, Sun, Sprout, Wind } from 'lucide-react';

const SmartIrrigation: React.FC = () => {
  const [analyzed, setAnalyzed] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      <h2 className="text-2xl font-bold text-secondary-green">Smart Irrigation</h2>

      {!analyzed ? (
        <div className="flex flex-col gap-4">
          <p className="text-gray-600 mb-2">Configure your field parameters. Our AI will analyze the weather and soil to recommend exactly when and how much to water.</p>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm">Crop Type & Growth Stage</label>
            <input type="text" placeholder="e.g. Wheat, Flowering stage" className="p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green outline-none" id="cropType" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm">Soil Details</label>
            <input type="text" placeholder="e.g. Black soil, retains good moisture" className="p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green outline-none" id="soilDetails" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-800 text-sm">Last Watered / Weather Conditions</label>
            <input type="text" placeholder="e.g. Watered 2 days ago, very sunny today" className="p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green outline-none" id="weatherDetails" />
          </div>

          <BigButton
            variant="primary"
            label="Generate AI Irrigation Plan"
            className="mt-6"
            onClick={async () => {
              const crop = (document.getElementById('cropType') as HTMLInputElement)?.value;
              const soil = (document.getElementById('soilDetails') as HTMLInputElement)?.value;
              const weather = (document.getElementById('weatherDetails') as HTMLInputElement)?.value;

              if (!crop) return alert("Please enter a crop type");

              try {
                // We'll use the chat endpoint to ask Gemini directly as a quick AI integration
                const { api } = await import('../services/api');
                const res = await api.post('/ai/chat', {
                  message: `Analyze Irrigation Needs: Crop: ${crop}. Soil: ${soil}. Weather/Last Watered: ${weather}. Provide a short, highly practical watering recommendation.`
                });
                alert("Gemini AI Says:\n" + res.data.response);
                setAnalyzed(true);
              } catch (e: any) {
                alert("AI Request Failed: " + (e.response?.data?.detail || e.message));
              }
            }}
          />
        </div>
      ) : (
        <div className="animate-fade-in flex flex-col gap-6">
          <div className="bg-primary-green text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
            <Droplet className="absolute -right-4 -bottom-4 text-white/10" size={120} />
            <h3 className="text-lg font-bold text-white/90 mb-2 uppercase tracking-wide">Next Watering</h3>
            <p className="text-5xl font-extrabold mb-1">2 Days</p>
            <p className="text-sm text-white/80">Thursday Morning, 6:00 AM</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
              <Sun size={28} className="text-accent-yellow mb-2" />
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Evaporation</span>
              <span className="font-bold text-gray-800">High</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
              <Wind size={28} className="text-secondary-green mb-2" />
              <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Soil Moisture</span>
              <span className="font-bold text-gray-800">42% (Optimal)</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border-l-4 border-primary-green shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Sprout className="text-primary-green" size={24} />
              <h4 className="font-bold text-gray-800 text-lg">Why wait 2 days?</h4>
            </div>
            <p className="text-sm text-gray-600">Your Black Soil still retains 42% moisture. Watering now risks root rot for Wheat in the current growth stage.</p>
          </div>

          <BigButton variant="secondary" label="Remind Me on Thursday" className="mt-2" />
          <button
            className="text-gray-400 font-bold uppercase text-sm p-3 mt-2 active:scale-95"
            onClick={() => setAnalyzed(false)}
          >
            Edit Parameters
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartIrrigation;
