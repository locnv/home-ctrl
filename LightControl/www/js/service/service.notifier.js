/* global angular */
/* global _global */
/* global cordova */
/* global $ */
(function() {
  'use strict';

  angular
    .module(_global.AppName)
    .factory('Notifier', ServiceImpl);

  ServiceImpl.$inject = [ 'LogService', 'Util' ];

  function ServiceImpl(LogService, Util) {

    /* Local variables */
    var mIsClosed = true;
    var mlogger = LogService;
    var mUtil = Util;

    // Native notifier
    var mSysNotifier = null;

    // Local notification
    var mLocalNotifier = null;

    /* Public interface */
    var services = {

      ////////////////////////////////////////////////////////////////
      //// ++ Web notifier
      ////////////////////////////////////////////////////////////////

      notify: notify,
      error: error,

      isClosed: isClosed,

      ////////////////////////////////////////////////////////////////
      //// -- Web notifier
      ////////////////////////////////////////////////////////////////


      ////////////////////////////////////////////////////////////////
      //// ++ Native notification
      ////////////////////////////////////////////////////////////////

      /**
       * Alert
       *
       * @param message: Dialog message. (String)
       * @param alertCallback: Callback to invoke when alert dialog is dismissed. (Function)
       * @param title: Dialog title. (String) (Optional, defaults to Alert)
       * @param buttonName: Button name. (String) (Optional, defaults to OK)
       */
      alert: alert,

      /**
       * Confirm
       *
       * @param message: Dialog message. (String)
       * @param confirmCallback: Callback to invoke with index of button pressed (1, 2, or 3)
       *        or when the dialog is dismissed without a button press (0). (Function)
       * @param title: Dialog title. (String) (Optional, defaults to Confirm)
       * @param buttonLabels: Array of strings specifying button labels.
       *        (Array) (Optional, defaults to [OK,Cancel])
       */
      confirm: confirm,

      /**
       * The promptCallback executes when the user presses one of the buttons in the prompt dialog box.
       * The results object passed to the callback contains the following properties:
       *
       * @param buttonIndex: The index of the pressed button. (Number) Note that the index uses 
       *    one-based indexing, so the value is 1, 2, 3, etc.
       * @param input1: The text entered in the prompt dialog box. (String)
       */
      prompt: prompt,

      /**
       * The device plays a beep sound.
       *
       * @param times: The number of times to repeat the beep. (Number)
       */
      beep: beep,

      ////////////////////////////////////////////////////////////////
      //// -- Native notification
      ////////////////////////////////////////////////////////////////


      ////////////////////////////////////////////////////////////////
      //// ++ Local notification
      ////////////////////////////////////////////////////////////////


      ////////////////////////////////////////////////////////////////
      //// -- Local notification
      ////////////////////////////////////////////////////////////////

      showLocalNotification: showLocalNotification,

    };

    return services;


    ////////////////////////////////////////////////////////
    //// Implementation.

    function notify(message) {
      return showNotifier(message, 'success');
    }

    function error(message) {
      return showNotifier(message, 'danger');
    }

    function showNotifier(message, type) {
      mIsClosed = false;
      return $.notify({ /* Options */
        message: message
      },{ /* Setting */
        type: type,
        placement: {
          from: "bottom",
          align: "right"
        },
        onClose: onNotifierClosed,
      });
    }

    function isClosed() {
      return mIsClosed;
    }

    function onNotifierClosed() {
      mIsClosed = true;
    }

    // Native notification

    /**
     * Alert
     *
     * @param message: Dialog message. (String)
     * @param alertCallback: Callback to invoke when alert dialog is dismissed. (Function)
     * @param title: Dialog title. (String) (Optional, defaults to Alert)
     * @param buttonName: Button name. (String) (Optional, defaults to OK)
     */
    function alert(message, fCallback, title, btnLabel) {
      checkSysNotifier();

      if(mSysNotifier === null) {
        error('System notification is not available!');
        return;
      }

      mSysNotifier.alert(message, fCallback, title, btnLabel);

    }

    function confirm(message, fCallback, title, btnLabels) {
      checkSysNotifier();

      if(mSysNotifier === null) {
        error('[notifier] > Confirm (failed)!');
        return;
      }

      mSysNotifier.confirm(message, fCallback, title, btnLabels);
    }

    function prompt(message, fCallback, title, btnLabels, defText) {
      checkSysNotifier();

      if(mSysNotifier === null) {
        error('[notifier] > prompt (failed)!');
        return;
      }

      mSysNotifier.prompt(message, fCallback, title, btnLabels, defText);
    }

    function beep(times) {
      checkSysNotifier();

      if(mSysNotifier === null) {
        error('[notifier] > Beep!');
        return;
      }

      mSysNotifier.beep(times);
    }

    function checkSysNotifier() {
      if(mSysNotifier === null) {
        mSysNotifier = (navigator && navigator.notification) ? navigator.notification : null;
      }
      return mSysNotifier;
    }

    // Implement Local Notification

    /**
     * Show a local notification
     * @param title title
     * @param message message
     */
    function showLocalNotification(title, message) {
      checkLocalNotificationPlugin();

      if(mLocalNotifier === null) {
        mlogger.warn('[notifier][local] Local notification plugin is not available!');
        return;
      }

      if(mUtil.isBrowser()) {
        mlogger.debug('[notifier][local]', title, message);
        mlogger.info('[notifier][local] Local notification is not supported on Browser platform!');
        return;
      }

      mLocalNotifier.schedule({
        title: title,
        text: message,
        foreground: true
      });

    }

    function checkLocalNotificationPlugin() {
      if(mLocalNotifier === null) {
        if(cordova.plugins.notification && cordova.plugins.notification.local) {
          mLocalNotifier = cordova.plugins.notification.local;
        }
      }

      return mLocalNotifier;
    }

  }
})();
