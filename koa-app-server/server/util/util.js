/**
 * Created by locnv on 11/27/18.
 */

(function() {
  "use strict";

  const uuidv1 = require('uuid/v1');

  let Util = {
    generateUuid: generateUuid,
  };

  module.exports = Util;

  function generateUuid() {
    return uuidv1();
  }

})();
