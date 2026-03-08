import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Dashboard from './modules/Dashboard'
import CropRecommendation from './modules/CropRecommendation'
import PriceForecast from './modules/PriceForecast'
import DirectConnect from './modules/DirectConnect'
import GovSchemes from './modules/GovSchemes'
import VoiceAssistant from './components/VoiceAssistant'

// New V2 Modules
import WeatherIntelligence from './modules/WeatherIntelligence'
import CropDisease from './modules/CropDisease'
import SmartIrrigation from './modules/SmartIrrigation'
import ExpenseTracker from './modules/ExpenseTracker'
import EquipmentRental from './modules/EquipmentRental'
import StorageFinder from './modules/StorageFinder'
import TransportBooking from './modules/TransportBooking'
import Community from './modules/Community'
import LearningCenter from './modules/LearningCenter'
import FarmRecords from './modules/FarmRecords'
import Profile from './modules/Profile'
import Auth from './components/Auth'

import './index.css'

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard')
  const [isVoiceOpen, setIsVoiceOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) setIsAuthenticated(true)

    const handleAuthError = () => setIsAuthenticated(false)
    window.addEventListener('auth-error', handleAuthError)
    return () => window.removeEventListener('auth-error', handleAuthError)
  }, [])

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab: string) => setCurrentTab(tab)} />
      case 'crop':
        return <CropRecommendation />
      case 'market':
        return <PriceForecast />
      case 'connect':
        return <Community /> // Replaced DirectConnect with V2 Community
      case 'profile':
        return <Profile />

      // Secondary Routes accessible via Dashboard
      case 'schemes': return <GovSchemes />
      case 'weather': return <WeatherIntelligence />
      case 'disease': return <CropDisease />
      case 'irrigation': return <SmartIrrigation />
      case 'expense': return <ExpenseTracker />
      case 'equipment': return <EquipmentRental />
      case 'storage': return <StorageFinder />
      case 'transport': return <TransportBooking />
      case 'learning': return <LearningCenter />
      case 'records': return <FarmRecords />
      case 'direct_connect': return <DirectConnect />

      default:
        return <Dashboard onNavigate={(tab: string) => setCurrentTab(tab)} />
    }
  }

  return (
    <div className="app-container">
      {/* Top App Bar Area */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white/80 backdrop-blur-xl text-gray-800 p-4 shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-primary-green to-emerald-500 p-2 rounded-xl shadow-sm">
            <img src="/vite.svg" alt="AgroSync Logo" className="w-5 h-5 filter brightness-0 invert" />
          </div>
          <span className="text-xl font-black premium-gradient-text tracking-tight drop-shadow-sm">AgroSync</span>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={localStorage.getItem('agro_language') || 'en-IN'}
            onChange={(e) => {
              localStorage.setItem('agro_language', e.target.value);
              window.location.reload();
            }}
            className="text-sm font-bold bg-green-50 text-primary-green rounded-lg px-2 py-1 outline-none cursor-pointer border border-green-200"
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="pa-IN">ਪੰਜਾਬੀ</option>
          </select>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors border border-red-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        {renderContent()}
      </main>

      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenVoice={() => setIsVoiceOpen(true)}
      />

      <VoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />
    </div>
  )
}

export default App
