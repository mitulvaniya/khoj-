import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../api';
import Spinner from '../Spinner';

const DEFAULT_CATEGORIES = [
  { id: 'Electrician', name: 'Electrician', count: 12 },
  { id: 'Plumber', name: 'Plumber', count: 8 },
  { id: 'Painter', name: 'Painter', count: 5 },
  { id: 'Cleaning', name: 'Cleaning', count: 15 },
  { id: 'Carpenter', name: 'Carpenter', count: 9 },
  { id: 'Gardener', name: 'Gardener', count: 6 },
  { id: 'AC Repair', name: 'AC Repair', count: 11 },
  { id: 'Locksmith', name: 'Locksmith', count: 4 },
  { id: 'Pest Control', name: 'Pest Control', count: 7 },
  { id: 'Appliance', name: 'Appliance', count: 10 },
  { id: 'Home Tutor', name: 'Home Tutor', count: 14 },
  { id: 'Beautician', name: 'Beautician', count: 18 }
];

const CATEGORY_IMAGES = {
  electrician: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop',
  plumber: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
  painter: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=600&auto=format&fit=crop',
  cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop',
  carpenter: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop',
  gardener: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop',
  'ac repair': 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=600&auto=format&fit=crop',
  locksmith: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?q=80&w=600&auto=format&fit=crop',
  'pest control': 'https://images.unsplash.com/photo-1587334206502-7b76d54c16a8?q=80&w=600&auto=format&fit=crop',
  appliance: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop',
  'home tutor': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop',
  beautician: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop',
};

const getCategoryImage = (name) => {
  const key = name.toLowerCase().trim();
  return CATEGORY_IMAGES[key] || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
};

function Cards() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(API.categoryDashboard)
      .then((res) => {
        if (res.data.success) {
          const apiData = res.data.data;
          const merged = [...apiData];
          DEFAULT_CATEGORIES.forEach(def => {
            if (!merged.some(c => c.name.toLowerCase() === def.name.toLowerCase())) {
              merged.push(def);
            }
          });
          setCards(merged);
        }
      })
      .catch((e) => {
        console.log(e);
        setCards(DEFAULT_CATEGORIES);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fadeIn duration-500 max-w-7xl mx-auto px-4">
      {/* Page Header */}
      <div className="mb-12 text-left">
        <span className="text-[10px] tracking-[0.4em] uppercase block mb-3 animate-fade-in-up" style={{ color: 'var(--terracotta)', fontFamily: "'Inter', monospace" }}>
          ● Browse Services
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--ink)', fontFamily: "'Outfit', sans-serif" }}>
          Service Categories
        </h1>
        <p className="text-sm font-light max-w-xl leading-relaxed" style={{ color: 'var(--stone)' }}>
          Select a category to discover specialized verified professionals near you. Real reviews, transparent pricing.
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => (
            <div
              key={card.id || i}
              onClick={() => {
                navigate(`/khoj-services/allServices?category=${card.id}`);
              }}
              className="group cursor-pointer bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 flex flex-col h-full"
              style={{
                borderColor: 'rgba(176, 141, 87, 0.15)',
              }}
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-[#f2efe8]">
                <img
                  src={getCategoryImage(card.name)}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 group-hover:brightness-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span 
                    className="text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm tracking-wider uppercase" 
                    style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))' }}
                  >
                    Explore Category
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-left text-[#1a1a1a] group-hover:text-[#c75b3a] transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {card.name}
                  </h3>
                  <p className="text-xs text-left mt-1" style={{ color: 'var(--stone)' }}>
                    Explore certified local providers.
                  </p>
                </div>

                <div 
                  className="mt-5 pt-4 flex items-center justify-between" 
                  style={{ borderTop: '1px solid rgba(176, 141, 87, 0.08)' }}
                >
                  <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--stone)' }}>
                    Providers Active
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--terracotta)' }}>
                    {card.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cards;
