import React from 'react';
import { Tag } from 'antd';
import {
  PlusOutlined,
  MinusOutlined,
  StarFilled,
  ClockCircleOutlined,
  CheckOutlined,
  SafetyCertificateFilled,
} from '@ant-design/icons';

export const CATEGORY_SERVICES_MENU = {
  Electrician: [
    {
      id: 'elec_fan',
      title: 'Ceiling Fan Installation & Repair',
      price: 199,
      originalPrice: 299,
      duration: '30 mins',
      rating: 4.8,
      reviews: 480,
      badge: 'Bestseller',
      warranty: '30-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=300&auto=format&fit=crop',
      features: ['Mounting & hook safety inspection', 'Regulator & switch speed testing', 'No noise vibration dampening'],
    },
    {
      id: 'elec_mcb',
      title: 'MCB & Main Switchboard Fuse Repair',
      price: 149,
      originalPrice: 249,
      duration: '25 mins',
      rating: 4.9,
      reviews: 310,
      badge: 'Essential Safety',
      warranty: '60-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop',
      features: ['Diagnostic short-circuit load test', 'Double-pole breaker installation', 'Fire-retardant socket check'],
    },
    {
      id: 'elec_inverter',
      title: 'Inverter & Battery Wiring Overhaul',
      price: 499,
      originalPrice: 699,
      duration: '60 mins',
      rating: 4.7,
      reviews: 195,
      badge: 'Heavy Duty',
      warranty: '30-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300&auto=format&fit=crop',
      features: ['Electrolyte level check & terminal cleanup', 'Bypass switch wiring installation', 'Full backup load calibration'],
    },
    {
      id: 'elec_lights',
      title: 'Full Room False Ceiling LED Lighting',
      price: 349,
      originalPrice: 499,
      duration: '45 mins',
      rating: 4.8,
      reviews: 220,
      badge: 'Popular',
      warranty: '30-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=300&auto=format&fit=crop',
      features: ['Cove light groove mounting', 'Concealed driver setup', 'Uniform luminance testing'],
    },
  ],

  Plumber: [
    {
      id: 'plumb_tap',
      title: 'Bathroom Tap, Mixer & Diverter Repair',
      price: 199,
      originalPrice: 299,
      duration: '30 mins',
      rating: 4.9,
      reviews: 512,
      badge: 'Bestseller',
      warranty: '30-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=300&auto=format&fit=crop',
      features: ['Spindle & washer replacement', 'Zero-drip silicone thread seal', 'High water pressure calibration'],
    },
    {
      id: 'plumb_drain',
      title: 'P-Trap Sewer & Sink Drain Unclogging',
      price: 299,
      originalPrice: 449,
      duration: '40 mins',
      rating: 4.8,
      reviews: 380,
      badge: 'Emergency Fix',
      warranty: '30-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=300&auto=format&fit=crop',
      features: ['Rotary snake cable clearing', 'Enzyme organic sludge removal', 'Free anti-cockroach trap inspection'],
    },
    {
      id: 'plumb_geyser',
      title: 'Water Heater / Geyser Pipe Installation',
      price: 349,
      originalPrice: 499,
      duration: '45 mins',
      rating: 4.7,
      reviews: 215,
      badge: 'Winter Special',
      warranty: '60-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=300&auto=format&fit=crop',
      features: ['Braided SS inlet-outlet connection', 'Pressure release safety valve test', 'Zero leakage joint weld'],
    },
    {
      id: 'plumb_tank',
      title: 'Toilet Flush Tank & Cistern Overhaul',
      price: 249,
      originalPrice: 349,
      duration: '35 mins',
      rating: 4.8,
      reviews: 190,
      badge: 'Essential',
      warranty: '30-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop',
      features: ['Syphon kit valve replacement', 'Ballcock float adjustment', 'Zero water overflow check'],
    },
  ],

  'AC Repair': [
    {
      id: 'ac_foam',
      title: 'Foam Jet Deep AC Servicing & Powerwash',
      price: 499,
      originalPrice: 799,
      duration: '45 mins',
      rating: 4.9,
      reviews: 640,
      badge: 'Super Saver',
      warranty: '60-Day Cooling Warranty',
      image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=300&auto=format&fit=crop',
      features: ['High-pressure water jet coil wash', 'Antibacterial foam sanitation', '2X faster room cooling guarantee'],
    },
    {
      id: 'ac_gas',
      title: 'AC Gas Leak Detection & Full Refill',
      price: 1299,
      originalPrice: 1799,
      duration: '60 mins',
      rating: 4.8,
      reviews: 320,
      badge: 'Heavy Duty',
      warranty: '90-Day Gas Warranty',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop',
      features: ['Nitrogen pressure testing', 'Brazing leak repair seal', 'Pure R32 / R410 refrigerant recharge'],
    },
    {
      id: 'ac_pcb',
      title: 'Inverter AC Circuit / PCB Board Repair',
      price: 849,
      originalPrice: 1199,
      duration: '50 mins',
      rating: 4.7,
      reviews: 145,
      badge: 'Specialist',
      warranty: '60-Day Guarantee',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=300&auto=format&fit=crop',
      features: ['Microcontroller component diagnostics', 'Capacitor & relay replacement', 'Sensor temperature calibration'],
    },
  ],

  Cleaning: [
    {
      id: 'clean_kitchen',
      title: 'Kitchen Chimney & Counter Degreasing',
      price: 599,
      originalPrice: 899,
      duration: '60 mins',
      rating: 4.9,
      reviews: 410,
      badge: 'Bestseller',
      warranty: '100% Sparkle Clean',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300&auto=format&fit=crop',
      features: ['Baffle filter steam degreasing', 'Tile grout oil stain removal', 'Stovetop burner carbon scrub'],
    },
    {
      id: 'clean_sofa',
      title: '3-Seater Fabric Sofa Deep Shampooing',
      price: 499,
      originalPrice: 699,
      duration: '45 mins',
      rating: 4.8,
      reviews: 290,
      badge: 'Popular',
      warranty: 'Fresh Fragrance',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop',
      features: ['High-suction vacuum extraction', 'Eco-friendly organic shampoo foam', 'Dust mite & allergen neutralization'],
    },
    {
      id: 'clean_bath',
      title: 'Bathroom Deep Stain & Tile Descaling',
      price: 399,
      originalPrice: 599,
      duration: '40 mins',
      rating: 4.8,
      reviews: 350,
      badge: 'Essential',
      warranty: 'Antimicrobial Shield',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop',
      features: ['Hard water scale removal from taps', 'Toilet bowl chemical descaling', 'Mirror & glass streak-free shine'],
    },
  ],
};

