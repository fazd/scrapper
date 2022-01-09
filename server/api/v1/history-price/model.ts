const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  }
};

const references = {
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  }
};

const historyPrice = new Schema(Object.assign(fields, references), {
  timestamps: true,
});

module.exports = {
  Model: mongoose.model('history-price', historyPrice),
  fields,
  references,
};
