import React, { useState, useEffect } from 'react';
import { Warehouse, MapPin, Plus, X, PhoneCall } from 'lucide-react';
import { api } from '../services/api';



// ... removed mock storage

const StorageFinder: React.FC = () => {
  const [storageList, setStorageList] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const res = await api.get('/features/storage');
      setStorageList(res.data);
    } catch (err) {
      console.error("Failed to fetch storage", err);
    }
  };

  // Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'Cold Storage' | 'Warehouse'>('Warehouse');
  const [newLocation, setNewLocation] = useState('');
  const [newCost, setNewCost] = useState<number | ''>('');

  const handleAddStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLocation || !newCost) return;

    try {
      await api.post('/features/storage', {
        name: newName,
        type: newType,
        location: newLocation,
        capacity: 1000, // Dummy static capacity since UI lacks this field
        rate_per_ton: Number(newCost)
      });
      fetchStorage();
      setShowAddForm(false);

      // Reset form
      setNewName('');
      setNewType('Warehouse');
      setNewLocation('');
      setNewCost('');
    } catch (err) {
      console.error("Failed to add storage", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Space Available': return 'bg-primary-green/10 text-primary-green';
      case 'Nearly Full': return 'bg-accent-yellow/10 text-accent-yellow';
      default: return 'bg-alert-red/10 text-alert-red';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full pb-20 p-2 relative z-10">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm">Storage Finder</h2>
          <p className="text-gray-600 font-medium">Find or list warehouse space to secure your harvest.</p>
        </div>
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 w-full py-4 bg-accent-yellow/10 text-accent-yellow border-2 border-dashed border-accent-yellow rounded-2xl font-bold shadow-sm hover:bg-accent-yellow/20 active:scale-95 transition-all outline-none"
        >
          <Plus size={24} /> List Storage Space
        </button>
      ) : (
        <div className="glass-card p-6 shadow-md border-t-4 border-accent-yellow relative animate-fade-in">
          <button
            onClick={() => setShowAddForm(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>

          <h3 className="text-xl font-bold text-gray-800 mb-6">List Storage Space</h3>

          <form onSubmit={handleAddStorage} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Facility Name *</label>
              <input
                type="text" required
                value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Village Godown"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow outline-none bg-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Facility Type</label>
                <select
                  value={newType} onChange={(e) => setNewType(e.target.value as 'Cold Storage' | 'Warehouse')}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow outline-none bg-white/50"
                >
                  <option value="Warehouse">Warehouse</option>
                  <option value="Cold Storage">Cold Storage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Distance/Location *</label>
                <input
                  type="text" required
                  value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. 5km near Highway"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow outline-none bg-white/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cost per bag/month (₹) *</label>
              <input
                type="number" required min="0"
                value={newCost} onChange={(e) => setNewCost(Number(e.target.value) || '')}
                placeholder="Amount"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow outline-none bg-white/50"
              />
            </div>

            <button type="submit" className="w-full py-4 rounded-xl font-extrabold bg-gradient-to-r from-accent-yellow to-yellow-600 text-white shadow-md hover:shadow-lg active:scale-95 transition-all mt-2">
              Add to Directory
            </button>
          </form>
        </div>
      )}

      {/* Storage List */}
      <div className="flex flex-col gap-6 mt-4">
        {storageList.map(facility => (
          <div key={facility.id} className="bg-white rounded-2xl p-5 shadow-md border-l-4 border-l-accent-yellow border border-gray-100 transition-all hover:shadow-lg">
            <div className="flex gap-4">
              <div className="bg-accent-yellow/10 p-3 rounded-xl h-fit">
                <Warehouse className="text-accent-yellow" size={32} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{facility.name}</h3>
                    <p className="text-primary-green text-xs font-bold uppercase tracking-wider">{facility.type}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} className="text-gray-400" /> {facility.location}
                    </p>
                  </div>
                  <span className={`${getStatusColor(facility.status)} px-2 py-1 rounded text-[10px] font-bold uppercase text-center w-20 leading-tight`}>
                    {facility.status}
                  </span>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-xl flex justify-between items-center mb-4 border border-gray-100">
                  <div>
                    <span className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">Rate Estimate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-lg text-gray-800">₹{facility.rate_per_ton || facility.cost}</span>
                      <span className="text-sm font-medium text-gray-500">/ ton / month</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl font-bold bg-white text-gray-700 border-2 border-gray-200 hover:border-accent-yellow hover:text-accent-yellow shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                  <PhoneCall size={18} /> Call to Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default StorageFinder;
