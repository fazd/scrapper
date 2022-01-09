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
  store: {
    type: String,
    required: true,
  },
};

const category = new Schema(fields, { timestamps: true });

module.exports = {
  Model: mongoose.model('category', category),
  fields,
};
