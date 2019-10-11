(function() {

  // global


  let canvas = document.getElementById('gameCanvas');
  let game = null;

  startGame();

  let btnStartAgain = document.getElementById('btnStartAgain');
  btnStartAgain.addEventListener('click', startGame);

  let btnSolve = document.getElementById('btnSolve');
  btnSolve.addEventListener('click', simulateSolution);

  function startGame() {

    if(game !== null) {
      game.stop();
      game = null;
    }

    let nbPiece = parseInt(document.getElementById('nbPieces').value);
    game = new Game(canvas, nbPiece);
    game.start();

    //setTimeout(game.resolveGame.bind(game), 2000);
  }

  function simulateSolution() {
    let lsSteps = document.getElementById('lsSteps');
    lsSteps.innerHTML = '';
    game.resolveGame(lsSteps);
  }

})();