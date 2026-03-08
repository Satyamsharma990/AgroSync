import React from 'react';
import BigButton from '../components/BigButton';
import { MapPin, Award, Phone } from 'lucide-react';

const Profile: React.FC = () => {

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full relative z-10 w-full max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold premium-gradient-text drop-shadow-sm">Farmer Profile</h2>

      <div className="glass-card p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-green to-[#1B5E20] text-white rounded-full flex items-center justify-center text-4xl font-black mb-4 shadow-inner">
          RS
        </div>
        <h3 className="text-xl font-extrabold text-gray-800">Ram Singh</h3>
        <p className="text-gray-500 font-medium flex items-center gap-1 mt-1 justify-center">
          <MapPin size={16} /> Pune, Maharashtra
        </p>
        <p className="text-gray-500 font-medium flex items-center gap-1 mt-1 justify-center">
          <Phone size={16} /> +91 98765 43210
        </p>

        <div className="flex gap-2 mt-5 w-full">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex-1 flex flex-col items-center shadow-sm">
            <Award size={28} className="text-amber-500 mb-1" strokeWidth={2.5} />
            <span className="font-bold text-gray-800 text-sm">Top Seller</span>
          </div>
          <div className="bg-primary-green/10 border border-primary-green/20 rounded-2xl p-3 flex-1 flex flex-col items-center shadow-sm">
            <span className="font-black text-primary-green text-2xl mb-1 drop-shadow-sm">5</span>
            <span className="font-bold text-gray-800 text-sm">Acres Total</span>
          </div>
        </div>
      </div>



      <div className="flex flex-col gap-3 pb-8">
        <h3 className="font-bold text-gray-800 text-lg ml-1">Account Settings</h3>
        <BigButton variant="secondary" label="Edit Profile Info" className="py-4 shadow-sm" />
        <BigButton variant="secondary" label="Language: English" className="py-4 shadow-sm" />
        <BigButton variant="danger" label="Log Out" className="py-4 shadow-sm" />
      </div>

    </div>
  );
};

export default Profile;
