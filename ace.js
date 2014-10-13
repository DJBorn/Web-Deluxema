

function Ace(game) {
	this.game = game;
	this.sprite = null;
	this.cursors = null;
	
};

Ace.prototype.preload = function() {
	// Load the sprite sheet of Ace
	this.game.load.spritesheet('ace', '../Web-Deluxema/includes/Sprites/Ace/Ace_SpriteSheet_252x120.png', 252, 120, 56);
};


	
Ace.prototype.create = function() {
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(500, 250, 'ace');
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);


	// Add the animations of Ace
	this.sprite.animations.add('stand', [2, 3, 4, 3, 2, 1, 0, 1], 10, true);
	
	this.sprite.animations.add('slice', [5, 6, 7, 8, 9, 10, 11, 12, 13, 6], 10, true);
					
	this.sprite.animations.play('stand');
	
	this.cursors = this.game.input.keyboard.createCursorKeys();
};

Ace.prototype.update = function() {
	this.sprite.body.velocity.x = 0;

	if(this.cursors.left.isDown)
	{
		this.sprite.body.velocity.x = -150;
		this.sprite.animations.play('stand');
	}
	else if(this.cursors.right.isDown)
	{
		this.sprite.body.velocity.x = 150;
		this.sprite.animations.play('stand');
	}
	else
	{
		this.sprite.animations.play('slice');
	}
};