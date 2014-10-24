function Explosion(game) {
	this.game = game;
	this.sprite = [];
	this.playing = [];
	this.animation_ref = [];
	this.sound = [];
	this.x1 = null;
	this.x2 = null;
	this.y1 = null;
	this.y2 = null;
};

Explosion.prototype.preload = function() {
	// Load the spritesheet for the explosion
	this.game.load.spritesheet('explosion', '../Web-Deluxema/includes/Sprites/Effects/Explosion_46x44.png', 46, 44, 9);
	
	// Load the explosion sound
	this.game.load.audio('bang', '../Web-Deluxema/includes/Sounds/Effects/Explosion.wav');
};

Explosion.prototype.is_finished = function() {
	for(var i = 0; i < 5; i++)
	{
		if(this.playing[i])
			return false;
	}
	return true;
};

Explosion.prototype.create = function() {
	
	// Create the explosions
	for(var i = 0; i < 5; i++)
	{
		this.sprite[i] = this.game.add.sprite(0, 0, 'explosion');
		this.game.physics.enable(this.sprite[i], Phaser.Physics.ARCADE);
		this.sprite[i].anchor.setTo(.5, .5);
		this.sprite[i].animations.add('explode', [0, 1, 2, 3, 4, 5, 6, 7, 8], 20, false);
		this.sprite[i].exists = false;
		this.playing[i] = false;
		this.sound[i] = this.game.add.audio('bang', 0.2);
	}
	
};

Explosion.prototype.initiate_explosion = function(x1, x2, y1, y2) {
	this.animation_ref[0] = this.sprite[0].animations.play('explode');
	this.sprite[0].exists = true;
	this.sprite[0].x = this.game.rnd.between(x1, x2);
	this.sprite[0].y = this.game.rnd.between(y1, y2);
	this.playing[0] = true;
	this.sound[0].play();
};

Explosion.prototype.play_explosion = function(x1, x2, y1, y2) {
	for(var i = 0; i < 5; i++)
	{
		if(this.playing[i])
		{
			if(this.animation_ref[i].isFinished)
			{
				this.sprite[i].exists = false;
				this.playing[i] = false;
			}
		}
	}
	for(var i = 0; i < 5; i++)
	{
		if(!this.playing[i] && this.playing[(i+1)%5] && this.animation_ref[(i+1)%5].frame == 3)
		{
			this.animation_ref[i] = this.sprite[i].animations.play('explode');
			this.sprite[i].exists = true;
			this.sprite[i].x = this.game.rnd.between(x1, x2);
			this.sprite[i].y = this.game.rnd.between(y1, y2);
			this.playing[i] = true;
			this.sound[i].play();
		}
	}
};

Explosion.prototype.update = function(x1, x2, y1, y2) {
	this.play_explosion(x1, x2, y1, y2);
};