function setupInvader (invader) {
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('explosion_image');
}

function explode () {
	
	this.rex = this.rexp.create(this.rockp.x,this.rockp.y,'fire_ball');	
				this.rex.scale.set(1.5);
				this.rex.anchor.x= 0.5;
				this.rex.anchor.y= 1;
				this.rex.angle= 90;
				this.rex.checkWorldBounds =true;
				this.rex.outOfBoundsKill =true;
				this.rex.animations.add('run');
				this.rex.animations.play('run', 32, true);
				this.rex.body.velocity.x= this.rockp.body.velocity.x*2;
				this.rockp.body.velocity.x= this.rockp.body.velocity.x*2;
				this.rex.body.velocity.y= this.rockp.body.velocity.y;	
				BasicGame.juicy.jelly(this.rockp,0.2,0,0.5);
	
	
	var explosion = BasicGame.explosions.getFirstExists(false);
	explosion.reset(this.rockp.x,this.rockp.y);
	explosion.play('explosion_image', 24, false, true);
}


function gofull() {

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
    }
    else
    {
        this.game.scale.startFullScreen(false);
    }

}

function gopause() {

    if (this.game.paused==true)
    {
        this.game.paused=false;
    }
    else
    {
        this.game.paused=true;
		
    }

}


Ship = function(game,p_number) {
	this.score=0;
	this.scoreString='';
	this.scoreText='';
	this.fireButton = null;
	this.bullet=null;
    this.bullets=null;
    this.bulletTime = 0;
	this.bulletspeed = 600;
    this.game = game;
	this.p_number = p_number;
    this.sprite = null;
    this.cursors = null;
	this.thrust_sound=null;
	this.p_x=0;
	this.p_y=0;
	this.p_rot=0;
};
Ship.prototype = {
 
    preload: function () {
        this.game.load.spritesheet('ship_image', 'assets/double_ship.png', 90, 90);
    },
 
    create: function () {
			
		if(this.p_number==1)
			{this.cursors = this.game.input.keyboard.createCursorKeys();
			this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);}
		if(this.p_number==2)
			{
			this.cursors = {up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
							down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
							left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
							right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)};				
			this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			}
		this.sprite = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY, 'ship_image');
		this.thrust_sound = this.game.add.audio('ship_thrust_sound');
		this.sprite.anchor.set(0.5);
		this.game.physics.arcade.enable(this.sprite);
		this.sprite.body.setSize(70, 70, 0, 0);
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.bounce.set(0.8);
		this.sprite.body.maxVelocity.set(160);
		this.sprite.body.drag.set(50);
		this.bullets = this.game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(40, 'missile_image');
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
    },
 
    update: function() {
		
		if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown)
    {							
		if(this.p_x ==0){
        this.p_x=this.game.input.x;
		this.p_y=this.game.input.y;
		this.p_rot=this.sprite.rotation;
		}
		
		this.sprite.rotation = this.p_rot+(this.p_y-this.game.input.y)/180;
		this.game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 500, this.sprite.body.acceleration);
		
		if (BasicGame.shield){
			this.sprite.frame = 3;}	//gemi arkasindan alev}
		else
			{this.sprite.frame = 1;}
		
		if(this.thrust_sound.isPlaying){}	//gaz sesi
		else{this.thrust_sound.play();}	
    }
    else
    {
		this.p_x=0;
		this.p_y=0;
		
		this.sprite.body.angularVelocity = 0;
		this.sprite.body.velocity.x -= 5;
		if (this.sprite.body.velocity.x < -155)
		{this.sprite.body.velocity.x=-155;}
		
		this.sprite.body.acceleration.x=0;
		this.sprite.body.acceleration.y=0;
		this.sprite.frame = 0;
		this.sprite.animations.stop();
		this.thrust_sound.stop();
		
		if(BasicGame.shield){this.sprite.frame = 3;}
    }
	
	if (this.sprite.exists)
		{this.fireBullet();}  //sürekli ates et


    },
	
	fireBullet: function() {
		if (this.game.time.now > this.bulletTime)
		{
			this.bullet = this.bullets.getFirstExists(false);

			if (this.bullet)
			{	
				shot_sound.play();
				this.bullet.reset(this.sprite.body.x+35+(35*Math.cos(this.sprite.rotation)), this.sprite.body.y+35+(35*Math.sin(this.sprite.rotation)));
				this.bullet.lifespan = 1000;
				this.bullet.rotation = this.sprite.rotation;
				this.game.physics.arcade.velocityFromRotation(this.sprite.rotation, 600, this.bullet.body.velocity);
				this.bulletTime = this.game.time.now + this.bulletspeed;
        }
    }
	},
	
	collisionHandler: function(sprite,bullet) {
				
		if (BasicGame.shield){
			BasicGame.shield=false;
			bullet.kill();
			
			var explosion = BasicGame.explosions.getFirstExists(false);
			explosion.reset(bullet.body.x+35, bullet.body.y+35);
			explosion.play('explosion_image', 24, false, true);
		}
		else{
		//  When a bullet hits an alien we kill them both
		bullet.kill();
		sprite.kill();
				
		//  And create an explosion :)
		var explosion = BasicGame.explosions.getFirstExists(false);
		explosion.reset(sprite.body.x+35, sprite.body.y+35);
		explosion.play('explosion_image', 24, false, true);
				
		BasicGame.stateText.text=" GAME OVER \n Click to restart";
		BasicGame.stateText.visible = true;                             //the "click to restart" handler
		this.game.input.onTap.addOnce(BasicGame.restart,this);
		}

	}
	
};

