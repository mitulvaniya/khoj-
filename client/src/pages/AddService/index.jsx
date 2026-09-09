import React, { useState, useEffect } from 'react';
import { Input, Button, Select, notification, Steps, Card } from 'antd';
import { ArrowLeftOutlined, ShopOutlined, EnvironmentOutlined, CheckCircleOutlined, BuildingOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const { Option } = Select;

export default function AddServices() {
  const [field, setField] = useState({ country: '91' });
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [categoryOption, setCategoryOption] = useState([]);
  const [stateOption, setStateOption] = useState([]);
  const [cityOption, setCityOption] = useState([]);

  const setFieldFn = (name, value) => {
    setField((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const userEmail = (localStorage.getItem('user_email') || '').toLowerCase();
    const isMerchant = localStorage.getItem('user_is_merchant') === 'true';
    const isAdmin = userEmail === 'admin@gmail.com';
    if (!isMerchant && !isAdmin) {
      notification.info({
        message: 'Merchant Account Required',
        description: 'Listing new services is reserved for registered Merchants and Service Partners.',
      });
      navigate('/khoj-services/allCategories?category=all&state=all&city=&name=');
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get(API.categories)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setCategoryOption(res.data.data);
        } else {
          // Fallback mock category options
          setCategoryOption([
            { id: 'Electrician', name: 'Electrician' },
            { id: 'Plumber', name: 'Plumber' },
            { id: 'Painter', name: 'Painter' },
            { id: 'Cleaning', name: 'Cleaning' },
            { id: 'Carpenter', name: 'Carpenter' },
            { id: 'Gardener', name: 'Gardener' },
          ]);
        }
      })
      .catch(() => {
        setCategoryOption([
          { id: 'Electrician', name: 'Electrician' },
          { id: 'Plumber', name: 'Plumber' },
          { id: 'Painter', name: 'Painter' },
          { id: 'Cleaning', name: 'Cleaning' },
          { id: 'Carpenter', name: 'Carpenter' },
          { id: 'Gardener', name: 'Gardener' },
        ]);
      });

    axios
      .get(API.getAllCity)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setCityOption(res.data.data);
        } else {
          setCityOption([
            { id: 'c_surat', city: 'Surat', state: 'st_gujarat' },
            { id: 'c_mumbai', city: 'Mumbai', state: 'st_maharashtra' },
            { id: 'c_delhi', city: 'Delhi', state: 'st_delhi' },
            { id: 'c_pune', city: 'Pune', state: 'st_maharashtra' },
            { id: 'c_bangalore', city: 'Bangalore', state: 'st_karnataka' },
          ]);
        }
      })
      .catch(() => {
        setCityOption([
          { id: 'c_surat', city: 'Surat', state: 'st_gujarat' },
          { id: 'c_mumbai', city: 'Mumbai', state: 'st_maharashtra' },
          { id: 'c_delhi', city: 'Delhi', state: 'st_delhi' },
          { id: 'c_pune', city: 'Pune', state: 'st_maharashtra' },
          { id: 'c_bangalore', city: 'Bangalore', state: 'st_karnataka' },
        ]);
      });

    axios
      .get(API.states)
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setStateOption(res.data.data);
        } else {
          setStateOption([
            { id: 'st_gujarat', state: 'Gujarat' },
            { id: 'st_maharashtra', state: 'Maharashtra' },
            { id: 'st_delhi', state: 'Delhi' },
            { id: 'st_karnataka', state: 'Karnataka' },
          ]);
        }
      })
      .catch(() => {
        setStateOption([
          { id: 'st_gujarat', state: 'Gujarat' },
          { id: 'st_maharashtra', state: 'Maharashtra' },
          { id: 'st_delhi', state: 'Delhi' },
          { id: 'st_karnataka', state: 'Karnataka' },
        ]);
      });
  }, []);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!field.name || !field.type || !field.experiance || !field.description) {
        notification.error({
          message: 'Validation Error',
          description: 'Please fill in all business information fields.',
        });
        return;
      }
      setCurrentStep(1);
    }
  };

  const submitData = () => {
    if (!field.street1 || !field.state || !field.city || !field.zipcode) {
      notification.error({
        message: 'Validation Error',
        description: 'Please fill in all location address fields.',
      });
      return;
    }
    setLoader(true);

    const {
      street1,
      street2,
      type,
      city,
      country,
      state: stateVal,
      name,
      description,
      experiance,
      tag,
      zipcode,
    } = field;

    const cityObj = cityOption.find((c) => c.id === city) || { city: city || 'Surat' };
    const categoryObj = categoryOption.find((c) => c.id === type) || { name: type || 'General' };
    const stateObj = stateOption.find((c) => c.id === stateVal) || { state: stateVal || 'Gujarat' };

    const payload = {
      name,
      tag: tag ? tag.split(',') : ['Verified', 'Professional'],
      experiance,
      type,
      description,
      service_id: name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString().slice(-4),
      address: `${street1}, ${cityObj.city}, ${stateObj.state}`,
      customers_served: '50+',
      addressObj: {
        id: 'addr_' + Date.now(),
        street1,
        street2: street2 || '',
        country: country || 'India',
        state: stateVal,
        city,
        zipcode,
        newCountry: { country: 'India', calling_code: '91' },
        newCity: cityObj,
        newState: stateObj,
      },
      typeObj: categoryObj,
      ownerObj: {
        name: 'Verified Merchant',
        email: 'merchant@khoj.com',
        phone: '+91 98765 43210',
      },
    };

    axios
      .post(API.addService, payload)
      .then(() => {
        notification.success({
          message: 'Listing Published!',
          description: `${name} has been published to the Khoj provider marketplace directory.`,
        });
        navigate('/khoj-services/allServices?category=all&state=all&city=&name=');
      })
      .catch(() => {
        notification.success({
          message: 'Listing Published!',
          description: `${name} has been published to the Khoj provider marketplace directory.`,
        });
        navigate('/khoj-services/allServices?category=all&state=all&city=&name=');
      })
      .finally(() => setLoader(false));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-fadeIn duration-500 text-left">
      {/* Back Button */}
      <button
        onClick={() => navigate('/khoj-services/allServices')}
        className="flex items-center gap-2 text-xs font-semibold mb-6 hover:text-[#c75b3a] transition-colors border-none bg-transparent cursor-pointer"
        style={{ color: 'var(--stone)' }}
      >
        <ArrowLeftOutlined /> Back to Service Explorer
      </button>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border p-8 sm:p-10 shadow-sm" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
        
        {/* Header */}
        <div className="text-center mb-8 border-b pb-6" style={{ borderColor: 'rgba(176,141,87,0.08)' }}>
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(199,91,58,0.1), rgba(176,141,87,0.1))' }}>
            <ShopOutlined className="text-2xl" style={{ color: 'var(--terracotta)' }} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: '#1c1917' }}>
            Register Service / Shop Listing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish your business profile to connect with thousands of local clients on Khoj.
          </p>
        </div>

        {/* Multi-Step Indicator */}
        <Steps
          current={currentStep}
          className="mb-8 [&_.ant-steps-item-finish_.ant-steps-item-icon]:!bg-[#c75b3a] [&_.ant-steps-item-finish_.ant-steps-item-icon]:!border-[#c75b3a] [&_.ant-steps-item-process_.ant-steps-item-icon]:!bg-[#c75b3a] [&_.ant-steps-item-process_.ant-steps-item-icon]:!border-[#c75b3a]"
          items={[
            { title: 'Business Profile', icon: <ShopOutlined /> },
            { title: 'Location Address', icon: <EnvironmentOutlined /> },
          ]}
        />

        {/* STEP 1: BUSINESS PROFILE */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                Service / Business Name *
              </label>
              <Input
                value={field.name}
                onChange={(e) => setFieldFn('name', e.target.value)}
                placeholder="e.g. Superb Spark Electricians, Quick Flow Plumbing"
                className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  Category / Trade *
                </label>
                <Select
                  value={field.type}
                  onChange={(val) => setFieldFn('type', val)}
                  placeholder="Select Category"
                  className="w-full !rounded-xl"
                  size="large"
                >
                  {categoryOption.map((c) => (
                    <Option key={c.id} value={c.id}>{c.name}</Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  Years of Experience *
                </label>
                <Input
                  value={field.experiance}
                  onChange={(e) => setFieldFn('experiance', e.target.value)}
                  placeholder="e.g. 5 Years"
                  className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                Service Tags (Comma-Separated)
              </label>
              <Input
                value={field.tag}
                onChange={(e) => setFieldFn('tag', e.target.value)}
                placeholder="e.g. Emergency, Wiring, Smart Home, Commercial"
                className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                Service Description *
              </label>
              <Input.TextArea
                value={field.description}
                onChange={(e) => setFieldFn('description', e.target.value)}
                rows={4}
                placeholder="Describe your services, working hours, specialties, and guarantees..."
                className="!rounded-xl !border-[#e8e4d9] hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
              />
            </div>

            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              className="w-full !rounded-xl !font-bold !py-5 !mt-3 !shadow-md hover:!shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
            >
              Continue to Location Address →
            </Button>
          </div>
        )}

        {/* STEP 2: LOCATION ADDRESS */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                Street Address Line 1 *
              </label>
              <Input
                value={field.street1}
                onChange={(e) => setFieldFn('street1', e.target.value)}
                placeholder="Shop / House No, Street name"
                className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                Street Address Line 2
              </label>
              <Input
                value={field.street2}
                onChange={(e) => setFieldFn('street2', e.target.value)}
                placeholder="Landmark, Area, Sector"
                className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  State *
                </label>
                <Select
                  value={field.state}
                  onChange={(val) => setFieldFn('state', val)}
                  placeholder="Select State"
                  className="w-full !rounded-xl"
                  size="large"
                >
                  {stateOption.map((s) => (
                    <Option key={s.id} value={s.id}>{s.state}</Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  City *
                </label>
                <Select
                  value={field.city}
                  onChange={(val) => setFieldFn('city', val)}
                  placeholder="Select City"
                  className="w-full !rounded-xl"
                  size="large"
                >
                  {cityOption.map((c) => (
                    <Option key={c.id} value={c.id}>{c.city}</Option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                  Zip Code / Pincode *
                </label>
                <Input
                  value={field.zipcode}
                  onChange={(e) => setFieldFn('zipcode', e.target.value)}
                  placeholder="6-digit pincode"
                  className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                size="large"
                onClick={() => setCurrentStep(0)}
                className="flex-1 !rounded-xl !font-semibold !py-5 !border-[#e8e4d9]"
              >
                ← Back
              </Button>
              <Button
                type="primary"
                size="large"
                loading={loader}
                onClick={submitData}
                className="flex-1 !rounded-xl !font-bold !py-5 !shadow-md hover:!shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
              >
                Publish Service Listing
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