export default function ServiceRateCard({ category, cartItems, onAddToCart, onUpdateQty }) {
  const services = CATEGORY_SERVICES_MENU[category] || CATEGORY_SERVICES_MENU['Electrician'];

  const getItemQty = (id) => {
    const found = cartItems.find((item) => item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-[#1c1917]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Select Services & Add-ons
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Choose individual tasks to build your custom service package with transparent upfront pricing.
          </p>
        </div>
        <Tag className="!border-none !rounded-full !px-3 !py-1 !text-xs !font-bold !bg-emerald-100 !text-emerald-800">
          <SafetyCertificateFilled className="mr-1" /> 30-Day Service Guarantee
        </Tag>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((svc) => {
          const qty = getItemQty(svc.id);

          return (
            <div
              key={svc.id}
              className={`p-4 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between ${
                qty > 0 ? 'border-[#c75b3a] shadow-md ring-1 ring-[#c75b3a]/20' : 'border-[#e8e4d9] hover:shadow-md'
              }`}
            >
              <div>
                {/* Top Badge & Rating */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Tag className="!border-none !rounded-md !px-2 !py-0.5 !text-[10px] !font-bold !bg-amber-100 !text-amber-800">
                    {svc.badge}
                  </Tag>
                  <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    <StarFilled className="text-amber-400" /> {svc.rating} ({svc.reviews})
                  </span>
                </div>

                {/* Title & Duration */}
                <h4 className="text-sm font-bold text-[#1c1917] mb-1">{svc.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <ClockCircleOutlined /> {svc.duration}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">{svc.warranty}</span>
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-1 mb-4 text-[11px] text-slate-600">
                  {svc.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckOutlined className="text-emerald-500 text-[10px] mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action Button Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-[#c75b3a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      ₹{svc.price}
                    </span>
                    {svc.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">₹{svc.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">Fixed upfront rate</span>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => onAddToCart(svc)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#c75b3a] hover:bg-[#b04f30] border-none cursor-pointer transition-all shadow-xs flex items-center gap-1 hover:-translate-y-0.5"
                  >
                    <PlusOutlined /> Add
                  </button>
                ) : (
                  <div className="flex items-center border border-[#c75b3a] rounded-xl bg-white px-2 py-1 shadow-xs">
                    <button
                      onClick={() => onUpdateQty(svc.id, qty - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-[#c75b3a] hover:bg-[#c75b3a]/10 border-none cursor-pointer text-xs"
                    >
                      <MinusOutlined style={{ fontSize: 10 }} />
                    </button>
                    <span className="w-8 text-center font-bold text-xs text-[#1c1917]">{qty}</span>
                    <button
                      onClick={() => onUpdateQty(svc.id, qty + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-lg text-[#c75b3a] hover:bg-[#c75b3a]/10 border-none cursor-pointer text-xs"
                    >
                      <PlusOutlined style={{ fontSize: 10 }} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
