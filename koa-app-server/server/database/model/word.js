/**
 * Created by locnv on 10/14/18.
 */

let mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId;

const Model = {
  card: {
    type: ObjectId,
    required: false,
  },
  name: String,
  type: String,
  pronunciation: String,
  descriptions: [ String ],
  examples: [ String ],
  imageUrl: String
};

module.exports = Model;