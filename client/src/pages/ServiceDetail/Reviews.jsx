import React, { useState } from 'react';
import { Rate, Button, Modal, Input, Avatar, Progress, message, Tag } from 'antd';
import { StarFilled, UserOutlined, EditOutlined, CheckCircleFilled, LikeOutlined } from '@ant-design/icons';

const INITIAL_REVIEWS_SEED = [
  {
    id: 'rev_1',
    userName: 'Ananya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    date: '2 days ago',
    comment: 'Extremely professional and punctual! Solved the wiring short circuit issue in less than 30 minutes. Highly recommended for home electrical repairs.',
    helpfulCount: 12,
    verified: true,
  },
  {
    id: 'rev_2',
    userName: 'Rohan Mehta',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    rating: 4,
    date: '1 week ago',
    comment: 'Great work quality and transparent pricing. Arrived on time with all necessary replacement parts and tools.',
    helpfulCount: 8,
    verified: true,
  },
  {
    id: 'rev_3',
    userName: 'Priya Patel',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Suberb service! Very polite behavior and cleaned up the workspace after completing the installation work.',
    helpfulCount: 15,
    verified: true,
  },
];

function Reviews({ serviceName, onRatingUpdate }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS_SEED);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [helpfulLikes, setHelpfulLikes] = useState({});

  // Calculations
  const totalReviews = reviews.length;
  const avgRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
  ).toFixed(1);

  // Rating Distribution
  const starCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const handleReviewSubmit = () => {
    if (!reviewerName.trim()) {
      message.error('Please enter your name!');
      return;
    }
    if (!reviewComment.trim()) {
      message.error('Please write your review feedback!');
      return;
    }

    const newRevObj = {
      id: 'rev_' + Date.now(),
      userName: reviewerName.trim(),
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        reviewerName,
      )}`,
      rating: newRating,
      date: 'Just now',
      comment: reviewComment.trim(),
      helpfulCount: 0,
      verified: true,
    };

    const updated = [newRevObj, ...reviews];
    setReviews(updated);

    // Notify parent to update hero average rating & reviews count
    if (onRatingUpdate) {
      const updatedAvg = (
        updated.reduce((acc, curr) => acc + curr.rating, 0) / updated.length
      ).toFixed(1);
      onRatingUpdate(updatedAvg, updated.length);
    }

    message.success('Thank you! Your review has been published.');
    setShowModal(false);
    setReviewerName('');
    setReviewComment('');
    setNewRating(5);
  };

  const handleLike = (id) => {
    setHelpfulLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="flex flex-col gap-8 text-left">
      {/* ─── RATING OVERVIEW CARD ────────────────────── */}
      <div className="bg-[#faf8f5] rounded-2xl border p-6" style={{ borderColor: 'rgba(176,141,87,0.15)' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Big Score */}
          <div className="text-center md:border-r border-[#e8e4d9]/60 pr-4">
            <span className="text-5xl font-black block" style={{ color: 'var(--terracotta)', fontFamily: "'Outfit', sans-serif" }}>
              {avgRating}
            </span>
            <div className="my-2">
              <Rate disabled allowHalf value={parseFloat(avgRating)} style={{ color: 'var(--gold)', fontSize: 18 }} />
            </div>
            <span className="text-xs font-medium text-slate-500 block">
              Based on {totalReviews} verified reviews
            </span>
          </div>

          {/* Progress Bars */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = starCounts[stars] || 0;
              const percent = Math.round((count / totalReviews) * 100);
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-bold text-slate-600 flex items-center gap-1">
                    {stars} <StarFilled style={{ color: 'var(--gold)', fontSize: 11 }} />
                  </span>
                  <div className="flex-1 bg-[#e8e4d9]/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        background: 'linear-gradient(90deg, var(--terracotta), var(--gold))',
                      }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono text-slate-400">{percent}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write Review CTA Button */}
        <div className="mt-6 pt-5 border-t border-[#e8e4d9]/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">Have you used this service provider recently?</span>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setShowModal(true)}
            className="!rounded-xl !font-bold !text-xs !px-5 !shadow-sm hover:!shadow-md"
            style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
          >
            Write a Review
          </Button>
        </div>
      </div>

      {/* ─── REVIEWS LIST ─────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Customer Feedback
          <Tag className="!rounded-full !border-none !px-2.5 !py-0.5 !text-[10px] !font-bold !bg-[#f2efe8] !text-[#5c5650]">
            {totalReviews} Reviews
          </Tag>
        </h3>

        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl border p-5 shadow-2xs transition-all hover:border-[#c75b3a]/30"
            style={{ borderColor: 'rgba(176,141,87,0.12)' }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <Avatar src={rev.userAvatar} size={42} icon={<UserOutlined />} className="border border-[#e8e4d9]" />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-[#1c1917]">{rev.userName}</h4>
                    {rev.verified && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircleFilled style={{ fontSize: 10 }} /> Verified Client
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>
              </div>

              {/* Star Rating Badge */}
              <div className="bg-[#fffbeb] px-2.5 py-1 rounded-lg border border-amber-200/50 flex items-center gap-1">
                <StarFilled style={{ color: 'var(--gold)', fontSize: 12 }} />
                <span className="text-xs font-bold text-amber-700">{rev.rating}.0</span>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              "{rev.comment}"
            </p>

            {/* Helpful Like Counter */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t pt-2.5" style={{ borderColor: 'rgba(176,141,87,0.08)' }}>
              <span>Was this review helpful?</span>
              <button
                onClick={() => handleLike(rev.id)}
                className="flex items-center gap-1.5 text-xs font-semibold hover:text-[#c75b3a] transition-colors border-none bg-transparent cursor-pointer"
                style={{ color: 'var(--stone)' }}
              >
                <LikeOutlined /> Helpful ({rev.helpfulCount + (helpfulLikes[rev.id] || 0)})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─── WRITE REVIEW MODAL ───────────────────────── */}
      <Modal
        open={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
        centered
        width={480}
        className="!rounded-3xl overflow-hidden"
      >
        <div className="p-4 font-sans text-left">
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Write a Review
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Share your experience with <b>{serviceName}</b> to help others in the community.
          </p>

          <div className="flex flex-col gap-4">
            {/* Rating Selector */}
            <div className="text-center py-3 bg-[#faf8f5] rounded-xl border border-[#e8e4d9]/60">
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-2" style={{ color: 'var(--stone)' }}>
                Your Overall Rating
              </label>
              <Rate
                value={newRating}
                onChange={(val) => setNewRating(val)}
                style={{ color: 'var(--gold)', fontSize: 28 }}
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                Your Name
              </label>
              <Input
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Enter your full name"
                className="!rounded-xl !border-[#e8e4d9] !py-2.5 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
              />
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider mb-1.5" style={{ color: 'var(--stone)' }}>
                Your Feedback
              </label>
              <Input.TextArea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                placeholder="How was the quality of work, punctuality, and professionalism?"
                className="!rounded-xl !border-[#e8e4d9] hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="primary"
              size="large"
              onClick={handleReviewSubmit}
              className="w-full !rounded-xl !font-bold !py-5 !mt-2 !shadow-md hover:!shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Reviews;
