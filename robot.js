function Robot(game) {
	// Main game
	this.game = game;
	
	// Sprite holder
	this.sprite = null;
	
	// Animation state handlers
	this.move = false;
	this.dashing = false;
	this.boosting = false;
	this.hovering = false;
	this.punching = false;
	this.animation_ref = null;
	this.dash_timer = null;
	
	
	// Sound handlers
	this.dash_sound = null;
	this.death_sound = null;
	this.dash_played = false;
	this.death_played = false;
	
};

Robot.prototype.preload = function() {

	// Load the sprite sheet of the robot
	this.game.load.spritesheet('robot', '../Web-Deluxema/includes/Sprites/Robot/Robot_Spritesheet_120x110.png', 120, 110, 13);
	
	// Load the sound effects of the robot
	this.game.load.audio('dash', '../Web-Deluxema/includes/Sounds/Effects/Robot/Robot_Dash.wav');
	this.game.load.audio('death', '../Web-Deluxema/includes/Sounds/Effects/Robot/Robot_Death.wav');
};

Robot.prototype.create = function() {
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(20, 300, 'robot');
	// this.game.rnd.between(
	
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	// Set the anchor of the sprite to the center
	this.sprite.anchor.setTo(.5, 1);
	
	
	// Adjust the body size
	this.sprite.body.setSize(26, 94, 0, 0);
	
	// Apply physics
	this.sprite.body.bounce.y = 0;
	this.sprite.body.gravity.y = 3000;
	this.sprite.body.collideWorldBounds = false;
	this.sprite.scale.x = -1;


	// Add the animations of the robot
	this.sprite.animations.add('stand', [0, 1, 2, 1], 5, true);
	
	this.sprite.animations.add('boost', [3, 4, 5], 15, false);
	
	this.sprite.animations.add('dash', [6], true);
	
	this.sprite.animations.add('punch', [7, 8, 9, 10, 8, 9, 10, 7], 10, false);
	
	this.sprite.animations.add('death', [11, 12], 5, true);
					
	this.sprite.animations.play('stand');	
	
	
	// Add the sound effects of the robot
	this.dash_sound = this.game.add.audio('dash', 0.3);
	this.death_sound = this.game.add.audio('death', 0.3);
	
};

Robot.prototype.dash = function()
{
	// Create the timer for the dash duration
	//this.dash_duration = this.game.time.create();
	
	// Set a TimerEvent to occur after 2 seconds
	//this.dash_duration.loop(3000, function(){this.move = false; this.dash_duration.destroy(); this.dashing = false; this.boosting = false;}, this);
	
	//this.dash_duration.start();
	this.game.time.events.add(3000, function(){this.move = false; this.dashing = false; this.boosting = false; this.punching = false;}, this);
	
	if(this.sprite.scale.x > 0)
		this.sprite.body.velocity.x = 250;
	else
		this.sprite.body.velocity.x = -250;
	
	if(this.punching && this.animation_ref.isFinished)
	{
		this.sprite.animations.play('dash');
	}
		
	else if(this.dashing)
	{
		if(Math.abs(this.sprite.body.x - main_game.ace.sprite.body.x) < 100)
		{
			this.animation_ref = this.sprite.animations.play('punch');
			this.punching = true;
		}
	}
	else if(this.boosting && this.animation_ref.isFinished)
	{
		this.sprite.animations.play('dash');
		this.dashing = true;
	}
	if(!this.boosting)
	{
		this.animation_ref = this.sprite.animations.play('boost');
		this.boosting = true;
	}
};

Robot.prototype.update = function()
{
	// Collide the robot with the platform no matter what state
	this.game.physics.arcade.collide(this.sprite, main_game.level.platform);
	
	// Set the default velocity to 0
	this.sprite.body.velocity.x = 0;
	if(!this.move)
	{
		if(this.sprite.body.x < main_game.ace.sprite.body.x)
			this.sprite.scale.x = 1;
		else
			this.sprite.scale.x = -1;
	}
	if(main_game.game_state == state.GAME)
	{
		if(!this.move)
		{
			this.sprite.animations.play('stand');
		
			// Create the timer for the dash
			//this.dash_timer = this.game.time.create();
			
			// Set a TimerEvent to occur after 2 seconds
			//this.dash_timer.loop(3000, function(){this.move = true; this.dash_timer.destroy();}, this);
			
			//this.dash_timer.start();
			this.game.time.events.add(3000, function(){this.move = true;}, this);
		}
		else
		{
			this.dash();
		}		
	}
};











