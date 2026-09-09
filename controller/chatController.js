let CHAT_MESSAGES = [
  {
    id: 'msg_1',
    bookingId: 'default',
    sender: 'provider',
    senderName: 'Rajesh Kumar (Electrician)',
    text: 'Hello! Thanks for reaching out to Khoj. I have reviewed your booking details.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'msg_2',
    bookingId: 'default',
    sender: 'user',
    senderName: 'Customer',
    text: 'Hi Rajesh! Please confirm if you will bring the wiring tools.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'msg_3',
    bookingId: 'default',
    sender: 'provider',
    senderName: 'Rajesh Kumar (Electrician)',
    text: 'Yes absolutely! I will carry all heavy-duty testing equipment and replacement fuses.',
    timestamp: new Date(Date.now() - 600000).toISOString(),
  },
];

const getMessages = (req, res) => {
  const { bookingId } = req.params;
  const messages = CHAT_MESSAGES.filter(m => m.bookingId === bookingId || m.bookingId === 'default');
  return res.status(200).json({
    success: true,
    data: messages,
  });
};

const sendMessage = (req, res) => {
  const { bookingId, sender, senderName, text } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, message: 'Message text is required' });
  }

  const newMsg = {
    id: 'msg_' + Date.now(),
    bookingId: bookingId || 'default',
    sender: sender || 'user',
    senderName: senderName || 'Customer',
    text,
    timestamp: new Date().toISOString(),
  };

  CHAT_MESSAGES.push(newMsg);

  return res.status(201).json({
    success: true,
    message: 'Message sent',
    data: newMsg,
  });
};

module.exports = {
  getMessages,
  sendMessage,
};
