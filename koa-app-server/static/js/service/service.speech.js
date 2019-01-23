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

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    //var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    //var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

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

      mInitialized = true;
      setTimeout(onDone, 1);

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
      //var phrase = 'turn on the light';

      //var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
      recognition = new SpeechRecognition();
      //var speechRecognitionList = new SpeechGrammarList();
      //speechRecognitionList.addFromString(grammar, 1);
      //recognition.grammars = speechRecognitionList;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = true;

      recognition.start();

      recognition.onresult = onResult;
      recognition.onspeechend = onspeechend;
      recognition.onerror = onerror;
      recognition.onaudiostart = onaudiostart;
      recognition.onaudioend = onaudioend;
      recognition.onend = onend;
      recognition.onnomatch = onnomatch;
      recognition.onsoundstart = onsoundstart;
      recognition.onsoundend = onsoundend;
      recognition.onspeechstart = onspeechstart;
      recognition.onstart = onstart;

    }

    function disableSpeech() {
      recognition.stop();
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

    function onspeechend() {
      //recognition.stop();
      //testBtn.disabled = false;
      //testBtn.textContent = 'Start new test';
    }

    function onerror(event) {
      //testBtn.disabled = false;
      //testBtn.textContent = 'Start new test';
      //diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
      var error = event.error;
      logger.debug('SpeechRecognition.onerror: ' + event.error);
      if(error === 'no-speech') {
        mEnabled = false;
        setTimeout(enableSpeech, 2000);
      }
    }

    function onaudiostart(event) {
      //Fired when the user agent has started to capture audio.
      logger.debug('SpeechRecognition.onaudiostart');
    }

    function onaudioend(event) {
      //Fired when the user agent has finished capturing audio.
      logger.debug('SpeechRecognition.onaudioend');
    }

    function onend(event) {
      //Fired when the speech recognition service has disconnected.
      logger.debug('SpeechRecognition.onend');

      if(mEnabled) {
        setTimeout(enableSpeech, 2000);
      }
    }

    function onnomatch(event) {
      //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
      logger.debug('SpeechRecognition.onnomatch');
    }

    function onsoundstart(event) {
      //Fired when any sound — recognisable speech or not — has been detected.
      logger.debug('SpeechRecognition.onsoundstart');
    }

    function onsoundend(event) {
      //Fired when any sound — recognisable speech or not — has stopped being detected.
      logger.debug('SpeechRecognition.onsoundend');
    }

    function onspeechstart(event) {
      //Fired when sound that is recognised by the speech recognition service as speech has been detected.
      logger.debug('SpeechRecognition.onspeechstart');
    }

    function onstart(event) {
      //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
      logger.debug('SpeechRecognition.onstart');
    }

  }
})();
