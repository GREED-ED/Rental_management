const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Message = require('../models/message');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, async (req, res) => {
  try {
    const { receiver_id, property_id, message_text } = req.body;

    const message = await Message.create({
      sender_id: req.user._id,
      receiver_id,
      property_id,
      message_text
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Send failed', error: err.message });
  }
});

router.get('/:propertyId/:userId', auth, async (req, res) => {
  try {
    const { propertyId, userId } = req.params;

    const messages = await Message.find({
      property_id: propertyId,
      $or: [
        {
          sender_id: new mongoose.Types.ObjectId(req.user._id),
          receiver_id: new mongoose.Types.ObjectId(userId)
        },
        {
          sender_id: new mongoose.Types.ObjectId(userId),
          receiver_id: new mongoose.Types.ObjectId(req.user._id)
        }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

module.exports = router;
