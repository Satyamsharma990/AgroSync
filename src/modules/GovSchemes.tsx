import React, { useState, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  Coins,
  ClipboardList,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

interface GovernmentScheme {
  id: string;
  name: string;
  shortDescription: string;
  benefit: string;
  eligibility: string[];
  steps: string[];
  link: string;
  tags: {
    crops: string[];
    states: string[];
    categories: string[];
  };
}

const SCHEMES: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN Samman Nidhi',
    shortDescription: 'Income Support Scheme for vulnerable landholding farmer families.',
    benefit: '₹6000 per year income support for small and marginal farmers.',
    eligibility: [
      'Small and marginal farmers',
      'Must own cultivable land',
      'Valid Aadhaar number',
      'Bank account linked with Aadhaar'
    ],
    steps: [
      'Visit pmkisan.gov.in',
      'Register farmer details',
      'Submit Aadhaar and land details',
      'Verification by local authorities'
    ],
    link: 'https://pmkisan.gov.in',
    tags: {
      crops: ['All'],
      states: ['All'],
      categories: ['Small/Marginal']
    }
  },
  {
    id: 'soil-health',
    name: 'Soil Health Card Scheme',
    shortDescription: 'Provides crop-wise recommendations of nutrients and fertilizers.',
    benefit: 'Free soil testing and targeted soil health report.',
    eligibility: [
      'All farmers',
      'Must provide soil samples from their field'
    ],
    steps: [
      'Contact local agriculture office',
      'Submit soil sample',
      'Receive soil health report'
    ],
    link: 'https://soilhealth.dac.gov.in/',
    tags: {
      crops: ['All'],
      states: ['All'],
      categories: ['All', 'Small/Marginal', 'Large']
    }
  },
  {
    id: 'pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    shortDescription: 'Comprehensive crop insurance coverage against unforeseen events.',
    benefit: 'Crop insurance against natural disasters, pests, and diseases.',
    eligibility: [
      'Farmers growing notified crops',
      'Farmers enrolled before sowing season'
    ],
    steps: [
      'Visit nearest bank or insurance provider',
      'Register crop details',
      'Pay minimal insurance premium'
    ],
    link: 'https://pmfby.gov.in/',
    tags: {
      crops: ['Wheat', 'Rice', 'Cotton', 'Soybean'], // Notified crops
      states: ['All'],
      categories: ['All', 'Small/Marginal', 'Large']
    }
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card (KCC)',
    shortDescription: 'Adequate and timely credit support via a single window.',
    benefit: 'Low-interest credit for farming needs.',
    eligibility: [
      'Farmers with agricultural land',
      'Must have valid ID and land records'
    ],
    steps: [
      'Visit bank branch',
      'Submit land documents',
      'Apply for KCC loan'
    ],
    link: 'https://sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card',
    tags: {
      crops: ['All'],
      states: ['All'],
      categories: ['All', 'Small/Marginal', 'Large']
    }
  },
  {
    id: 'enam',
    name: 'National Agriculture Market (e-NAM)',
    shortDescription: 'Pan-India electronic trading portal uniting APMC mandis.',
    benefit: 'Online platform to sell crops at better prices free from local cartels.',
    eligibility: [
      'Farmers registered in APMC mandis'
    ],
    steps: [
      'Register on eNAM portal',
      'Link bank account',
      'Start trading agricultural produce'
    ],
    link: 'https://enam.gov.in/',
    tags: {
      crops: ['All'],
      states: ['All'],
      categories: ['All', 'Small/Marginal', 'Large']
    }
  }
];

