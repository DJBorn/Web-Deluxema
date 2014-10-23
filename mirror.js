function Mirror(game) {
	// Main game
	this.game = game;
	
	// Sprite holder
	this.sprite = null;
	
	this.equilibrium = 192;
	this.frequency = 4;
	this.speed = 5;
	this.velocity = this.speed;
};

Mirror.prototype.preload = function()
{
	// Load the sprite sheet of the mirror
	this.game.load.spritesheet('mirror', '../Web-Deluxema/includes/Sprites/Mirror/Mirror_Spritesheet_138x162.png', 138, 162, 32);
	
};

Mirror.prototype.create = function()
{
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(500, this.equilibrium, 'mirror');
	
	this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	
	// Set the anchor of the sprite to the center
	this.sprite.anchor.setTo(.515, .5);
	
	this.sprite.body.immovable = true;
	
	// Adjust the body size
	this.sprite.body.setSize(68, 90, 0, 0);
	
	// Apply physics
	this.sprite.body.gravity.y = 0;

	// Add the animations of the Mirror
	this.sprite.animations.add('mirror1', [0, 1, 2, 3, 4, 3, 2, 1], 3, true);

	this.sprite.animations.add('mirror2', [5, 6, 7, 8, 9, 8, 7, 6], 3, true);

	this.sprite.animations.add('mirror3', [10, 11, 12, 13, 14, 13, 12, 11], 3, true);

	this.sprite.animations.add('mirror4', [15, 16, 17, 18, 19, 18, 17, 16], 3, true);

	this.sprite.animations.add('mirror5', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31], 3, false);
	
	this.sprite.animations.play('mirror1');
};

Mirror.prototype.oscillate = function()
{
	var center = this.sprite.body.y + this.sprite.body.height/2;
	if(center > this.equilibrium + this.frequency)
		this.velocity = this.speed * -1;
	else if(center < this.equilibrium - this.frequency)
		this.velocity = this.speed;
	this.sprite.body.velocity.y = this.velocity;
};

Mirror.prototype.update = function()
{
	this.oscillate();
};
	