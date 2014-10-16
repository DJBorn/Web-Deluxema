var ace = null;
var level = null;
var hud = null;
var game_state = null;

function deluxema(){
	var game = new Phaser.Game(1000, 400, Phaser.AUTO, 'stage', { preload: preload, create: create, update: update, render: render });

	function preload () {
      game.time.advancedTiming = true;
			game.stage.smoothed = false;
			game_state = state.MENU;
			
			level = new Level(game);
			level.preload();
			ace = new Ace(game);
			ace.preload();
			hud = new HUD(game);
			hud.preload();
	}

	function create () {
	
		level.create();
		ace.create();
		hud.create();
	}
	
	function update () {
		level.update();
		ace.update();
		hud.update();
	}
	
	function render () {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
		//game.debug.body(ace.sprite);
		game.debug.body(level.platform);
	}
	

}