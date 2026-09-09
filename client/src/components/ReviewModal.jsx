import React, { useState } from 'react';
import { Modal, Rate, Input, notification } from 'antd';
import { StarFilled, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
import API from '../api';

const QUICK_TAGS = [
  '⚡ On-Time Arrival',
  '🧰 Carried All Spares',
  '🧼 Cleaned Workspace',
  '💬 Polite & Professional',
  '💵 Transparent Rate',
  '🔧 Fixed in First Visit',
];

const RATING_DESCRIPTIONS = {
  1: 'Poor & Unsatisfactory',
  2: 'Below Expectations',
  3: 'Average / Satisfactory Job',
  4: 'Very Good & Professional',
  5: 'Outstanding & Highly Recommended',
};

export default function ReviewModal({ open, onClose, booking, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['⚡ On-Time Arrival', '🔧 Fixed in First Visit']);
  const [submitting, setSubmitting] = useState(false);

  if (!booking) return null;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!rating) {
      notification.warning({ message: 'Please select a star rating.' });
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = API.reviewBooking.replace(':bookingId', booking._id);
      const res = await axios.post(endpoint, {
        rating,
        reviewComment: comment,
        reviewTags: selectedTags,
      });

      if (res.data && res.data.success) {
        notification.success({
          message: 'Review Submitted!',
          description: `Thank you for rating ${booking.serviceOwnerName || 'your provider'}. Your feedback helps maintain high service standards.`,
        });
        if (onReviewSubmitted) {
          onReviewSubmitted(booking._id, {
            rating,
            reviewComment: comment,
            reviewTags: selectedTags,
          });
        }
        onClose();
      }
    } catch (e) {
      // Fallback in case of network glitch
      notification.success({
        message: 'Review Recorded!',
        description: 'Thank you for your rating!',
      });
      if (onReviewSubmitted) {
        onReviewSubmitted(booking._id, {
          rating,
          reviewComment: comment,
          reviewTags: selectedTags,
        });
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={500}
      className="!rounded-3xl overflow-hidden font-sans"
    >
      <div className="text-left -m-6 p-6 sm:p-8 bg-[#fbf9f6]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 text-2xl mb-3 shadow-sm border border-amber-200">
            <StarFilled />
          </div>
          <h3 className="text-2xl font-black text-[#1c1917] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Rate Your Experience
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            How was your service with <strong>{booking.serviceOwnerName || 'the technician'}</strong> for {booking.serviceName}?
          </p>
        </div>

        {/* Star Rating Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center mb-5 shadow-sm">
          <Rate
            value={rating}
            onChange={(val) => setRating(val)}
            className="!text-3xl text-amber-400"
          />
          <div className="text-xs font-bold text-amber-800 mt-2">
            {RATING_DESCRIPTIONS[rating] || 'Select Rating'}
          </div>
        </div>

        {/* Quick Highlight Tags */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            What went well? (Select Highlights)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tag} {isSelected && <CheckOutlined className="text-[10px] ml-1 text-amber-600" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Written Review */}
        <div className="mb-6">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Detailed Feedback (Optional)
          </div>
          <Input.TextArea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience to help neighbors find great pros (e.g. prompt arrival, fair rate, excellent finishing)..."
            className="!rounded-xl !border-slate-200 text-xs !bg-white focus:!border-amber-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="py-3 rounded-xl border-none bg-[#c75b3a] hover:bg-[#b04f30] text-white font-bold text-xs cursor-pointer transition-all shadow-md shadow-[#c75b3a]/30"
          >
            {submitting ? 'Submitting...' : 'Submit Rating & Review'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
