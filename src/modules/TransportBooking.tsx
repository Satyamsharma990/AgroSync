import React, { useState, useEffect } from 'react';
import { Truck, PhoneCall, PackageOpen, X, Star, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';


// ... removed mock initial list

const TransportBooking: React.FC = () => {
  const [transportList, setTransportList] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'Book' | 'List'>('Book');

  useEffect(() => {
    fetchTransport();
  }, []);

  const fetchTransport = async () => {
    try {
      const res = await api.get('/features/transport');
      setTransportList(res.data);
    } catch (err) {
      console.error("Failed to fetch transport", err);
    }
  };

  // Form State
  const [newDriver, setNewDriver] = useState('');
  const [newType, setNewType] = useState<'Mini Pickup' | 'Heavy Truck' | 'Auto'>('Mini Pickup');
  const [newCapacity, setNewCapacity] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newFare, setNewFare] = useState<number | ''>('');

  // Booking State
  const [destination, setDestination] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState<{ distance: string, fare: number } | null>(null);

  const handleAddTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriver || !newLocation || !newFare) return;

    try {
      await api.post('/features/transport', {
        vehicle_type: newType,
        capacity: parseFloat(newCapacity) || 1.0,
        rate_per_km: Number(newFare),
        location: newLocation
      });
      fetchTransport();
      setShowAddForm(false);
      setActiveTab('Book');

      // Reset form
      setNewDriver('');
      setNewType('Mini Pickup');
      setNewCapacity('');
      setNewLocation('');
      setNewFare('');
    } catch (err) {
      console.error("Failed to add transport", err);
    }
  };

  const getVehicleIconColor = (type: string) => {
    switch (type) {
      case 'Mini Pickup': return 'text-primary-green bg-primary-green/10';
      case 'Heavy Truck': return 'text-gray-600 bg-gray-100';
      default: return 'text-accent-yellow bg-accent-yellow/10';
    }
  };

  const handleCalculateFare = () => {
    if (!destination.trim()) {
      alert("Please enter a destination to calculate fare.");
      return;
    }

    setIsCalculating(true);
    setEstimatedFare(null);

    // Simulate API calculation delay
    setTimeout(() => {
      const mockDistance = Math.floor(Math.random() * 40) + 10; // 10 to 50 km
      const mockFare = mockDistance * 35; // ₹35 per km avg for pickup
      setEstimatedFare({ distance: `${mockDistance} km`, fare: mockFare });
      setIsCalculating(false);
    }, 1500);
  };

  const handleContactDriver = (driverName: string) => {
    // In a real app, this might open a dialer or initiate an in-app chat
    alert(`Initiating secure call to ${driverName}...\n\n(This is a simulated action. In a live environment, this would open your phone's dialer.)`);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full pb-20 p-2 relative z-10">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm">Transport</h2>
          <p className="text-gray-600 font-medium">Book logistics or list your own vehicle.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-2xl">
        <button
          onClick={() => { setActiveTab('Book'); setShowAddForm(false); }}
          className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all ${activeTab === 'Book' ? 'bg-white shadow-sm text-primary-green' : 'text-gray-500 hover:text-gray-800'}`}
        >
          Book a Ride
        </button>
        <button
          onClick={() => { setActiveTab('List'); setShowAddForm(true); }}
          className={`flex-1 py-3 text-sm font-extrabold rounded-xl transition-all ${activeTab === 'List' ? 'bg-white shadow-sm text-primary-green' : 'text-gray-500 hover:text-gray-800'}`}
        >
          List a Vehicle
        </button>
      </div>

      {!showAddForm ? (
        <>
          {/* Quick Book Form */}
          <div className="bg-primary-green/5 rounded-3xl p-6 border-2 border-primary-green/10 shadow-inner">
            <h3 className="font-extrabold text-gray-800 mb-4 flex items-center gap-2 text-lg">
              <PackageOpen size={22} className="text-primary-green" /> Quick Route Estimator
            </h3>

            <div className="flex flex-col gap-3 mb-6 relative">
              <input type="text" placeholder="From: My Farm" className="w-full p-4 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary-green bg-white shadow-sm font-medium" disabled />
              <div className="absolute left-6 top-[2.7rem] bottom-[2.7rem] w-0.5 bg-gray-200 z-0"></div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="To (e.g., Pune Mandi)"
                className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary-green bg-white shadow-sm font-medium relative z-10"
              />
            </div>

            {estimatedFare && (
              <div className="mb-6 p-4 bg-white rounded-xl border border-primary-green/30 flex items-center justify-between animate-fade-in shadow-sm">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-primary-green" /> Route Calculated
                  </p>
                  <p className="text-sm font-bold text-gray-800">Est. Distance: {estimatedFare.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Avg Fare</p>
                  <p className="text-xl font-black text-primary-green">~₹{estimatedFare.fare}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleCalculateFare}
              disabled={isCalculating}
              className={`w-full py-4 rounded-xl font-extrabold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 ${isCalculating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-primary-green to-emerald-600 hover:shadow-lg'}`}
            >
              {isCalculating ? (
                <><Loader2 size={20} className="animate-spin" /> Calculating Route...</>
              ) : (
                'Calculate Distance & Fare'
              )}
            </button>
          </div>

          <h3 className="font-extrabold text-xl text-gray-800 mt-2">Available Drivers</h3>

          {/* Dynamic Transport List */}
          <div className="flex flex-col gap-4">
            {transportList.map(vehicle => (
              <div key={vehicle.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className={`p-4 rounded-2xl h-fit border border-white shadow-inner flex items-center justify-center ${getVehicleIconColor(vehicle.vehicleType)}`}>
                    <Truck size={36} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{vehicle.vehicleType}</h3>
                        <p className="text-xs text-primary-green font-bold uppercase tracking-wider mb-1">{vehicle.capacity}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                          <MapPin size={14} className="text-gray-400" /> {vehicle.location}
                        </p>
                      </div>
                      <div className="flex items-center text-accent-yellow bg-accent-yellow/10 px-2 py-1 rounded-md font-bold text-xs shadow-sm">
                        <Star size={12} className="fill-accent-yellow mr-1" /> {vehicle.rating}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <span className="block text-xs text-gray-400 uppercase font-bold tracking-wider mb-0.5">Base Fare / Est.</span>
                        <span className="font-black text-xl text-gray-800">
                          {estimatedFare && activeTab === 'Book'
                            ? `~₹${Math.max(vehicle.baseFare, estimatedFare.fare)}`
                            : `₹${vehicle.baseFare}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleContactDriver(vehicle.driverName)}
                        className="py-2.5 px-5 rounded-xl font-bold bg-primary-green/10 text-primary-green hover:bg-primary-green hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <PhoneCall size={16} /> Contact {vehicle.driverName.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* List Vehicle Form */
        <div className="glass-card p-6 shadow-md border-t-4 border-primary-green relative animate-fade-in mt-2">
          <button
            onClick={() => { setShowAddForm(false); setActiveTab('Book'); }}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>

          <h3 className="text-xl font-bold text-gray-800 mb-6">Partner with AgroSync</h3>

          <form onSubmit={handleAddTransport} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Driver / Agency Name *</label>
              <input
                type="text" required
                value={newDriver} onChange={(e) => setNewDriver(e.target.value)}
                placeholder="Ramesh Transports"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Vehicle Type</label>
                <select
                  value={newType} onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50 font-medium"
                >
                  <option value="Mini Pickup">Mini Pickup (Ace/Dost)</option>
                  <option value="Heavy Truck">Heavy Truck</option>
                  <option value="Auto">Commercial Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Max Capacity</label>
                <input
                  type="text"
                  value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)}
                  placeholder="e.g. 1.5 Tons"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Current Location / Hub *</label>
              <input
                type="text" required
                value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Near City APMC"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Minimum Base Fare (₹) *</label>
              <input
                type="number" required min="0"
                value={newFare} onChange={(e) => setNewFare(Number(e.target.value) || '')}
                placeholder="Starting price"
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none bg-white/50 font-medium"
              />
            </div>

            <button type="submit" className="w-full py-4 rounded-xl font-extrabold bg-gradient-to-r from-primary-green to-emerald-600 text-white shadow-md hover:shadow-lg active:scale-95 transition-all mt-4">
              Publish Listing
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TransportBooking;
