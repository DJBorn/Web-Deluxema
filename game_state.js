var state = {
	MENU: "menu",
	EXPLOSION: "explosion",
	PREPARATION: "preparation",
	GAME: "game",
	GAMEOVER: "gameover",
	RESULT: "result"
};

function reset_game()
{
	main_game.mirror.life = 1;
	main_game.hud.reset();
	main_game.ace.reset();
	for(var i = 0; i < main_game.robot_amount; i++)
	{
		main_game.robots[i].reset();
	}
}

function adjust_difficulty()
{
	for(var i = 0; i < main_game.robot_amount; i++)
	{
		main_game.robots[i].active = false;
	}
	if(main_game.game_score == 0)
		main_game.missile.difficulty = 2000;
	if(main_game.game_score > 0)
	{
		main_game.robots[0].active = true;
		main_game.robots[1].active = true;
		main_game.robots[2].active = true;
	}
	if(main_game.game_score > 5)
		main_game.robots[3].active = true;
	if(main_game.game_score > 10)
		main_game.robots[4].active = true;
	if(main_game.game_score > 20)
	{
		main_game.missile.difficulty = 1800;
		main_game.robots[5].active = true;
	}
	if(main_game.game_score > 30)
		main_game.robots[6].active = true;
	if(main_game.game_score > 50)
	{
		main_game.missile.difficulty = 1600;
		main_game.robots[7].active = true;
	}
	if(main_game.game_score > 70)
		main_game.robots[8].active = true;
	if(main_game.game_score > 90)
		main_game.robots[9].active = true;
	if(main_game.game_score > 120)
	{
		main_game.missile.difficulty = 1400;
		main_game.robots[10].active = true;
	}
	if(main_game.game_score > 180)
	{
		main_game.missile.difficulty = 1200;
	}
	if(main_game.game_score > 260)
	{
		main_game.missile.difficulty = 1000;
	}
}
