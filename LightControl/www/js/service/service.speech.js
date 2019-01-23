/*jshint esversion: 6 */
/* global angular */
/* global _global */
(function() {
  'use strict';

  angular.module(_global.AppName)
  .factory('Speech', ServiceImpl);

  ServiceImpl.$inject = [ 'LogService' ];

  function ServiceImpl( logger ) {

    var mInitialized = false;
    var mEnabled = false;

    var mOnSpeechRecognized = [];

    var recognition;
    var options = {
      language: 'en-US',
      matches: 5,
      prompt: '',      // Android only
      showPopup: false,  // Android only
      showPartial: false
    };

    var speechRecognition = window.plugins.speechRecognition;

    var inst = {
      initialize: initialize,
      setEnable: setEnable,
      isInitialized: isInitialized,
      addSpeechRecognized: addSpeechRecognized,
      removeSpeechRecognized: removeSpeechRecognized,
    };

    initialize()
    .then(logger.info.bind(null, ''));

    return inst;

    /**
     * Initialization
     *
     * @return {Promise}
     */
    function initialize() {
      var promise = new Promise(function(resolve, reject) {
        internal_initialize(resolve, reject);
      });

      return promise;
    }

    function internal_initialize(onDone) {
      if(mInitialized) {
        setTimeout(onDone, 1);
        return;
      }

      speechRecognition.isRecognitionAvailable(function onSuccess(ok) {
        logger.debug('SpeechRecognition.isRecognitionAvailable: ' + ok);
        mInitialized = ok;
        onDone();
      }, function onError(err) {
        onDone();
      });

    }

    function isInitialized() {
      return mInitialized;
    }

    function addSpeechRecognized(listener) {
      var idx = mOnSpeechRecognized.indexOf(listener);
      if(idx !== -1) {
        mOnSpeechRecognized[idx] = listener;
      } else {
        mOnSpeechRecognized.push(listener);
      }
    }

    function removeSpeechRecognized(listener) {
      var idx = mOnSpeechRecognized.indexOf(listener);
      if(idx === -1) {
        return;
      }

      mOnSpeechRecognized.splice(idx, 1);

    }

    function notifySpeechRecognized(rs) {
      for(var i = 0; i < mOnSpeechRecognized.length; i++) {
        var fn = mOnSpeechRecognized[i];
        fn.call(null, rs);
      }
    }

    function setEnable(enabled) {
      mEnabled = enabled;

      if(mEnabled) {
        enableSpeech();
      } else {
        disableSpeech();
      }

    }

    function enableSpeech() {
      mEnabled = true;

      speechRecognition.startListening(onRecognized, onStartError, options);
    }

    function onRecognized(terms) {
      logger.info(terms);
    }

    function onStartError(err) {
      logger.error('speech::start:error ', err);
    }

    function onStopError(err) {
      logger.error('speech::stop:error ', err);
    }

    function disableSpeech() {
      speechRecognition.stopListening(onStopSuccess, onStopError);
    }

    function onResult(event) {
      // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
      // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
      // It has a getter so it can be accessed like an array
      // The first [0] returns the SpeechRecognitionResult at position 0.
      // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
      // These also have getters so they can be accessed like arrays.
      // The second [0] returns the SpeechRecognitionAlternative at position 0.
      // We then return the transcript property of the SpeechRecognitionAlternative object

      /*var nbRs = event.results.length;
      for(var i = 0; i < nbRs; i++) {
        var rs = event.results[i][0];
        var speechResult = rs.transcript.toLowerCase();

        logger.debug('Result: ' + speechResult +' (Confidence: ' + rs.confidence+')');
      }*/

      var nbRs = event.results.length;
      var rs = event.results[nbRs-1][0];
      var speechResult = rs.transcript.toLowerCase();

      //logger.debug('Result: ' + speechResult +' (Confidence: ' + rs.confidence+')');

      notifySpeechRecognized(speechResult);
    }


  }
})();
