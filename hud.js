function HUD(game) {
	this.game = game;
	
	this.style = null;
	
	this.title = null;
	
	this.press_enter = null;
	this.controls = null;
	this.score = null;
	this.game_score = 0;
	
	this.timer = null;
	
	this.start_sound = null;
	this.start_sound_played = false;
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
	
	// Load the style
	this.style = { font: "24px pixel", fill: "white", align: "center" };
	
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
	this.title = this.game.add.sprite(this.game.world.centerX, 104, 'title');
	this.title.anchor.setTo(0.5, 0.5);

	// Create the text handlers
	this.press_enter = this.game.add.text(this.game.world.centerX, 260, "PRESS ENTER", this.style);
	this.press_enter.anchor.setTo(0.5, 0.5);
	
	this.controls = this.game.add.text(this.game.world.centerX, 390, "Z: Jump  X: Attack  Arrows: Run", this.style);
	this.controls.anchor.setTo(0.5, 0.5);
	
	this.score = this.game.add.text(this.game.world.centerX, 0, "", this.style);
	this.score.anchor.setTo(0.5, 0);
	
	// Create the start sound
	this.start_sound = this.game.add.audio('start_sound', 0.5);
};

HUD.prototype.update = function()
{
	this.timer.start();
	if(game_state == state.MENU)
	{
	}
	else if(game_state == state.EXPLOSION)
	{
		if(!this.start_sound_played)
		{
			this.start_sound.play();
			this.start_sound_played = true;
		}
		this.title.exists = false;
		this.press_enter.text = "";
		this.controls.text = "";
	}
	else
	{
		this.start_sound_played = false;
		this.title.exists = false;
		this.press_enter.text = "";
		this.controls.text = "";
	}
	
	if(game_state == state.GAME)
	{
		this.score.text = "Score: " + this.game_score;
	}
	
};