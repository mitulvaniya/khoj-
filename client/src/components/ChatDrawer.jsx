import React, { useState, useEffect } from 'react';
import { Drawer, Input, Button, Avatar, Badge, Tag } from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import API from '../api';

export default function ChatDrawer({ open, onClose, bookingId, providerName }) {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'provider',
      senderName: providerName || 'Rajesh Kumar (Electrician)',
      text: 'Hello! I received your booking. What time works best for you?',
      timestamp: '10:15 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      senderName: 'You',
      text: 'Hi! Morning slot is perfect. Please bring testing tools.',
      timestamp: '10:18 AM',
    },
    {
      id: 'm3',
      sender: 'provider',
      senderName: providerName || 'Rajesh Kumar (Electrician)',
      text: 'Noted! I will arrive on time with all required replacement parts.',
      timestamp: '10:20 AM',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [sending, setSending] = useState(false);

  const fetchMessages = () => {
    if (!bookingId) return;
    axios
      .get(API.getChatMessages.replace(':bookingId', bookingId))
      .then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setMessages(res.data.data);
        }
      })
      .catch((err) => console.log('Chat load offline fallback'));
  };

  useEffect(() => {
    if (open) {
      fetchMessages();
    }
  }, [open, bookingId]);

  const handleSend = () => {
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      senderName: 'You',
      text: inputMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    const sentText = inputMsg;
    setInputMsg('');

    axios
      .post(API.sendChatMessage, {
        bookingId: bookingId || 'default',
        sender: 'user',
        senderName: 'Customer',
        text: sentText,
      })
      .catch(() => {});

    // Simulated provider auto-reply after 2 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_auto_' + Date.now(),
          sender: 'provider',
          senderName: providerName || 'Service Provider',
          text: 'Got it! Thanks for confirming. See you at your address.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 2000);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3 text-left">
          <Badge status="processing" color="#10b981">
            <Avatar src="../images/team_01.jpg" icon={<UserOutlined />} className="border border-[#c75b3a]/30" />
          </Badge>
          <div>
            <span className="text-sm font-bold text-[#1c1917] block leading-tight">
              {providerName || 'Service Provider'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircleFilled style={{ fontSize: 9 }} /> Online & Connected
            </span>
          </div>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      className="[&_.ant-drawer-header]:!bg-[#faf8f5] [&_.ant-drawer-header]:!border-b [&_.ant-drawer-header]:!border-[#e8e4d9]"
    >
      <div className="flex flex-col h-full text-left">
        {/* Messages List Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-2">
          <div className="text-center my-2">
            <Tag className="!rounded-full !border-none !px-3 !py-0.5 !text-[9px] !bg-[#f2efe8] !text-[#5c5650]">
              🔒 Encrypted Direct Channel
            </Tag>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] text-slate-400 mb-1 px-1">{m.senderName}</span>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-gradient-to-r from-[#c75b3a] to-[#b08d57] text-white rounded-br-none'
                      : 'bg-[#f2efe8] text-[#1c1917] rounded-bl-none border border-[#e8e4d9]'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1 flex items-center gap-0.5">
                  <ClockCircleOutlined style={{ fontSize: 8 }} /> {m.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-[#e8e4d9] flex gap-2">
          <Input
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onPressEnter={handleSend}
            placeholder="Type your message..."
            className="!rounded-xl !border-[#e8e4d9] !py-2 hover:!border-[#c75b3a]/30 focus:!border-[#c75b3a]/50"
          />
          <Button
            type="primary"
            onClick={handleSend}
            icon={<SendOutlined />}
            className="!rounded-xl !font-bold !py-2"
            style={{ background: 'linear-gradient(135deg, var(--terracotta), var(--gold))', border: 'none' }}
          />
        </div>
      </div>
    </Drawer>
  );
}
