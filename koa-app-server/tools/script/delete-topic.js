/**
 * Created by locnv on 10/14/18.
 */



var dbName = 'learn-voca';
var conn = new Mongo();
var db = conn.getDB(dbName);
var log = console.log;

//function showAllCollections() {
  db.collectionNames(function(err, collections) {
    if(err) {
      log(err);
      return;
    }

    log(collections);
  });
//}

//showAllCollections();


