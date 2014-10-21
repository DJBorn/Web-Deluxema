function Ace(game) {
	// Main game
	this.game = game;
	
	// Sprite holder
	this.sprite = null;
	
	// Attack hit box
	this.attack = null;
	
	// Input handlers
	this.cursors = null;
	this.jump_button = null;
	this.jump_button_pressed = false;
	this.attack_button = null;
	this.attack_button_pressed = false;
	this.enter_button = null;
	
	// Animation state handlers
	this.waking = false;
	this.preparing = false;
	this.air_slicing = false;
	this.slicing = false;
	this.portal_ref = null;
	this.waking_ref = null;
	this.preparing_ref = null;
	this.slicing_ref = null;
	this.air_slicing_ref = null;
	
	this.slice_timer = null;
	this.slice_timer_started = false;
	
	// Sound handlers
	this.jump_sound = null;
	this.slice_sound = null;
	this.portal_sound = null;
	this.portal_played = false;
	this.grab_played = false;
};

Ace.prototype.input = function(key)
{
	// Make sure the input can only be detected once on key down to prevent chained input events
	if(key == "x")
	{
		if(this.attack_button.isDown)
		{
			if(this.attack_button_pressed)
				return false;
			this.attack_button_pressed = true;
			return true;
		}
		this.attack_button_pressed = false;
		return false;
	}
	if(key == "z")
	{
		if(this.jump_button.isDown)
		{
			if(this.jump_button_pressed)
				return false;
			this.jump_button_pressed = true;
			return true;
		}
		this.jump_button_pressed = false;
		return false;
	}
};

Ace.prototype.preload = function() {
	// Load the sprite sheet of Ace
	this.game.load.spritesheet('ace', '../Web-Deluxema/includes/Sprites/Ace/Ace_SpriteSheet_252x120.png', 252, 120, 57);
	this.game.load.image('attack', '../Web-Deluxema/includes/Sprites/pixel.png');
	
	// Load the sound effects of Ace
	this.game.load.audio('jump', '../Web-Deluxema/includes/Sounds/Effects/Ace/Ace_Jump.wav');
	this.game.load.audio('slice', '../Web-Deluxema/includes/Sounds/Effects/Ace/Ace_Slice.wav');
	this.game.load.audio('portal', '../Web-Deluxema/includes/Sounds/Effects/Ace/Ace_Portal.wav');
};


Ace.prototype.create = function() {
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(498, 348, 'ace');
	
	// Create Ace's attack hit box
	this.attack = this.game.add.sprite(0, 0, 'attack');
	this.attack.scale.setTo(130, 80);
	
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.game.physics.enable(this.attack, Phaser.Physics.ARCADE);
	
	// Set the anchor of the sprite and attack to the center
	this.sprite.anchor.setTo(.5, .5);
	this.attack.anchor.setTo(.5, .5);
	
	this.attack.body.immovable = true;
	
	// Adjust the body size
	this.sprite.body.setSize(28, 76, 0, 0);
	
	// Apply physics
	this.sprite.body.bounce.y = 0;
	this.sprite.body.gravity.y = 3000;
	this.sprite.body.collideWorldBounds = true;
	this.sprite.scale.x = -1;


	// Add the animations of Ace
	this.sprite.animations.add('stand', [2, 3, 4, 3, 2, 1, 0, 1], 8, true);
	
	this.sprite.animations.add('jump', [25], true);
	
	this.sprite.animations.add('hurt', [24], true);
	
	this.sprite.animations.add('slice', [5, 6, 7, 8, 9, 10, 11, 12, 13, 6], 30, false);
	
	this.sprite.animations.add('jump_slice', [26, 27, 28, 29, 30, 31, 32, 33, 26], 30, false);
	
	this.sprite.animations.add('run', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 15, true);
	
	this.sprite.animations.add('sleeping', [34, 35], 1, true);
	
	this.sprite.animations.add('waking_up', [36, 37, 38, 39], 10, false);
	
	this.sprite.animations.add('sitting', [56], false);
	
	this.sprite.animations.add('standing_up', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55], 15, false);
					
	this.sprite.animations.play('stand');
	
	// Add the sound effects of Ace
	this.jump_sound = this.game.add.audio('jump', 0.5);
	this.slice_sound = this.game.add.audio('slice', 0.3);
	this.portal_sound = this.game.add.audio('portal', 0.3);
	
	// Create the input handlers
	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.jump_button = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.attack_button = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
	this.enter_button = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
};