const GovSchemes: React.FC = () => {
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);

  // Filter States
  const [cropFilter, setCropFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('Small/Marginal');

  const [aiLoading, setAiLoading] = useState(false);
  const [personalizedSchemes, setPersonalizedSchemes] = useState<any[]>([]);

  const fetchPersonalizedSchemes = async () => {
    setAiLoading(true);
    try {
      const res = await api.get('/schemes/recommendations');
      if (res.data.message) {
        alert(res.data.message);
        return;
      }

      let schemes = [];
      if (res.data.recommendations_from_gemini) {
        let text = res.data.recommendations_from_gemini;
        text = text.replace(/```json/gi, '').replace(/```/gi, '').trim();
        schemes = JSON.parse(text);
      } else if (res.data.schemes) {
        schemes = res.data.schemes; // Fallback
      }

      if (schemes && schemes.length > 0) {
        setPersonalizedSchemes(schemes);
      }
    } catch (err) {
      console.error("AI Scheme fetch failed", err);
      alert("Failed to get personalized schemes.");
    } finally {
      setAiLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };

  // Check if a scheme matches the current selected profile
  const isMatch = (scheme: GovernmentScheme) => {
    const matchesCrop = scheme.tags.crops.includes('All') || scheme.tags.crops.includes(cropFilter) || cropFilter === 'All';
    const matchesState = scheme.tags.states.includes('All') || scheme.tags.states.includes(stateFilter) || stateFilter === 'All';
    const matchesCat = scheme.tags.categories.includes('All') || scheme.tags.categories.includes(categoryFilter) || categoryFilter === 'All';

    return matchesCrop && matchesState && matchesCat;
  };

  const filteredSchemes = useMemo(() => {
    // We display all of them but sort the matched ones to the top.
    const matched = SCHEMES.filter(isMatch);
    const unmatched = SCHEMES.filter(s => !isMatch(s));
    return [...matched, ...unmatched];
  }, [cropFilter, stateFilter, categoryFilter]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full pb-20 p-2 relative z-10 w-full">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm flex items-center gap-2">
            Help from the Government
          </h2>
          <p className="text-gray-600 font-medium leading-relaxed mt-1">
            Discover subsidies and financial aids. Filter by your profile to find guaranteed matches.
          </p>
        </div>
      </div>

      {!personalizedSchemes.length ? (
        <button
          onClick={fetchPersonalizedSchemes}
          disabled={aiLoading}
          className="w-full py-4 mb-2 rounded-xl font-extrabold bg-gradient-to-r from-primary-green to-emerald-600 text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {aiLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          {aiLoading ? "Consulting AI..." : "Get AI Personalized Schemes"}
        </button>
      ) : (
        <div className="bg-green-50 rounded-2xl p-5 border border-green-200 mb-2 shadow-inner">
          <h3 className="text-xl font-black text-green-800 flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-green-600" /> AI Recommended For Your Profile
          </h3>
          <div className="flex flex-col gap-4">
            {personalizedSchemes.map((s, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-green-100">
                <h4 className="font-bold text-lg text-gray-800">{s.name}</h4>
                <p className="text-gray-600 text-sm mt-1">{s.description}</p>
                <div className="mt-3 bg-gray-50 p-2 rounded flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <span><strong>Eligibility:</strong> {s.eligibility}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setPersonalizedSchemes([])} className="mt-4 text-green-700 text-sm font-bold underline">Hide AI Recommendations</button>
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gray-800 font-bold mb-1">
          <Filter size={20} className="text-primary-green" /> Filter Schemes
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={cropFilter} onChange={e => setCropFilter(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-green"
          >
            <option value="All">All Crops</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Cotton">Cotton</option>
          </select>

          <select
            value={stateFilter} onChange={e => setStateFilter(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-green"
          >
            <option value="All">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Punjab">Punjab</option>
            <option value="Gujarat">Gujarat</option>
          </select>

          <select
            value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-primary-green"
          >
            <option value="All">All Categories</option>
            <option value="Small/Marginal">Small/Marginal</option>
            <option value="Large">Large Farmer</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredSchemes.map((scheme) => {
          const matched = isMatch(scheme);
          const expanded = expandedSchemeId === scheme.id;

          return (
            <div key={scheme.id} className={`bg-white rounded-2xl shadow-md border overflow-hidden transition-all duration-300 ${matched ? 'border-primary-green/40 shadow-green-900/5' : 'border-gray-100'}`}>
              <div
                className="p-5 cursor-pointer flex flex-col gap-3 relative"
                onClick={() => toggleExpand(scheme.id)}
              >
                {matched && (
                  <span className="absolute top-4 right-4 bg-green-100 text-green-700 font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Award size={14} /> AI Matched for You
                  </span>
                )}

                <div className="pr-32">
                  <h3 className="text-xl font-black text-gray-800">{scheme.name}</h3>
                  <p className="text-gray-500 font-medium text-sm mt-1">{scheme.shortDescription}</p>
                </div>
              </div>

              {/* Minimized view features */}
              <div className="px-5 pb-5">
                <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                  <Coins size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-800 block mb-0.5">Benefit</span>
                    {scheme.benefit}
                  </div>
                </div>

                {expanded && (
                  <div className="animate-fade-in space-y-4 mt-4 border-t border-gray-100 pt-4">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-gray-800 mb-2">
                        <CheckCircle2 size={18} className="text-blue-500" /> Eligibility
                      </div>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-1">
                        {scheme.eligibility.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 font-bold text-gray-800 mb-2">
                        <ClipboardList size={18} className="text-purple-500" /> How to Apply
                      </div>
                      <ol className="list-decimal list-inside text-gray-600 text-sm space-y-1 ml-1 font-medium bg-purple-50 p-3 rounded-lg border border-purple-100">
                        {scheme.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <a
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full py-3.5 bg-primary-green text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-green-700 transition-colors shadow-sm active:scale-95"
                    >
                      Visit Official Portal <ExternalLink size={18} />
                    </a>
                  </div>
                )}

                <button
                  onClick={(e) => { e.stopPropagation(); toggleExpand(scheme.id); }}
                  className="mt-2 w-full flex items-center justify-center gap-1 py-2 text-primary-green font-bold text-sm bg-primary-green/5 hover:bg-primary-green/10 rounded-lg transition-colors"
                >
                  {expanded ? (
                    <>Hide Details <ChevronUp size={16} /></>
                  ) : (
                    <>[Show More] <ChevronDown size={16} /></>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GovSchemes;
