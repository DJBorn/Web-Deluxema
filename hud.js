function HUD(game) {
	this.game = game;
	
	this.style = null;
	
	this.title = null;
	this.fade = null;
	
	this.press_enter = null;
	this.controls = null;
	this.score = null;
	this.high_score = null;
	this.result = null;
	this.showing_results = false;
	this.result_fading = false;
	this.result_timer = false;
	this.sparkle = [];
	this.sparkle_timer = [];
	this.sparkling = [];
	this.sparkle_ref = [];
	this.sparkle_started = [];
	
	this.timer = null;
	
	this.start_sound = null;
	this.start_sound_played = false;
	
	this.enter_button = null;
};

HUD.prototype.toggle_enter = function()
{
	if(this.press_enter.text == "PRESS ENTER")
		this.press_enter.text = "";
	else
		this.press_enter.text = "PRESS ENTER";
};


HUD.prototype.preload = function()
{
	// Load the title screen
	this.game.load.image('title', '../Web-Deluxema/includes/Sprites/Effects/Deluxema.png');
	
	// Load the fade sprite
	this.game.load.image('fade', '../Web-Deluxema/includes/Sprites/Effects/Fade.png');
	
	// Load the sparkles
	this.game.load.spritesheet('sparkle', '../Web-Deluxema/includes/Sprites/Effects/Sparkle_82x82.png', 82, 82, 18);
	
	// Load the style
	this.style = { font: "24px pixel", fill: "white", align: "center" };
	this.result_style = { font: "60px pixel", fill: "black", align: "center" };
	
	// Create the timer for the explosions
	this.timer = this.game.time.create();
	
	// Set a TimerEvent to occur after 2 seconds
	this.timer.loop(500, this.toggle_enter, this);
	
	// Load the start sound effect
	this.game.load.audio('start_sound', '../Web-Deluxema/includes/Sounds/Effects/Start_Select.wav');
};

HUD.prototype.create = function()
{
	// Create the title
	this.title = this.game.add.sprite(this.game.world.centerX, 102, 'title');
	this.title.anchor.setTo(0.5, 0.5);
	
	// Create the fade sprite
	this.fade = this.game.add.sprite(0, 0, 'fade');
	this.fade.alpha = 0;
	
	// Create the sparkles
	this.sparkle[0] = this.game.add.sprite(276, 82, 'sparkle');
	this.sparkle[1] = this.game.add.sprite(700, 90, 'sparkle');
	this.sparkle[2] = this.game.add.sprite(440, 116, 'sparkle');
	
	// Add each sparkles animations and set their timer flag to false
	for(var i = 0; i < 3; i++)
	{
		this.game.physics.enable(this.sparkle[i], Phaser.Physics.ARCADE);
		this.sparkle[i].anchor.setTo(.5, .5);
		this.sparkle[i].animations.add('twinkle', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 
																							16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0], 50, false);
		this.sparkling[i] = false;
		this.sparkle_started[i] = false;
	}

	// Create the text handlers
	this.press_enter = this.game.add.text(this.game.world.centerX, 270, "PRESS ENTER", this.style);
	this.press_enter.anchor.setTo(0.5, 0.5);
	
	this.controls = this.game.add.text(this.game.world.centerX, 390, "Space: Jump  X: Attack  Arrows: Run", this.style);
	this.controls.anchor.setTo(0.5, 0.5);
	
	this.score = this.game.add.text(this.game.world.width/3, 0, "", this.style);
	this.score.anchor.setTo(0.5, 0);
	
	this.high_score = this.game.add.text(this.game.world.width/3*2, 0, "", this.style);
	this.high_score.anchor.setTo(0.5, 0);
	
	this.result = this.game.add.text(this.game.world.width/2, this.game.world.height/2, "", this.result_style);
	this.result.anchor.setTo(0.5, 0.5);
	
	// Create the start sound
	this.start_sound = this.game.add.audio('start_sound', 0.5);
	
	// Create the enter button handler
	this.enter_button = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
};

