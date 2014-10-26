var main_game = {
	ace: null,
	robots: [],
	mirror: null,
	missile: null,
	level: null,
	hud: null,
	game_state: null,
	robot_amount: 15,
	game_score: 0,
	close: false
};
function close_deluxema() {
	main_game.close = true;
};

function deluxema(){
	var game = new Phaser.Game(1000, 400, Phaser.AUTO, 'stage', { preload: preload, create: create, update: update, render: render });
	
	function preload () {
		game.time.advancedTiming = true;
		game.stage.smoothed = false;
		main_game.game_state = state.MENU;
		
		main_game.level = new Level(game);
		main_game.level.preload();
		main_game.missile = new Missile(game);
		main_game.missile.preload();
		main_game.mirror = new Mirror(game);
		main_game.mirror.preload();
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

	function create ()
	{
		main_game.level.create();
		main_game.mirror.create();
		main_game.missile.create();
		for(var i = 0; i < main_game.robot_amount; i++)
		{
			main_game.robots[i].create();
		}
		main_game.ace.create();
		main_game.hud.create();
	}
	
	function update ()
	{
		if(main_game.close)
		{
			main_game.close = false;
			game.destroy();
		}
		adjust_difficulty();
		main_game.level.update();
		main_game.mirror.update();
		main_game.missile.update();
		for(var i = 0; i < main_game.robot_amount; i++)
		{
			main_game.robots[i].update();
		}
		main_game.ace.update();
		main_game.hud.update();
	}
	
	function render () {/*
    game.debug.text(game.time.fps, 2, 14, "#00ff00");
		game.debug.body(main_game.ace.sprite);
		game.debug.body(main_game.ace.attack);
		game.debug.body(main_game.mirror.sprite);
		game.debug.body(main_game.missile.sprite);
		for(var i = 0; i < main_game.robot_amount; i++)
		{
			game.debug.body(main_game.robots[i].sprite);
			game.debug.body(main_game.robots[i].attack);
		}*/
	}
}