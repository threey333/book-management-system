const mongoose = require('mongoose');
const { getMeta, preSave } = require('../../helper')

const BookClassifySchema = new mongoose.Schema({
  title: String,

  meta: getMeta(),
});

BookClassifySchema.pre('save', preSave);

mongoose.model('BookClassify', BookClassifySchema);