Rock = function(game) {
	this.rock=null;
	this.rockp=null;
    this.rocks=null;
	this.rexp=null;
	this.rex=null;
    this.rockTime = 0;
	this.rexTime = 0;
    this.game = game;
	
};
Rock.prototype = {
 
    preload: function () {
        this.game.load.image('asteroid_image',"assets/asteroid.png");
		this.game.load.spritesheet('fire_ball', 'assets/fire_02.png', 128, 128);
		
    },
 
    create: function () {

		this.rocks = this.game.add.group();
		this.rocks.enableBody = true;
		this.rocks.physicsBodyType = Phaser.Physics.ARCADE;
		this.rocks.createMultiple(20, 'asteroid_image',0,false);
		
		this.rocks.setAll('anchor.x', 0.5);
		this.rocks.setAll('anchor.y', 0.5);
		
		this.rocks.setAll('checkWorldBounds', true);
		this.rocks.setAll('outOfBoundsKill', true);
		
		this.rocks.setAll('body.bounce.x', 1);
		this.rocks.setAll('body.bounce.y', 1);
		this.rocks.setAll('body.minBounceVelocity', 0);	
			
		
		this.rexp = this.game.add.group();
		this.rexp.enableBody = true;
		this.rexp.physicsBodyType = Phaser.Physics.ARCADE;
			
    },
 
    update: function() {
	
		if (this.game.time.now > this.rockTime+300)
		{
			this.rock = this.rocks.getFirstExists(false);
			if (this.rock)
			{				
				var y=this.game.world.randomY;
				this.rock.reset(this.game.world.width+200,y);
				this.rock.body.velocity.x= this.game.rnd.integerInRange(-400, -100);
				this.rock.body.velocity.y= this.game.rnd.integerInRange(-20, 20);
				this.rock.body.angularVelocity=Math.random() * 200 - 100;
				this.rockTime = this.game.time.now + 300;	
								
			}
		}
		
		if (this.game.time.now > this.rexTime+1900)
		{
			this.rockp = this.rocks.getRandom();
			BasicGame.juicy.jelly(this.rockp,0.2,0,0.9);
			if (this.rockp.exists){		
				this.game.time.events.add(2000, explode, this);
				this.rexTime = this.game.time.now + 2000;
				}
		}
    },
	
	collisionHandler: function(bullet,sprite) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
	sprite.kill();
	
	BasicGame.ship1.score += 20;
    BasicGame.ship1.scoreText.text = BasicGame.ship1.scoreString + BasicGame.ship1.score;
	
    //  And create an explosion :)
    var explosion = BasicGame.explosions.getFirstExists(false);
    explosion.reset(sprite.body.x+35, sprite.body.y+35);
    explosion.play('explosion_image', 24, false, true);
	explosion_sound.play();
	
	}
	
};

