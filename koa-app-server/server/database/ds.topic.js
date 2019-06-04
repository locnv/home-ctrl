/**
 * Created by locnv on 10/14/18.
 */
(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/topic');
  const Name = 'Topic';

  function DsTopic() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsTopic.inherits(DbBase);

  // DsTopic.prototype.findWordsByTopic = function(topicId) {
  //   return this.uber('find', { topic: topicId });
  // };

  module.exports = new DsTopic();

})();