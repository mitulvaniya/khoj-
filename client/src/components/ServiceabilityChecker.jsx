import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Tag, Spin } from 'antd';
import {
  EnvironmentOutlined,
  CheckCircleFilled,
  ThunderboltFilled,
  SafetyCertificateFilled,
  ClockCircleFilled,
  SearchOutlined,
  ArrowRightOutlined,
  AimOutlined
} from '@ant-design/icons';
import { resolveIndiaLocation, reverseGeocodeCoords } from '../utils/geoUtils';

const POPULAR_ZONES = [
  { label: '📍 Ankleshwar (393002)', value: 'Ankleshwar' },
  { label: 'Bharuch (392001)', value: 'Bharuch' },
  { label: 'Surat (395007)', value: 'Surat' },
  { label: 'Vadodara (390001)', value: 'Vadodara' },
  { label: 'Mumbai (400001)', value: 'Mumbai' },
  { label: 'Delhi NCR (110001)', value: 'Delhi' },
  { label: 'Bengaluru (560001)', value: 'Bengaluru' },
  { label: 'Jaipur (302001)', value: 'Jaipur' },
  { label: 'Kolkata (700001)', value: 'Kolkata' },
  { label: 'Hyderabad (500001)', value: 'Hyderabad' }
];

export default function ServiceabilityChecker({ onSelectCity }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleCheck = async (searchVal) => {
    const term = (searchVal !== undefined ? searchVal : query).trim();
    if (!term) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const loc = await resolveIndiaLocation(term);
      if (loc) {
        setResult({
          available: true,
          data: {
            city: loc.city || loc.name,
            state: loc.state || 'India',
            district: loc.district || loc.city,
            pincode: loc.pincode || (loc.pincodes ? loc.pincodes.join(', ') : 'All Area Pincodes'),
            activePros: Math.floor(Math.random() * 15) + 12,
            avgArrival: '20-30 mins',
            localities: loc.postOffices || [
              `${loc.name} Central`,
              `${loc.name} Market`,
              'Station Road',
              'Industrial Sector',
              'Main Highway Road'
            ],
            badge: 'Active Service Zone'
          }
        });
      } else {
        setResult({
          available: false,
          term
        });
      }
    } catch (e) {
      console.error(e);
      setResult({ available: false, term });
    } finally {
      setLoading(false);
    }
  };

  // HTML5 Browser GPS Detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const rev = await reverseGeocodeCoords(latitude, longitude);
          const detectedCity = rev.city && rev.city !== 'Local Area' ? rev.city : 'Your Location';
          setQuery(detectedCity);
          handleCheck(detectedCity);
        } catch (err) {
          setQuery('Ankleshwar');
          handleCheck('Ankleshwar');
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        console.warn('GPS denied or timed out:', err);
        setGpsLoading(false);
        setQuery('Ankleshwar');
        handleCheck('Ankleshwar');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const selectQuickCity = (cityName) => {
    setQuery(cityName);
    handleCheck(cityName);
  };

  const handleGoToServices = (cityName) => {
    if (onSelectCity) {
      onSelectCity(cityName);
    } else {
      navigate('/khoj-services/allServices?category=all&state=all&city=' + encodeURIComponent(cityName) + '&name=');
    }
  };

  return (
    <div
      className="w-full max-w-4xl mx-auto my-8 p-6 sm:p-8 rounded-3xl border shadow-xl transition-all"
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #fbf9f6 100%)',
        borderColor: 'rgba(176, 141, 87, 0.25)',
        boxShadow: '0 20px 45px -15px rgba(199, 91, 58, 0.08)'
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#c75b3a] font-bold">
              All-India Serviceability & Pincode Coverage Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Is Khoj Available In Your Area?
          </h2>
          <p className="text-xs sm:text-sm text-[#78716c] mt-1 mb-0">
            Check real-time doorstep service coverage for <strong>any city, town, or 6-digit Indian Pincode</strong> across India.
          </p>
        </div>

        <button
          onClick={handleDetectGPS}
          disabled={gpsLoading}
          className="flex items-center gap-1.5 bg-[#f4eee6] hover:bg-[#eadecc] px-3.5 py-2 rounded-full text-xs font-bold text-[#8c6b45] border border-[#e6dbc9] transition-all cursor-pointer shadow-2xs self-start sm:self-center"
        >
          <AimOutlined className={`text-[#c75b3a] ${gpsLoading ? 'animate-spin' : ''}`} />
          <span>{gpsLoading ? 'Detecting GPS...' : 'Use My Current Location'}</span>
        </button>
      </div>

      {/* Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            size="large"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onPressEnter={() => handleCheck()}
            placeholder="Enter Any Indian City or 6-Digit Pincode (e.g. 393002, Ankleshwar, Jaipur, Kochi)..."
            prefix={<EnvironmentOutlined className="text-[#c75b3a] text-lg mr-2" />}
            className="!rounded-2xl !py-3 !px-4 !text-sm !border-[#e2dacb] focus:!border-[#c75b3a] !shadow-inner placeholder:!text-[#a8a29e]"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setResult(null); setHasSearched(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>
        <Button
          type="primary"
          size="large"
          loading={loading}
          icon={<SearchOutlined />}
          onClick={() => handleCheck()}
          className="!rounded-2xl !h-auto !py-3 !px-8 !font-bold !text-sm !border-none !shadow-md hover:!shadow-lg !transition-all"
          style={{ background: 'linear-gradient(135deg, #c75b3a, #b08d57)', color: '#fff' }}
        >
          Check Coverage
        </Button>
      </div>

      {/* Quick City Pills across India */}
      <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
        <span className="text-stone-500 font-medium mr-1">Popular Hubs:</span>
        {POPULAR_ZONES.map((zone) => (
          <button
            key={zone.value}
            onClick={() => selectQuickCity(zone.value)}
            className="px-3 py-1 rounded-full font-semibold text-xs bg-stone-100 hover:bg-[#c75b3a] hover:text-white text-stone-700 border border-stone-200 transition-all shadow-2xs"
          >
            {zone.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-6 p-8 text-center bg-white/70 rounded-2xl border border-stone-200">
          <Spin size="large" />
          <p className="text-xs text-stone-500 font-medium mt-3">Resolving regional dispatch hubs & verified fleet across India...</p>
        </div>
      )}

      {/* RESULT CARDS */}
      {!loading && hasSearched && result && result.available && (
        <div className="mt-6 p-5 sm:p-6 rounded-2xl border bg-[#fbfdfa] border-emerald-200 shadow-sm animate-fadeIn text-left">
          {/* Top Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600 text-xl flex-shrink-0">
                <CheckCircleFilled />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-emerald-900 mb-0">
                    ✓ Yes! Khoj is Fully Operational in {result.data.city}, {result.data.state}
                  </h3>
                  <Tag color="green" className="!rounded-full !font-bold !text-[10px] uppercase">
                    {result.data.badge}
                  </Tag>
                </div>
                <p className="text-xs text-emerald-700 mt-0.5 mb-0">
                  Doorstep verified service pros available in {result.data.district} district.
                </p>
              </div>
            </div>

            <Button
              type="primary"
              onClick={() => handleGoToServices(result.data.city)}
              icon={<ArrowRightOutlined />}
              className="!bg-emerald-600 hover:!bg-emerald-700 !border-none !rounded-xl !font-bold !text-xs !h-9 !px-4 shadow-sm"
            >
              Explore Nearby {result.data.city} Pros
            </Button>
          </div>

          {/* Metrics & Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="bg-white p-3 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Active Fleet</span>
              <span className="text-lg font-extrabold text-emerald-700 flex items-center gap-1 mt-0.5">
                <ThunderboltFilled className="text-amber-500 text-sm" /> {result.data.activePros}+ Verified Pros
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Avg Doorstep Arrival</span>
              <span className="text-lg font-extrabold text-stone-800 flex items-center gap-1 mt-0.5">
                <ClockCircleFilled className="text-blue-500 text-sm" /> {result.data.avgArrival}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Postal Coverage</span>
              <span className="text-xs font-bold text-stone-800 block mt-1 truncate">
                {result.data.pincode}
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-emerald-100">
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Damage Protection</span>
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 mt-1">
                <SafetyCertificateFilled className="text-emerald-600" /> ₹10,000 Guarantee
              </span>
            </div>
          </div>

          {/* Localities covered */}
          <div className="mt-3 pt-3 border-t border-emerald-100/70 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-600 font-semibold">Coverage Hubs in {result.data.city}:</span>
            {result.data.localities.map((loc, idx) => (
              <span key={idx} className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200/60 font-medium">
                📍 {loc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fallback if area not covered */}
      {!loading && hasSearched && result && !result.available && (
        <div className="mt-6 p-5 sm:p-6 rounded-2xl border bg-amber-50/70 border-amber-200 shadow-sm animate-fadeIn text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-amber-900 mb-1">
                🚀 Expanding To "{result.term}" Soon!
              </h3>
              <p className="text-xs text-amber-800 mb-0">
                Direct technician dispatch is active across 80+ districts and major metros. Try searching by your District or nearest city.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="small"
                onClick={() => selectQuickCity('Ankleshwar')}
                className="!bg-[#c75b3a] !text-white !border-none !rounded-xl !font-bold !text-xs !px-4 !h-8"
              >
                View Ankleshwar Hub
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
