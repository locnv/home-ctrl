(function() {

  let logger = console;

  function runApp() {
    let n = 0;
    let allPromises = [];

    for(let i = 0; i < n; i++) {
      let p = createPromise();
      allPromises.push(p);
    }

    Promise.all(allPromises)
    .then(function() {
      logger.info('All finished.');
    });

    doAsync()
    .then(function() { logger.info('Ok, that sounds good'); });
  }

  function createPromise() {
    let d = Math.round(1000 + 10000* Math.random());
    let name = 'p-' + d;

    let p = new Promise(function(resolve) {
      logger.info(`${name} pending`);
      setTimeout(function() {
        logger.info(`${name} executed`);
        resolve(true);
      }, d);
    });

    return p;
  }

  async function doAsync() {
    let p = await createPromise();
    logger.info('Await returned a value ' + p);
  }


  setTimeout(runApp, 10);

})();