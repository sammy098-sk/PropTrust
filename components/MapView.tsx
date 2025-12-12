import React, { useState, useEffect, useRef } from 'react';
import { Property } from '../types';
import { Navigation, X, MapPin, Calendar, Lock, AlertTriangle, Crosshair, Loader2, Map as MapIcon } from 'lucide-react';
import TrustBadge from './TrustBadge';

interface Props {
  properties: Property[];
  onSelect: (p: Property) => void;
  bookedInspections: string[];
  onBookInspection: (id: string) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    gm_authFailure: () => void;
  }
}

const MapView: React.FC<Props> = ({ properties, onSelect, bookedInspections, onBookInspection }) => {
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [mapError, setMapError] = useState(false);
  const [locating, setLocating] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);
  const userLocationMarkerRef = useRef<any>(null);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    }
    return `₦${price.toLocaleString()}`;
  };

  // Load Google Maps Script
  useEffect(() => {
    // Handle Auth Failure Global Callback (Fixes ApiProjectMapError crash)
    window.gm_authFailure = () => {
        console.error("Google Maps Authentication Failed. Switching to Mock Mode.");
        setMapError(true);
    };

    const loadGoogleMaps = () => {
      // Check if script already exists
      if (document.getElementById('google-maps-script')) {
        if (window.google) {
            initMap();
        } 
        return;
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
      
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places,geometry`;
      script.async = true;
      script.defer = true;
      script.onerror = () => setMapError(true);
      
      window.initMap = initMap;
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
        // Cleanup markers/circles if unmounting
        if (markersRef.current) markersRef.current.forEach(m => m.setMap(null));
        if (circlesRef.current) circlesRef.current.forEach(c => c.setMap(null));
        if (userLocationMarkerRef.current) userLocationMarkerRef.current.setMap(null);
    };
  }, []);

  // Initialize Map
  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    try {
        const defaultCenter = { lat: 6.5244, lng: 3.3792 };

        const map = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 12,
        styles: [
            {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
            }
        ],
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false
        });

        mapInstanceRef.current = map;
        renderMarkers(map);
    } catch (e) {
        console.error("Error initializing map", e);
        setMapError(true);
    }
  };

  // Render Markers/Circles when properties or booked status changes
  useEffect(() => {
    if (mapInstanceRef.current && window.google && !mapError) {
        renderMarkers(mapInstanceRef.current);
    }
  }, [properties, bookedInspections, mapError]);

  const renderMarkers = (map: any) => {
    if (!window.google) return;

    // Clear existing
    markersRef.current.forEach(m => m.setMap(null));
    circlesRef.current.forEach(c => c.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    properties.forEach(property => {
        const isBooked = bookedInspections.includes(property.id);
        const position = { lat: property.location.lat || 6.5244, lng: property.location.lng || 3.3792 };
        
        bounds.extend(position);

        if (isBooked) {
            // EXACT LOCATION MARKER
            const marker = new window.google.maps.Marker({
                position: position,
                map: map,
                title: property.title,
                icon: {
                    path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                    scale: 6,
                    fillColor: "#16a34a", // Green-600
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                }
            });

            marker.addListener("click", () => {
                setActiveProperty(property);
            });
            markersRef.current.push(marker);

        } else {
            // APPROXIMATE LOCATION CIRCLE
            const idNum = property.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const jitterLat = (Math.sin(idNum) * 0.002); // ~200m offset
            const jitterLng = (Math.cos(idNum) * 0.002);
            
            const approxCenter = { 
                lat: position.lat + jitterLat, 
                lng: position.lng + jitterLng 
            };

            const circle = new window.google.maps.Circle({
                strokeColor: "#3b82f6", // Blue-500
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#3b82f6",
                fillOpacity: 0.25,
                map: map,
                center: approxCenter,
                radius: 800, // 800 meters radius
                clickable: true
            });

            circle.addListener("click", () => {
                setActiveProperty(property);
            });
            circlesRef.current.push(circle);
        }
    });

    if (!bounds.isEmpty() && markersRef.current.length + circlesRef.current.length > 0 && !userLocationMarkerRef.current) {
        map.fitBounds(bounds);
    }
  };

  const handleMyLocation = () => {
      if (!navigator.geolocation) {
          alert("Geolocation not supported");
          return;
      }
      
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
          (position) => {
              if (mapError) {
                  // In mock mode, just simulate finding location
                  setTimeout(() => {
                      setLocating(false);
                      alert("In Mock Mode: Location simulation centered (Lat: " + position.coords.latitude.toFixed(4) + ")");
                  }, 1000);
                  return;
              }

              const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              };
              
              if (mapInstanceRef.current && window.google) {
                  mapInstanceRef.current.setCenter(pos);
                  mapInstanceRef.current.setZoom(15);
                  
                  if (userLocationMarkerRef.current) {
                      userLocationMarkerRef.current.setMap(null);
                  }
                  
                  userLocationMarkerRef.current = new window.google.maps.Marker({
                      position: pos,
                      map: mapInstanceRef.current,
                      title: "You are here",
                      icon: {
                          path: window.google.maps.SymbolPath.CIRCLE,
                          scale: 8,
                          fillColor: "#3b82f6",
                          fillOpacity: 1,
                          strokeWeight: 2,
                          strokeColor: "#ffffff",
                      },
                      zIndex: 1000
                  });
              }
              setLocating(false);
          },
          (error) => {
              console.error(error);
              setLocating(false);
              alert("Unable to get location");
          }
      );
  };

  const handleSchedule = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onBookInspection(id);
  };

  // --- MOCK MAP RENDERER (Fallback) ---
  const renderMockMap = () => {
      // Simple projection: map lat/lng range to % for Lagos
      // Approx Lagos bounds: Lat 6.4 to 6.7, Lng 3.2 to 3.6
      const minLat = 6.42;
      const maxLat = 6.65;
      const minLng = 3.25;
      const maxLng = 3.6;

      const getPos = (lat?: number, lng?: number) => {
          const l = lat || 6.5;
          const g = lng || 3.4;
          const y = ((maxLat - l) / (maxLat - minLat)) * 100;
          const x = ((g - minLng) / (maxLng - minLng)) * 100;
          return { top: `${Math.max(10, Math.min(90, y))}%`, left: `${Math.max(10, Math.min(90, x))}%` };
      };

      return (
          <div className="w-full h-full bg-[#e6f3f9] relative overflow-hidden">
               {/* Decorative map elements */}
               <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
               <div className="absolute top-1/2 left-0 w-full h-2 bg-blue-200/50 -rotate-3"></div>
               <div className="absolute top-0 left-1/2 h-full w-2 bg-blue-200/50 rotate-12"></div>
               
               <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-bold border border-amber-200 shadow-sm z-20 flex items-center">
                  <AlertTriangle size={12} className="mr-2" /> Google Maps API Key Invalid - Showing Interactive Mock Map
               </div>

               {properties.map(p => {
                   const isBooked = bookedInspections.includes(p.id);
                   const pos = getPos(p.location.lat, p.location.lng);
                   
                   return (
                       <div 
                         key={p.id}
                         className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                         style={pos}
                         onClick={() => setActiveProperty(p)}
                       >
                           {isBooked ? (
                               <div className="relative">
                                   <MapPin className="text-green-600 drop-shadow-md" size={32} fill="white" />
                                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-black/20 rounded-full blur-[2px]"></div>
                               </div>
                           ) : (
                               <div className="relative flex items-center justify-center">
                                   <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-pulse"></div>
                                   <div className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md"></div>
                               </div>
                           )}
                       </div>
                   );
               })}
          </div>
      );
  };

  return (
    <div className="relative w-full h-screen bg-slate-200 overflow-hidden pb-16">
        {/* Map Container */}
        {mapError ? (
            renderMockMap()
        ) : (
            <div ref={mapRef} className="w-full h-full" />
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <button 
                onClick={handleMyLocation}
                disabled={locating}
                className="bg-white p-2 rounded-lg shadow-md text-blue-600 hover:text-blue-700 disabled:opacity-70 active:scale-95 transition-transform"
                title="My Location"
            >
                {locating ? <Loader2 className="animate-spin" size={20} /> : <Crosshair size={20} />}
            </button>
            
            <button 
                onClick={() => {
                   if (!mapError && mapInstanceRef.current && window.google) {
                       renderMarkers(mapInstanceRef.current);
                   } else {
                       // Mock reset
                       setActiveProperty(null);
                   }
                }}
                className="bg-white p-2 rounded-lg shadow-md text-slate-600 hover:text-slate-900 active:scale-95 transition-transform"
                title="Fit to Properties"
            >
                <Navigation className="rotate-45" size={20} />
            </button>
        </div>

        {/* Active Property Card Overlay */}
        {activeProperty && (
            <div className="absolute bottom-20 left-4 right-4 z-30 animate-in slide-in-from-bottom-5 fade-in duration-300 max-w-md mx-auto">
                <div 
                    className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 flex gap-3 cursor-pointer" 
                    onClick={() => onSelect(activeProperty)}
                >
                    <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-slate-200 relative">
                        <img src={activeProperty.media.coverImage} className="w-full h-full object-cover" loading="lazy" alt={activeProperty.title} />
                        <div className="absolute top-1 left-1">
                             <TrustBadge verification={activeProperty.verification} mini />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                        <h3 className="font-bold text-slate-900 truncate mb-1">{activeProperty.title}</h3>
                        <p className="text-xs text-slate-500 mb-2 truncate flex items-center">
                            {bookedInspections.includes(activeProperty.id) ? (
                                <>
                                    <MapPin size={10} className="mr-1 text-green-600" />
                                    <span className="text-green-700 font-bold">Exact Location Revealed</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={10} className="mr-1 text-slate-400" />
                                    Approximate Area • Book to reveal
                                </>
                            )}
                        </p>
                        <div className="flex justify-between items-end mt-auto gap-2">
                             <div>
                                 <p className="text-green-700 font-bold">{formatPrice(activeProperty.price)}</p>
                             </div>
                             
                             {!bookedInspections.includes(activeProperty.id) ? (
                                <button 
                                    onClick={(e) => handleSchedule(e, activeProperty.id)}
                                    className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 flex items-center shadow-lg shadow-slate-200"
                                >
                                    <Calendar size={12} className="mr-1" /> Inspect
                                </button>
                             ) : (
                                <button 
                                    className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center"
                                >
                                    <MapPin size={12} className="mr-1" /> View Map
                                </button>
                             )}
                        </div>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveProperty(null);
                        }}
                        className="absolute -top-3 -right-3 bg-white text-slate-400 hover:text-red-500 rounded-full p-1.5 shadow-md border border-slate-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default MapView;