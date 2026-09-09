const chat = require('express').Router();
const { getMessages, sendMessage } = require('../controller/chatController');

chat.route('/:bookingId').get(getMessages);
chat.route('/send').post(sendMessage);

module.exports = chat;
