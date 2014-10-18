var main_game = {
	ace: null,
	robots: null,
	level: null,
	hud: null,
	game_state: null
};

function deluxema(){
	var game = new Phaser.Game(1000, 400, Phaser.AUTO, 'stage', { preload: preload, create: create, update: update, render: render });

	function preload () {
      game.time.advancedTiming = true;
			game.stage.smoothed = false;
			main_game.game_state = state.MENU;
			
			main_game.level = new Level(game);
			main_game.level.preload();
			main_game.robots = new Robot(game);
			main_game.robots.preload();
			main_game.ace = new Ace(game);
			main_game.ace.preload();
			main_game.hud = new HUD(game);
			main_game.hud.preload();
	}

	function create () {
	
		main_game.level.create();
		main_game.robots.create();
		main_game.ace.create();
		main_game.hud.create();
	}
	
	function update () {
		main_game.level.update();
		main_game.robots.update();
		main_game.ace.update();
		main_game.hud.update();
	}
	
	function render () {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
		game.debug.body(main_game.ace.sprite);
		game.debug.body(main_game.robots.sprite);
		game.debug.body(main_game.level.platform);
	}
	

}