Hole = function(game) {
	this.b_hole=null;
    this.hole=null;
    this.game = game;
};
Hole.prototype = {
 
    preload: function () {
		this.game.load.image('black_hole',"assets/blackhole/2.png");
		this.game.load.image('hole',"assets/blackhole/p4.png");    },
 
    create: function () {
		
		this.b_hole = this.game.add.sprite(0,this.game.world.centerY , 'black_hole');
		this.b_hole.angle=90;
		this.b_hole.anchor.set(0.5);
		this.b_hole.scale.setTo(1.0, 2.0);
		this.game.physics.arcade.enable(this.b_hole);
		this.b_hole.body.setSize(this.b_hole.width/2, this.b_hole.height, 90, 0);
	
		this.hole = this.game.add.sprite(0,this.game.world.centerY , 'hole');
		this.hole.anchor.set(0.5);
		this.hole.scale.setTo(0.4, 0.4);	
		this.game.physics.arcade.enable(this.hole);
		
    },
 
    update: function() {
		this.b_hole.rotation += 0.01;
		this.hole.rotation += 0.01;
		
    }
	
};


Powerups = function(game) {
	this.shields=null;
	this.shield=null;
	this.bullets=null;
	this.bullet=null;
    this.game = game;
	this.pupTime = 0;
};
Powerups.prototype = {
 
    preload: function () {
        this.game.load.image('shield', 'assets/shield_silver.png');
		this.game.load.image('bolt', 'assets/powerupRed_bolt.png');				
    },
 
    create: function () {	
		this.shields = this.game.add.group();
		this.bullets = this.game.add.group();
		this.shields.enableBody = true;
		this.bullets.enableBody = true;
		this.shields.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.shields.createMultiple(10, 'shield',0,false);
		this.bullets.createMultiple(10, 'bolt',0,false);
		this.shields.setAll('anchor.x', 0.5);
		this.shields.setAll('anchor.y', 0.5);
		this.bullets.setAll('anchor.x', 0.5);
		this.bullets.setAll('anchor.y', 0.5);
		this.shields.setAll('checkWorldBounds', true);
		this.shields.setAll('outOfBoundsKill', true);
		this.shields.setAll('body.bounce.x', 1);
		this.shields.setAll('body.bounce.y', 1);
		this.shields.setAll('body.minBounceVelocity', 0);	
		this.bullets.setAll('checkWorldBounds', true);
		this.bullets.setAll('outOfBoundsKill', true);
		this.bullets.setAll('body.bounce.x', 1);
		this.bullets.setAll('body.bounce.y', 1);
		this.bullets.setAll('body.minBounceVelocity', 0);					
    },
 
    update: function() {
	
		if (this.game.time.now > this.pupTime+500)
		{
			var rrr = Math.random();
			if (rrr>0.5){ 
				this.shield = this.shields.getFirstExists(false);
				if (this.shield)
				{				
					var y=this.game.world.randomY;
					this.shield.reset(this.game.world.width+100,y);
					this.shield.body.velocity.x= this.game.rnd.integerInRange(-60, -40);
					this.shield.body.velocity.y= 0;				
				}
			}
			else{
				this.bullet = this.bullets.getFirstExists(false);
				if (this.bullet)
				{				
					var y=this.game.world.randomY;
					this.bullet.reset(this.game.world.width+100,y);
					this.bullet.body.velocity.x= this.game.rnd.integerInRange(-60, -40);
					this.bullet.body.velocity.y= 0;									
				}			
			}
			this.pupTime = this.game.time.now + 500;
		}
    },
	
	shieldcollisionHandler: function(bullet,sprite) {
		sprite.kill();
		BasicGame.shield=true;
	},
	
	bulletcollisionHandler: function(bullet,sprite) {
		sprite.kill();
		BasicGame.ship1.bulletspeed=BasicGame.ship1.bulletspeed*0.8;
	}
};

