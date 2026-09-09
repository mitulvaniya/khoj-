import React, { useState } from 'react';
import { Modal, Tabs, Input, Select, Button, Tag, notification } from 'antd';
import {
  CustomerServiceOutlined,
  PhoneOutlined,
  MessageOutlined,
  AlertOutlined,
  SafetyCertificateFilled,
  ClockCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

export default function HelpSupportModal({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('contact');
  const [category, setCategory] = useState('quality');
  const [description, setDescription] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [tickets, setTickets] = useState(() => {
    try {
      const saved = localStorage.getItem('khoj_support_tickets');
      return saved ? JSON.parse(saved) : [
        {
          id: 'TKT-8921',
          category: 'Service Quality',
          status: 'Resolved',
          date: 'Yesterday',
          desc: 'Technician arrived with appropriate tools and resolved AC dripping issue.',
        }
      ];
    } catch (e) {
      return [];
    }
  });

  const handleRaiseTicket = () => {
    if (!description.trim()) {
      notification.warning({ message: 'Please describe the issue you are experiencing.' });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const newTicket = {
        id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
        category: category === 'delay' ? 'Technician Delay'
          : category === 'refund' ? 'Billing / Refund'
          : category === 'safety' ? 'Safety Concern'
          : 'Service Quality & Warranty',
        status: 'Investigating (Escrow Protected)',
        date: 'Just now',
        bookingRef: bookingRef || 'General Inquiry',
        desc: description,
      };

      const updated = [newTicket, ...tickets];
      setTickets(updated);
      localStorage.setItem('khoj_support_tickets', JSON.stringify(updated));

      setDescription('');
      setBookingRef('');
      setSubmitting(false);
      setActiveTab('my_tickets');

      notification.success({
        message: 'Support Ticket Created!',
        description: `Ticket ${newTicket.id} logged. Our resolution desk will respond within 2 hours.`,
      });
    }, 600);
  };

  const triggerSOS = () => {
    notification.error({
      message: '🚨 Safety SOS Triggered!',
      description: 'Customer Safety Hotline alert sent. Emergency agent is connecting to your registered phone number.',
      duration: 6,
    });
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={onClose}
      centered
      width={560}
      className="!rounded-3xl overflow-hidden"
    >
      <div className="p-2 font-sans text-left">
        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-stone-200/80 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#c75b3a] to-[#b08d57] text-white flex items-center justify-center text-xl shadow-md">
            <CustomerServiceOutlined />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 m-0" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Khoj Care & Dispute Resolution
            </h2>
            <p className="text-xs text-stone-500 m-0">
              24x7 Doorstep Service Assurance & Rework Protection Desk
            </p>
          </div>
        </div>

        {/* SOS Emergency Banner */}
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center text-sm">
              <AlertOutlined />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-900 block">On-Site Safety Concern?</span>
              <span className="text-[10px] text-rose-700">Immediate doorstep escalation & supervisor alert</span>
            </div>
          </div>
          <button
            type="button"
            onClick={triggerSOS}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black cursor-pointer border-none shadow-sm transition-all"
          >
            Trigger SOS
          </button>
        </div>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="[&_.ant-tabs-nav]:!mb-4 [&_.ant-tabs-tab-active]:!text-[#c75b3a] [&_.ant-tabs-ink-bar]:!bg-[#c75b3a]"
        >
          {/* TAB 1: QUICK CONTACT */}
          <TabPane
            tab={<span className="font-bold text-xs flex items-center gap-1"><PhoneOutlined /> Quick Assist</span>}
            key="contact"
          >
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-base font-bold">
                    <PhoneOutlined />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">Toll-Free Helpline</span>
                    <span className="text-[11px] text-stone-500">1800-266-KHOJ (Available 24x7)</span>
                  </div>
                </div>
                <Tag className="!rounded-lg !bg-emerald-50 !border-emerald-200 !text-emerald-800 !font-bold !text-[10px]">
                  Toll Free
                </Tag>
              </div>

              <div className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-amber-300 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-base font-bold">
                    <MessageOutlined />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">WhatsApp Concierge</span>
                    <span className="text-[11px] text-stone-500">+91 98765 43210 (Instant Bot & Agent)</span>
                  </div>
                </div>
                <Tag className="!rounded-lg !bg-emerald-50 !border-emerald-200 !text-emerald-800 !font-bold !text-[10px]">
                  Online
                </Tag>
              </div>

              {/* Service Guarantee Card */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5">
                <SafetyCertificateFilled className="text-amber-600 text-base mt-0.5" />
                <div className="text-xs text-amber-950">
                  <span className="font-bold block mb-0.5">30-Day Khoj Service Guarantee</span>
                  <span>
                    If any delivered service does not meet quality expectations or issues resurface within 30 days, we assign a senior specialist for free rework or issue an escrow refund.
                  </span>
                </div>
              </div>
            </div>
          </TabPane>

          {/* TAB 2: RAISE A TICKET */}
          <TabPane
            tab={<span className="font-bold text-xs flex items-center gap-1"><FileTextOutlined /> Raise Dispute</span>}
            key="raise"
          >
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                  Issue Category
                </label>
                <Select
                  value={category}
                  onChange={setCategory}
                  className="w-full !rounded-xl"
                  size="large"
                >
                  <Option value="quality">🔧 Poor Service Quality / Rework Needed</Option>
                  <Option value="delay">⏱️ Technician Delayed / No Show</Option>
                  <Option value="refund">💵 Payment / Overcharging Dispute</Option>
                  <Option value="safety">🛡️ Safety / Unprofessional Conduct</Option>
                </Select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                  Booking Reference / Service (Optional)
                </label>
                <Input
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="e.g. bk_1788932805... or AC Repair"
                  className="!rounded-xl !py-2"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-stone-500 mb-1">
                  Describe the Issue
                </label>
                <TextArea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide details about what went wrong so our operations team can resolve this swiftly..."
                  className="!rounded-xl"
                />
              </div>

              <Button
                type="primary"
                size="large"
                loading={submitting}
                onClick={handleRaiseTicket}
                className="w-full !rounded-xl !font-bold !py-5"
                style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
              >
                Submit Resolution Ticket
              </Button>
            </div>
          </TabPane>

          {/* TAB 3: MY ACTIVE TICKETS */}
          <TabPane
            tab={
              <span className="font-bold text-xs flex items-center gap-1">
                <ClockCircleOutlined /> My Tickets ({tickets.length})
              </span>
            }
            key="my_tickets"
          >
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {tickets.length === 0 ? (
                <div className="py-8 text-center text-xs text-stone-400">
                  No active support tickets logged.
                </div>
              ) : (
                tickets.map((t) => (
                  <div key={t.id} className="p-3.5 rounded-2xl border border-stone-200 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#c75b3a]">{t.id}</span>
                        <span className="text-xs font-bold text-stone-800">{t.category}</span>
                      </div>
                      <Tag className="!rounded-md !border-none !text-[10px] !font-bold !bg-amber-100 !text-amber-900">
                        {t.status}
                      </Tag>
                    </div>
                    <p className="text-xs text-stone-600 m-0 mb-2">
                      {t.desc}
                    </p>
                    <div className="text-[10px] text-stone-400 flex items-center justify-between border-t pt-1.5">
                      <span>Ref: {t.bookingRef || 'General'}</span>
                      <span>Logged: {t.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
}
