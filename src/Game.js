
BasicGame.Game = function (game) {
  // When a State is added to Phaser it automatically has the
  // following properties set on it, even if they already exist:
  this.game;       //  a reference to the currently running game
  this.add;        //  used to add sprites, text, groups, etc
  this.camera;     //  a reference to the game camera
  this.cache;      //  the game cache
  this.input;      //  the global input manager (you can access
                   //  this.input.keyboard, this.input.mouse, as well
                   //  from it)
  this.load;       //  for preloading assets
  this.math;       //  lots of useful common math operations
  this.sound;      //  the sound manager - add a sound, play one,
                   //  set-up markers, etc
  this.stage;      //  the game stage
  this.time;       //  the clock
  this.tweens;     //  the tween manager
  this.world;      //  the game world
  this.particles;  //  the particle manager
  this.physics;    //  the physics manager
  this.rnd;        //  the repeatable random number generator

 //  You can use any of these from any function within this State.
 //  But do consider them as being 'reserved words', i.e. don't create
 //  a property for your own game called "world" or you'll over-write
 //  the world reference.

};


BasicGame.Game.prototype = {

  create: function () {
	
	BasicGame.juicy = this.game.plugins.add(Phaser.Plugin.Juicy); //ekran sallama plugini
		
	this.game.physics.startSystem(Phaser.Physics.ARCADE);

	shot_sound = this.game.add.audio('missile_sound');
	shot_sound.volume=0.7;
	
	
	explosion_sound = this.game.add.audio('explosion_sound');
	music = this.game.add.audio('soundtrack');
	music.volume=0.2;
	music.play()
	this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;   //f e bastiğinda tam ekrana gec 
	fullButton = this.game.input.keyboard.addKey(Phaser.Keyboard.F);		
	fullButton.onDown.add(gofull, this);

	pauseButton = this.game.input.keyboard.addKey(Phaser.Keyboard.P);			//p e bastiğinda durdur
	pauseButton.onDown.add(gopause, this);
	
	restartButton = this.game.input.keyboard.addKey(Phaser.Keyboard.R);			//r e bastiğinda restart
	restartButton.onDown.add(BasicGame.restart, this);
		

	tile =this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'nebula_image');
	tile.autoScroll(-155, 0);
	debris =this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'debris_image');
	debris.autoScroll(-330, 0);
	
	this.game.input.addPointer();  //dokunmatik  
	
	BasicGame.stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' }); //oyun bitince
    BasicGame.stateText.anchor.setTo(0.5, 0.5);
    BasicGame.stateText.visible = false;

	
	BasicGame.hole.create();

	BasicGame.rocks.create();
	
	BasicGame.ship1.create();
	
	BasicGame.pups.create();
	
	
		//  The score
    BasicGame.ship1.scoreString = 'Score : ';
    BasicGame.ship1.scoreText = BasicGame.ship1.game.add.text(10, 10, BasicGame.ship1.scoreString + BasicGame.ship1.score, { font: '34px Arial', fill: '#fff' });
	
    BasicGame.explosions = this.game.add.group();
    BasicGame.explosions.createMultiple(30, 'explosion_image');
    BasicGame.explosions.forEach(setupInvader, this);
	
    var fullscreen =
      this.add.button(this.game.width-8, this.game.height-8,
                      'fullscreen',
                      BasicGame.toggleFullscreen,
                      this,
                      'over', 'up', 'down');
    fullscreen.pivot.x = fullscreen.width;
    fullscreen.pivot.y = fullscreen.height;
	
	var restartbut =
      this.add.button(this.game.width-98, this.game.height-8,
                      'fullscreen',
                      BasicGame.restart,
                      this,
                      'over', 'up', 'down');
    restartbut.pivot.x = restartbut.width;
    restartbut.pivot.y = restartbut.height;

  },

  update: function () {
		BasicGame.hole.update();
	
		BasicGame.rocks.update();

		BasicGame.ship1.update();
		
		BasicGame.pups.update();
		
		
		
		debris.autoScroll(-330, -BasicGame.ship1.sprite.body.velocity.y/3);
		this.game.physics.arcade.collide(BasicGame.rocks.rocks);
		this.game.physics.arcade.overlap(BasicGame.ship1.sprite, BasicGame.rocks.rocks, BasicGame.ship1.collisionHandler, null, this);
		this.game.physics.arcade.overlap(BasicGame.ship1.sprite, BasicGame.pups.shields, BasicGame.pups.shieldcollisionHandler, null, this);
		this.game.physics.arcade.overlap(BasicGame.ship1.sprite, BasicGame.pups.bullets, BasicGame.pups.bulletcollisionHandler, null, this);
		this.game.physics.arcade.overlap(BasicGame.ship1.bullets, BasicGame.rocks.rocks, BasicGame.rocks.collisionHandler, null, this);
		this.game.physics.arcade.overlap(BasicGame.ship1.sprite, BasicGame.hole.hole, BasicGame.hole.collisionHandler, null, this);
		
		var dist = this.game.physics.arcade.distanceToXY(BasicGame.ship1.sprite,0,this.game.height/2);
		if (dist < 150){
		
			BasicGame.stateText.text=" GAME OVER \n Click to restart";
			BasicGame.stateText.visible = true;                             //the "click to restart" handler
			this.game.input.onTap.addOnce(BasicGame.restart,this);

			BasicGame.ship1.sprite.scale.x *=0.99;
			BasicGame.ship1.sprite.scale.y *=0.99;
			BasicGame.ship1.sprite.body.velocity.x = -50;
			BasicGame.ship1.sprite.body.velocity.y = 0;
			if(BasicGame.ship1.sprite.scale.x <0.3 && BasicGame.ship1.sprite.alive){
		//  And create an explosion :)
				var explosion = BasicGame.explosions.getFirstExists(false);
				explosion.reset(BasicGame.ship1.sprite.body.x+35, BasicGame.ship1.sprite.body.y+35);
				explosion.play('explosion_image', 24, false, true);
				explosion_sound.play();
				BasicGame.ship1.sprite.kill();
			}
		}
		
		if ( dist< this.game.height/2+40 && dist > 150){
			if (BasicGame.cshake==0){
			BasicGame.cshake = 5
			BasicGame.juicy.jelly(BasicGame.ship1.sprite,0.2,0,0.9);
			BasicGame.juicy.shake(5,50);
			}
			else{
				BasicGame.cshake-=1;
			}
		}
		else{
		BasicGame.cshake = 5;
		}
  },
  
 /* render: function () {
	BasicGame.rocks.rocks.forEachAlive(renderGroup, this);
  },*/
  
  
  quitGame: function (pointer) {

    this.state.start('MainMenu');
  }

};

function renderGroup(member) {
    this.game.debug.body(member);
}
