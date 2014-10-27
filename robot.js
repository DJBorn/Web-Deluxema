function Robot(game) {
	// Main game
	this.game = game;
	
	// Determine if this robot is allowed to move
	this.active = false;
	
	// Sprite holder
	this.sprite = null;
	this.attack = null;
	
	// Animation state handlers
	this.move = false;
	this.dashing = false;
	this.boosting = false;
	this.hovering = false;
	this.punching = false;
	this.destroyed = false;
	this.punch_ref = null;
	this.boost_ref = null;
	this.dash_timer = null;
	
	this.attacking = false;
	
	this.first_dash = true;
	
	this.dash_started = false;
	this.duration_started = false;
	
	this.explosion = new Explosion(game);
	
	
	// Sound handlers
	this.dash_sound = null;
	this.death_sound = null;
	this.dash_played = false;
	this.death_played = false;
	
};

Robot.prototype.preload = function() {

	// Load the sprite sheet of the robot
	this.game.load.spritesheet('robot', '../Web-Deluxema/includes/Sprites/Robot/Robot_Spritesheet_120x110.png', 120, 110, 13);
	this.game.load.image('attack', '../Web-Deluxema/includes/Sprites/pixel.png');
	
	// Load the explosion
	this.explosion.preload();
	
	// Load the sound effects of the robot
	this.game.load.audio('dash', '../Web-Deluxema/includes/Sounds/Effects/Robot/Robot_Dash.wav');
	this.game.load.audio('death', '../Web-Deluxema/includes/Sounds/Effects/Robot/Robot_Death.wav');
};

Robot.prototype.create = function() {
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(-100 + (1200 * this.game.rnd.between(0, 1)), 390, 'robot');

	// Create the robot's attack hit box
	this.attack = this.game.add.sprite(0, 0, 'attack');
	this.attack.scale.setTo(70, 30);
	
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.game.physics.enable(this.attack, Phaser.Physics.ARCADE);
	
	// Set the anchor of the sprite to the center
	this.sprite.anchor.setTo(.5, 1);
	this.attack.anchor.setTo(.5, .5);
	
	
	// Adjust the body size
	this.sprite.body.setSize(26, 94, 0, 0);
	
	// Apply physics
	this.sprite.body.bounce.y = 0;
	this.sprite.body.gravity.y = 500;
	this.sprite.body.collideWorldBounds = false;
	this.sprite.scale.x = -1;


	// Add the animations of the robot
	this.sprite.animations.add('stand', [0, 1, 2, 1], 5, true);
	
	this.sprite.animations.add('boost', [3, 4, 5], 25, false);
	
	this.sprite.animations.add('dash', [6], true);
	
	this.sprite.animations.add('punch', [7, 8, 9, 10, 8, 9, 10, 7], 15, false);
	
	this.sprite.animations.add('death', [11, 12], 5, true);
					
	this.sprite.animations.play('stand');	
	
	
	// Add the sound effects of the robot
	this.dash_sound = this.game.add.audio('dash', 0.3);
	this.death_sound = this.game.add.audio('death', 0.3);
	
	// Add the explosion
	this.explosion.create();
};

Robot.prototype.reset = function()
{
	this.active = false;
	this.sprite.x = -100 + (1200 * this.game.rnd.between(0, 1));
	this.sprite.y = 390;
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
	this.first_dash = true;
};

Robot.prototype.dash = function()
{
	if(!this.duration_started)
	{
		this.duration_started = true;
		
		// Create the timer for the dash duration
		this.dash_duration = this.game.time.create();
		
		// Set a TimerEvent to occur between these times unless this is its first dash
		if(this.first_dash)
		{
			this.dash_duration.add(this.game.rnd.between(400, 600), function(){this.duration_started = false; this.move = false; this.dashing = false; this.boosting = false; this.punching = false;}, this);
			this.first_dash = false;
		}
		else
			this.dash_duration.add(this.game.rnd.between(1500, 2500), function(){this.duration_started = false; this.move = false; this.dashing = false; this.boosting = false; this.punching = false;}, this);
		
		this.dash_duration.start();
	}
	
	if(this.sprite.scale.x > 0)
		this.sprite.body.velocity.x = 300;
	else
		this.sprite.body.velocity.x = -300;
	
	if(this.punching)
	{
		if(this.punch_ref.isFinished)
		{
			this.sprite.animations.play('dash');
		}
		else if(8 <= this.punch_ref.frame && this.punch_ref.frame <= 10)
		{
			this.attacking = true;
		}
	}
	else if(this.dashing)
	{
		if(Math.abs(this.sprite.body.x - main_game.ace.sprite.body.x) < 150)
		{
			this.punch_ref = this.sprite.animations.play('punch');
			this.punching = true;
		}
	}
	else if(this.boosting && this.boost_ref.isFinished)
	{
		this.sprite.animations.play('dash');
		this.dashing = true;
	}
	if(!this.boosting)
	{
		this.boost_ref = this.sprite.animations.play('boost');
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
};

Robot.prototype.in_game = function()
{
	if(main_game.game_state == state.GAME || main_game.game_state == state.GAMEOVER)
	{	
		// Check if the robot was hit by ace
		if(Phaser.Rectangle.intersects(this.sprite.body, main_game.ace.attack.body) && main_game.ace.attacking && !this.destroyed)
		{
			this.sprite.body.velocity.y = -200;
			this.sprite.body.velocity.x = 250 * main_game.ace.sprite.scale.x;
			this.destroyed = true;
			this.first_dash = true;
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
				this.sprite.body.x = -100 + (1200 * this.game.rnd.between(0, 1));
			}
		}
		else
		{
			this.adjust_direction();
			if(!this.move)
			{
				this.sprite.animations.play('stand');
			
				if(!this.dash_started && main_game.game_state == state.GAME)
				{
					this.dash_started = true;
			
					// Create the timer for the dash
					this.dash_timer = this.game.time.create();
					
					// Set the delay so the robot will dash between 1 to 4 seconds
					this.dash_timer.add(this.game.rnd.between(1000, 4000), function(){this.dash_started = false; this.move = true; this.dash_sound.play(); }, this);
					
					this.dash_timer.start();
				}
			}
			else
			{
				this.dash();
			}
		}
	}
};

Robot.prototype.update = function()
{
	// Collide the robot with the platform no matter what state
	this.game.physics.arcade.collide(this.sprite, main_game.level.platform);
	this.attacking = false;
	
	// Update attack hitbox position
	this.attack.x = this.sprite.x + 10 * this.sprite.scale.x;
	this.attack.y = this.sprite.y - 62;
	
	if(this.active)
		this.in_game();
	
};











