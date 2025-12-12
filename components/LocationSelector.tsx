import React, { useState } from 'react';
import { MapPin, Navigation, X, Loader2 } from 'lucide-react';

interface Props {
  onSelect: (location: string) => void;
  onClose: () => void;
}

const POPULAR_LOCATIONS = [
  { area: 'Lekki Phase 1', city: 'Lagos' },
  { area: 'Ikoyi', city: 'Lagos' },
  { area: 'Victoria Island', city: 'Lagos' },
  { area: 'Ikeja', city: 'Lagos' },
  { area: 'Yaba', city: 'Lagos' },
  { area: 'Maitama', city: 'Abuja' },
  { area: 'Wuse 2', city: 'Abuja' },
  { area: 'Port Harcourt', city: 'Rivers' },
  { area: 'Ajah', city: 'Lagos' },
  { area: 'Magodo', city: 'Lagos' },
];

const LocationSelector: React.FC<Props> = ({ onSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (apiKey) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
            const data = await response.json();
            
            if (data.results && data.results[0]) {
               const addressComponents = data.results[0].address_components;
               // Try to find specific neighborhood first, then locality
               const area = addressComponents.find((c: any) => 
                 c.types.includes('sublocality_level_1') || 
                 c.types.includes('neighborhood')
               )?.long_name;
               
               const city = addressComponents.find((c: any) => 
                 c.types.includes('locality')
               )?.long_name;

               const locationName = area || city;
               
               if (locationName) {
                 onSelect(locationName);
                 return;
               }
            }
        }
        
        // Fallback if no API key or no results (Mocking successful location find for UX in demo)
        // In a real app, you might show a "Location not found" error or filter by lat/lng distance directly.
        // For this demo, we'll default to showing all if we can't reverse geocode, 
        // OR we could hardcode a demo location if we assume the user is in Lagos.
        // Let's pass an empty string to show all, but update the search bar to show coordinates for visual feedback?
        // Better: Just show all properties sorted by distance if we implemented that.
        // For now, let's just trigger "Show All" but with a visual indicator that we tried.
        onSelect(''); 
        
      } catch (e) {
        console.error("Geocoding failed", e);
        onSelect('');
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error(error);
      setLoading(false);
      alert("Unable to retrieve your location");
    });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white animate-in slide-in-from-bottom-10 flex flex-col h-full">
      <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3">
        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:bg-slate-50 rounded-full">
           <X size={24} />
        </button>
        <div className="flex-1 relative">
           <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 h-5 w-5" />
           <input 
             autoFocus
             type="text" 
             placeholder="Enter location..." 
             className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 text-lg font-medium"
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    onSelect(query);
                }
             }}
           />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-20">
         <div className="mb-6">
            <button 
              onClick={handleUseCurrentLocation} 
              disabled={loading}
              className="flex items-center w-full p-4 bg-green-50 rounded-xl text-green-700 font-bold mb-4 active:scale-95 transition-transform disabled:opacity-70"
            >
               {loading ? <Loader2 className="mr-3 animate-spin" size={20} /> : <Navigation className="mr-3" size={20} />}
               {loading ? "Locating..." : "Use My Exact Location"}
            </button>
         </div>

         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Popular Areas</h3>
         <div className="space-y-2">
            {POPULAR_LOCATIONS.filter(l => l.area.toLowerCase().includes(query.toLowerCase())).map((loc) => (
               <button 
                 key={loc.area}
                 onClick={() => onSelect(loc.area)}
                 className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all group active:scale-[0.98]"
               >
                  <div className="flex items-center">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-green-600 group-hover:shadow-sm mr-4 transition-all">
                        <MapPin size={20} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold text-slate-900">{loc.area}</p>
                        <p className="text-xs text-slate-500">{loc.city}, Nigeria</p>
                     </div>
                  </div>
               </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default LocationSelector;