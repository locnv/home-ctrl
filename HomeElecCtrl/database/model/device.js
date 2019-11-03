/**
 * Created by locnv on 10/14/18.
 */

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const Model = {
  owner: {
    type: ObjectId,
    required: true
  },
  gw: {
    type: ObjectId,
    required: true
  },
  devType: String,
  id: String,
  name: String
};

module.exports = Model;
