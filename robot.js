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
	this.destroyed = false;
	this.animation_ref = null;
	this.dash_timer = null;
	
	this.dash_started = false;
	this.duration_started = false;
	
	this.explosion = new Explosion(this.game);
	
	
	// Sound handlers
	this.dash_sound = null;
	this.death_sound = null;
	this.dash_played = false;
	this.death_played = false;
	
};

Robot.prototype.preload = function() {

	// Load the sprite sheet of the robot
	this.game.load.spritesheet('robot', '../Web-Deluxema/includes/Sprites/Robot/Robot_Spritesheet_120x110.png', 120, 110, 13);
	
	// Load the explosion
	this.explosion.preload();
	
	// Load the sound effects of the robot
	this.game.load.audio('dash', '../Web-Deluxema/includes/Sounds/Effects/Robot/Robot_Dash.wav');
	this.game.load.audio('death', '../Web-Deluxema/includes/Sounds/Effects/Robot/Robot_Death.wav');
};

Robot.prototype.create = function() {
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(this.game.rnd.between(-300, -250) + (1550 * this.game.rnd.between(0, 1)), 390, 'robot');
	// this.game.rnd.between(
	
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	// Set the anchor of the sprite to the center
	this.sprite.anchor.setTo(.5, 1);
	
	
	// Adjust the body size
	this.sprite.body.setSize(26, 94, 0, 0);
	
	// Apply physics
	this.sprite.body.bounce.y = 0;
	this.sprite.body.gravity.y = 500;
	this.sprite.body.collideWorldBounds = false;
	this.sprite.scale.x = -1;


	// Add the animations of the robot
	this.sprite.animations.add('stand', [0, 1, 2, 1], 5, true);
	
	this.sprite.animations.add('boost', [3, 4, 5], 15, false);
	
	this.sprite.animations.add('dash', [6], true);
	
	this.sprite.animations.add('punch', [7, 8, 9, 10, 8, 9, 10, 8, 9, 10, 7], 10, false);
	
	this.sprite.animations.add('death', [11, 12], 5, true);
					
	this.sprite.animations.play('stand');	
	
	
	// Add the sound effects of the robot
	this.dash_sound = this.game.add.audio('dash', 0.3);
	this.death_sound = this.game.add.audio('death', 0.3);
	
	// Add the explosion
	this.explosion.create();
};

Robot.prototype.dash = function()
{
	if(!this.duration_started)
	{
		this.duration_started = true;
		
		// Create the timer for the dash duration
		this.dash_duration = this.game.time.create();
		
		// Set a TimerEvent to occur after 2 seconds
		this.dash_duration.add(this.game.rnd.between(1000, 1200), function(){this.duration_started = false; this.move = false; this.dashing = false; this.boosting = false; this.punching = false;}, this);
		
		this.dash_duration.start();
		//this.best = this.game.time.events.add(1000, function(){this.move = false; this.dashing = false; this.boosting = false; this.punching = false;}, this);
	}
	
	if(this.sprite.scale.x > 0)
		this.sprite.body.velocity.x = 350;
	else
		this.sprite.body.velocity.x = -350;
	
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

Robot.prototype.adjust_direction = function()
{
	// Set the default velocity to 0
	this.sprite.body.velocity.x = 0;
	if(!this.move)
	{
		if(this.sprite.body.x < main_game.ace.sprite.body.x)
			this.sprite.scale.x = 1;
		else
			this.sprite.scale.x = -1;
	}
}

Robot.prototype.update = function()
{
	// Collide the robot with the platform no matter what state
	this.game.physics.arcade.collide(this.sprite, main_game.level.platform);

	if(main_game.game_state == state.GAME)
	{	
		// Check if the robot was hit by ace
		if(Phaser.Rectangle.intersects(this.sprite.body, main_game.ace.attack.body) && main_game.ace.attack.exists && !this.destroyed)
		{
			this.sprite.body.velocity.y = -200;
			this.sprite.body.velocity.x = 250 * main_game.ace.sprite.scale.x;
			this.destroyed = true;
			this.death_sound.play();
			main_game.game_score++;
		}
		
		else if(this.destroyed)
		{
			this.sprite.animations.play('death');
			if(this.explosion.is_finished())
				this.explosion.initiate_explosion(this.sprite.body.x, 
																					this.sprite.body.x + this.sprite.body.width, 
																					this.sprite.body.y, 
																					this.sprite.body.y + this.sprite.body.height);
			this.explosion.update(this.sprite.body.x, 
														this.sprite.body.x + this.sprite.body.width, 
														this.sprite.body.y, 
														this.sprite.body.y + this.sprite.body.height);
			if(this.sprite.body.touching.down)
			{
				this.destroyed = false;
				this.move = false;
				this.sprite.body.x = this.game.rnd.between(-300, -250) + (1550 * this.game.rnd.between(0, 1));
			}
		}
		else
		{
			this.adjust_direction();
			if(!this.move)
			{
				this.sprite.animations.play('stand');
			
				if(!this.dash_started)
				{
					this.dash_started = true;
			
					// Create the timer for the dash
					this.dash_timer = this.game.time.create();
					
					// Set a TimerEvent to occur after 2 seconds
					this.dash_timer.add(this.game.rnd.between(3000, 5000), function(){this.dash_started = false; this.move = true; this.dash_sound.play(); }, this);
					
					this.dash_timer.start();
					//this.test = this.game.time.events.add(3000, function(){this.move = true;}, this);
				}
			}
			else
			{
				this.dash();
			}
		}
	}
};











