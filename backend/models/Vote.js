const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    selectedOption: { type: String, required: true },
    voterFingerprint: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

voteSchema.index({ pollId: 1, voterFingerprint: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
