import React, { useState, useEffect } from 'react';
import BigButton from '../components/BigButton';
import { History, Sprout } from 'lucide-react';
import { api } from '../services/api';

const FarmRecords: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form
  const [cropName, setCropName] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/features/farm-records');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/features/farm-records', {
        crop_name: cropName,
        sowing_date: new Date().toISOString(),
        area: parseFloat(area) || 1.0,
      });
      fetchRecords();
      setShowForm(false);
      setCropName('');
      setArea('');
    } catch (err) {
      console.error("Failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full">
      <h2 className="text-2xl font-bold text-secondary-green flex items-center gap-2">
        <History /> Digital Farm Records
      </h2>
      <p className="text-gray-600">Securely store your crop history, fertilizer usage, and harvest timelines in one place.</p>

      {!showForm ? (
        <BigButton variant="primary" label="Add New Record" onClick={() => setShowForm(true)} />
      ) : (
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4 animate-fade-in">
          <h3 className="font-bold text-gray-800">Record Sowing Event</h3>
          <input type="text" required value={cropName} onChange={e => setCropName(e.target.value)} placeholder="Crop Name (e.g., Wheat)" className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green" />
          <input type="number" step="0.1" required value={area} onChange={e => setArea(e.target.value)} placeholder="Area planted (Acres)" className="p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-green" />
          <div className="flex gap-2">
            <BigButton variant="primary" label={loading ? 'Saving...' : 'Save Record'} disabled={loading} type="submit" className="flex-1" />
            <BigButton variant="secondary" label="Cancel" onClick={() => setShowForm(false)} className="flex-1 bg-gray-400" />
          </div>
        </form>
      )}

      {/* Timeline UI */}
      <div className="relative border-l-2 border-primary-green ml-4 mt-4 flex flex-col gap-8">

        {records.length === 0 && <p className="text-gray-500 text-sm ml-6">No records found. Start your digital farm journal today.</p>}
        {records.map((rec) => (
          <div key={rec.id} className="relative pl-6">
            <div className="absolute -left-[17px] top-1 bg-white border-4 border-primary-green w-8 h-8 rounded-full flex items-center justify-center">
              <Sprout size={14} className="text-primary-green" />
            </div>
            <div>
              <span className="text-sm font-bold text-primary-green block mb-1">
                {new Date(rec.sowing_date).toLocaleDateString()}
              </span>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-1">Planted {rec.crop_name}</h3>
                <p className="text-sm text-gray-600">Covered {rec.area} acres. Waiting for harvest.</p>
              </div>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
};

export default FarmRecords;
