// Comprehensive India Geolocation & Distance Utilities

export const INDIA_MAJOR_CITIES = {
  // Gujarat
  'ankleshwar': { name: 'Ankleshwar', district: 'Bharuch', state: 'Gujarat', lat: 21.6264, lng: 73.0033, pincode: '393002', hub: true },
  'bharuch': { name: 'Bharuch', district: 'Bharuch', state: 'Gujarat', lat: 21.7051, lng: 72.9959, pincode: '392001', hub: true },
  'surat': { name: 'Surat', district: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, pincode: '395007', hub: true },
  'vadodara': { name: 'Vadodara', district: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, pincode: '390001', hub: true },
  'baroda': { name: 'Vadodara', district: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, pincode: '390001', hub: true },
  'ahmedabad': { name: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, pincode: '380001', hub: true },
  'rajkot': { name: 'Rajkot', district: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, pincode: '360001', hub: true },
  'navsari': { name: 'Navsari', district: 'Navsari', state: 'Gujarat', lat: 20.9467, lng: 72.9520, pincode: '396445', hub: true },
  'vapi': { name: 'Vapi', district: 'Valsad', state: 'Gujarat', lat: 20.3893, lng: 72.9106, pincode: '396191', hub: true },
  'bhavnagar': { name: 'Bhavnagar', district: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519, pincode: '364001', hub: true },
  'jamnagar': { name: 'Jamnagar', district: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577, pincode: '361001', hub: true },
  'gandhinagar': { name: 'Gandhinagar', district: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, pincode: '382010', hub: true },
  'anand': { name: 'Anand', district: 'Anand', state: 'Gujarat', lat: 22.5645, lng: 72.9289, pincode: '388001', hub: true },

  // Maharashtra
  'mumbai': { name: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, pincode: '400001', hub: true },
  'pune': { name: 'Pune', district: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, pincode: '411001', hub: true },
  'nagpur': { name: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, pincode: '440001', hub: true },
  'nashik': { name: 'Nashik', district: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, pincode: '422001', hub: true },
  'thane': { name: 'Thane', district: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, pincode: '400601', hub: true },
  'navi mumbai': { name: 'Navi Mumbai', district: 'Thane', state: 'Maharashtra', lat: 19.0330, lng: 73.0297, pincode: '400703', hub: true },
  'aurangabad': { name: 'Chhatrapati Sambhajinagar', district: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, pincode: '431001', hub: true },

  // Delhi NCR
  'delhi': { name: 'Delhi', district: 'New Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025, pincode: '110001', hub: true },
  'new delhi': { name: 'New Delhi', district: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, pincode: '110001', hub: true },
  'noida': { name: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', lat: 28.5355, lng: 77.3910, pincode: '201301', hub: true },
  'gurgaon': { name: 'Gurugram', district: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, pincode: '122001', hub: true },
  'gurugram': { name: 'Gurugram', district: 'Gurugram', state: 'Haryana', lat: 28.4595, lng: 77.0266, pincode: '122001', hub: true },
  'ghaziabad': { name: 'Ghaziabad', district: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538, pincode: '201001', hub: true },
  'faridabad': { name: 'Faridabad', district: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178, pincode: '121001', hub: true },

  // Karnataka
  'bangalore': { name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pincode: '560001', hub: true },
  'bengaluru': { name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', lat: 12.9716, lng: 77.5946, pincode: '560001', hub: true },
  'mysore': { name: 'Mysuru', district: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394, pincode: '570001', hub: true },
  'mysuru': { name: 'Mysuru', district: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394, pincode: '570001', hub: true },
  'mangalore': { name: 'Mangaluru', district: 'Dakshina Kannada', state: 'Karnataka', lat: 12.9141, lng: 74.8560, pincode: '575001', hub: true },
  'hubli': { name: 'Hubballi', district: 'Dharwad', state: 'Karnataka', lat: 15.3647, lng: 75.1240, pincode: '580020', hub: true },

  // Tamil Nadu
  'chennai': { name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, pincode: '600001', hub: true },
  'coimbatore': { name: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, pincode: '641001', hub: true },
  'madurai': { name: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, pincode: '625001', hub: true },
  'salem': { name: 'Salem', district: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, pincode: '636001', hub: true },

  // Telangana & Andhra Pradesh
  'hyderabad': { name: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, pincode: '500001', hub: true },
  'visakhapatnam': { name: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, pincode: '530001', hub: true },
  'vijayawada': { name: 'Vijayawada', district: 'NTR', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480, pincode: '520001', hub: true },

  // Rajasthan
  'jaipur': { name: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, pincode: '302001', hub: true },
  'jodhpur': { name: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, pincode: '342001', hub: true },
  'udaipur': { name: 'Udaipur', district: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, pincode: '313001', hub: true },
  'kota': { name: 'Kota', district: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, pincode: '324001', hub: true },

  // Uttar Pradesh
  'lucknow': { name: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, pincode: '226001', hub: true },
  'kanpur': { name: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, pincode: '208001', hub: true },
  'varanasi': { name: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, pincode: '221001', hub: true },
  'agra': { name: 'Agra', district: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, pincode: '282001', hub: true },
  'prayagraj': { name: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, pincode: '211001', hub: true },
  'allahabad': { name: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, pincode: '211001', hub: true },
  'meerut': { name: 'Meerut', district: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, pincode: '250001', hub: true },

  // Madhya Pradesh
  'indore': { name: 'Indore', district: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, pincode: '452001', hub: true },
  'bhopal': { name: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, pincode: '462001', hub: true },
  'gwalior': { name: 'Gwalior', district: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, pincode: '474001', hub: true },
  'jabalpur': { name: 'Jabalpur', district: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, pincode: '482001', hub: true },

  // West Bengal
  'kolkata': { name: 'Kolkata', district: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, pincode: '700001', hub: true },
  'howrah': { name: 'Howrah', district: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, pincode: '711101', hub: true },
  'siliguri': { name: 'Siliguri', district: 'Darjeeling', state: 'West Bengal', lat: 26.7271, lng: 88.3953, pincode: '734001', hub: true },

  // Punjab, Haryana & Chandigarh
  'chandigarh': { name: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, pincode: '160017', hub: true },
  'ludhiana': { name: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573, pincode: '141001', hub: true },
  'amritsar': { name: 'Amritsar', district: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723, pincode: '143001', hub: true },

  // Kerala
  'kochi': { name: 'Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.9312, lng: 76.2673, pincode: '682001', hub: true },
  'cochin': { name: 'Kochi', district: 'Ernakulam', state: 'Kerala', lat: 9.9312, lng: 76.2673, pincode: '682001', hub: true },
  'thiruvananthapuram': { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, pincode: '695001', hub: true },
  'trivandrum': { name: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, pincode: '695001', hub: true },
  'kozhikode': { name: 'Kozhikode', district: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, pincode: '673001', hub: true },

  // Bihar & Jharkhand
  'patna': { name: 'Patna', district: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376, pincode: '800001', hub: true },
  'ranchi': { name: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, pincode: '834001', hub: true },
  'jamshedpur': { name: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, pincode: '831001', hub: true },

  // Odisha
  'bhubaneswar': { name: 'Bhubaneswar', district: 'Khurda', state: 'Odisha', lat: 20.2961, lng: 85.8245, pincode: '751001', hub: true },
  'cuttack': { name: 'Cuttack', district: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.8830, pincode: '753001', hub: true },

  // Assam & North-East
  'guwahati': { name: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam', lat: 26.1445, lng: 91.7362, pincode: '781001', hub: true },
  'shillong': { name: 'Shillong', district: 'East Khasi Hills', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, pincode: '793001', hub: true },

  // Uttarakhand & Himachal
  'dehradun': { name: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, pincode: '248001', hub: true },
  'shimla': { name: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, pincode: '171001', hub: true },

  // Goa, J&K
  'panaji': { name: 'Panaji', district: 'North Goa', state: 'Goa', lat: 15.4909, lng: 73.8278, pincode: '403001', hub: true },
  'goa': { name: 'Goa', district: 'North Goa', state: 'Goa', lat: 15.2993, lng: 74.1240, pincode: '403001', hub: true },
  'srinagar': { name: 'Srinagar', district: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973, pincode: '190001', hub: true },
  'jammu': { name: 'Jammu', district: 'Jammu', state: 'Jammu and Kashmir', lat: 32.7266, lng: 74.8570, pincode: '180001', hub: true }
};

// Pincode prefix to major regional coordinate mapper for instant offline resolution
export const PINCODE_REGION_MAP = {
  '11': { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  '12': { name: 'Haryana', lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  '13': { name: 'Haryana / Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Haryana' },
  '14': { name: 'Punjab', lat: 30.9010, lng: 75.8573, state: 'Punjab' },
  '16': { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Chandigarh' },
  '17': { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, state: 'Himachal Pradesh' },
  '18': { name: 'Jammu', lat: 32.7266, lng: 74.8570, state: 'Jammu and Kashmir' },
  '19': { name: 'Kashmir', lat: 34.0837, lng: 74.7973, state: 'Jammu and Kashmir' },
  '20': { name: 'Western UP / Noida', lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
  '21': { name: 'Central UP / Prayagraj', lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
  '22': { name: 'Eastern UP / Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  '24': { name: 'Uttarakhand', lat: 30.3165, lng: 78.0322, state: 'Uttarakhand' },
  '25': { name: 'Meerut / Western UP', lat: 28.9845, lng: 77.7064, state: 'Uttar Pradesh' },
  '26': { name: 'Bareilly / UP', lat: 28.3670, lng: 79.4304, state: 'Uttar Pradesh' },
  '27': { name: 'Gorakhpur / UP', lat: 26.7606, lng: 83.3732, state: 'Uttar Pradesh' },
  '30': { name: 'Jaipur / Rajasthan', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  '31': { name: 'Udaipur / Rajasthan', lat: 24.5854, lng: 73.7125, state: 'Rajasthan' },
  '32': { name: 'Kota / Rajasthan', lat: 25.2138, lng: 75.8648, state: 'Rajasthan' },
  '34': { name: 'Jodhpur / Rajasthan', lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
  '36': { name: 'Saurashtra / Rajkot', lat: 22.3039, lng: 70.8022, state: 'Gujarat' },
  '38': { name: 'North Gujarat / Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  '39': { name: 'South Gujarat / Ankleshwar / Surat', lat: 21.6264, lng: 73.0033, state: 'Gujarat' },
  '40': { name: 'Mumbai / Konkan / Goa', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  '41': { name: 'Pune / Western Maharashtra', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  '42': { name: 'Nashik / Khandesh', lat: 19.9975, lng: 73.7898, state: 'Maharashtra' },
  '43': { name: 'Marathwada / Aurangabad', lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },
  '44': { name: 'Vidarbha / Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  '45': { name: 'Indore / Malwa', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  '46': { name: 'Bhopal / Central MP', lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  '48': { name: 'Jabalpur / MP', lat: 23.1815, lng: 79.9864, state: 'Madhya Pradesh' },
  '49': { name: 'Chhattisgarh / Raipur', lat: 21.2514, lng: 81.6296, state: 'Chhattisgarh' },
  '50': { name: 'Hyderabad / Telangana', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  '51': { name: 'Rayalaseema / AP', lat: 14.4673, lng: 78.8242, state: 'Andhra Pradesh' },
  '52': { name: 'Coastal AP / Vijayawada', lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  '53': { name: 'North Coastal AP / Vizag', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  '56': { name: 'Bengaluru Urban', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  '57': { name: 'Mysuru / Mangaluru', lat: 12.9141, lng: 74.8560, state: 'Karnataka' },
  '58': { name: 'North Karnataka / Hubballi', lat: 15.3647, lng: 75.1240, state: 'Karnataka' },
  '60': { name: 'Chennai / North TN', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  '62': { name: 'South TN / Madurai', lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
  '64': { name: 'West TN / Coimbatore', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  '67': { name: 'North Kerala / Kozhikode', lat: 11.2588, lng: 75.7804, state: 'Kerala' },
  '68': { name: 'Central Kerala / Kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  '69': { name: 'South Kerala / Trivandrum', lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  '70': { name: 'Kolkata Metropolitan', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  '71': { name: 'Howrah / South Bengal', lat: 22.5958, lng: 88.2636, state: 'West Bengal' },
  '73': { name: 'North Bengal / Siliguri', lat: 26.7271, lng: 88.3953, state: 'West Bengal' },
  '75': { name: 'Odisha / Bhubaneswar', lat: 20.2961, lng: 85.8245, state: 'Odisha' },
  '78': { name: 'Assam / Guwahati', lat: 26.1445, lng: 91.7362, state: 'Assam' },
  '79': { name: 'North-East India', lat: 25.5788, lng: 91.8933, state: 'Meghalaya' },
  '80': { name: 'Bihar / Patna', lat: 25.5941, lng: 85.1376, state: 'Bihar' },
  '83': { name: 'Jharkhand / Ranchi', lat: 23.3441, lng: 85.3096, state: 'Jharkhand' }
};

// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Calculate estimated arrival time in minutes from distance
export function estimateArrivalTime(distanceKm) {
  if (distanceKm <= 2) return '15-20 mins';
  if (distanceKm <= 5) return '20-25 mins';
  if (distanceKm <= 12) return '25-35 mins';
  if (distanceKm <= 25) return '35-45 mins';
  if (distanceKm <= 50) return '45-60 mins';
  return 'Same Day Dispatch';
}

// Universal India Location Resolver
export async function resolveIndiaLocation(query) {
  if (!query || typeof query !== 'string') return null;
  const q = query.trim().toLowerCase();

  // 1. Check direct in-memory Indian cities dictionary
  if (INDIA_MAJOR_CITIES[q]) {
    return {
      ...INDIA_MAJOR_CITIES[q],
      source: 'local_database'
    };
  }

  // 2. Fuzzy substring match in in-memory database
  const matchingKey = Object.keys(INDIA_MAJOR_CITIES).find(
    k => q.includes(k) || k.includes(q)
  );
  if (matchingKey) {
    return {
      ...INDIA_MAJOR_CITIES[matchingKey],
      source: 'local_fuzzy'
    };
  }

  // 3. If query is a 6-digit Indian Pincode, query official Postal API
  const pincodeMatch = q.match(/\b\d{6}\b/);
  if (pincodeMatch) {
    const pin = pincodeMatch[0];
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
        const po = data[0].PostOffice[0];
        const prefix = pin.substring(0, 2);
        const fallbackRegion = PINCODE_REGION_MAP[prefix] || { lat: 21.6264, lng: 73.0033 };

        return {
          name: po.Name,
          city: po.District || po.Name,
          district: po.District,
          state: po.State,
          pincode: pin,
          lat: fallbackRegion.lat + (Math.random() * 0.04 - 0.02),
          lng: fallbackRegion.lng + (Math.random() * 0.04 - 0.02),
          postOffices: data[0].PostOffice.map(p => p.Name).slice(0, 5),
          source: 'india_postal_api'
        };
      }
    } catch (e) {
      console.warn('Postal API fallback error:', e);
    }

    // Pincode prefix fallback
    const prefix = pin.substring(0, 2);
    if (PINCODE_REGION_MAP[prefix]) {
      return {
        name: `Pincode ${pin}`,
        city: PINCODE_REGION_MAP[prefix].name,
        district: PINCODE_REGION_MAP[prefix].name,
        state: PINCODE_REGION_MAP[prefix].state,
        pincode: pin,
        lat: PINCODE_REGION_MAP[prefix].lat,
        lng: PINCODE_REGION_MAP[prefix].lng,
        source: 'pincode_prefix'
      };
    }
  }

  // 4. OpenStreetMap Nominatim India Geocoding API
  try {
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(geoUrl, {
      headers: { 'Accept': 'application/json' }
    });
    const results = await res.json();
    if (results && results.length > 0) {
      const first = results[0];
      const parts = (first.display_name || '').split(',').map(s => s.trim());
      return {
        name: parts[0] || query,
        city: parts[0] || query,
        district: parts[1] || parts[0] || query,
        state: parts[parts.length - 2] || 'India',
        lat: parseFloat(first.lat),
        lng: parseFloat(first.lon),
        displayName: first.display_name,
        source: 'nominatim_india'
      };
    }
  } catch (err) {
    console.warn('Nominatim geocode failed:', err);
  }

  return null;
}

// Reverse Geocode HTML5 GPS coordinates to Indian City & State
export async function reverseGeocodeCoords(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();
    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county || 'Near You';
      const state = data.address.state || 'India';
      const pincode = data.address.postcode || '';
      return {
        name: city,
        city,
        state,
        pincode,
        displayName: data.display_name
      };
    }
  } catch (e) {
    console.warn('Reverse geocode error:', e);
  }
  return { name: 'Current Location', city: 'Local Area', state: 'India' };
}
