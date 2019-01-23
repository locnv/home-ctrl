/**
 * Created by locnv on 10/14/18.
 */

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const Model = {
  card: {
    type: ObjectId,
    required: true,
  },
  name: String,
  description: String,
  example: String
};

module.exports = Model;