HUD.prototype.reset = function()
{
	this.start_sound_played = false;
	for(var i = 0; i < 3; i++)
	{
		this.sparkling[i] = false;
		this.sparkle_started[i] = false;
		this.sparkle[i].alpha = 1;
	}
	this.score.text = "";
	this.title.alpha = 1;
	this.controls.alpha = 1;
	this.press_enter.alpha = 1;
}

HUD.prototype.handle_sparkle = function()
{		
	for(var i = 0; i < 3; i++)
	{
		this.sparkle[i].angle += 8;
		if(!this.sparkling[i])
		{
			this.sparkling[i] = true;
			
			this.sparkle[i].exists = true;
			
			// Create the timer for the sparkle
			this.sparkle_timer[i] = this.game.time.create();
			
			// Set the delay of the sparkle
			this.sparkle_timer[i].add(this.game.rnd.between(2900 + i*1000, 3100 + i*1000), 
																function(i)
																{
																	this.sparkle_started[i] = true;
																	this.sparkle_ref[i] = this.sparkle[i].animations.play('twinkle');
																}, this, i);
			
			// Start the timer
			this.sparkle_timer[i].start();
		}
		else if(this.sparkle_started[i] && this.sparkle_ref[i].isFinished)
		{
			this.sparkling[i] = false;
			this.sparkle_started[i] = false;
		}
	}
}

HUD.prototype.update = function()
{
	this.timer.start();
	if(main_game.game_state == state.MENU)
	{
		if(typeof(Storage) !== "undefined")
		{
			if(localStorage.getItem("high_score") === null)
				localStorage.setItem("high_score", 0);
		}
		
		this.handle_sparkle();
		this.high_score.text = "High Score: " + localStorage.getItem("high_score");
		if(this.enter_button.isDown)
			main_game.game_state = state.EXPLOSION;
	}
	else if(main_game.game_state == state.EXPLOSION)
	{
		for(var i = 0; i < 3; i++)
		{
			this.sparkle[i].angle += 8;
			this.sparkle[i].alpha -= 0.02;
			if(this.sparkle[i].alpha <= 0)
				this.sparkle[i].alpha = 0;
		}
		if(!this.start_sound_played)
		{
			this.start_sound.play();
			this.start_sound_played = true;
		}
		this.title.alpha -= 0.02;
		this.press_enter.text = "PRESS ENTER";
		this.press_enter.alpha -= 0.02;
		if(this.title.alpha <= 0)
			this.title.alpha = 0;
		if(this.press_enter.alpha <= 0)
			this.press_enter.alpha = 0;
	}
	
	if(main_game.game_state == state.GAME)
	{
		this.score.text = "Score: " + main_game.game_score;
		if(main_game.game_score > 0)
		{
			this.controls.alpha -= 0.02;
			if(this.controls.alpha <= 0)
				this.controls.alpha = 0;
		}
	}
	if(main_game.game_state == state.GAMEOVER)
	{
		this.fade.alpha += 0.008;
		if(this.fade.alpha >= 1)
		{
			this.fade.alpha = 1;
			reset_game();
			main_game.game_state = state.RESULT;
			this.result.alpha = 1;
			this.high_score.text = "High Score: " + localStorage.getItem("high_score");
		}
	}
	if(main_game.game_state == state.RESULT)
	{
		this.result.text = "Your Score: " + main_game.game_score;
		
		if(!this.showing_results)
		{
			this.showing_results = true;
	
			// Create the timer for the dash
			this.result_timer = this.game.time.create();
			
			// Set the delay
			this.result_timer.add(3000, function(){this.result_fading = true;}, this);
			
			this.result_timer.start();
		}
		else if(this.result_fading)
		{
			this.fade.alpha -= 0.008;
			this.result.alpha -= 0.008;
			if(this.fade.alpha <= 0)
			{
				this.fade.alpha = 0;
				this.result.alpha = 0;
				this.result_fading = false;
				main_game.game_score = 0;
				main_game.game_state = state.MENU;
				this.showing_results = false;
			}
		}
	}
	
};