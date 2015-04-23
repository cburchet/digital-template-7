window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 640, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.tilemap('world', 'assets/world.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image( 'gameTiles', 'assets/tiles.png' );
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        game.load.spritesheet('goblin', 'assets/goblin.png', 60, 60);
        game.load.image('bullet', 'assets/bullet.png');
        game.load.audio('music', 'assets/bg2.mp3');
    }
    var player;
    var bullet;
    var fireRate = 100;
    var nextFire = 0;
    var cursors;
    
    var goblin;
    var enemies;
    var enemyFireLoop;
    
    var map;
    var backgroundLayer;
    var blockedLayer;
    
    var level;
    var levelText;
    
    var music;
    
    function create() 
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        map = game.add.tilemap('world');
        map.addTilesetImage('tiles', 'gameTiles');
        
        blockedLayer = map.createLayer('BlockLayer');
        
        map.setCollisionBetween(1, 4000, true, 'BlockLayer');
        blockedLayer.resizeWorld();
        
        backgroundLayer = map.createLayer('BackGroundLayer');
        backgroundLayer.resizeWorld();
        
        player = game.add.sprite(33, game.world.height - 49, 'dude');
	 
    	game.physics.enable(player);
	game.camera.follow(player);
	
	player.body.bounce.y = 0.2;
	player.body.gravity.y = 300;
	
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);
	
	cursors = game.input.keyboard.createCursorKeys();
	
	var enemyFireLoop = game.time.events.loop(Phaser.Timer.SECOND * 2, enemyfire, this);
	
	level = 1;
	levelText = game.add.text(120, 0, 'Level: ' + level, { fontSize: '128px', fill: 'red' });
	levelText.fixedToCamera = true;
	
	enemies = game.add.group();
	enemies.enableBody = true
	goblin = enemies.create(200, game.world.height - 64, 'goblin');
	game.phsyics.enable(goblin);
	
	music = game.add.audio('music');
	music.play('', 0, .1, true);
    }
    
    function update() 
    {
        game.physics.arcade.collide(player, blockedLayer);
        game.physics.arcade.collide(enemies, blockedLayer);
	game.physics.arcade.overlap(bullet, enemies, bulletHitEnemy, null, this);
       
       //enemy move/fire controls
       if(phaser.Math.distance(player.x, player.y, goblin.x, goblin.y) > 10){
       	   game.physics.arcade.moveToXY(goblin, player.x, goblin.y, 50);
       	   game.time.events.remove(enemyFireLoop);
       }
       else
       {
       		enemyFireLoop = game.time.events.loop(Phaser.Timer.SECOND * 5, enemyfire, this);
       }
       
       //player movement
        player.body.velocity.x = 0;
	 
	if (game.input.activePointer.isDown)
	{
		fire();
	}
    	if (cursors.left.isDown)
    	{
		player.body.velocity.x = -150;
 
		player.animations.play('left');
    	}
    	else if (cursors.right.isDown)
    	{
    		player.body.velocity.x = 150;
     		player.animations.play('right');
    	}   
    	else
    	{
    		player.animations.stop();
    	    
	    	player.frame = 4;
    	}
	
    	if (cursors.up.isDown && player.body.onFloor())
    	{
    		player.body.velocity.y = -250;
    	}
    }
    
    function enemyfire()
    {
    	if (game.time.now > nextFire)
    	{
    		nextFire = game.time.now + fireRate;
	    	bullet = game.add.sprite(goblin.x + 10, goblin.y, 'bullet');
	    	bullet.lifespan = 1000;
	    	game.physics.enable(bullet);
	    	bullet.rotation = game.physics.arcade.moveToXY(bullet, player.x, player.y, 1000);
    	}
    }
    
    function fire()
    {
    	if (game.time.now > nextFire)
    	{
    		nextFire = game.time.now + fireRate;
	    	bullet = game.add.sprite(player.x + 10, player.y, 'bullet');
	    	bullet.lifespan = 1000;
	    	game.physics.enable(bullet);
	    	bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer);
    	}
    }
    
    function bulletHitEnemy (goblin, bullet) 
    {
	bullet.kill();
    	goblin.destroy();

}
    
    function gameOver()
    {
    	player.body.velocity.x = 0;
	player.animations.stop();
	player.frame = 4;
	var gameoverText = game.add.text(350, 300, 'Game Over', { fontSize: '128px', fill: 'red' });
	gameoverText.fixedToCamera = true;
    }
    
    function nextLevel()
    {
	    	level++;
	    	enemyHealth = level + 5;
	    	enemies.health = enemyHealth;
	    	levelText.text = 'Level: ' + level;
	    	player.x = 33;
	    	player.y = game.world.height-49;
		player.body.velocity.x = 0;
		player.animations.stop();
		player.frame = 4;
	    //	introText.visible = true;
	    //	game.input.onDown.add(begin, this);
    }
};