// This function handles Ace when he is sleeping
Ace.prototype.sleeping = function()
{
	this.sprite.animations.play('sleeping');
	if(this.enter_button.isDown)
		main_game.game_state = state.EXPLOSION;
};

// This function handles Ace when he is waking up from the explosion
Ace.prototype.waking_up = function()
{
	if(this.waking)
		if(this.waking_ref.isFinished)
			this.sprite.animations.play('sitting');
	if(!this.waking)
	{
		this.waking_ref = this.sprite.animations.play('waking_up');
		this.waking = true;
	}
};

// This function handles Ace when he is standing up after the explosion
Ace.prototype.standing_up = function()
{
	if(this.preparing)
	{
		if(this.preparing_ref.isFinished)
			main_game.game_state = state.GAME;
		else if(this.preparing_ref.frame == 45 && !this.portal_played)
		{
			this.portal_played = true;
			this.portal_sound.play();
		}
		else if(this.preparing_ref.frame == 52 && !this.grab_played)
		{
			this.grab_played = true;
			this.jump_sound.play();
		}
	}
	if(!this.preparing)
	{
		this.preparing_ref = this.sprite.animations.play('standing_up');
		this.preparing = true;
	}
};


// This function handles Ace during gameplay
Ace.prototype.in_game = function()
{
	this.sprite.body.velocity.x = 0;
	this.attack.exists = false;
	
	// animation handler
	if(this.air_slicing)
	{
		if(this.air_slicing_ref.isFinished || this.sprite.body.touching.down)
		{
			this.air_slicing = false;
			this.slice_sound.pause();
		}
		else if(this.air_slicing_ref.frame == 28)
		{
			this.attack.x = this.sprite.x + 60 * this.sprite.scale.x;
			this.attack.y = this.sprite.y - 10;
			this.attack.exists = true;
		}
	}
	else if(this.slicing)
	{
		if(this.slicing_ref.isFinished)
		{
			this.slicing = false;
		}
		else if(this.slicing_ref.frame == 8)
		{
			this.attack.x = this.sprite.x + 60 * this.sprite.scale.x;
			this.attack.y = this.sprite.y - 10;
			this.attack.exists = true;
		}
	}
	else if (!this.sprite.body.touching.down) 
	{
		if(this.input("x"))
		{
			this.air_slicing_ref = this.sprite.animations.play('jump_slice');
			this.air_slicing = true;
			this.slice_sound.play();
		}
		else
			this.sprite.animations.play('jump');
	}
	else if (this.input("x"))
	{
		this.slicing_ref = this.sprite.animations.play('slice');
		this.slicing = true;
		this.slice_sound.play();
	}
	else if(this.cursors.left.isDown || this.cursors.right.isDown)
	{
		this.sprite.animations.play('run');
	}
	else
	{
		this.sprite.animations.play('stand');
	}
	
	
	// movement handler
	if(!this.slicing)
	{
		if(this.cursors.left.isDown)
		{
			this.sprite.body.velocity.x = -250;
			if(!this.air_slicing)
				this.sprite.scale.x = -1;
		}
		else if(this.cursors.right.isDown)
		{
			this.sprite.body.velocity.x = 250;
			if(!this.air_slicing)
				this.sprite.scale.x = 1;
		}
		if(this.input("z") && this.sprite.body.touching.down){
			this.sprite.body.velocity.y = -950;
			this.jump_sound.play();
		}
	}
};

Ace.prototype.update = function()
{
	// Collide ace with the platform no matter what state
	this.game.physics.arcade.collide(this.sprite, main_game.level.platform);
	if(main_game.game_state == state.GAME)
		this.in_game();
	else if(main_game.game_state == state.MENU)
		this.sleeping();
	else if(main_game.game_state == state.EXPLOSION)
		this.waking_up();
	else if(main_game.game_state == state.PREPARATION)
		this.standing_up();
};









