import React, { useState, useEffect } from 'react';
import { Tractor, PhoneCall, Star, Plus, X, MapPin } from 'lucide-react';
import { api } from '../services/api';



// ... removed mock initial list

const EquipmentRental: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await api.get('/features/equipment');
      setEquipmentList(res.data);
    } catch (err) {
      console.error("Failed to fetch equipment", err);
    }
  };

  // Form State
  const [newName, setNewName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPrice, setNewPrice] = useState<number | ''>('');
  const [newRateType, setNewRateType] = useState<'per hour' | 'per day'>('per hour');
  const [newDetails, setNewDetails] = useState('');

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    try {
      await api.post('/features/equipment', {
        name: newName,
        type: newDetails, // simplified
        daily_rate: Number(newPrice),
        location: newLocation || 'Nearby'
      });
      fetchEquipment();
      setShowAddForm(false);

      // Reset form
      setNewName('');
      setNewOwner('');
      setNewLocation('');
      setNewPrice('');
      setNewRateType('per hour');
      setNewDetails('');
    } catch (err) {
      console.error("Failed to add equipment", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full pb-20 p-2 relative z-10">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm">Equipment Rentals</h2>
          <p className="text-gray-600 font-medium">Rent tractors and tools directly from nearby farmers.</p>
        </div>
      </div>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 w-full py-4 bg-primary-green/10 text-primary-green border-2 border-dashed border-primary-green rounded-2xl font-bold shadow-sm hover:bg-primary-green/20 active:scale-95 transition-all outline-none"
        >
          <Plus size={24} /> List Your Equipment
        </button>
      ) : (
        <div className="glass-card p-6 shadow-md border-t-4 border-primary-green relative animate-fade-in">
          <button
            onClick={() => setShowAddForm(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>

          <h3 className="text-xl font-bold text-gray-800 mb-6">List Equipment</h3>

          <form onSubmit={handleAddEquipment} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Equipment Name *</label>
              <input
                type="text" required
                value={newName} onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Rotavator, Tractor"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Owner Name *</label>
                <input
                  type="text" required
                  value={newOwner} onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Distance/Location</label>
                <input
                  type="text"
                  value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. 2km or Village Name"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number" required min="0"
                  value={newPrice} onChange={(e) => setNewPrice(Number(e.target.value) || '')}
                  placeholder="Amount"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rate Type</label>
                <select
                  value={newRateType} onChange={(e) => setNewRateType(e.target.value as 'per hour' | 'per day')}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50"
                >
                  <option value="per hour">Per Hour</option>
                  <option value="per day">Per Day</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">More Details / Description</label>
              <textarea
                value={newDetails} onChange={(e) => setNewDetails(e.target.value)}
                placeholder="Include model, condition, driver info, terms..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none resize-none bg-white/50"
                rows={3}
              />
            </div>

            <button type="submit" className="w-full py-4 rounded-xl font-extrabold bg-gradient-to-r from-primary-green to-emerald-600 text-white shadow-md hover:shadow-lg active:scale-95 transition-all mt-2">
              Add to Listings
            </button>
          </form>
        </div>
      )}

      {/* Equipment List */}
      <div className="flex flex-col gap-6 mt-4">
        {equipmentList.map(item => (
          <div key={item.id} className="glass-card overflow-hidden shadow-md">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-40 w-full flex items-center justify-center relative shadow-inner">
              {/* Placeholder for an image, using icon for now */}
              <Tractor className="text-gray-400 opacity-50 absolute" size={100} strokeWidth={1} />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary-green text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary-green animate-pulse"></div>
                AVAILABLE
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    Owner ID: {item.owner_id} <span className="mx-1">•</span> <MapPin size={12} className="mr-0.5" /> {item.location}
                  </div>
                </div>
                <div className="flex items-center text-accent-yellow bg-accent-yellow/10 px-2 py-1 rounded-md font-bold text-sm">
                  <Star size={14} className="fill-accent-yellow mr-1" /> 5.0
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4 text-sm text-gray-600 leading-relaxed font-medium">
                {item.type || 'No additional details provided.'}
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-primary-green">₹{item.daily_rate}</span>
                  <span className="text-gray-500 text-sm font-medium">per day</span>
                </div>
              </div>

              <button className="w-full py-3 rounded-xl font-bold bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-green hover:text-primary-green shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                <PhoneCall size={18} /> Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentRental;
