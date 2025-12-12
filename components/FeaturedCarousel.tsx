import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Pinnacle Heights",
    location: "Banana Island",
    description: "Exclusive 3-4 bedroom smart homes in a secure, serviced community. Starting from ₦85M.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&q=80",
    tag: "New Launch",
    tagColor: "bg-brand-600"
  },
  {
    id: 2,
    title: "Eko Atlantic City",
    location: "Victoria Island",
    description: "Experience the future of Lagos living with ocean views and premium amenities.",
    image: "https://images.unsplash.com/photo-1577086664693-894553052526?auto=format&fit=crop&w=1200&q=80",
    tag: "Trending",
    tagColor: "bg-purple-600"
  },
  {
    id: 3,
    title: "Ikeja GRA Luxury",
    location: "Ikeja, Mainland",
    description: "Serene environment with 24/7 power supply and top-tier security.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=1200&q=80",
    tag: "Hot Deal",
    tagColor: "bg-orange-600"
  }
];

const FeaturedBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div className="px-4 py-3 bg-white border-b border-slate-100">
      <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-sm group border border-slate-200">
        
        {SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent"></div>

            {/* Content Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
               <div className="flex items-center space-x-2 mb-3">
                 <div className={`${slide.tagColor} px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider`}>
                   {slide.tag}
                 </div>
                 <div className="bg-white/20 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded flex items-center text-[10px] font-medium text-white">
                    <MapPin size={10} className="mr-1" /> {slide.location}
                 </div>
               </div>
               
               <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight max-w-[80%] drop-shadow-md">
                 {slide.title}
               </h3>
               
               <p className="text-slate-200 text-xs sm:text-sm mb-5 max-w-[70%] leading-relaxed opacity-90 line-clamp-2">
                 {slide.description}
               </p>
               
               <button className="bg-white text-slate-900 hover:bg-brand-50 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold w-fit flex items-center transition-all shadow-lg active:scale-95">
                 View Details <ArrowRight size={14} className="ml-2 text-brand-600" />
               </button>
            </div>
          </div>
        ))}

        {/* Indicators */}
        <div className="absolute bottom-4 left-6 z-20 flex gap-2">
           {SLIDES.map((_, idx) => (
             <button 
               key={idx}
               onClick={() => setCurrentIndex(idx)}
               className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'}`}
               aria-label={`Go to slide ${idx + 1}`}
             />
           ))}
        </div>

        {/* Navigation Arrows */}
        <button 
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40 hidden sm:flex"
        >
            <ChevronLeft size={20} />
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/20 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40 hidden sm:flex"
        >
            <ChevronRight size={20} />
        </button>

      </div>
    </div>
  );
};

export default FeaturedBanner;