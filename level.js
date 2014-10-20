function Level(game) {
	this.game = game;
	this.house = null;
	this.house_breached = null;
	this.platform = null;
	this.explosion_left = new Explosion(this.game);
	this.explosion_right = new Explosion(this.game);
	this.timer = null;
	this.timer_begin = false;
};

Level.prototype.preload = function() {
	// Load the background for the level
	this.game.load.image('ace_house', '../Web-Deluxema/includes/Sprites/Map/Ace_House.png');
	this.game.load.image('ace_house_breached', '../Web-Deluxema/includes/Sprites/Map/Ace_House_Breached.png');
  this.game.load.image('ground', '../Web-Deluxema/includes/Sprites/Map/ground.png');
	this.explosion_left.preload();
	this.explosion_right.preload();
};


Level.prototype.create = function() {
	
	// Create the background image
	this.house = this.game.add.sprite(0, 0, 'ace_house');
	this.house_breached = this.game.add.sprite(0, 0, 'ace_house_breached');
	this.house_breached.exists = false;
	
	// Create the initial group that contains the ground
	this.platform = this.game.add.group();
	
	// Create the ground
	var ground = this.platform.create(-500, this.game.world.height - 14, 'ground');
	this.game.physics.enable(ground, Phaser.Physics.ARCADE);

	// Create the explosion for the initial animation
	this.explosion_left.create();
	this.explosion_right.create();
	
	// Create the timer for the explosions
	this.timer = this.game.time.create();
	
	// Set a TimerEvent to occur after 2 seconds
	this.timer.loop(2500, function(){main_game.game_state = state.PREPARATION;}, this);

	// Scale the size (initial image is a 1x1 block)
	ground.scale.setTo(1, 1);
	
	// the ground cannot be affected by gravity
	ground.body.allowGravity = false;

	// This stops it from falling away when you jump on it
	ground.body.immovable = true;
};

Level.prototype.update = function() {
	if(main_game.game_state == state.EXPLOSION)
	{
		// Start the timer
		this.timer.start();
			
		if(this.explosion_left.is_finished())
			this.explosion_left.initiate_explosion(0, 8, 152, 222);
		if(this.explosion_right.is_finished())
			this.explosion_right.initiate_explosion(0, 8, 152, 222);
		this.explosion_left.update(0, 8, 152, 222);
		this.explosion_right.update(992, 1000, 152, 222);
	}
	if(main_game.game_state == state.PREPARATION)
	{
		this.timer_began = false;
		this.house_breached.exists = true;
		this.house.exists = false;
	}
};