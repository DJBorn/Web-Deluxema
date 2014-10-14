var ace = null;
var level = null;

function deluxema(){
	var game = new Phaser.Game(1000, 400, Phaser.AUTO, 'stage', { preload: preload, create: create, update: update, render: render });
	


	function preload () {
      game.time.advancedTiming = true;
	
			level = new Level(game);
			level.preload();
			ace = new Ace(game);
			ace.preload();

	}

	function create () {
	
		level.create();
		ace.create();

	}
	
	function update () {
		ace.update();
	}
	
	function render () {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
		game.debug.body(ace.sprite);
		game.debug.body(level.platform);
	}
	

}