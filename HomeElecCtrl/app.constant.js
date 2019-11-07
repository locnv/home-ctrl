/**
 * Created by locnv on 11/4/18.
 */


(function() {
  "use strict";

  const mConst = {
    App: {
      Version: '0.0',
      Identifier: 'home-npc-2018',
      AccessToken: 'not-defined-yet'
    },

    Remote: {
      //Host: 'http://localhost:1337',
      Host: 'http://ec2-18-222-53-144.us-east-2.compute.amazonaws.com/',
    },

    DeviceType: {
      Led: 'led',
      Switch: 'switch'
    },

    DeviceError: {
      NoError: 0,     // OK

      DevExist: 1,    // Register device
      Unknown: 1001,  // Unknown error
    },

    // As server
    Server: {
      RespStatus: {
        Ok: 'ok',
        Nok: 'nok'
      }
    }

  };

  module.exports = mConst;

})();
