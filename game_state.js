var state = {
	MENU: "menu",
	EXPLOSION: "explosion",
	PREPARATION: "preparation",
	GAME: "game",
	GAMEOVER: "gameover"
};

function robot_activation()
{
	if(main_game.game_score > 3)
		main_game.robots[3].active = true;
	if(main_game.game_score > 5)
		main_game.robots[4].active = true;
	if(main_game.game_score > 7)
		main_game.robots[5].active = true;
	if(main_game.game_score > 9)
		main_game.robots[6].active = true;
	if(main_game.game_score > 11)
		main_game.robots[7].active = true;
	if(main_game.game_score > 13)
		main_game.robots[8].active = true;
	if(main_game.game_score > 15)
		main_game.robots[9].active = true;
	if(main_game.game_score > 17)
		main_game.robots[10].active = true;
}
