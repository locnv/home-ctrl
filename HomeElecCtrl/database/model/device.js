/**
 * Created by locnv on 10/14/18.
 */

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const Model = {
  id: String,
  name: String,
  devType: String,
  pins: Array
};

module.exports = Model;
