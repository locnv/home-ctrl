/**
 * Created by locnv on 10/14/18.
 */

(function() {
  "use strict";

  const mongoose = require('mongoose');
  const ObjectId = mongoose.Types.ObjectId;
  const logger = require('../../util/logger');

  function DsBase() { }

  DsBase.prototype.toObjectId = function(stringId) {
    return new ObjectId(stringId);
  };

  DsBase.prototype.load = function(modelName, modelSchema) {

    this.mModelName = modelName;
    this.modelSchema = modelSchema;

    let ext = {
      timestamps: true,
    };

    let schema = mongoose.Schema(modelSchema, ext);
    this.model = mongoose.model(modelName, schema);
  };

  /**
   *
   * @param data
   * @return {Promise} resolve newly created object
   */
  DsBase.prototype.create = function(data) {
    let model = this.model;
    let promise = new Promise(function(resolve) {

      let dbObject = new model(data);

      dbObject.save()
      .then(function(obj) {
        resolve(obj);
      })
      .catch(function(err) {
        logger.error(err);
        resolve(new Error('Failed to create new entry'));
      });
    });

    return promise;
  };

  DsBase.prototype.deleteBy = function(filter) {
    let model = this.model;

    let promise = new Promise(function(resolve) {
      model.deleteOne(filter)
        .then(function(obj) {
          resolve(obj);
        })
        .catch(function(err) {
          logger.error(err);
          resolve(new Error('Failed to remove entry'));
        });
    });

    return promise;
  };

  /**
   *
   * @param id
   * @return {Promise} resolve deleted object
   */
  DsBase.prototype.delete = function(id) {
    let model = this.model;

    let promise = new Promise(function(resolve) {
      model.deleteOne({ _id: id })
      .then(function(obj) {
        resolve(obj);
      })
      .catch(function(err) {
        logger.error(err);
        resolve(new Error('Failed to remove entry'));
      });
    });

    return promise;

  };

  DsBase.prototype.update = function(doc) {

    let id = doc.id || doc._id;
    let criteria = { _id: id };

    let schema = this.modelSchema;
    let target = {};

    for(let key in schema) {
      if(!schema.hasOwnProperty(key) || !doc[key]) {
        continue;
      }

      target[key] = doc[key];
    }

    if(Object.keys(target).length === 0) {
      return Promise.resolve(new Error('Update failed: No property matched schema'));
    }

    let newValues = { $set: target };

    let model = this.model;

    let promise = new Promise(function(resolve) {
      model.updateOne(criteria, newValues)
      .then(function(updatedDoc) {
        resolve(updatedDoc);
      })
      .catch(function(err) {
        logger.error(err);
        resolve(new Error('Failed to update.'));
      });
    });

    return promise;

  };

  DsBase.prototype.find = function(criteria, projections) {
    let proj = projections || {};
    let model = this.model;
    let promise = new Promise(function(resolve) {
      model.find(criteria, proj)
      .then(function(docs) {
        resolve(docs);
      })
      .catch(function(err) {
        logger.error(err);
        resolve(new Error('Find error.'));
      });
    });

    return promise;
  };

  DsBase.prototype.findByIds = function(ids) {
    let model = this.model;
    let promise = new Promise(function(resolve) {
      let criteria = {
        _id: { $in: ids }
      };

      model.find(criteria)
        .then(function(docs) {
          resolve(docs);
        })
        .catch(function(err) {
          logger.error(err);
          resolve(new Error('Find error.'));
        });
    });

    return promise;
  };

  DsBase.prototype.count = function() {
    let model = this.model;
    let promise = new Promise(function(resolve) {
      model.count()
      .then(function(nb) {
        resolve(nb);
      })
      .catch(function(err) {
        logger.error(err);
        resolve(new Error('Count error.'));
      });
    });

    return promise;
  };

  DsBase.prototype.getAt = function(idx) {
    let model = this.model;
    let promise = new Promise(function(resolve) {
      model
        //.where('field1').gte(25)
        // .where().in([])
        .where({})
        .select()
        .skip(idx)
        .limit(1)
        //.asc('field1')
        .exec(function(err, ret) {
          resolve(ret);
        });
    });

    return promise;
  };

  DsBase.prototype.findOne = function(criteria) {
    let model = this.model;
    let promise = new Promise(function(resolve) {
      model.findOne(criteria)
        .then(function(doc) {
          resolve(doc);
        })
        .catch(function(err) {
          logger.error(err);
          resolve(new Error('FindOne error.'));
        });
    });

    return promise;
  };

  DsBase.prototype.findAll = function() {
    let model = this.model;
    let promise = new Promise(function(resolve) {
      model.find()
      .then(function(docs) {
        resolve(docs);
      })
      .catch(function(err) {
        logger.error(err);
        resolve(null);
      });
    });

    return promise;
  };

  DsBase.prototype.filter = function(cretial) {

  };

  module.exports = DsBase;

})();
