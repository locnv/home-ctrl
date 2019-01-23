/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  let mongoose = require('mongoose');
  let ObjectId = mongoose.Schema.Types.ObjectId;

  const Model = {
    owner: {
      type: ObjectId,
      required: true,
    },
    id: String,
    name: String
  };

  module.exports = Model;

})();
