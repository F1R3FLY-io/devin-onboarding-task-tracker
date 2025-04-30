const mongoose = require('mongoose');

const RankingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['incremental', 'distributed'],
    default: 'distributed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('rankinglist', RankingListSchema);
