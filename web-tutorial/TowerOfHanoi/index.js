(function() {

  // global


  let canvas = document.getElementById('gameCanvas');
  let game = null;

  startGame();

  let btnStartAgain = document.getElementById('btnStartAgain');
  btnStartAgain.addEventListener('click', startGame);

  function startGame() {

    if(game !== null) {
      game.stop();
      game = null;
    }

    game = new Game(canvas);
    game.start();
  }

})();