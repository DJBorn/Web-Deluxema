function Debris(game, amount, color) {
	this.game = game;
	this.amount = amount;
	this.sprites = [];
	this.color = color;
};

Debris.prototype.preload = function()
{
	this.game.load.image(this.color + '_debris', '../Web-Deluxema/includes/Sprites/Debris/' + this.color + '_debris.png');
};

Debris.prototype.create = function()
{
	// Create an instance of the sprite using the ace sprite sheet
	this.sprite = this.game.add.sprite(498, 348, 'ace');
	
	// Create Ace's attack hit box
	this.attack = this.game.add.sprite(0, 0, 'attack');
	this.attack.scale.setTo(130, 60);
	
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


};

Debris.prototype.update = function()
{
};