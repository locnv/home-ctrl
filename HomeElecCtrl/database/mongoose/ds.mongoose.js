/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  // Configuring the database
  const dbConfig = require('../db.config.js');
  const mongoose = require('mongoose');

  let MongooseDS = function() { };

  MongooseDS.prototype.initialize = initialize;


  async function initialize() {

    return new Promise(function(resolve) {
      // Connecting to the database
      mongoose.connect(dbConfig.url, {
        useNewUrlParser: true
      })
      .then(() => resolve(true))
      .catch(err => resolve(false));
    });
  }

  module.exports = MongooseDS;

})();
