/**
 * Created by locnv on 10/14/18.
 */

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const Model = {
  topic: {
    type: ObjectId,
    required: true,
  },
  word: {
    type: ObjectId,
    required: true,
  }
};

module.exports = Model;