BasicGame.Preloader = function (game) {

  this.preloadBar = null;

  this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {
	
    // Create a progress bar based on cropping on image
    this.preloadBar =
      this.add.sprite(this.game.width/2, this.game.height/2, 'preloader-bar');
    this.preloadBar.pivot.x = this.preloadBar.width/2;
    this.preloadBar.pivot.y = this.preloadBar.height/2;

    this.load.setPreloadSprite(this.preloadBar);
			//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.

    // Load game assets here...

    this.load.atlasJSONHash('playnow',
                            'assets/ui/playnow.png',
                            'assets/ui/playnow.json');
    this.load.atlasJSONHash('start',
                            'assets/ui/start.png',
                            'assets/ui/start.json');
    this.load.atlasJSONHash('fullscreen',
                            'assets/ui/fullscreen.png',
                            'assets/ui/fullscreen.json');
							
	this.load.atlasJSONHash('logo',
                            'assets/logo.png',
                            'assets/logo.json');


	//this.load.image('logo', 'assets/logo.png');

			BasicGame.ship1 = new Ship(this,1);
			BasicGame.ship1.preload();
			

			BasicGame.rocks = new Rock(this);
			BasicGame.rocks.preload();

			BasicGame.hole = new Hole(this);
			BasicGame.hole.preload();
			
			BasicGame.pups = new Powerups(this);
			BasicGame.pups.preload();



		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, the lines below won't work as the files themselves will 404, they are just an example of use.
		this.load.image('titlepage', 'images/title.png');
		this.load.image('playButton', 'images/play_button.png');//this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
		this.load.audio('titleMusic', ['audio/main_menu.mp3']);
		//this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here
		this.load.image('debris_image',"assets/debris.png");
		this.load.image('nebula_image',"assets/nebula.png");
		this.load.image('splash_image',"assets/start.png");
		this.load.image('missile_image',"assets/shot.png");
		this.load.spritesheet('explosion_image',"assets/explosion.png",128,128);
		
		this.load.audio('soundtrack', 'assets/soundtrack.mp3');
		this.load.audio('missile_sound', 'assets/missile.mp3');
		this.load.audio('ship_thrust_sound', 'assets/thrust.ogg');
		this.load.audio('explosion_sound', 'assets/explosion.mp3');
		
		this.load.image('company', 'assets/ui/icons/company4.png');
		this.load.image('shadow', 'assets/ui/icons/shadow.png');

  },

  create: function () {
  
    var item;
    var shadow;
    var tween;

    this.preloadBar.cropEnabled = false;
	
	this.preloadBar.visible = false;
	
	this.game.stage.backgroundColor = '#ffffff';
	
	shadow = this.game.add.sprite(this.game.width/2, this.game.height/2, 'shadow');
	shadow.scale.setTo(0.0, 0.0);
	shadow.anchor.setTo(0.5, 0.5);
	this.game.add.tween(shadow.scale).to({x: 0.95, y: 0.95}, 2400, Phaser.Easing.Bounce.Out, true);
	item = this.game.add.sprite(this.game.width/2, -150, 'company');
	item.anchor.setTo(0.5, 0.5);
	tween = this.game.add.tween(item).to( { y: this.game.height/2-35 }, 2400, Phaser.Easing.Bounce.Out, true);
	
	this.game.input.onTap.addOnce(function(){this.state.start('MainMenu');},this);

	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	//this.scale.pageAlignHorizontally = true;
	this.scale.pageAlignVertically = true;
	this.scale.setScreenSize( true );
	
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
