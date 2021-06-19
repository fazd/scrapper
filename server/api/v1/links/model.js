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
  },
  store: {
    type: String,
    required: true,
  },
};

const link = new Schema(fields, { timestamps: true });

module.exports = {
  Model: mongoose.model('link', link),
  fields,
};
