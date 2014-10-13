
function deluxema(){

	var game = new Phaser.Game(1000, 400, Phaser.AUTO, 'stage', { preload: preload, create: create, update: update, render: render });
	
	var ace = null;

	function preload () {
	

			game.load.image('logo', '../Web-Deluxema/includes/Sprites/Map/Ace_House.png');
			
			ace = new Ace(game);
			ace.preload();

	}

	function create () {
	

		var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		logo.anchor.setTo(0.5, 0.5);
		ace.create();

	}
	
	function update () {
		ace.update();
	}
	
	function render () {
	}


}