/**
 * Created by locnv on 10/14/18.
 */

//let mongoose = require('mongoose');
//let ObjectId = mongoose.Schema.Types.ObjectId;

const Model = {
  name: String,         // en-en, vi-en, vi-ja ...
  description: String,  // A description
  lastUpdate: Date
};

module.exports = Model;