const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: false,
    trim: true,
  },
  store: {
    type: String,
    required: true,
  },
};

const product = new Schema(fields, { timestamps: true });

module.exports = {
  Model: mongoose.model('product', product),
  fields,
};
