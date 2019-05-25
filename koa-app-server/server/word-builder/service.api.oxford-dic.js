/**
 * https://developer.oxforddictionaries.com/documentation#!/Entries/get_entries_source_lang_word_id
 */

(function () {

    const http = require('https');
    const util = require('util');

    const app_id = "116d0175";                          // insert your APP Id
    const app_key = "ef07209303bd0a00df424a7f59ae7f40"; // insert your APP Key
    const fields = "pronunciations,definitions,examples";
    const strictMatch = 'false';
    const logger = require('../util/logger');

    ///api/v2/entries/en-us/' + wordId + '?fields=' + fields + '&strictMatch=' + strictMatch
    const ApiPathTemplate = '/api/v2/entries/%s/%s?fields=%s&strictMatch=%s';

    let options = {
        host: 'od-api.oxforddictionaries.com',
        port: '443',
        path: '', //'/api/v2/entries/en-us/' + wordId + '?fields=' + fields + '&strictMatch=' + strictMatch,
        method: 'GET',
        headers: { 'app_id': app_id, 'app_key': app_key }
    };

    function OxfordApi() { }

    OxfordApi.prototype.query = query;

    /**
     *
     * @param wordId
     * @returns {Promise<any>} result Word definition
     */
    function query(wordId) {

        options.path = util.format(ApiPathTemplate, 'en-us', wordId, fields, strictMatch);
        let body = '';

        let promise = new Promise(function(resolve, reject) {

            http.get(options, (resp) => {

                resp.on('data', (d) => { body += d });

                resp.on('end', () => {
                    try {
                        let respObj = JSON.parse(body);
                        let word = toWordDefinition(respObj);
                        resolve(word)
                    } catch (e) {
                        logger.error('An error occurs while parsing oxford result.', e);
                        logger.info('onerror -> ' + body);
                        reject(e);
                    }
                });

                resp.on('error', (err) => {
                    logger.error('Got server error during querying word data.', err);
                    reject(err);
                })
            })
            .on('error', function onHttpGetError(err) {
                logger.error('An error occurs while querying word from oxford dic.', err);
                reject(err);
            });
        });

        return promise;

    }

    function toWordDefinition(oxfordResp) {
        let results = oxfordResp.results;
        if(!Array.isArray(results) || results.length === 0) {
            return null;
        }

        let result = results[0];
        let lexicalEntries = result.lexicalEntries;
        if(!Array.isArray(lexicalEntries) || lexicalEntries.length === 0) {
            return null;
        }

        let lexicalEntry = lexicalEntries[0];
        if(lexicalEntry === null || lexicalEntry === undefined) {
            return null;
        }

        console.log('--------------------------------');
        console.log(JSON.stringify(lexicalEntry));
        console.log('--------------------------------');

        let entries = lexicalEntry.entries || [];
        let pronunciations = lexicalEntry.pronunciations || [];
        let category =  lexicalEntry.lexicalCategory;

        let firstEntry = entries[0] || {};
        let senses = firstEntry.senses || [];

        //let firstSenses = senses[0] || {};
        let firtPronunciation = pronunciations[0] || {};

        let definitions = [], sentences = [];
        senses.forEach(function(sense) {
            definitions = definitions.concat(sense.definitions);

            let examples = sense.examples || [];
            examples.forEach(function(ex) {
                sentences.push(ex.text);
            });
        });


        return {
            name: result.word,
            language: result.language,
            type: category.id,
            pronunciation: firtPronunciation.phoneticSpelling,
            descriptions: definitions,
            examples: sentences
        };
    }

    module.exports = new OxfordApi();

})();
