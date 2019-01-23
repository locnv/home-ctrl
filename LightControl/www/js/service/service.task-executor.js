/* global angular */
/* global _global */
(function() {
  'use strict';

  angular
  .module(_global.AppName)
  .factory('TaskExecutor', ServiceImple);

  ServiceImple.$inject = [ 'LogService', 'Util' ];
  function ServiceImple( LogService, Util) {
    /******************************************************************
    Class properties
    ******************************************************************/
    // Constants

    // Variables

    var logger = LogService;
    var util = Util;

    var mTasks = [];
    var mTimer = null;
    var mIsExecuting = false;

    /******************************************************************
    ** The declaration of the interface                              **
    ******************************************************************/
    var services = {

      executeTask: executeTask,
    };

    return services;


    /******************************************************************
    ** The definition of the BleService                              **
    ******************************************************************/

    /**
     * Schedule a task to be executed
     * @param task {Object}
     * task:
     *  fn {function} - function to execcute
     *  ctx {object} - fn context
     *  args {array} - arguments
     */
    function executeTask(task) {
      mTasks.push(task);

      executeNext();
    }

    function executeNext() {
      if(mIsExecuting === true) {
        return;
      }

      if(mTasks.length === 0) {
        return;
      }

      mIsExecuting = true;
      var task = mTasks.shift();
      var fn = task.fn;
      var ctx = task.ctx || null;
      var args = task.args;

      fn.apply(ctx, args);

      setTimeout(function() {
        mIsExecuting = false;
        executeNext();
      }, 200);
    }
  }
})();

