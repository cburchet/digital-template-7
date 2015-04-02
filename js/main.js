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
        game.load.image('door', 'assets/castledoors.png');
        game.load.image('key', 'assets/key.png');
        game.load.image('bird', 'assets/birds.png');
        game.load.image('bullet', 'assets/bullet.png');
    }
    var player;
    var bullet;
    var fireRate = 100;
    var nextFire = 0;
    var cursors;
    
    var door;
    var key;
    
    var enemy;
    var enemyHealth;
    var enemies;
    
    var map;
    var backgroundLayer;
    var blockedLayer;
    
    var level;
    var levelText;
    
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
	
	
	level = 1;
	levelText = game.add.text(120, 0, 'Level: ' + level, { fontSize: '128px', fill: 'red' });
	levelText.fixedToCamera = true;
	
	enemyHealth = level + 5;
	enemies = game.add.group();
	enemies.enableBody = true
	enemies.health = enemyHealth;
	game.time.events.loop(Phaser.Timer.SECOND * 5, createEnemies, this);
    }
    
    function update() 
    {
        game.physics.arcade.collide(player, blockedLayer);
	game.physics.arcade.overlap(bullet, enemies, bulletHitEnemy, null, this);
	game.physics.arcade.collide(player, key, collectKey, null, this);
	game.physics.arcade.overlap(player, door, nextLevel, null, this);
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
    
    function fire()
    {
    	if (game.time.now > nextFire)
    	{
    		nextFire = game.time.now + fireRate;
	    	bullet = game.add.sprite(player.x, player.y - 20, 'bullet');
	    	bullet.lifespan = 1000;
	    	game.physics.enable(bullet);
	    	bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer);
    	}
    }
    
    function bulletHitEnemy (enemy, bullet) 
    {
	var chance = game.rnd.integerInRange(0, 25);
	if (chance == 1)
	{
		key = game.add.sprite(enemy.x, enemy.y, 'key');
		game.physics.enable(key);
		key.body.gravity.y = 200;
	}
	bullet.kill();
    	var destroyed = enemy.damage(1);

}
    
    function createEnemies()
    {
    	enemy = enemies.create(game.world.width + 64, game.rnd.integerInRange(50, 500), 'bird');
    	enemy.body.velocity.x = -75;
    }
    
    function collectKey()
    {
    	key.kill();
    	door = game.add.sprite(game.world.width - 64, game.world.height - 128, 'door');
	game.physics.enable(door);
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
