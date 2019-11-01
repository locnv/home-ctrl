/* global angular */
/* global device */
/* global _global */
(function() {
  'use strict';

  let device = {
    platform: 'browser'
  };

  // if(device === undefined) {
  //   let device = {
  //     platform: 'browser'
  //   }
  // }

  angular
    .module(_global.AppName)
    .factory('Util', Util);

  Util.$inject = [ ];
  function Util() {
    let mPlatform = null;

    let services = {
      Remote: {
        Host: 'http://localhost:1337',
      },
      stringToByteArray: stringToByteArray,
      hexStringToByteArray: hexStringToByteArray,
      isHexString: isHexString,
      isNullOrUndefined: isNullOrUndefined,
      isNullOrEmpty: isNullOrEmpty,
      standardizeUUID: standardizeUUID,
      replaceChar: replaceChar,
      byteArrayToU8: byteArrayToU8,
      compareVersionString: compareVersionString,
      /* Padding with NULL to fix a frame of 20 bytes */
      padNull: padNull,
      convertUint8ArrayToArray: convertUint8ArrayToArray,
      clone: clone,
      guid: guid,
      toHexString: toHexString,
      containsSpecialChars: containsSpecialChars,
      bytesToString: bytesToString,

      isAndroid: isAndroid,
      isIOS: isIOS,
      isBrowser: isBrowser,

      copy: copy

    };

    return services;


    function copy(dest, src, keys) {
      if(!src) {
        return dest;
      }

      if(!dest) {
        dest = {};
      }

      if(!keys) {
        keys = Object.keys(src);
      }

      for(let i = 0; i < keys.length; i++) {
        let key = keys[i];
        dest[key] = src[key];
      }
    }

    /**
     * Check if a string contains special characters.
     *
     * @param text
     * @returns {boolean}
     */
    function containsSpecialChars(text) {
      if(!text || text.length === 0) {
        return false;
      }

      //let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      let format = /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/;

      return format.test(text);
    }

    function bytesToString(bytes) {
      return String.fromCharCode.apply(null, bytes);
    }

    /**
     * Convert byte array to hex string.
     * @param bytes bytes array
     * @returns {string} hex string
     */
    function toHexString(bytes) {
      return Array.from(bytes, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('');
    }

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }


    function isAndroid() {
      if(mPlatform === null || mPlatform === undefined) {
        mPlatform = device.platform;
      }

      if(!mPlatform) {
        return false;
      }

      let tmp = mPlatform.toLowerCase();
      return tmp.indexOf('android') !== -1;
    }

    function isIOS() {
      if(mPlatform === null || mPlatform === undefined) {
        mPlatform = device.platform;
      }

      if(!mPlatform) {
        return false;
      }

      let tmp = mPlatform.toLowerCase();
      return tmp.indexOf('ios') !== -1;
    }

    function isBrowser() {
      if(mPlatform === null || mPlatform === undefined) {
        mPlatform = device.platform;
      }

      if(!mPlatform) {
        return false;
      }

      let tmp = mPlatform.toLowerCase();
      return tmp.indexOf('browser') !== -1;
    }

    function clone(obj) {
      let copy;

      // Handle the 3 simple types, and null or undefined
      if (null === obj || "object" !== typeof obj) {
        return obj;
      }

      // Handle Date
      if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
      }

      // Handle Array
      if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
          copy[i] = clone(obj[i]);
        }
        return copy;
      }

      // Handle Object
      if (obj instanceof Object) {
        copy = {};
        for(let attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = clone(obj[attr]);
          }
        }
        return copy;
      }

      throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function padNull(bytes, length) {
      let maxLength = length;
      let nbToPad = maxLength - bytes.length;
      if(nbToPad <= 0) {
        return bytes;
      }

      let NULL_VALUE = 0x00;
      //let result = Array.from(bytes);  /* Array.from not support for android 5. using slice instead*/
      let result = bytes.slice();
      for(let i = 0; i < nbToPad; i++) {
        result.push(NULL_VALUE);
      }

      return result;
    }

    // Return 1 if a > b
    // Return -1 if a < b
    // Return 0 if a == b
    function compareVersionString(v1, v2) {
      if (v1 === v2) {
        return 0;
      }

      let a_components = v1.split(".");
      let b_components = v2.split(".");
      let len = Math.min(a_components.length, b_components.length);

      // loop while the components are equal
      for (let i = 0; i < len; i++) {
        // A bigger than B
        if (parseInt(a_components[i]) > parseInt(b_components[i])) {
          return 1;
        }
        // B bigger than A
        if (parseInt(a_components[i]) < parseInt(b_components[i])) {
          return -1;
        }
      }
      // If one's a prefix of the other, the longer one is greater.
      if (a_components.length > b_components.length) {
        return 1;
      }

      if (a_components.length < b_components.length) {
        return -1;
      }

      // Otherwise they are the same.
      return 0;
    }

    function byteArrayToU8(bytes) {
      return bytes[0];
    }

    function replaceChar(text, search, replacement) {
      if (!text ) {
        return '';
      }
      return text.replace(new RegExp(search, 'g'), replacement).toLowerCase();
    }

    function standardizeUUID(uuid) {
      return uuid.replace(new RegExp('-', 'g'), '').toLowerCase();
    }

    function isNullOrUndefined(obj) {
      return (obj === null) || (obj === undefined);
    }

    function isNullOrEmpty(str) {
      return (isNullOrUndefined(str) || str.length === 0);
    }

    function stringToByteArray(text) {
      let bytes = [];
      let charCode;
      for (let i = 0; i < text.length; ++i)
      {
        charCode = text.charCodeAt(i);
        bytes.push(charCode);
      }

      return bytes;
    }

    function hexStringToByteArray(hexString) {
      let bytes = [];
      if(hexString.startsWith('0x')) {
        hexString = hexString.substr(2, hexString.length);
      }

      if(hexString.length % 2 === 1) {
        hexString = '0'+hexString;
      }

      for(let i = 0; i < hexString.length; i+=2) {
        let tmp = hexString.substr(i, 2);
        let b = parseInt(tmp, 16);
        bytes.push(b);
      }

      return bytes;
    }

    function isHexString(input) {
      if(typeof input !== 'string') {
        return false;
      }

      let tmp = input;

      if(tmp.startsWith('0x') || tmp.startsWith('0X')) {
        tmp = tmp.slice(2, tmp.length);
      }

      let hexRegEx = /([0-9]|[a-f])/gim;
      return (tmp.match(hexRegEx) || []).length === tmp.length;
    }

    /**
     * Convert UInt8Array object to array
     * let uint8ArrObject = {"0":40,"1":58,"2":129,"3":241,"4":174,"5":64,"6":64,"7":173,"8":23,"9":229,"10":48,"11":35,"12":238,"13":124,"14":176,"15":47,"16":212,"17":237,"18":224,"19":7}
     * @param UInt8Array
     */
    function convertUint8ArrayToArray(UInt8Array) {
      let result = [];

      let object = UInt8Array;

      for (let key in object) {
        if (object.hasOwnProperty(key)) {
          result.push(object[key]);
        }
      }

      return result;
    }

  }
})();
