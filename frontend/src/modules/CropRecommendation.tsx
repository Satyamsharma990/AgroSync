import React, { useState } from 'react';
import { Sprout, TestTube, MapPin, Calculator, Loader2, Droplets, Sun, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

interface CropResult {
  name: string;
  reason: string[];
  demand: string;
  sowingTime: string;
  expectedYield: string;
}

const CropRecommendation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form states
  const [soilType, setSoilType] = useState('Black Soil');
  const [season, setSeason] = useState('Summer');
  const [waterAvailability, setWaterAvailability] = useState('Good rain');
  const [notes, setNotes] = useState('');

  const [result, setResult] = useState<CropResult | null>(null);

  const getRecommendation = async () => {
    setIsAnalyzing(true);

    try {
      const response = await api.post('/ai/crop-recommendation', {
        soilType: soilType,
        season: season,
        waterAvailability: waterAvailability,
        additionalNotes: notes
      });

      const data = response.data;
      const cropName = data.recommended_crop || "Unknown Crop";

      const recommendation: CropResult = {
        name: cropName,
        reason: [
          data.reasoning || `AI considered your soil type and season.`,
          data.planting_advice || 'Optimal NPK and climate conditions predicted.'
        ],
        demand: 'High Demand Expected',
        sowingTime: 'See Planting Advice ↑',
        expectedYield: data.expected_yield || 'Varies based on precise conditions'
      };

      setResult(recommendation);
      setStep(2);
    } catch (err) {
      console.error("AI Recommendation failed", err);
      alert("Failed to get recommendation from AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full pb-20 p-2 relative z-10 w-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm">Crop Advisor</h2>
          <p className="text-gray-600 font-medium">Data-driven planting recommendations.</p>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex flex-col gap-5">
          <div className="flex items-center gap-3 text-primary-green mb-2">
            <MapPin size={24} className="text-primary-green" />
            <h3 className="font-extrabold flex-1 text-xl text-gray-800">Farm Details</h3>
          </div>

          <div className="p-4 bg-primary-green/5 rounded-2xl border border-primary-green/10 text-sm text-gray-700 font-medium leading-relaxed">
            Tell us about your field constraints. We will match your soil and season with high-yield crop profiles.
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-2 flex items-center gap-2">
                <TestTube size={16} className="text-gray-500" /> Primary Soil Type (Type in details)
              </label>
              <input
                type="text"
                placeholder="e.g. Black soil, dry context"
                value={soilType} onChange={(e) => setSoilType(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-green bg-gray-50 shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Sun size={16} className="text-gray-500" /> Current Season / Weather
              </label>
              <input
                type="text"
                placeholder="e.g. Summer, very hot"
                value={season} onChange={(e) => setSeason(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-green bg-gray-50 shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Droplets size={16} className="text-gray-500" /> Water Availability / Status
              </label>
              <input
                type="text"
                placeholder="e.g. Drip irrigation, low groundwater"
                value={waterAvailability} onChange={(e) => setWaterAvailability(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-green bg-gray-50 shadow-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2 flex items-center gap-2">
                Additional Notes
              </label>
              <input
                type="text"
                placeholder="e.g. I have 5 acres of land and prefer vegetables"
                value={notes} onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-green bg-gray-50 shadow-sm font-medium"
              />
            </div>
          </div>

          <button
            onClick={getRecommendation}
            disabled={isAnalyzing}
            className={`w-full py-4 mt-2 rounded-xl font-extrabold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary-green to-emerald-600 hover:shadow-lg'}`}
          >
            {isAnalyzing ? (
              <><Loader2 size={20} className="animate-spin" /> Analyzing Agronomy Data...</>
            ) : (
              <><Calculator size={20} /> Generate Recommendation</>
            )}
          </button>
        </div>
      )}

      {step === 2 && result && (
        <div className="bg-white rounded-3xl p-6 shadow-md border-t-8 border-primary-green flex flex-col gap-5 animate-fade-in relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-5">
            <Sprout size={120} />
          </div>

          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-3 bg-primary-green/10 rounded-xl text-primary-green">
              <Sprout size={28} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-gray-500">AI Recommendation</p>
              <h3 className="font-black text-2xl text-gray-800">{result.name}</h3>
            </div>
          </div>

          <div className="inline-block py-1.5 px-3 bg-green-100 text-green-700 font-bold rounded-lg text-sm self-start shadow-sm border border-green-200">
            {result.demand}
          </div>

          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TestTube size={18} className="text-primary-green" />
              <strong className="text-gray-800 text-lg">Why this crop?</strong>
            </div>
            <ul className="space-y-2 text-gray-600 font-medium">
              {result.reason.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <ChevronRight size={18} className="text-primary-green shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2 mb-2 relative z-10">
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Sowing Window</span>
              <span className="font-bold text-gray-800">{result.sowingTime}</span>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase block mb-1">Expected Yield</span>
              <span className="font-bold text-gray-800">{result.expectedYield}</span>
            </div>
          </div>

          <div className="flex gap-3 relative z-10 mt-2">
            <button
              className="flex-1 py-3.5 rounded-xl font-bold bg-primary-green/10 text-primary-green hover:bg-primary-green hover:text-white transition-colors active:scale-95 text-sm"
            >
              Find Seeds
            </button>
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors active:scale-95 text-sm"
            >
              Analyze Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
