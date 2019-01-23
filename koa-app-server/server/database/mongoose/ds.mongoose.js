/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  // Configuring the database
  const dbConfig = require('../../../config/db.config.js');
  const mongoose = require('mongoose');

  var MongooseDS = function() { };

  MongooseDS.prototype.initialize = initialize;


  async function initialize() {
    //mongoose.Promise = global.Promise;

    let promise = new Promise(function(resolve) {
      // Connecting to the database
      mongoose.connect(dbConfig.url, {
        useNewUrlParser: true
      }).then(() => {
        //console.log("Successfully connected to the database");
        resolve(true);
      }).catch(err => {
        //console.error('Could not connect to the database. Exiting now...', err);
        resolve(false);
      });
    });

    return promise;
  }

  module.exports = MongooseDS;

})();

