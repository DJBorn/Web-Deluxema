function Level(game) {
	this.game = game;
	this.platform = null;
};

Level.prototype.preload = function() {
	// Load the background for the level
	this.game.load.image('ace_house', '../Web-Deluxema/includes/Sprites/Map/Ace_House.png');
  this.game.load.image('ground', '../Web-Deluxema/includes/Sprites/Map/platform.png');
};


Level.prototype.create = function() {
	
	// Create the background image
	this.game.add.sprite(0, 0, 'ace_house');
	
	// Create the initial group that contains the ground
	this.platform = this.game.add.group();
	
	// Create the ground
	var ground = this.platform.create(-200, this.game.world.height - 14, 'ground');
	this.game.physics.enable(ground, Phaser.Physics.ARCADE);

	// Scale the size (initial image is a 1x1 block)
	ground.scale.setTo(1, 1);
	
	ground.body.allowGravity = false;

	// This stops it from falling away when you jump on it
	ground.body.immovable = true;
};

Level.prototype.update = function() {

};