//En esta escena se muestra el juego, listo para jugar

class gameScene extends Phaser.Scene {
	constructor(){
		super('gameScene');
	}

	create ()
    {  
        //Activo la música de fondo
        let bgmusic = this.sound.add('musica_fons')
        bgmusic.play({
           volume: .3,
           loop: true,
           delay:1
        })

        //Creo la imagen de fondo, que se irá moviendo a medida que se mueve el personaje
        this.mainGround = this.add.tileSprite(400, 250, game.config.width*20, game.config.height*1.5, 'fondo');
    
        //Creo el personaje
        player = this.physics.add.sprite(100, 250, 'cayetana').setScale(1.5);
        player.setSize(40,70);
        player.setOffset(10,0)
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        //Configuro las animaciones cuando el personaje camina a la izquierda
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('cayetana', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        //Cuando cambia de direccion o se para
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'cayetana', frame: 6 } ],
            frameRate: 20
        });

        //Cuando camina a la derecha
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('cayetana', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        //Creo los cursores para generar los controles del juego
        cursors = this.input.keyboard.createCursorKeys();

        //Genero el mapa creado en Tiled
        const mapa = this.make.tilemap({ key: 'mapa'}); 
        const tileset = mapa.addTilesetImage('Tileset_MisaQuest');

        //Genero las ostias
        //Creo un GRUPO para ello
        ostias = this.physics.add.group({
            key: 'ostia',
            repeat: 30,
            setXY: { x: 12, y: 0, stepX: 200 },
            setScale: {x: 4, y: 4}
        });

        //Defino el comportamiento de las ostias
        ostias.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.body.velocity.setTo(0, -200);
        });

        //Genero los enemigos
        gayspers = this.physics.add.group({
            key: 'gaysper',
            repeat: 10,
            setXY: { x: 900, y: 100, stepX: 200 }
        });

        //Defino el comportamiento de los enemigos
        gayspers.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
            child.allowGravity = false;
            child.body.bounce.y = 0;
            child.body.bounce.x = 1;
            child.body.collideWorldBounds = true;
            child.body.velocity.x = Phaser.Math.Between(100, 200);
        });
        
        //Coloco la iglesia al final en una capa aparte
        const layer_iglesia = mapa.createStaticLayer('iglesia', tileset, 0,-360);
        layer_iglesia.setScale(2);
        //Coloco la capa del suelo y las plataformas
        const layer_suelo = mapa.createDynamicLayer('suelos', tileset, 0,-360);
        layer_suelo.setScale(2);
        //Defino qué tiles deben colisionar
        mapa.setCollisionBetween(17, 31);
        mapa.setCollisionBetween(70, 73);
        mapa.setCollisionBetween(96, 127); 

        //Configuro la cámara para que siga al jugador, y que el fondo se mueva a la vez
        this.physics.world.bounds.width = layer_suelo.width*2;
        this.physics.world.bounds.height = layer_suelo.height*2;

        this.cameras.main.setBounds(0, 0, layer_suelo.width*2, layer_suelo.height).setName('main');
        this.cameras.main.startFollow(player);

	    //Función al colisionar el personaje con una ostia
	    var cogerOstia = function(player, ostia) {
	            ostia.disableBody(true, true);
	            puntuacion += 10;
	            textoPuntuacion.setText(puntuacion + ' Puntos');
	    }

	    //Función al colisionar el personaje con un enemigo
	    var chocaGaysper = function(player, gaysper){
	        this.physics.pause();
	        player.setTint(0xff0000);
	        player.anims.play('turn');
	        gameOver = true;
	    }

        //Defino qué elementos deben colisionar con otros y si se debe activar alguna acción
        this.physics.add.collider(player, layer_suelo);
        this.physics.add.collider(ostias, layer_suelo);
        this.physics.add.overlap(player, ostias, cogerOstia, null, this);
        this.physics.add.collider(gayspers, layer_suelo);
        this.physics.add.collider(player, gayspers, chocaGaysper, null, this);
    
        //Defino el cartel con los puntos acumulados (comienza en 0)
        textoPuntuacion = this.add.text(20, 20, '0 Puntos', {
            fontSize: '40px',
            fill: '#ffffff'
        });
        textoPuntuacion.setScrollFactor(0);
    }

 update ()
 {
        //Si hemos perdido, se detiene el juego
        if (gameOver)
        {
            return;
        }

        //Defino los movimientos del jugador segun las teclas que aprete
        if (cursors.left.isDown) //Izquierda
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) //Derecha
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else //ni izq ni der
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.blocked.down) 
        {
            player.setVelocityY(-500);
        }

        //Muevo el fondo siguiendo al personaje, pero más lentamente
        this.mainGround.tilePositionX = this.cameras.main.scrollX * .2
}



}
