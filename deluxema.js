var main_game = {
	ace: null,
	robots: [],
	level: null,
	hud: null,
	game_state: null,
	robot_amount: 5,
	game_score: 0
};

function deluxema(){
	var game = new Phaser.Game(1000, 400, Phaser.AUTO, 'stage', { preload: preload, create: create, update: update, render: render });

	function preload () {
		game.time.advancedTiming = true;
		game.stage.smoothed = false;
		main_game.game_state = state.MENU;
		
		main_game.level = new Level(game);
		main_game.level.preload();
		for(var i = 0; i < main_game.robot_amount; i++)
		{
			main_game.robots[i] = new Robot(game);
			main_game.robots[i].preload();
		}
		main_game.ace = new Ace(game);
		main_game.ace.preload();
		main_game.hud = new HUD(game);
		main_game.hud.preload();
	}

	function create () {
	
		main_game.level.create();
		for(var i = 0; i < main_game.robot_amount; i++)
		{
			main_game.robots[i].create();
		}
		main_game.ace.create();
		main_game.hud.create();
	}
	
	function update () {
		main_game.level.update();
		for(var i = 0; i < main_game.robot_amount; i++)
		{
			main_game.robots[i].update();
		}
		main_game.ace.update();
		main_game.hud.update();
	}
	
	function render () {
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
		game.debug.body(main_game.ace.sprite);
		game.debug.body(main_game.ace.attack);
		for(var i = 0; i < main_game.robot_amount; i++)
		{
			game.debug.body(main_game.robots[i].sprite);
			game.debug.body(main_game.robots[i].attack);
		}
		game.debug.body(main_game.level.platform);
	}
	

}