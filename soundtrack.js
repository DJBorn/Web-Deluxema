function Soundtrack(game) {
	// Main game
	this.game = game;
	
	// Main theme object
	this.main_theme = null;
	
	this.main_theme_start = false;
	
	this.main_theme_fading = false;
};

Soundtrack.prototype.preload = function()
{
	// Load the sprite sheet of the mirror
	this.game.load.audio('main_theme', '../Web-Deluxema/includes/Sounds/Music/[10] Voile Magic Library.mp3');
	
};

Soundtrack.prototype.create = function()
{
	// Create an instance of the sprite using the ace sprite sheet
	this.main_theme = this.game.add.audio('main_theme');
	
};

Soundtrack.prototype.update = function()
{
	if(main_game.game_state == state.MENU)
	{
		this.main_theme_start = false;
		this.main_theme.fading = false;
	}
	if(main_game.game_state == state.GAME && !this.main_theme_start)
	{
		this.main_theme_start = true;
		this.main_theme.play('', 0, 0.2, true, true);
	}
	
	if(main_game.game_state == state.GAMEOVER && !this.main_theme_fading)
	{
		this.main_theme_fading = true;
		this.main_theme.fadeOut(2000);
	}
};
	