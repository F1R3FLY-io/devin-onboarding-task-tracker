const mongoose = require('mongoose');

const RankingItemSchema = new mongoose.Schema({
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rankinglist',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'task',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('rankingitem', RankingItemSchema);
