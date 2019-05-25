/**
 *
 */

(function () {

    'use strict';

    const oxfordApi = require('./service.api.oxford-dic');
    const logger = require('../util/logger');

    function DicApi() { }

    DicApi.prototype.query = query;

    function query(wordId) {
        return oxfordApi.query(wordId);
    }

    module.exports = new DicApi();

})();
