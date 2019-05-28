/* global angular */
(function() {
  'use strict';

  angular.module('LearnVoca')
  .constant('AppConstants', {
    ENV_DEV: 'dev',
    ENV_PROD: 'prod',

    ENV: 'prod',              // ['dev'|'prod']
    APP_VERSION: '1.0.0',     // App's version
    AppName: 'Learn Voca',

    /* Routes */
    Routes: {
      Home:               '/home',
      SignUp:             '/signup',
      SignIn:             '/signin',
      Card:               '/card',
      Word:               '/word',
      WordBuilder:        '/words-builder',
      TopicBuilder:       '/topic-builder',
      WordCreate:         '/word-create',
      About:              '/about',
      Setting:            '/setting',
      Test:               '/Test',
    },

    CfgKeys: {
      InstallTime: 'install-time',
      LastClick: 'last-click',
      LastShow: 'last-show',
    },

    Footer: {
      /* Button Left index */
      Left: 0,
      /* Button Middle index */
      Middle: 1,
      /* Button Right index */
      Right: 2,
    },

    /* Runtime Storage Keys */
    RtStorageKeys: {
      // List devices (runtime available)
      ListDev: 'rt-list-devs',
    },

    CharacteristicCfg: {
      DisFormat: {
        Hex: 0,
        Text: 1,
        Both: 2,
      }
    }

  });
})();
