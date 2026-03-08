import React, { useState, useEffect } from 'react';
import BigButton from '../components/BigButton';
import { PhoneCall, MapPin, Search, PlusCircle } from 'lucide-react';
import { api } from '../services/api';

const DirectConnect: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get('/features/marketplace');
      setListings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/features/marketplace', {
        crop_name: cropName,
        quantity: parseFloat(quantity) || 0,
        price_per_unit: parseFloat(price) || 0,
        location: location
      });
      fetchListings();
      setShowAdd(false);
      setCropName('');
      setQuantity('');
      setPrice('');
      setLocation('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const containerStyle: React.CSSProperties = {
    padding: '1.5rem',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--white)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    marginBottom: '1rem',
    borderLeft: '6px solid var(--accent)',
  };

  return (
    <div style={containerStyle} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>
          Sell Direct (Marketplace)
        </h2>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)} style={{ background: 'var(--accent)', color: 'white', padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
            <PlusCircle size={18} /> Sell Crop
          </button>
        )}
      </div>
      <p style={{ color: '#555', marginBottom: '1.5rem' }}>
        Bypass middlemen. Connect with buyers directly or list your harvest to secure the best price.
      </p>

      {/* Search Bar matching the "Big" theme */}
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search crop or buyer..."
          style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 3rem', borderRadius: '12px', border: '1px solid #CCC', fontSize: '1.125rem' }}
        />
        <Search style={{ position: 'absolute', left: '1rem', top: '1.25rem', color: '#888' }} size={24} />
      </div>

      {showAdd ? (
        <form onSubmit={handlePost} style={{ ...cardStyle }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Post a Listing</h3>
          <input type="text" required value={cropName} onChange={e => setCropName(e.target.value)} placeholder="Crop (e.g., Tomato)" style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="number" step="0.1" required value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity in Quintals" style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="number" required value={price} onChange={e => setPrice(e.target.value)} placeholder="Expected Price per Quintal (₹)" style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="Your Location" style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', background: 'var(--secondary)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>{loading ? 'Posting...' : 'Post Listing'}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', background: '#ccc', color: '#333', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          {listings.length === 0 && <p>No listings found. Be the first to post!</p>}
          {listings.map(item => (
            <div key={item.id} style={{ ...cardStyle }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--neutral)', textTransform: 'capitalize' }}>{item.crop_name}</h3>
                  <span style={{ fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={16} /> {item.location}
                  </span>
                </div>
                <span style={{ backgroundColor: '#E8F5E9', color: 'var(--success)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  AVAILABLE
                </span>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold' }}>Offer: {item.quantity} q @ ₹{item.price_per_unit}/q</p>
              <BigButton
                label={`Contact Seller #${item.seller_id}`}
                variant="primary"
                icon={<PhoneCall size={20} />}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default DirectConnect;
