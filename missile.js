function Missile(game)
{
	// Main game
	this.game = game;
	
	// Sprites
	this.sprite = null;
	this.warning = null;
	
	// Animation handlers
	this.firing = false;
	this.preparing = false;
	this.exploding = false;
	this.explode_playing = false;
	this.warned = false;
	this.destroyed = false;
	CC = null;
	this.exploding_ref = null;
	
	this.explosion = new Explosion(game);
	
	// Sounds
	this.warning_sound = null;
	this.explosion_sound = null;
	this.firing_sound = null;
	
	// Timer
	this.firing_timer = null;
	
	// Settings
	this.difficulty = 3000;
};

Missile.prototype.preload = function()
{
	// Load the sprite sheets
	this.game.load.spritesheet('missile', '../Web-Deluxema/includes/Sprites/Missile/Missile_Spritesheet_162x122.png', 162, 122, 17);
	
	this.game.load.spritesheet('warning', '../Web-Deluxema/includes/Sprites/Effects/Warning_Spritesheet_20x60.png', 20, 60, 2);

	// Load the sound effects
	this.game.load.audio('warning_sound', '../Web-Deluxema/includes/Sounds/Effects/Warning.wav');
	this.game.load.audio('explosion_sound', '../Web-Deluxema/includes/Sounds/Effects/Missile_Explosion.wav');
	this.game.load.audio('fire_sound', '../Web-Deluxema/includes/Sounds/Effects/Missile_Fire.wav');
	
	// Load the explosion
	this.explosion.preload();
};

Missile.prototype.create = function()
{
	// Create an instance of the sprite using the sprite sheet
	this.sprite = this.game.add.sprite(-100, 186, 'missile');
	this.warning = this.game.add.sprite(40, 156, 'warning');
	this.warning.exists = false;
	
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	// Set the anchor of the sprite to the center
	this.sprite.anchor.setTo(.5, .5);
	
	// Adjust the body size
	this.sprite.body.setSize(80, 24, 0, 0);

	this.sprite.scale.x = 1;


	// Add the animations
	this.sprite.animations.add('firing', [0, 1, 2, 3, 4], 5, true);
	
	this.sprite.animations.add('explode', [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 30, false);
	
	this.sprite.animations.add('destroyed', [16], true);
	
	this.warning.animations.add('warn', [0, 1], 5, true);
	
	// Add the sounds
	this.warning_sound = this.game.add.audio('warning_sound', 0.1);
	this.firing_sound = this.game.add.audio('fire_sound', 0.3);
	this.explosion_sound = this.game.add.audio('explosion_sound', 0.5);
	
	// Add the explosion
	this.explosion.create();
};

Missile.prototype.reset_missile = function()
{
	this.warned = false;
	this.preparing = false;
	this.firing = false;
	this.exploding = false;
	this.explode_playing = false;
	this.sprite.exists = false;
	this.destroyed = false;
	this.sprite.angle = 0;
	this.sprite.body.velocity.x = 0;
	this.sprite.body.velocity.y = 0;
	this.sprite.body.gravity.y = 0;
};

Missile.prototype.handle_firing = function()
{
	this.sprite.body.velocity.x = 0;
	if(this.exploding)
	{
		if(this.explode_playing && this.exploding_ref.isFinished)
		{
			this.reset_missile();
		}
		else if(!this.explode_playing)
		{
			this.explosion_sound.play();
			this.explode_playing = true;
			this.exploding_ref = this.sprite.animations.play('explode');
		}
	}
	else if(!this.warned)
	{
		this.warning_sound.onStop.addOnce(function() {
			this.warned = true;
			this.warning.exists = false;
			this.sprite.exists = true;
			this.firing_sound.play();
		}, this);
		this.sprite.x = -80;
		this.sprite.y = 186;
		this.warning.x = 40;
		this.warning.y = 156;
		if(this.sprite.scale.x == 1)
		{
			this.warning.x = 960;
			this.sprite.x = 1080;
		}
		this.warning.exists = true;
		this.warning.animations.play('warn');
	}
	else
	{
		this.sprite.animations.play('firing');
		this.sprite.body.velocity.x = 500 * this.sprite.scale.x * -1;
		
		if(Phaser.Rectangle.intersects(this.sprite.body, main_game.mirror.sprite.body))
		{
			this.exploding = true;
			main_game.mirror.life += 1;
		}
	}
}

Missile.prototype.in_game = function()
{
	if(this.firing)
	{
		if(!this.destroyed && this.warned && !this.exploding && Phaser.Rectangle.intersects(this.sprite.body, main_game.ace.attack.body) && main_game.ace.attacking)
		{
			this.destroyed = true;
			this.spin = 12 * main_game.ace.sprite.scale.x;
			this.sprite.body.gravity.y = 800;
			this.sprite.body.velocity.y = -400;
			this.sprite.body.velocity.x = 200 * main_game.ace.sprite.scale.x;
			this.explosion_sound.play();
			main_game.game_score++;
		}
		else if(this.destroyed)
		{
			// Play the explosion of the destroyed missile
			if(this.explosion.is_finished())
				this.explosion.initiate_explosion(this.sprite.body.x, 
																					this.sprite.body.x + this.sprite.body.width, 
																					this.sprite.body.y, 
																					this.sprite.body.y + this.sprite.body.height);
			this.explosion.update(this.sprite.body.x, 
														this.sprite.body.x + this.sprite.body.width, 
														this.sprite.body.y, 
														this.sprite.body.y + this.sprite.body.height);
														
			this.sprite.animations.play('destroyed');
			this.sprite.angle += this.spin;
			if(this.sprite.body.touching.down)
			{
				this.reset_missile();
			}
		}
		else
			this.handle_firing();
	}
	else if(!this.preparing)
	{
		this.preparing = true;
		
		this.firing_timer = this.game.time.create();
		this.firing_timer.add(this.game.rnd.between(this.difficulty, this.difficulty + 1000), 
													function(){
														this.firing = true;
														var direction = this.game.rnd.between(0, 1);
														if(direction)
															this.sprite.scale.x *= -1;
														this.warning_sound.play();
													}, 
													this);
		this.firing_timer.start();
	}
}

Missile.prototype.update = function()
{
	this.game.physics.arcade.collide(this.sprite, main_game.level.platform);
	if(main_game.game_state == state.GAME)
	{
		this.in_game();
	}
};