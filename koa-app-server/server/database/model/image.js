/**
 * Created by locnv on 10/14/18.
 */

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const Model = {
  title: String,
  link: String,
  description: String,
  author: String,
  tags: [ String ],
  source: String
};

module.exports = Model;