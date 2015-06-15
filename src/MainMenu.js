
BasicGame.MainMenu = function(game) {

};

BasicGame.MainMenu.prototype = {

	create: function() {
	
		bot = this.game.add.sprite(0, 0, 'logo');
		bot.animations.add('run');
		bot.animations.play('run', 60, true)

		var button = this.add.button(this.game.width/2, 3.25*this.game.height/4,
										'start',
										function() {
										this.state.start("Game");
										},
										this,
										'over', 'up', 'down');
		button.pivot.x = button.width * .5;
		button.pivot.y = button.height * .5;
		
		var fullscreen =
			this.add.button(this.game.width-8, this.game.height-8,
							'fullscreen',
							BasicGame.toggleFullscreen,
							this,
							'over', 'up', 'down');
		fullscreen.pivot.x = fullscreen.width;
		fullscreen.pivot.y = fullscreen.height;
			
	

	},

};
