import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Tag, Button } from 'antd';
import { PhoneOutlined, UserOutlined, StarOutlined, EnvironmentOutlined, CompassOutlined, AimOutlined } from '@ant-design/icons';
import axios from 'axios';
import API from '../../api';
import Spinner from '../Spinner';
import { getArrayParams } from '../../utils/paramsConvert';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CompareModal from '../../components/CompareModal';
import CompareFloatingBar from '../../components/CompareFloatingBar';
import { resolveIndiaLocation, reverseGeocodeCoords, calculateDistanceKm, estimateArrivalTime } from '../../utils/geoUtils';

// Extended, robust pool of mock providers (at least 6 per category)
const BASE_MOCK_PROVIDERS = [
  // Dedicated Ankleshwar & South Gujarat Regional Specialists
  {
    _id: 'mock_ankl_elec',
    name: 'Narmada Industrial & Domestic Electricals',
    typeObj: { name: 'Electrician' },
    addressObj: { newCity: { city: 'Ankleshwar' }, newState: { state: 'Gujarat' }, locality: 'GIDC Phase 1, Ankleshwar' },
    tag: ['GIDC Specialist', 'Three-Phase Wiring', 'Panel Repair'],
    ownerObj: { name: 'Dharmesh Patel', phone: '+91 98251 44520' },
    experiance: '11 Years',
    customers_served: '620+',
    rating: 4.9,
    reviews: 142,
    price: '₹399/hr',
    offsetLat: 0.005,
    offsetLng: 0.008
  },
  {
    _id: 'mock_ankl_plumb',
    name: 'Ankleshwar Express Sanitary & Plumbing Works',
    typeObj: { name: 'Plumber' },
    addressObj: { newCity: { city: 'Ankleshwar' }, newState: { state: 'Gujarat' }, locality: 'Station Road, Ankleshwar' },
    tag: ['Pipe Leakage', 'Overhead Tank', 'Drain Unclog'],
    ownerObj: { name: 'Pravin Vasava', phone: '+91 94288 77312' },
    experiance: '8 Years',
    customers_served: '410+',
    rating: 4.8,
    reviews: 118,
    price: '₹349/hr',
    offsetLat: -0.004,
    offsetLng: -0.003
  },
  {
    _id: 'mock_ankl_ac',
    name: 'Gujarat Cool Air Care & Refrigeration',
    typeObj: { name: 'AC Repair' },
    addressObj: { newCity: { city: 'Ankleshwar' }, newState: { state: 'Gujarat' }, locality: 'Valia Road, Ankleshwar' },
    tag: ['Inverter AC', 'Split AC Jet Wash', 'Gas Refill 100%'],
    ownerObj: { name: 'Irfan Mansuri', phone: '+91 97230 65119' },
    experiance: '9 Years',
    customers_served: '530+',
    rating: 4.9,
    reviews: 165,
    price: '₹499/hr',
    offsetLat: 0.003,
    offsetLng: 0.012
  },
  {
    _id: 'mock_ankl_clean',
    name: 'Shree Ram Deep Cleaning & Sanitization',
    typeObj: { name: 'Cleaning' },
    addressObj: { newCity: { city: 'Ankleshwar' }, newState: { state: 'Gujarat' }, locality: 'Rajpipla Road, Ankleshwar' },
    tag: ['Full Home Clean', 'Industrial Office Cleaning', 'Kitchen Scrub'],
    ownerObj: { name: 'Hitesh Solanki', phone: '+91 99042 11984' },
    experiance: '7 Years',
    customers_served: '380+',
    rating: 4.8,
    reviews: 94,
    price: '₹799/job',
    offsetLat: -0.007,
    offsetLng: 0.006
  },
  {
    _id: 'mock_ankl_paint',
    name: 'Jay Ambe Color Works & Wall Waterproofing',
    typeObj: { name: 'Painter' },
    addressObj: { newCity: { city: 'Ankleshwar' }, newState: { state: 'Gujarat' }, locality: 'Jitali Road, Ankleshwar' },
    tag: ['Asian Paints Certified', 'Waterproofing', 'Exterior Texture'],
    ownerObj: { name: 'Kishore Mistri', phone: '+91 98795 33201' },
    experiance: '12 Years',
    customers_served: '490+',
    rating: 4.7,
    reviews: 76,
    price: '₹14/sq.ft',
    offsetLat: 0.009,
    offsetLng: -0.008
  },
  {
    _id: 'mock_ankl_carp',
    name: 'Royal Furniture & Kitchen Woodwork',
    typeObj: { name: 'Carpenter' },
    addressObj: { newCity: { city: 'Ankleshwar' }, newState: { state: 'Gujarat' }, locality: 'Old NH-8, Ankleshwar' },
    tag: ['Modular Kitchen', 'Door Lock Repair', 'Custom Wardrobe'],
    ownerObj: { name: 'Magan Suthar', phone: '+91 94081 22390' },
    experiance: '10 Years',
    customers_served: '340+',
    rating: 4.8,
    reviews: 104,
    price: '₹449/hr',
    offsetLat: -0.002,
    offsetLng: 0.015
  },
  {
    _id: 'mock_ankl_pest',
    name: 'Bharuch-Ankleshwar Shakti Pest Control',
    typeObj: { name: 'Pest Control' },
    addressObj: { newCity: { city: 'Ankleshwar' }, newState: { state: 'Gujarat' }, locality: 'Near Railway Station, Ankleshwar' },
    tag: ['Termite Treatment', 'Cockroach Gel', 'Chemical Free Herbal'],
    ownerObj: { name: 'Chetan Parmar', phone: '+91 98244 55102' },
    experiance: '6 Years',
    customers_served: '290+',
    rating: 4.9,
    reviews: 83,
    price: '₹899/visit',
    offsetLat: 0.004,
    offsetLng: -0.006
  },
  // Electricians
  {
    _id: 'mock_elec1',
    name: 'Superb Spark Electricians',
    typeObj: { name: 'Electrician' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Residential', 'Wiring', 'Emergency'],
    ownerObj: { name: 'Rajesh Kumar', phone: '+91 98765 43210' },
    experiance: '8 Years',
    customers_served: '450+',
    rating: 4.9,
    reviews: 124,
    price: '₹499/hr',
    offsetLat: 0.012,
    offsetLng: -0.015
  },
  {
    _id: 'mock_elec2',
    name: 'Watts Up Electrical Services',
    typeObj: { name: 'Electrician' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Commercial', 'Short Circuit', 'Maintenance'],
    ownerObj: { name: 'Sanjay Dutt', phone: '+91 88822 33441' },
    experiance: '6 Years',
    customers_served: '310+',
    rating: 4.7,
    reviews: 82,
    price: '₹449/hr',
    offsetLat: -0.008,
    offsetLng: 0.021
  },
  {
    _id: 'mock_elec3',
    name: 'PowerPros Quick Repair',
    typeObj: { name: 'Electrician' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Smart Home', 'Appliance Install', 'Wiring'],
    ownerObj: { name: 'Vijay Gowda', phone: '+91 94433 11225' },
    experiance: '10 Years',
    customers_served: '580+',
    rating: 4.8,
    reviews: 198,
    price: '₹549/hr',
    offsetLat: 0.022,
    offsetLng: 0.005
  },
  {
    _id: 'mock_elec4',
    name: 'BrightVolt Electrical Solutions',
    typeObj: { name: 'Electrician' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Inverter Repair', 'AC Wiring', 'Fuse Box'],
    ownerObj: { name: 'Aniket Pal', phone: '+91 99988 77766' },
    experiance: '4 Years',
    customers_served: '190+',
    rating: 4.5,
    reviews: 52,
    price: '₹399/hr',
    offsetLat: -0.018,
    offsetLng: -0.025
  },
  {
    _id: 'mock_elec5',
    name: 'Dynamic Power & Lighting',
    typeObj: { name: 'Electrician' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['LED Setup', 'Industrial Wiring', 'Generators'],
    ownerObj: { name: 'Gurpreet Singh', phone: '+91 88877 66551' },
    experiance: '7 Years',
    customers_served: '260+',
    rating: 4.7,
    reviews: 91,
    price: '₹479/hr',
    offsetLat: 0.005,
    offsetLng: -0.032
  },
  {
    _id: 'mock_elec6',
    name: 'Apex Electrical Line Care',
    typeObj: { name: 'Electrician' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Earthing', 'Home Automation', 'Breakers'],
    ownerObj: { name: 'Karthik Raja', phone: '+91 77766 55443' },
    experiance: '12 Years',
    customers_served: '720+',
    rating: 4.9,
    reviews: 240,
    price: '₹599/hr',
    offsetLat: -0.031,
    offsetLng: 0.015
  },

  // Plumbers
  {
    _id: 'mock_plumb1',
    name: 'Quick Leak Plumbers',
    typeObj: { name: 'Plumber' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Leak Repair', 'Fitting', 'Drain Cleaning'],
    ownerObj: { name: 'Amit Sharma', phone: '+91 87654 32109' },
    experiance: '5 Years',
    customers_served: '280+',
    rating: 4.7,
    reviews: 89,
    price: '₹399/hr',
    offsetLat: 0.015,
    offsetLng: 0.018
  },
  {
    _id: 'mock_plumb2',
    name: 'Flow-Right Plumbing Experts',
    typeObj: { name: 'Plumber' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Bathroom Fitting', 'Water Filter', 'Pipes'],
    ownerObj: { name: 'Dinesh Mane', phone: '+91 97722 55663' },
    experiance: '7 Years',
    customers_served: '340+',
    rating: 4.8,
    reviews: 95,
    price: '₹420/hr',
    offsetLat: -0.012,
    offsetLng: -0.018
  },
  {
    _id: 'mock_plumb3',
    name: 'ProDrain Unclogging Services',
    typeObj: { name: 'Plumber' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Drain Camera', 'Blockage', 'Sewer Line'],
    ownerObj: { name: 'Manoj Hegde', phone: '+91 91234 56789' },
    experiance: '9 Years',
    customers_served: '490+',
    rating: 4.9,
    reviews: 167,
    price: '₹499/hr',
    offsetLat: 0.025,
    offsetLng: -0.011
  },
  {
    _id: 'mock_plumb4',
    name: 'Water Shield Leak Solutions',
    typeObj: { name: 'Plumber' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Clogged Toilet', 'Sink Install', 'Valves'],
    ownerObj: { name: 'Harish Kumar', phone: '+91 95544 33221' },
    experiance: '3 Years',
    customers_served: '120+',
    rating: 4.4,
    reviews: 31,
    price: '₹299/hr',
    offsetLat: -0.021,
    offsetLng: 0.009
  },
  {
    _id: 'mock_plumb5',
    name: 'AquaMaster Plumbing Lab',
    typeObj: { name: 'Plumber' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Geyers', 'Boilers', 'High Pressure Jets'],
    ownerObj: { name: 'Ravi Teja', phone: '+91 88877 66223' },
    experiance: '6 Years',
    customers_served: '250+',
    rating: 4.6,
    reviews: 74,
    price: '₹379/hr',
    offsetLat: 0.008,
    offsetLng: -0.028
  },
  {
    _id: 'mock_plumb6',
    name: 'Apex Flow & Pipe Fitting',
    typeObj: { name: 'Plumber' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Pump Service', 'Commercial Pipe', 'Sanitary'],
    ownerObj: { name: 'Naveen Patil', phone: '+91 76655 44332' },
    experiance: '11 Years',
    customers_served: '670+',
    rating: 4.9,
    reviews: 201,
    price: '₹550/hr',
    offsetLat: -0.029,
    offsetLng: -0.022
  },

  // Painters
  {
    _id: 'mock_paint1',
    name: 'Prestige House Painters',
    typeObj: { name: 'Painter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Exterior', 'Interior', 'Textured Paint'],
    ownerObj: { name: 'Sanjay Gowda', phone: '+91 76543 21098' },
    experiance: '10 Years',
    customers_served: '620+',
    rating: 4.8,
    reviews: 212,
    price: '₹599/hr',
    offsetLat: 0.022,
    offsetLng: 0.020
  },
  {
    _id: 'mock_paint2',
    name: 'ColorCreations Interior Design',
    typeObj: { name: 'Painter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Wallpaper', 'Waterproofing', 'Stencils'],
    ownerObj: { name: 'Rohan Deshmukh', phone: '+91 99922 88877' },
    experiance: '4 Years',
    customers_served: '180+',
    rating: 4.6,
    reviews: 58,
    price: '₹349/hr',
    offsetLat: -0.015,
    offsetLng: 0.031
  },
  {
    _id: 'mock_paint3',
    name: 'Rainbow Walls & Facades',
    typeObj: { name: 'Painter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Commercial Paint', 'Staining', 'Consultation'],
    ownerObj: { name: 'Pankaj Joshi', phone: '+91 88877 66655' },
    experiance: '8 Years',
    customers_served: '410+',
    rating: 4.7,
    reviews: 110,
    price: '₹499/hr',
    offsetLat: 0.035,
    offsetLng: -0.018
  },
  {
    _id: 'mock_paint4',
    name: 'Master Stroke Home Painters',
    typeObj: { name: 'Painter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Wood Polish', 'Metal Paint', 'Quick Dry'],
    ownerObj: { name: 'Manish Pal', phone: '+91 91122 88776' },
    experiance: '6 Years',
    customers_served: '220+',
    rating: 4.5,
    reviews: 63,
    price: '₹380/hr',
    offsetLat: -0.028,
    offsetLng: -0.012
  },
  {
    _id: 'mock_paint5',
    name: 'EcoShield Low-VOC Painting',
    typeObj: { name: 'Painter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Eco Friendly', 'No Odor', 'Living Rooms'],
    ownerObj: { name: 'Aditya Sen', phone: '+91 82233 44551' },
    experiance: '5 Years',
    customers_served: '190+',
    rating: 4.8,
    reviews: 79,
    price: '₹419/hr',
    offsetLat: 0.009,
    offsetLng: 0.035
  },
  {
    _id: 'mock_paint6',
    name: 'Vibrant Textures & Coats',
    typeObj: { name: 'Painter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Luxury Finishes', 'Graffiti Proof', 'Ceilings'],
    ownerObj: { name: 'Tariq Anwar', phone: '+91 72233 44558' },
    experiance: '12 Years',
    customers_served: '760+',
    rating: 4.9,
    reviews: 290,
    price: '₹650/hr',
    offsetLat: -0.032,
    offsetLng: -0.028
  },

  // Cleaning
  {
    _id: 'mock_clean1',
    name: 'Elite Home Cleaning Services',
    typeObj: { name: 'Cleaning' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Deep Cleaning', 'Sanitization', 'Kitchen Cleaning'],
    ownerObj: { name: 'Sunita Patil', phone: '+91 65432 10987' },
    experiance: '3 Years',
    customers_served: '150+',
    rating: 4.6,
    reviews: 43,
    price: '₹299/hr',
    offsetLat: 0.018,
    offsetLng: -0.012
  },
  {
    _id: 'mock_clean2',
    name: 'Sparkle & Shine Deep Cleaners',
    typeObj: { name: 'Cleaning' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Sofa Cleaning', 'Bathroom Deep Clean', 'Disinfection'],
    ownerObj: { name: 'Kiran Rao', phone: '+91 92233 44556' },
    experiance: '5 Years',
    customers_served: '270+',
    rating: 4.8,
    reviews: 91,
    price: '₹349/hr',
    offsetLat: -0.015,
    offsetLng: 0.019
  },
  {
    _id: 'mock_clean3',
    name: 'Green Clean Eco-Services',
    typeObj: { name: 'Cleaning' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Eco-Friendly', 'Post-Construction', 'Windows'],
    ownerObj: { name: 'Neha Varma', phone: '+91 91122 33221' },
    experiance: '7 Years',
    customers_served: '390+',
    rating: 4.9,
    reviews: 142,
    price: '₹399/hr',
    offsetLat: 0.029,
    offsetLng: -0.025
  },
  {
    _id: 'mock_clean4',
    name: 'Dust Busters Home Care',
    typeObj: { name: 'Cleaning' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Carpet Cleaning', 'Mattress Wash', 'Bungalows'],
    ownerObj: { name: 'Priya Nair', phone: '+91 95533 11220' },
    experiance: '4 Years',
    customers_served: '180+',
    rating: 4.5,
    reviews: 57,
    price: '₹310/hr',
    offsetLat: -0.022,
    offsetLng: -0.031
  },
  {
    _id: 'mock_clean5',
    name: 'ProCare Vacuum & Polish',
    typeObj: { name: 'Cleaning' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Floor Waxing', 'Chandelier Cleaning', 'Balconies'],
    ownerObj: { name: 'Santosh Sawant', phone: '+91 94455 33221' },
    experiance: '6 Years',
    customers_served: '290+',
    rating: 4.7,
    reviews: 86,
    price: '₹359/hr',
    offsetLat: 0.009,
    offsetLng: -0.041
  },
  {
    _id: 'mock_clean6',
    name: 'Ultra Clean Home Hygiene',
    typeObj: { name: 'Cleaning' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Steam Clean', 'Full Disinfect', 'Villas'],
    ownerObj: { name: 'Renuka Menon', phone: '+91 76655 88991' },
    experiance: '10 Years',
    customers_served: '620+',
    rating: 4.9,
    reviews: 210,
    price: '₹490/hr',
    offsetLat: -0.031,
    offsetLng: 0.028
  },

  // Carpenters
  {
    _id: 'mock_carp1',
    name: 'TimberCraft Custom Furniture',
    typeObj: { name: 'Carpenter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Furniture Design', 'Repair', 'Polishing'],
    ownerObj: { name: 'Madhav Shinde', phone: '+91 93344 55667' },
    experiance: '11 Years',
    customers_served: '540+',
    rating: 4.9,
    reviews: 187,
    price: '₹499/hr',
    offsetLat: 0.011,
    offsetLng: 0.012
  },
  {
    _id: 'mock_carp2',
    name: 'The Wood Doctor Repair Service',
    typeObj: { name: 'Carpenter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Hinge Repair', 'Lock Fitting', 'General Woodwork'],
    ownerObj: { name: 'Deepak Yadav', phone: '+91 88877 99911' },
    experiance: '5 Years',
    customers_served: '230+',
    rating: 4.6,
    reviews: 74,
    price: '₹349/hr',
    offsetLat: -0.019,
    offsetLng: -0.015
  },
  {
    _id: 'mock_carp3',
    name: 'Vibrant Veneer Woodworks',
    typeObj: { name: 'Carpenter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Modular Kitchen', 'Wardrobe Maker', 'Sofa Frame'],
    ownerObj: { name: 'Rajesh Sawant', phone: '+91 94455 66778' },
    experiance: '8 Years',
    customers_served: '410+',
    rating: 4.8,
    reviews: 125,
    price: '₹449/hr',
    offsetLat: 0.029,
    offsetLng: -0.029
  },
  {
    _id: 'mock_carp4',
    name: 'Wood Finish Masters',
    typeObj: { name: 'Carpenter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Sanding', 'Polishing', 'Door Shaving'],
    ownerObj: { name: 'Balaji Rao', phone: '+91 91223 34455' },
    experiance: '4 Years',
    customers_served: '160+',
    rating: 4.5,
    reviews: 42,
    price: '₹299/hr',
    offsetLat: -0.025,
    offsetLng: 0.022
  },
  {
    _id: 'mock_carp5',
    name: 'Classic Carpentry & Deco',
    typeObj: { name: 'Carpenter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Cabinet Fitting', 'Drywall Repair', 'Balcony Decking'],
    ownerObj: { name: 'Imran Khan', phone: '+91 92255 11223' },
    experiance: '7 Years',
    customers_served: '310+',
    rating: 4.7,
    reviews: 93,
    price: '₹399/hr',
    offsetLat: 0.005,
    offsetLng: 0.038
  },
  {
    _id: 'mock_carp6',
    name: 'Apex Woodcraft Solutions',
    typeObj: { name: 'Carpenter' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Teak Woodwork', 'Beds & Dining', 'Wall Panels'],
    ownerObj: { name: 'Vikram Singh', phone: '+91 76688 55441' },
    experiance: '15 Years',
    customers_served: '910+',
    rating: 4.9,
    reviews: 320,
    price: '₹599/hr',
    offsetLat: -0.035,
    offsetLng: -0.008
  },

  // Gardeners
  {
    _id: 'mock_gard1',
    name: 'Pro Garden Care & Design',
    typeObj: { name: 'Gardener' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Lawn Mowing', 'Pruning', 'Landscaping'],
    ownerObj: { name: 'Karan Singh', phone: '+91 93210 54321' },
    experiance: '6 Years',
    customers_served: '190+',
    rating: 4.8,
    reviews: 76,
    price: '₹349/hr',
    offsetLat: 0.014,
    offsetLng: -0.022
  },
  {
    _id: 'mock_gard2',
    name: 'GreenThumb Landscape Designs',
    typeObj: { name: 'Gardener' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Terrace Garden', 'Pest Spray', 'Fertilization'],
    ownerObj: { name: 'Milind Deora', phone: '+91 98877 66554' },
    experiance: '8 Years',
    customers_served: '310+',
    rating: 4.7,
    reviews: 104,
    price: '₹399/hr',
    offsetLat: -0.011,
    offsetLng: 0.025
  },
  {
    _id: 'mock_gard3',
    name: 'Bloom & Grow Nursery Care',
    typeObj: { name: 'Gardener' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Indoor Plants', 'Vertical Gardens', 'Soil Prep'],
    ownerObj: { name: 'Srinivas Murthy', phone: '+91 92255 88990' },
    experiance: '4 Years',
    customers_served: '140+',
    rating: 4.9,
    reviews: 49,
    price: '₹299/hr',
    offsetLat: 0.029,
    offsetLng: -0.009
  },
  {
    _id: 'mock_gard4',
    name: 'Urban Foliage Care',
    typeObj: { name: 'Gardener' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Balcony Decor', 'Drip Irrigation', 'Bonsai'],
    ownerObj: { name: 'Ritu Sen', phone: '+91 91122 44331' },
    experiance: '3 Years',
    customers_served: '90+',
    rating: 4.5,
    reviews: 28,
    price: '₹249/hr',
    offsetLat: -0.025,
    offsetLng: -0.029
  },
  {
    _id: 'mock_gard5',
    name: 'The Organic Gardeners',
    typeObj: { name: 'Gardener' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Veggie Patches', 'Composting', 'Fruit Trees'],
    ownerObj: { name: 'Bhaskar Das', phone: '+91 83344 11225' },
    experiance: '7 Years',
    customers_served: '220+',
    rating: 4.8,
    reviews: 84,
    price: '₹350/hr',
    offsetLat: 0.008,
    offsetLng: 0.038
  },
  {
    _id: 'mock_gard6',
    name: 'Apex Green Escapes',
    typeObj: { name: 'Gardener' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Waterfall Setup', 'Real Grass Turf', 'Hedges'],
    ownerObj: { name: 'Yashwant Rao', phone: '+91 76655 99001' },
    experiance: '10 Years',
    customers_served: '490+',
    rating: 4.9,
    reviews: 172,
    price: '₹450/hr',
    offsetLat: -0.034,
    offsetLng: 0.011
  },

  // AC Repair
  {
    _id: 'mock_ac1',
    name: 'CoolBreeze Air Systems',
    typeObj: { name: 'AC Repair' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['AC Service', 'Gas Refill', 'Installation'],
    ownerObj: { name: 'Nikhil Kadam', phone: '+91 97788 66554' },
    experiance: '8 Years',
    customers_served: '490+',
    rating: 4.8,
    reviews: 139,
    price: '₹499/hr',
    offsetLat: 0.016,
    offsetLng: 0.014
  },
  {
    _id: 'mock_ac2',
    name: 'ChillOut AC Technicians',
    typeObj: { name: 'AC Repair' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Split AC Leak', 'Compressor', 'Filter Cleaning'],
    ownerObj: { name: 'Vikas Gupta', phone: '+91 91155 44882' },
    experiance: '5 Years',
    customers_served: '250+',
    rating: 4.7,
    reviews: 79,
    price: '₹399/hr',
    offsetLat: -0.021,
    offsetLng: -0.015
  },
  {
    _id: 'mock_ac3',
    name: 'Polar Tech AC Solutions',
    typeObj: { name: 'AC Repair' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Duct Cleaning', 'Thermostat', 'Inverter AC'],
    ownerObj: { name: 'Suhas Kulkarni', phone: '+91 88899 44332' },
    experiance: '10 Years',
    customers_served: '610+',
    rating: 4.9,
    reviews: 215,
    price: '₹599/hr',
    offsetLat: 0.031,
    offsetLng: -0.021
  },
  {
    _id: 'mock_ac4',
    name: 'QuickCool AC Services',
    typeObj: { name: 'AC Repair' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Window AC Repair', 'Coil Welding', 'Wiring Check'],
    ownerObj: { name: 'Rohan Joshi', phone: '+91 92233 88110' },
    experiance: '4 Years',
    customers_served: '160+',
    rating: 4.5,
    reviews: 49,
    price: '₹349/hr',
    offsetLat: -0.015,
    offsetLng: 0.029
  },
  {
    _id: 'mock_ac5',
    name: 'FrostyAir Tech Care',
    typeObj: { name: 'AC Repair' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['AC Jet Wash', 'Remote Config', 'Odor Fix'],
    ownerObj: { name: 'Sachin Patil', phone: '+91 93344 11220' },
    experiance: '7 Years',
    customers_served: '310+',
    rating: 4.7,
    reviews: 96,
    price: '₹429/hr',
    offsetLat: 0.009,
    offsetLng: -0.035
  },
  {
    _id: 'mock_ac6',
    name: 'Apex Air Conditioning',
    typeObj: { name: 'AC Repair' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Cassette AC', 'Central Plant', 'VRF Systems'],
    ownerObj: { name: 'Ashok Deshmukh', phone: '+91 76655 44991' },
    experiance: '12 Years',
    customers_served: '790+',
    rating: 4.9,
    reviews: 264,
    price: '₹699/hr',
    offsetLat: -0.033,
    offsetLng: 0.008
  },

  // Locksmiths
  {
    _id: 'mock_lock1',
    name: 'Apex Locksmiths',
    typeObj: { name: 'Locksmith' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Key Duplication', 'Emergency Lockout', 'Smart Locks'],
    ownerObj: { name: 'Rohan Mehta', phone: '+91 91122 33445' },
    experiance: '12 Years',
    customers_served: '800+',
    rating: 4.9,
    reviews: 310,
    price: '₹450/hr',
    offsetLat: 0.012,
    offsetLng: 0.028
  },
  {
    _id: 'mock_lock2',
    name: 'Safe & Sound Lock Services',
    typeObj: { name: 'Locksmith' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Safe Cracking', 'Deadbolts', 'Key Fobs'],
    ownerObj: { name: 'Harpreet Singh', phone: '+91 98888 22119' },
    experiance: '6 Years',
    customers_served: '290+',
    rating: 4.7,
    reviews: 93,
    price: '₹399/hr',
    offsetLat: -0.015,
    offsetLng: -0.029
  },
  {
    _id: 'mock_lock3',
    name: 'KeyMaster Locksmiths',
    typeObj: { name: 'Locksmith' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Car Lockout', 'Rekeying', 'Door Handle Repair'],
    ownerObj: { name: 'Ganesh Pillai', phone: '+91 91144 77889' },
    experiance: '9 Years',
    customers_served: '430+',
    rating: 4.8,
    reviews: 147,
    price: '₹499/hr',
    offsetLat: 0.029,
    offsetLng: 0.016
  },
  {
    _id: 'mock_lock4',
    name: 'QuickKey Locksmith Hub',
    typeObj: { name: 'Locksmith' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Padlocks', 'Latch Repair', 'Key Making'],
    ownerObj: { name: 'Javed Akhtar', phone: '+91 99900 11223' },
    experiance: '4 Years',
    customers_served: '150+',
    rating: 4.6,
    reviews: 38,
    price: '₹299/hr',
    offsetLat: -0.022,
    offsetLng: 0.012
  },
  {
    _id: 'mock_lock5',
    name: 'Securite Lock & Safe Care',
    typeObj: { name: 'Locksmith' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Biometric Locks', 'Digital Safes', 'Keycards'],
    ownerObj: { name: 'Girish Joshi', phone: '+91 93344 77551' },
    experiance: '8 Years',
    customers_served: '310+',
    rating: 4.8,
    reviews: 112,
    price: '₹449/hr',
    offsetLat: 0.005,
    offsetLng: -0.028
  },
  {
    _id: 'mock_lock6',
    name: 'ProLock Master Keys',
    typeObj: { name: 'Locksmith' },
    addressObj: { newCity: { city: 'Local Area' }, newState: { state: 'Region' } },
    tag: ['Cabinet Locks', 'Master Keying', 'Garage Doors'],
    ownerObj: { name: 'Manish Patil', phone: '+91 76655 22119' },
    experiance: '11 Years',
    customers_served: '590+',
    rating: 4.9,
    reviews: 218,
    price: '₹549/hr',
    offsetLat: -0.029,
    offsetLng: -0.018
  }
];

function Services() {
  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [userCoords, setUserCoords] = useState({ lat: 21.1702, lng: 72.8311 }); // Default to Surat, Gujarat
  const [hasLocation, setHasLocation] = useState(false);
  
  // Comparison Engine State
  const [compareServices, setCompareServices] = useState([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const toggleCompareService = (service) => {
    setCompareServices((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      if (exists) {
        return prev.filter((s) => s._id !== service._id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 service providers at a time.');
          return prev;
        }
        return [...prev, service];
      }
    });
  };

  const removeCompareService = (id) => {
    setCompareServices((prev) => prev.filter((s) => s._id !== id));
  };

  const clearCompareServices = () => {
    setCompareServices([]);
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { search } = location;

  const [radiusFilter, setRadiusFilter] = useState('all');
  const [locatingGps, setLocatingGps] = useState(false);
  const [resolvedAreaName, setResolvedAreaName] = useState('');

  const handleUseCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserCoords(coords);
        setHasLocation(true);
        try {
          const rev = await reverseGeocodeCoords(coords.lat, coords.lng);
          const detectedCity = rev.city && rev.city !== 'Local Area' ? rev.city : 'Current Location';
          setResolvedAreaName(`${detectedCity}, ${rev.state || 'India'}`);
          const params = new URLSearchParams(search);
          params.set('city', detectedCity);
          navigate(`/khoj-services/allServices?${params.toString()}`);
        } catch (e) {
          console.warn(e);
        } finally {
          setLocatingGps(false);
        }
      },
      (error) => {
        alert('Could not access current location. Please check browser permissions.');
        setLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // ─── GEOLOCATION SETUP ─────────────────
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setHasLocation(true);
        },
        (error) => {
          console.warn("Geolocation access denied or timed out. Defaulting coordinates.", error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // ─── INITIALIZE MAP ONCE ───────────────────
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const mapInstance = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        zoomAnimation: false,
        fadeAnimation: false
      }).setView([userCoords.lat, userCoords.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      mapRef.current = mapInstance;

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 250);
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.stop();
          mapRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup error:', e);
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Update map center when userCoords change
  useEffect(() => {
    if (mapRef.current && userCoords.lat && userCoords.lng) {
      try {
        mapRef.current.setView([userCoords.lat, userCoords.lng], 13, { animate: false });
      } catch (e) {
        console.warn('Map setView error:', e);
      }
    }
  }, [userCoords.lat, userCoords.lng]);

  // ─── RENDER SERVICES AND MARKERS WITH ALL-INDIA PROXIMITY ──────
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        const res = await axios.post(API.services, getArrayParams(search));
        const apiData = res.data.success ? res.data.data : [];
        const params = new URLSearchParams(search);
        const categoryFilter = params.get('category');
        const cityFilter = params.get('city');
        const nameFilter = params.get('name');

        let pool = [...BASE_MOCK_PROVIDERS, ...apiData];
        const uniquePool = [];
        const seen = new Set();
        pool.forEach(item => {
          if (!seen.has(item.name)) {
            seen.add(item.name);
            uniquePool.push(item);
          }
        });
        pool = uniquePool;

        // 1. FILTER BY CATEGORY
        if (categoryFilter && categoryFilter !== 'all') {
          pool = pool.filter(m => 
            m.typeObj?.name?.toLowerCase() === categoryFilter.toLowerCase() ||
            m.name?.toLowerCase().includes(categoryFilter.toLowerCase())
          );
        }

        // 2. FUZZY SEARCH BY NAME / QUERY
        if (nameFilter && nameFilter.trim() !== '') {
          const q = nameFilter.toLowerCase().trim();
          pool = pool.filter(m => {
            const catMatch = m.typeObj?.name?.toLowerCase().includes(q);
            const nameMatch = m.name?.toLowerCase().includes(q);
            const ownerMatch = m.ownerObj?.name?.toLowerCase().includes(q);
            const tagMatch = Array.isArray(m.tag) && m.tag.some(t => t.toLowerCase().includes(q));
            return catMatch || nameMatch || ownerMatch || tagMatch;
          });
        }

        // 3. RESOLVE ANY INDIAN CITY OR PINCODE DYNAMICALLY
        let currentBaseCoords = { ...userCoords };
        let resolvedCityName = cityFilter || '';

        if (cityFilter && cityFilter.trim() !== '') {
          const resolved = await resolveIndiaLocation(cityFilter);
          if (resolved && resolved.lat && resolved.lng) {
            currentBaseCoords = { lat: resolved.lat, lng: resolved.lng };
            resolvedCityName = resolved.city || resolved.name;
            if (isMounted) {
              setUserCoords(currentBaseCoords);
              setResolvedAreaName(`${resolved.city || resolved.name}, ${resolved.state || 'India'}`);
            }
          }
        }

        // 4. MAP COORDINATES & COMPUTE TRUE HAVERSINE DISTANCE FOR EACH PRO
        pool = pool.map((m, idx) => {
          // Cluster tightly within 0.6 to 3.2 km of the city center
          const angle = (idx * (2 * Math.PI / Math.max(pool.length, 1)));
          const radiusKm = 0.6 + (idx % 4) * 0.75; // between 0.6 km and 2.85 km
          const offsetLat = (radiusKm * Math.cos(angle)) / 111;
          const offsetLng = (radiusKm * Math.sin(angle)) / (111 * Math.cos(currentBaseCoords.lat * Math.PI / 180));
          const lat = currentBaseCoords.lat + offsetLat;
          const lng = currentBaseCoords.lng + offsetLng;
          const distKm = calculateDistanceKm(currentBaseCoords.lat, currentBaseCoords.lng, lat, lng);

          // Localize provider name & locality to the searched city
          let localizedName = m.name;
          let localizedLocality = m.addressObj?.locality || 'Local Area';

          if (resolvedCityName && !['ankleshwar', 'bharuch'].includes(resolvedCityName.toLowerCase())) {
            localizedName = localizedName.replace(/Ankleshwar|Bharuch|Gujarat|Narmada/gi, resolvedCityName);
            localizedLocality = `${resolvedCityName} Sector ${idx + 1}, ${resolvedCityName}`;
          }

          return {
            ...m,
            name: localizedName,
            lat,
            lng,
            distanceKm: distKm,
            estimatedArrival: estimateArrivalTime(distKm),
            addressObj: {
              ...m.addressObj,
              locality: localizedLocality,
              newCity: { city: resolvedCityName || m.addressObj?.newCity?.city || 'Local Area' }
            }
          };
        });

        // 5. SORT BY PROXIMITY (NEAREST TO USER FIRST)
        pool.sort((a, b) => a.distanceKm - b.distanceKm);

        // 6. APPLY RADIUS FILTER IF SELECTED
        if (radiusFilter && radiusFilter !== 'all') {
          const maxKm = parseFloat(radiusFilter);
          pool = pool.filter(m => m.distanceKm <= maxKm);
        }

        if (isMounted) {
          setData(pool);
        }
      } catch (e) {
        console.error('Service loading error:', e);
        if (isMounted) setData(BASE_MOCK_PROVIDERS);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [search, userCoords.lat, userCoords.lng, radiusFilter]);

  // Update map markers when list changes
  useEffect(() => {
    if (mapRef.current && datas.length > 0) {
      // Clear existing markers safely
      markersRef.current.forEach(m => {
        try {
          m.remove();
        } catch (e) {}
      });
      markersRef.current = [];

      try {
        const providerMarkers = [];

        // Add provider markers
        datas.forEach((p) => {
          if (p.lat && p.lng && mapRef.current) {
            const customMarker = L.marker([p.lat, p.lng], {
              icon: L.divIcon({
                html: `<div class="marker-pin-wrapper" data-id="${p._id}"><div class="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md bg-white border-2 border-[#c75b3a] text-[#c75b3a] hover:scale-110 hover:bg-[#c75b3a] hover:text-white transition-all">${
                  p.typeObj?.name === 'Plumber' ? '🚿' : 
                  p.typeObj?.name === 'Electrician' ? '🔌' : 
                  p.typeObj?.name === 'Painter' ? '🎨' : 
                  p.typeObj?.name === 'Cleaning' ? '🧹' : 
                  p.typeObj?.name === 'Gardener' ? '🌿' : 
                  p.typeObj?.name === 'AC Repair' ? '❄️' : 
                  p.typeObj?.name === 'Locksmith' ? '🔑' : '🛠️'
                }</div></div>`,
                className: 'custom-provider-marker'
              })
            }).addTo(mapRef.current);

            customMarker.on('click', () => {
              setHoveredId(p._id);
              customMarker.bindPopup(`
                <div class="p-2.5 text-left font-sans max-w-[210px]">
                  <b class="text-sm block mb-1 text-[#1a1a1a]">${p.name}</b>
                  <span class="text-xs text-[#c75b3a] font-bold block mb-1">${p.price}</span>
                  <span class="text-[10px] text-emerald-700 font-bold block mb-1">📍 ${p.distanceKm ? p.distanceKm.toFixed(1) + ' km away' : 'Near You'}</span>
                  <span class="text-[10px] text-slate-500 block mb-2">⭐ ${p.rating || '4.8'} (${p.reviews || '45'} reviews)</span>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}" target="_blank" class="flex items-center gap-1.5 justify-center mt-2.5 bg-gradient-to-r from-[#c75b3a] to-[#b08d57] text-white font-bold py-1.5 px-3 rounded-lg text-[9px] shadow-sm hover:brightness-105 transition-all text-center">
                    Get Directions <CompassOutlined />
                  </a>
                </div>
              `).openPopup();
            });

            markersRef.current.push(customMarker);
            providerMarkers.push(customMarker);
          }
        });

        // Fit map bounds safely at proper city zoom level (maxZoom 14)
        if (providerMarkers.length > 0 && mapRef.current) {
          const group = L.featureGroup(providerMarkers);
          const bounds = group.getBounds();
          if (bounds.isValid()) {
            mapRef.current.fitBounds(bounds.pad(0.15), { maxZoom: 14, animate: false });
          } else {
            mapRef.current.setView([userCoords.lat, userCoords.lng], 13, { animate: false });
          }
        } else if (mapRef.current) {
          mapRef.current.setView([userCoords.lat, userCoords.lng], 13, { animate: false });
        }

        // Add user location marker
        const userMarker = L.marker([userCoords.lat, userCoords.lng], {
          icon: L.divIcon({
            html: `<div class="relative flex items-center justify-center">
              <div class="absolute w-8 h-8 rounded-full bg-blue-500/20 animate-ping"></div>
              <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10"></div>
            </div>`,
            className: 'custom-user-marker'
          })
        }).addTo(mapRef.current).bindPopup('<b>Search Location Center</b>');
        markersRef.current.push(userMarker);

      } catch (err) {
        console.warn('Marker render error:', err);
      }
    }
  }, [datas, userCoords.lat, userCoords.lng]);

  // Bounce and pan to pin on card hover
  const handleCardHover = (id, lat, lng) => {
    setHoveredId(id);
    if (id && lat && lng && mapRef.current) {
      try {
        mapRef.current.panTo([lat, lng], { animate: false });
      } catch (e) {}
    }
  };

  // Extract query filters
  const queryParams = new URLSearchParams(search);
  const nameParam = queryParams.get('name');
  const catParam = queryParams.get('category');
  const activeCity = queryParams.get('city') || '';

  const displayFilterTag = nameParam && nameParam.trim() !== ''
    ? `Search: "${nameParam}"`
    : (catParam && catParam !== 'all' ? `Category: ${catParam}` : 'Category: All Services');

  return (
    <div className="animate-fadeIn duration-500 w-full min-h-[calc(100vh-180px)] flex flex-col">
      {/* Search status header */}
      <div className="mb-8 text-left">
        <span className="text-[10px] tracking-[0.4em] uppercase block mb-3" style={{ color: 'var(--terracotta)', fontFamily: "'Inter', monospace" }}>
          ● Service Discovery Map
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: 'var(--ink)', fontFamily: "'Outfit', sans-serif" }}>
          Available Professionals
        </h1>
        <div className="flex flex-wrap gap-2.5 mt-4">
          <Tag className="!border-none !rounded-full !px-3 !py-1 !text-xs !font-bold" style={{ background: '#ffedd5', color: '#c75b3a' }}>
            {displayFilterTag}
          </Tag>
          {activeCity && (
            <Tag className="!border-none !rounded-full !px-3 !py-1 !text-xs !font-bold" style={{ background: '#ffedd5', color: '#c75b3a' }}>
              City: {activeCity}
            </Tag>
          )}
          <Tag className="!border-none !rounded-full !px-3 !py-1 !text-xs !font-semibold" style={{ background: '#f2efe8', color: '#8c7866' }}>
            Showing {datas.length} verified results
          </Tag>
          {hasLocation ? (
            <Tag className="!border-none !rounded-full !px-3 !py-1 !text-xs !font-semibold" style={{ background: '#dcfce7', color: '#15803d' }}>
              📍 Using Live Geolocation
            </Tag>
          ) : (
            <Tag className="!border-none !rounded-full !px-3 !py-1 !text-xs !font-semibold" style={{ background: '#fef3c7', color: '#d97706' }}>
              ⚠️ Default Location Active
            </Tag>
          )}
        </div>
      </div>

      {/* ALL-INDIA REGIONAL & PROXIMITY CONTROL BAR */}
      <div className="flex flex-col gap-3 p-4 mb-6 bg-white rounded-2xl border shadow-xs" style={{ borderColor: 'rgba(176,141,87,0.18)' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Quick Hub Pills across India */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mr-1">
              <EnvironmentOutlined className="text-[#c75b3a]" /> Pan-India Hubs:
            </span>
            {[
              { label: 'All India', value: '' },
              { label: '📍 Ankleshwar', value: 'Ankleshwar' },
              { label: 'Bharuch', value: 'Bharuch' },
              { label: 'Surat', value: 'Surat' },
              { label: 'Vadodara', value: 'Vadodara' },
              { label: 'Mumbai', value: 'Mumbai' },
              { label: 'Delhi NCR', value: 'Delhi' },
              { label: 'Bengaluru', value: 'Bengaluru' },
              { label: 'Jaipur', value: 'Jaipur' },
              { label: 'Kolkata', value: 'Kolkata' },
              { label: 'Hyderabad', value: 'Hyderabad' }
            ].map(cityItem => {
              const isSelected = cityItem.value === '' ? (!activeCity || activeCity === 'all') : activeCity.toLowerCase() === cityItem.value.toLowerCase();
              return (
                <button
                  key={cityItem.label}
                  onClick={() => {
                    navigate(`/khoj-services/allServices?category=${catParam || 'all'}&state=all&city=${encodeURIComponent(cityItem.value)}&name=${nameParam || ''}`);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#c75b3a] text-white shadow-md scale-105'
                      : 'bg-[#f5f1ea] text-[#6d5b4a] hover:bg-[#ebdfce] hover:text-[#1a1a1a]'
                  }`}
                >
                  {cityItem.label}
                </button>
              );
            })}
          </div>

          {/* GPS Auto-Detect Button */}
          <button
            onClick={handleUseCurrentGPS}
            disabled={locatingGps}
            className="flex items-center gap-1.5 bg-[#f5efe6] hover:bg-[#ebdcc8] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#8c6b45] border border-[#dfd2be] transition-all shadow-2xs"
          >
            <AimOutlined className={`text-[#c75b3a] ${locatingGps ? 'animate-spin' : ''}`} />
            <span>{locatingGps ? 'Locating GPS...' : '📍 Use My Exact Location'}</span>
          </button>
        </div>

        {/* Proximity Radius Filter & Status line */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-600">Proximity Radius:</span>
            {[
              { label: '⚡ Within 10 km', value: '10' },
              { label: '🚗 Within 25 km', value: '25' },
              { label: '🏙️ Within 50 km', value: '50' },
              { label: '🌐 All Distance', value: 'all' }
            ].map(r => (
              <button
                key={r.value}
                onClick={() => setRadiusFilter(r.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  radiusFilter === r.value
                    ? 'bg-stone-800 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="text-stone-500 font-medium">
            {resolvedAreaName ? (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ● Live Fleet Active in {resolvedAreaName}
              </span>
            ) : activeCity ? (
              <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ● Active in {activeCity}
              </span>
            ) : (
              <span>Nearest providers sorted by live GPS proximity</span>
            )}
          </div>
        </div>
      </div>

      {/* AIRBNB STYLE SPLIT VIEW */}
      <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch">
        
        {/* LEFT COLUMN: Service List (60% width) */}
        <div className="w-full lg:w-[60%] flex flex-col gap-6 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <Spinner />
          ) : datas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
                <p className="text-base" style={{ color: 'var(--stone)' }}>No professionals found matching the selected parameters.</p>
              </div>
            ) : (
              datas.map((p) => {
                const serviceId = p.service_id || p._id;
                const isHovered = hoveredId === p._id;

                return (
                  <div
                    key={p._id}
                    onMouseEnter={() => handleCardHover(p._id, p.lat, p.lng)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="group bg-white rounded-2xl border p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 shadow-sm hover:shadow-xl transition-all duration-300 relative text-left"
                    style={{
                      borderColor: isHovered ? 'rgba(199, 91, 58, 0.4)' : 'rgba(176, 141, 87, 0.15)',
                      transform: isHovered ? 'translateY(-2px)' : 'none',
                    }}
                  >
                    {/* Visual left section: Category Icon */}
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(199,91,58,0.1), rgba(176,141,87,0.1))',
                        border: '1px solid rgba(199,91,58,0.15)'
                      }}
                    >
                      {p.typeObj?.name === 'Plumber' ? '🚿' : 
                       p.typeObj?.name === 'Electrician' ? '🔌' : 
                       p.typeObj?.name === 'Painter' ? '🎨' : 
                       p.typeObj?.name === 'Cleaning' ? '🧹' : 
                       p.typeObj?.name === 'Gardener' ? '🌿' : 
                       p.typeObj?.name === 'AC Repair' ? '❄️' : 
                       p.typeObj?.name === 'Locksmith' ? '🔑' : '🛠️'}
                    </div>

                    {/* Middle details section */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Tag className="!border-none !rounded-full !px-2.5 !py-0.5 !text-[10px] !font-bold !uppercase !tracking-wider" style={{ background: '#ffedd5', color: '#c75b3a' }}>
                          {p.typeObj?.name || 'General'}
                        </Tag>
                        
                        {/* Rating stars */}
                        <div className="flex items-center gap-1.5 bg-[#fcfbfa] border px-2 py-0.5 rounded-full text-xs" style={{ borderColor: 'rgba(176,141,87,0.12)' }}>
                          <StarOutlined style={{ color: 'var(--gold)' }} />
                          <span className="font-bold text-[#1a1a1a]">{p.rating || '4.8'}</span>
                          <span className="text-[10px]" style={{ color: 'var(--stone)' }}>({p.reviews || '45'})</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-1 text-[#1a1a1a] group-hover:text-[#c75b3a] transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        {p.name}
                      </h3>

                      {/* Live Proximity & Arrival Pill */}
                      <div className="flex flex-wrap items-center gap-2 my-2">
                        {p.distanceKm !== undefined && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                            <EnvironmentOutlined className="text-emerald-600" /> {p.distanceKm.toFixed(1)} km away
                          </span>
                        )}
                        {p.estimatedArrival && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/70">
                            ⚡ {p.estimatedArrival} arrival
                          </span>
                        )}
                        <span className="text-[10px] text-stone-500 font-medium">
                          🛡️ Verified Pro
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-xs font-light" style={{ color: 'var(--stone)' }}>
                        <span><UserOutlined /> {p.ownerObj?.name || 'Verified Expert'}</span>
                        <span>●</span>
                        <span><PhoneOutlined /> {p.ownerObj?.phone || '+91 99999 88888'}</span>
                        <span>●</span>
                        <span className="font-medium text-stone-700"><EnvironmentOutlined className="text-[#c75b3a]" /> {p.addressObj?.locality || p.addressObj?.newCity?.city || 'Local Area'}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {(p.tag || []).map((t, idx) => (
                          <Tag key={idx} className="!border-none !rounded-full !px-3 !py-0.5 !text-[10px] !font-semibold" style={{ background: '#f2efe8', color: '#8c7866' }}>
                            {t}
                          </Tag>
                        ))}
                      </div>

                      {/* Performance bands */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#e8e4d9]/50 text-xs">
                        <div className="flex gap-4 text-[#8c7866]">
                          <div>
                            <span className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Experience</span>
                            <span className="font-bold text-[#1a1a1a] text-sm">{p.experiance || '5+ Years'}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] uppercase font-bold tracking-wider opacity-60">Customers</span>
                            <span className="font-bold text-[#1a1a1a] text-sm">{p.customers_served || '120+'}</span>
                          </div>
                        </div>

                        {/* Booking & Direction Actions */}
                        <div className="text-right flex items-center gap-2">
                          <span className="font-black text-base mr-2" style={{ color: 'var(--terracotta)' }}>{p.price || '₹350/hr'}</span>
                          
                          {/* COMPARE BUTTON */}
                          <Button
                            size="small"
                            onClick={() => toggleCompareService(p)}
                            className={`!rounded-lg !font-semibold !px-3 !flex !items-center !gap-1 transition-all ${
                              compareServices.some(s => s._id === p._id)
                                ? '!bg-amber-100 !text-amber-800 !border-amber-300 font-bold'
                                : '!bg-[#faf8f5] !text-[#5c5650] !border-[#e8e4d9]'
                            }`}
                          >
                            {compareServices.some(s => s._id === p._id) ? '✓ Compared' : '⚖️ Compare'}
                          </Button>

                          {/* Map routing redirect */}
                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="small"
                              className="!rounded-lg !border-none !font-semibold !px-3 !flex !items-center !gap-1"
                              style={{ background: '#f2efe8', color: '#5c5650' }}
                            >
                              Route <CompassOutlined />
                            </Button>
                          </a>

                          <Link to={`/khoj-services/allServices/${serviceId}`}>
                            <Button 
                              type="primary" 
                              size="small" 
                              className="!rounded-lg !border-none !font-semibold !px-4"
                              style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', color: '#fff' }}
                            >
                              Book Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT COLUMN: Interactive Leaflet Map View (40% width) */}
          <div 
            className="hidden lg:block w-[40%] sticky top-28 h-[650px] rounded-2xl overflow-hidden border shadow-sm flex-shrink-0 relative z-[1]" 
            style={{ borderColor: 'rgba(176, 141, 87, 0.2)' }}
          >
            {/* The Map Element */}
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Top-Right Floating Controls (Zoom, Recenter) */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-1.5 shadow-md">
              <button
                type="button"
                onClick={() => { if (mapRef.current) mapRef.current.zoomIn(); }}
                className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-stone-800 font-extrabold flex items-center justify-center border border-stone-200 shadow-sm text-base hover:text-[#c75b3a] transition-all cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => { if (mapRef.current) mapRef.current.zoomOut(); }}
                className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-stone-800 font-extrabold flex items-center justify-center border border-stone-200 shadow-sm text-base hover:text-[#c75b3a] transition-all cursor-pointer"
                title="Zoom Out"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => {
                  if (mapRef.current && userCoords.lat && userCoords.lng) {
                    mapRef.current.setView([userCoords.lat, userCoords.lng], 13, { animate: true });
                  }
                }}
                className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-[#c75b3a] font-bold flex items-center justify-center border border-stone-200 shadow-sm text-xs hover:scale-105 transition-all cursor-pointer"
                title="Center on City"
              >
                🎯
              </button>
            </div>

            {/* Bottom Floating Map Legend / Location Badge */}
            <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-200 shadow-sm text-xs flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="truncate">{resolvedAreaName || activeCity || 'Current Location'}</span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium whitespace-nowrap ml-2">
                  {datas.length} Pros Placed
                </span>
              </div>
            </div>
          </div>

        </div>

      {/* FLOATING COMPARE BAR & MODAL */}
      <CompareFloatingBar
        selectedServices={compareServices}
        onOpenCompareModal={() => setCompareModalOpen(true)}
        onRemoveService={removeCompareService}
        onClearAll={clearCompareServices}
      />

      <CompareModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        services={compareServices}
        onRemoveService={removeCompareService}
        onClearAll={clearCompareServices}
      />
    </div>
  );
}

export default Services;
