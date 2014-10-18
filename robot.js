function Robot(game) {
	// Main game
	this.game = game;
	
	// Sprite holder
	this.sprite = null;
	
	// Animation state handlers
	this.animation_ref = null;
	
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
	
	this.sprite.animations.add('boost', [3, 4, 5], 10, true);
	
	this.sprite.animations.add('dash', [6], true);
	
	this.sprite.animations.add('punch', [7, 8, 9, 10, 8, 9, 10, 7], 15, true);
	
	this.sprite.animations.add('death', [11, 12], 5, true);
					
	this.sprite.animations.play('stand');
	
	// Add the sound effects of the robot
	this.dash_sound = this.game.add.audio('dash', 0.3);
	this.death_sound = this.game.add.audio('death', 0.3);
	
};

Robot.prototype.update = function()
{
	// Collide ace with the platform no matter what state
	this.game.physics.arcade.collide(this.sprite, main_game.level.platform);
	//if(main_game.game_state == state.GAME)
	//	this.in_game();
};











