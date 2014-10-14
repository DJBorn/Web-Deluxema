
function Ace(game) {
	this.game = game;
	this.sprite = null;
	this.cursors = null;
	this.jump_button = null;
	this.attack_button = null;
	this.air_slicing = false;
	this.slicing = false;
	this.animation_ref = null;
};

Ace.prototype.preload = function() {
	// Load the sprite sheet of Ace
	this.game.load.spritesheet('ace', '../Web-Deluxema/includes/Sprites/Ace/Ace_SpriteSheet_252x120.png', 252, 120, 56);
};


Ace.prototype.create = function() {
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(500, 250, 'ace');
	
	this.sprite.anchor.setTo(.5, .5);
	
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	this.sprite.body.setSize(28, 76, 0, 0);
	this.game.physics.arcade.gravity.y = 3000;
	this.sprite.body.bounce.y = 0;
	this.sprite.body.gravity.y = 200;


	// Add the animations of Ace
	this.sprite.animations.add('stand', [2, 3, 4, 3, 2, 1, 0, 1], 8, true);
	
	this.sprite.animations.add('jump', [25], true);
	
	this.sprite.animations.add('hurt', [24], true);
	
	this.sprite.animations.add('slice', [5, 6, 7, 8, 9, 10, 11, 12, 13, 6], 25, false);
	
	this.sprite.animations.add('jump_slice', [26, 27, 28, 29, 30, 31, 32, 33, 26], 25, false);
	
	this.sprite.animations.add('run', [14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 15, true);
					
	this.sprite.animations.play('stand');
	
	this.cursors = this.game.input.keyboard.createCursorKeys();
	
	this.jump_button = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.attack_button = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
};

Ace.prototype.update = function() {
	// Collide ace with the platform
	this.game.physics.arcade.collide(this.sprite, level.platform);
	
	this.sprite.body.velocity.x = 0;
	
	// animation handler
	if(this.air_slicing)
	{
		if(this.animation_ref.isFinished || this.sprite.body.touching.down)
			this.air_slicing = false;
	}
	else if(this.slicing)
	{
		if(this.animation_ref.isFinished)
			this.slicing = false;
	}
	else if (!this.sprite.body.touching.down) 
	{
		if(this.attack_button.isDown)
		{
			this.animation_ref = this.sprite.animations.play('jump_slice');
			this.air_slicing = true;
		}
		else
			this.sprite.animations.play('jump');
	}
	else if (this.attack_button.isDown)
	{
		this.animation_ref = this.sprite.animations.play('slice');
		this.slicing = true;
	}
	else if(this.cursors.left.isDown)
	{
		this.sprite.animations.play('run');
	}
	else if(this.cursors.right.isDown)
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
		if(this.jump_button.isDown && this.sprite.body.touching.down){
			this.sprite.body.velocity.y = -900;
		}
	}
};