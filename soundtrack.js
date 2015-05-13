function Soundtrack(game) {
	// Main game
	this.game = game;
	
	// Main theme object
	this.main_theme = null;
	
	this.main_theme_start = false;
};

Soundtrack.prototype.preload = function()
{
	// Load the main theme file
	this.game.load.audio('main_theme', '../Web-Deluxema/includes/Sounds/Music/[10] Voile Magic Library.mp3');
	
};

Soundtrack.prototype.create = function()
{
	// Create an instance of the main theme
	this.main_theme = this.game.add.audio('main_theme');
	
};

Soundtrack.prototype.update = function()
{
	if(main_game.game_state == state.MENU)
	{
		this.main_theme_start = false;
	}
	if(main_game.game_state == state.GAME && !this.main_theme_start)
	{
		this.main_theme_start = true;
		this.main_theme.loopFull(0.2);
	}
	
	if(main_game.game_state == state.RESULT)
	{
		this.main_theme.stop();
	}
};
	