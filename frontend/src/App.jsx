import React, { useState, useEffect } from 'react';
import { MapPinIcon, BellIcon, Mail, PhoneIcon, CheckIcon } from 'lucide-react';

// This would be your actual Supabase client setup
// import { supabase } from './supabaseClient';

function App() {
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [topics, setTopics] = useState({
    deforestation: false,
    airPollution: false,
    flooding: false,
    glacierMelting: false,
    urbanExpansion: false,
    coastalErosion: false,
  });
  const [notifyMethod, setNotifyMethod] = useState('email');
  const [contactInfo, setContactInfo] = useState('');
  const [viewState, setViewState] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 4,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Available regions (simplified for demo)
  const regions = [
    { id: 1, name: 'Kerala', lat: 10.8505, lng: 76.2711 },
    { id: 2, name: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { id: 3, name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
    { id: 4, name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
    { id: 5, name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
  ];

  const handleRegionToggle = (region) => {
    if (selectedRegions.some(r => r.id === region.id)) {
      setSelectedRegions(selectedRegions.filter(r => r.id !== region.id));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };

  const handleTopicToggle = (topic) => {
    setTopics({ ...topics, [topic]: !topics[topic] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Prepare data for saving
    const userData = {
      regions: selectedRegions.map(r => r.name),
      topics: Object.keys(topics).filter(key => topics[key]),
      notifyMethod: notifyMethod,
      contactInfo: contactInfo,
      // userId would come from auth context in a real app
      userId: 'demo-user-123',
    };

    // Simulate API call with timeout
    setTimeout(() => {
      console.log('Saved preferences:', userData);
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
    
    // With actual Supabase, it would be something like:
    // try {
    //   const { data, error } = await supabase
    //     .from('user_preferences')
    //     .upsert({
    //       user_id: userId,
    //       regions: selectedRegions.map(r => r.name),
    //       topics: Object.keys(topics).filter(key => topics[key]),
    //       notify_method: notifyMethod,
    //       contact_info: contactInfo,
    //     });
    //   
    //   if (error) throw error;
    //   setSaveSuccess(true);
    // } catch (error) {
    //   console.error('Error saving preferences:', error);
    // } finally {
    //   setIsSaving(false);
    // }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-700 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <BellIcon className="mr-2" size={24} />
          <h1 className="text-xl font-bold">Ultorn Alert</h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center">
            <BellIcon className="mr-2" size={24} />
            Set Up Environmental Alerts
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Region Selection */}
            <section>
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                <MapPinIcon className="mr-2" size={20} />
                Select Regions to Monitor
              </h3>
              
              <div className="mb-6 h-64 border rounded-lg overflow-hidden">
                {/* Map placeholder - would be replaced with actual Map component */}
                <div className="h-full bg-blue-50 flex items-center justify-center">
                  <p className="text-gray-500">Interactive map would be displayed here</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {regions.map(region => (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => handleRegionToggle(region)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedRegions.some(r => r.id === region.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {region.name}
                    {selectedRegions.some(r => r.id === region.id) && 
                      <CheckIcon className="inline ml-1" size={16} />
                    }
                  </button>
                ))}
              </div>
            </section>

            {/* Topic Selection */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                Choose Environmental Topics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(topics).map(key => {
                  const label = key.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1);
                  
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={key}
                        checked={topics[key]}
                        onChange={() => handleTopicToggle(key)}
                        className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor={key} className="text-gray-700">{label}</label>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Notification Method */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                How Would You Like to Be Notified?
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="email"
                    name="notifyMethod"
                    value="email"
                    checked={notifyMethod === 'email'}
                    onChange={() => setNotifyMethod('email')}
                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="email" className="ml-2 flex items-center text-gray-700">
                    <Mail size={16} className="mr-1" /> Email
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="sms"
                    name="notifyMethod"
                    value="sms"
                    checked={notifyMethod === 'sms'}
                    onChange={() => setNotifyMethod('sms')}
                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="sms" className="ml-2 flex items-center text-gray-700">
                    <PhoneIcon size={16} className="mr-1" /> SMS
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  {notifyMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <input
                  type={notifyMethod === 'email' ? 'email' : 'tel'}
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder={notifyMethod === 'email' ? 'your@email.com' : '+91 1234567890'}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSaving}
                className={`px-6 py-3 ${
                  isSaving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
              >
                {isSaving ? 'Saving...' : 'Save Notification Preferences'}
              </button>
              
              {saveSuccess && (
                <div className="text-green-600 flex items-center font-medium">
                  <CheckIcon className="mr-1" size={20} />
                  Preferences saved successfully!
                </div>
              )}
            </div>
          </form>
        </div>
      </main>

      <footer className="mt-16 bg-gray-100 py-8 px-4">
        <div className="container mx-auto text-center text-gray-600">
          <p className="mb-4">&copy; 2025 EcoAlert - Environmental Monitoring System</p>
          <p className="text-sm">Developed for the Environmental Hackathon</p>
        </div>
      </footer>
    </div>
  );
}

export default App;