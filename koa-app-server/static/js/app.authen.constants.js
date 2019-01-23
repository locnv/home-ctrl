/* global angular */
(function() {
  'use strict';

  angular.module('Authen')
  .constant('AppConstants', {
    ENV_DEV: 'dev',
    ENV_PROD: 'prod',

    ENV: 'prod',              // ['dev'|'prod']
    APP_VERSION: '1.0.0',     // App's version
    AppName: 'Authentication',

    /* Routes */
    Routes: {
      Home:               '/authen',
      SignUp:             '/signup',
      SignIn:             '/signin',
    },

    Footer: {
      /* Button Left index */
      Left: 0,
      /* Button Middle index */
      Middle: 1,
      /* Button Right index */
      Right: 2,
    },

  });
})();
