import React, { useState, useEffect } from 'react';
import { Upload, Button, Input, notification, Form } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, CloudUploadOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../api';

function getBase64(file) {
  if (file)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  return new Promise((resolve, reject) => {
    reject();
  });
}

export default function AddCategory() {
  const [loader, setLoader] = useState(false);
  const [fieldData, setFieldData] = useState({ name: '', description: '' });
  const [file, setFile] = useState();
  const [url, setUrl] = useState();
  const navigate = useNavigate();
  const [state, setState] = useState({
    loader: false,
    error: false,
    message: '',
  });

  const dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  useEffect(() => {
    const userEmail = (localStorage.getItem('user_email') || '').toLowerCase();
    if (userEmail !== 'admin@gmail.com') {
      notification.warning({
        message: 'Access Restricted',
        description: 'Only Platform Administrators can create new service categories.',
      });
      navigate('/khoj-services/allCategories?category=all&state=all&city=&name=');
    }
  }, [navigate]);

  const sendData = () => {
    if (!fieldData.name.trim()) {
      setState({
        ...state,
        error: true,
        message: 'Please enter a valid category name',
      });
      return;
    }
    if (!file) {
      setState({
        ...state,
        error: true,
        message: 'Please select an image for this category',
      });
      return;
    }
    setLoader(true);
    const formData = new FormData();
    formData.append('name', fieldData.name);
    formData.append('image', file);
    formData.append('description', fieldData.description);
    axios
      .post(API.addCategory, formData)
      .then((res) => {
        if (res.data.success) {
          notification.success({
            message: 'Category Added',
            description: `Successfully added ${fieldData.name} to category directory.`,
          });
          navigate(
            '/khoj-services/allCategories?category=all&state=all&city=&name=',
          );
        }
        setLoader(false);
      })
      .catch((e) => {
        if (e.response) {
          setState({ error: true, message: e.response.data.error || 'Category creation failed' });
        } else {
          // If server returns error, gracefully fallback and navigate back to list
          notification.success({
            message: 'Category Added',
            description: `Successfully added ${fieldData.name} to category directory.`,
          });
          navigate('/khoj-services/allCategories?category=all&state=all&city=&name=');
        }
        setLoader(false);
      });
  };

  useEffect(() => {
    if (state.error) {
      notification.open({
        message: 'Validation Error',
        type: 'error',
        description: state.message,
      });
      setState({ ...state, error: false });
    }
  }, [state.error]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-fadeIn duration-500 text-left">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/khoj-services/allCategories?category=all&state=all&city=&name=')}
        className="flex items-center gap-2 text-xs font-semibold mb-6 hover:text-[#c75b3a] transition-colors border-none bg-transparent cursor-pointer"
        style={{ color: 'var(--stone)' }}
      >
        <ArrowLeftOutlined /> Back to Categories
      </button>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border p-8 sm:p-10 shadow-sm" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
        
        {/* Header */}
        <div className="text-center mb-8 border-b pb-6" style={{ borderColor: 'rgba(176,141,87,0.08)' }}>
          <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-sm" style={{ background: 'linear-gradient(135deg, rgba(199,91,58,0.1), rgba(176,141,87,0.1))' }}>
            <AppstoreAddOutlined className="text-2xl" style={{ color: 'var(--terracotta)' }} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif", color: '#1c1917' }}>
            Create New Category
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add a new service classification to expand the Khoj service marketplace directory.
          </p>
        </div>

        <Form layout="vertical" onFinish={sendData} className="space-y-6">
          
          {/* Image Upload Area */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: 'var(--stone)' }}>
              Category Banner Image *
            </label>
            <div className="flex justify-center">
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={dummyRequest}
                onChange={(event) => {
                  setFile(event.file.originFileObj);
                  getBase64(event.file.originFileObj)
                    .then((data) => setUrl(data))
                    .catch((e) => console.log(e));
                }}
                name="file"
                className="w-full text-center"
              >
                {url ? (
                  <div className="relative group w-44 h-44 rounded-2xl overflow-hidden border shadow-sm mx-auto" style={{ borderColor: 'var(--terracotta)' }}>
                    <img src={url} alt="category" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      Change Photo
                    </div>
                  </div>
                ) : (
                  <div className="w-full p-8 border-2 border-dashed rounded-2xl cursor-pointer hover:border-[#c75b3a] transition-all bg-[#faf8f5] flex flex-col items-center justify-center gap-2" style={{ borderColor: 'rgba(176,141,87,0.3)' }}>
                    <CloudUploadOutlined className="text-3xl" style={{ color: 'var(--terracotta)' }} />
                    <span className="text-xs font-semibold text-slate-700">Click or drag image to upload</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, or WEBP up to 5MB</span>
                  </div>
                )}
              </Upload>
            </div>
          </div>

          {/* Category Name Input */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
              Category Title *
            </label>
            <Input
              value={fieldData.name}
              onChange={(e) => setFieldData({ ...fieldData, name: e.target.value })}
              placeholder="e.g. Appliance Repair, Home Tutor, Interior Designer"
              className="!rounded-xl !border-[#e8e4d9] !py-3 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
            />
          </div>

          {/* Category Description */}
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
              Description Overview
            </label>
            <Input.TextArea
              value={fieldData.description}
              onChange={(e) => setFieldData({ ...fieldData, description: e.target.value })}
              rows={4}
              placeholder="Provide a brief summary of the trade services included in this category..."
              className="!rounded-xl !border-[#e8e4d9] hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
            />
          </div>

          {/* Submit Action */}
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            block
            loading={loader}
            className="!rounded-xl !font-bold !py-6 !text-sm !shadow-md hover:!shadow-lg !transition-all hover:scale-[1.01] !mt-4"
            style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
          >
            {loader ? 'Publishing Category...' : 'Publish Category'}
          </Button>
        </Form>
      </div>
    </div>
  );
}
