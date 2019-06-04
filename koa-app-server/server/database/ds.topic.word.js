/**
 * Created by locnv on 10/14/18.
 */
(function() {
  "use strict";

  const DbBase = require('./mongoose/ds.base');
  const model = require('./model/topic.word');
  const Name = 'TopicWord';

  function DsTopicWord() {
    this.uber('constructor');
    this.load(Name, model);
  }

  DsTopicWord.inherits(DbBase);

  DsTopicWord.prototype.findWordsByTopic = function(topicId) {
    return this.uber('find', { topic: topicId });
  };

  module.exports = new DsTopicWord();

})();