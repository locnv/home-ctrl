/* global angular */
(function() {
  'use strict';

  angular.module('AppTest')
  .constant('AppConstants', {
    ENV_DEV: 'dev',
    ENV_PROD: 'prod',

    ENV: 'prod',              // ['dev'|'prod']
    APP_VERSION: '1.0.0',     // App's version
    AppName: 'AppTest',
    Identifier: 'locnv-agents',
    GW: 'home-npc-2018',

    /* Routes */
    Routes: {
      Home: '/test',
      Schedule: '/schedule',
      VoiceCtrl: '/voice-ctrl'
    },

    SwitchStatus: {
      Unknown: -1,
      On: 0,
      Off: 1
    },

    SwitchCommands: {
      TurnOn: 'turn-on',
      TurnOff: 'turn-off',
      Schedule: 'schedule',
      RmSchedule: 'remove-schedule'
    },

    LedCommands: {
      SetColor: 'set-color',
      SetMode: 'set-mode'
    },

    LedModes: {
      None: 0,
      Blink: 1,
      Chase: 2,
      Dim: 3
    },

    DeviceType: {
      Led: 'led',
      Switch: 'switch'
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
