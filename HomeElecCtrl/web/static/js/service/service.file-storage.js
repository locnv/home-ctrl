//@LOCN
/* global angular         */
/* global _global           */
/* global cordova         */
/* global FileError       */
/* global LocalFileSystem */
/* global Promise */
(function() {
  'use strict';

  angular.module(_global.AppName)
    .factory('FileStorage', ServiceImpl);

  ServiceImpl.$inject = [ 'LogService', 'Util'];

  function ServiceImpl(LogService, Util) {

    /* Global/Constant */
    let log = LogService;
    let util = Util;
    let ServiceName = 'file-storage';
    /* Local variables */

    let inst = {

      /* Get all files (by application) */
      getAllFiles: getAllFiles,
      /* Write object to file */
      writeToFile: writeToFile,

      /**
       * Read data from a specific file.
       *
       * The function execute reading and return to the caller a promise.
       * Once the read is ok, the text is converted to an json object
       * and will be resolved back to the caller.
       *
       * On a fail reading, the promise reject operator.
       *
       * @param fileName file name to be read
       * @return promise
       */
      readFromFile: readFromFile,

      /* Delete a file */
      deleteFile: deleteFile,

      /* Check if a file exist or not */
      checkFileExist: checkFileExist,

      /* Retrive application data location */
      getDataStorageLocation: getDataStorageLocation,

    };

    return inst;

    ////// Implementation

    /**
     * Retrive file entry
     * @param fileName
     * @returns {Promise}
     */
    function getFileEntry(fileName) {
      let promise = new Promise(function(resolve, reject) {

        let fGetStorageDirEntry = util.isBrowser() ? getFileSystem : getAppDataDir;

        fGetStorageDirEntry()
        .then(function(dirEntry) {
          dirEntry.getFile(fileName, { create: true, exclusive: false },
            function(fileEntry) {
              resolve(fileEntry);
            }, function onErrorCreateFile(err) {
              log.error(ServiceName, 'Error on creating file', err);
              reject(err);
            });
        })
        .catch(function(err) {
          log.error(ServiceName, 'Fail to get Storage Data entry', err);
          reject(err);
        });
      });

      return promise;
    }

    /**
     * On Browser (Chrome)
     * @returns {Promise}
     */
    function getFileSystem() {
      let promise = new Promise(function(resolve, reject) {

        let FileType = LocalFileSystem.PERSISTENT; //LocalFileSystem.TEMPORARY
        let FileSize = 5*1024*1024; // 1 Mb ?
        window.requestFileSystem(FileType, FileSize, function (fs) {
          resolve(fs.root);
        }, function onErrorLoadFs(err) {
          log.error(ServiceName, 'Fail to get FileSystemDir', err);
          reject(err);
        });
      });

      return promise;
    }

    /**
     * On Android n iOS
     * @returns {Promise}
     */
    function getAppDataDir() {
      let promise = new Promise(function(resolve, reject) {

        let path = cordova.file.dataDirectory;
        window.resolveLocalFileSystemURL(path, function(entry) {
          resolve(entry);
        }, function onError(err) {
          log.error(ServiceName, 'Fail to get AppDataDir', err);
          reject(err);
        });
      });

      return promise;
    }

    function getDataStorageLocation() {
      let promise = new Promise(function(resolve, reject) {
        let fGetStorageDirEntry = util.isBrowser() ? getFileSystem : getAppDataDir;
        fGetStorageDirEntry()
        .then(function(dirEntry) {
          resolve(dirEntry.toURL());
        })
        .catch(function(err) {
          resolve(null);
        });
      });

      return promise;
    }

    /**
     * Check if a file exist or not
     * @param fileName
     * @param fCallback
     */
    function checkFileExist(fileName, fCallback) {
      let path = getStoragePath() + fileName;
      window.resolveLocalFileSystemURL(path, function fileExist() {
        fCallback(true);
      }, function fileNotExist() {
        fCallback(false);
      });
    }

    function readFromFile(fileName) {
      let promise = new Promise(function(resolve, reject) {
        getFileEntry(fileName)
        .then(function(fileEntry) {
          return internal_read(fileEntry);
        })
        .then(function(text) {
          let readObj = null;

          if(text !== null && text !== undefined && text.length > 0) {
            try {
              readObj = JSON.parse(text);
            } catch (e) {
              log.warn(ServiceName, 'ReadFromFile>Failed to parse json', e.message, e.stack);
            }
          }

          resolve(readObj);
        })
        .catch(function(err) {
          log.error(ServiceName, 'Failed on reading file', err);
          reject('Failed on reading');
        });
      });

      return promise;
    }

    function internal_read(fileEntry) {
      let promise = new Promise(function(resolve, reject) {
        fileEntry.file(function onReachFile(file) {
          let reader = new FileReader();

          reader.onloadend = function() {
            resolve(this.result);
          };
          reader.onerror = function(err) {
            log.error(ServiceName, 'Failed to readAsText', err);
            reject('Failed to readAsText!');
          };

          reader.readAsText(file);
        }, function(err) {
          reject('Failed to get file.');
        });
      });

      return promise;
    }

    function getAllFiles() {
      let promise = new Promise(function(resolve, reject) {

        let fGetStorageDirEntry = util.isBrowser() ? getFileSystem : getAppDataDir;
        fGetStorageDirEntry()
        .then(internal_getAllFiles)
        .then(function(files) {
          resolve(files);
        })
        .catch(function(error) {
          reject(error);
        });
      });

      return promise;
    }

    function internal_getAllFiles(dirEntry) {
      let promise = new Promise(function(resolve, reject) {
        let reader = dirEntry.createReader();
        reader.readEntries(function(entries) {
          resolve(entries);
        }, function onError(err) {
          reject(err);
        });
      });

      return promise;
    }

    function writeToFile(fileName, objData) {
      let p1 = null;
      if(util.isBrowser()) {
        p1 = deleteFile(fileName);
      } else {
        p1 = new Promise(function(resolve1, reject1) {
          setTimeout(resolve1, 1);
        });
      }

      let promise = new Promise(function(resolve, reject) {

        p1.then(function(){
          log.debug(ServiceName, 'Write begin.');
          return getFileEntry(fileName);
        })
        .then(createFileWriter)
        .then(function(writer) {
          return internal_write(writer, objData);
        })
        .then(function(rs) {
          resolve(true);
        })
        .catch(function onFailToRequestFile(err) {
          log.error(ServiceName, 'Write failed!', err);
          reject(err);
        });
      });

      return promise;
    }

    function internal_write(writer, objData) {
      let promise = new Promise(function(resolve, reject) {

        writer.onwriteend = function() {
          log.debug(ServiceName, "internal_write>onWriteEnd");
          resolve(true);
        };
        writer.onerror = function onWriteFailed(err) {
          log.error(ServiceName, "internal_write>onError: ", err);
          reject(err);
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if(typeof objData === 'object') {
          objData = JSON.stringify(objData, null, '\t');
        }

        let blob = new Blob([objData], { type: 'application/json' });
        writer.write(blob);
      });

      return promise;
    }

    function deleteFile(fileName) {
      let promise = new Promise(function(resolve, reject) {
        getFileEntry(fileName)
        .then(internal_deleteFile)
        .then(function() {
          resolve(true);
        })
        .catch(function(err) {
          log.error(ServiceName, 'Fail to delete file', err);
          reject(err);
        });
      });

      return promise;
    }

    function internal_deleteFile(fileEntry) {
      let promise = new Promise(function(resolve, reject) {
        fileEntry.remove(function(file) {
          log.debug(ServiceName, 'File removed', fileEntry.name);
          resolve();
        }, function(err) {
          reject(err);
        });
      });

      return promise;
    }

    function createFileWriter(fileEntry) {
      let promise = new Promise(function(resolve, reject) {
        fileEntry.createWriter(resolve, function onError(err) {
          log.error(ServiceName, 'Failed to create FileWriter', err);
          reject(err);
        });
      });

      return promise;
    }

    /**
     * get default file path
     * @returns {*}
     * @private
     */
    function getStoragePath () {
      if (cordova && cordova.file && cordova.file.dataDirectory) {
        return cordova.file.dataDirectory;
      }

      return null;
    }

  }
})();
