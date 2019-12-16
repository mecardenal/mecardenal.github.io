//En esta escena se muestra el juego, listo para jugar
class gameScene extends Phaser.Scene {
	constructor(){
		super('gameScene');
	}

    init(props) {
        const { level = 1 } = props
        this.currentLevel = level
    }

	create ()
    {  
        //Activo la música de fondo
        let bgmusic = this.sound.add('musica_fons')
        bgmusic.play({
           volume: .5,
           loop: true
        })

        //Creo la imagen de fondo, que se irá moviendo a medida que se mueve el personaje
        this.mainGround = this.add.tileSprite(400, 250, game.config.width*20, game.config.height*1.5, 'fondo');
    
        //Creo el personaje
        player = this.physics.add.sprite(100, 250, 'cayetana').setScale(1.5);
        player.setSize(40,70);
        player.setOffset(10,0);
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

        //Creo cartel inicio nivel
        var quieromisa_cartel = this.make.image({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'cartel_quieromisa'
        });

        //Coloco la iglesia al final del mapa
        iglesia_final = this.physics.add.staticImage(4650,400,'iglesia');

        iglesia_final.setScale(2);

        //Genero las ostias
        //Creo un GRUPO para ello
        ostias = this.physics.add.group({
            key: 'ostia',
            repeat: 30,
            setXY: { x: 400, y: 0, stepX: 200 },
            setScale: {x: 4, y: 4}
        });

        //Defino el comportamiento de las ostias
        ostias.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.body.velocity.setTo(0, -200);
            child.setDepth(1);
        });

        //Genero los enemigos
        gayspers = this.physics.add.group({
            key: 'gaysper',
            repeat: 15,
            setXY: { x: 900, y: 100, stepX: 150 },
        });
       
        //Genero el fuego
        var bolaFuego = this.add.particles('fuego');
        bolaFuego.setDepth(4);
        //Genero 100 bolas de fuego
        for  (var i = 0; i < 100; i++){

            bolaFuego.createEmitter({
                alpha: { start: 0.3, end: 0 },
                scale: { start: 0.5, end: 2.5 },
                tint: { start: 0xa3504c, end: 0xa3504c },
                speed: 20,
                accelerationY: -200,
                angle: { min: -85, max: -95 },
                rotate: { min: -180, max: 180 },
                lifespan: { min: 400, max: 500 },
                blendMode: 'ADD',
                frequency: 60,
                maxParticles: 60,
                x: (i*50),
                y: 620
            });
       }


        //Defino el comportamiento de los enemigos
        //Con cada nivel se multiplica la velocidad
        var velocidad_min = 100 * this.currentLevel;
        var velocidad_max = 200 * this.currentLevel;
        
        gayspers.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
            child.body.gravity.y = 10;
            child.body.bounce.y = 0.8;
            child.body.bounce.x = 1;
            child.body.restitution = 1;
            child.body.collideWorldBounds = true;
            child.body.velocity.x = Phaser.Math.Between(velocidad_min, velocidad_max);
            child.body.velocity.y = Phaser.Math.Between(150,200);
            child.setDepth(2);
            child.setScale(1.2);
        });
        
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

	    //Función al colisionar el personaje con una ostia (la recoge y suma 10 puntos)
	    var cogerOstia = function(player, ostia) {
            sonido_moneda.play();
            ostia.disableBody(true, true);
            puntuacion += 10;
            textoPuntuacion.setText(puntuacion + ' Ostias');
	    }

	    //Función al colisionar el personaje con un enemigo (gameover)
	    var chocaGaysper = function(player, gaysper){
           
            //Paro la música de fondo
            bgmusic.stop();    

            //Pongo el audio y paro la escena
            sonido_muereCayetana.play();
	        this.physics.pause();
            
            //Pinto a Cayetana de rojo
	        player.setTint(0xff0000);
	        player.anims.play('turn');

            //Creo el cartel y el texto de game over
            gameover_cartel = this.make.image({
                x: this.cameras.main.scrollX + 400,
                y: this.cameras.main.scrollY + 250,
                key: 'cartel_gameover'
            });
            gameover_cartel.setDepth(2);
            
            textoGO = this.add.text(this.cameras.main.scrollX + 280, this.cameras.main.scrollY + 380, '   Pulsa SHIFT para\nponer la otra mejilla', {
                fontSize: '20px',
                fill: '#ffffff',
                fontStyle: 'bold',
                shadowStroke: true,
                stroke: 'black',
                strokeThickness: 4
            });
            textoGO.setDepth(2);

            //Activo la variable que indica que hemos perdido
            gameOver = true;
	    }


        //Función cuando Cayetana pasa delante de la iglesia final (sube nivel)
        var chocaIglesia = function(player,iglesia){
            if(exito != 1){
                //Creo el cartel y el sonido de final de nivel
                sonido_exito.play();
                finalnivel_cartel = this.make.image({
                        x: this.cameras.main.scrollX + 400,
                        y: this.cameras.main.scrollY + 250,
                        key: 'cartel_amen'
                    });
                finalnivel_cartel.setDepth(2);
                    
                textoFinalNivel = this.add.text(this.cameras.main.scrollX + 220, this.cameras.main.scrollY + 270, 'Hasta el próximo domingo...\n\n  Pulsa SHIFT para seguir',{
                        fontSize: '20px',
                        fill: '#ffffff',
                        fontStyle: 'bold',
                        shadowStroke: true,
                        stroke: 'black',
                        strokeThickness: 4
                    });
                textoFinalNivel.setDepth(2);
                
                //Activo la variable que indica que hemos superado un nivel
                exito = true;

                //Paro la física y la música
                this.physics.pause(); 
                bgmusic.stop();
            }
        }


        //Si una bala toca un gaysper, lo mata
        var disparoGaysper = function(gaysper,bullet){
            sonido_muereGaysper.play();
            bullet.destroy();
            gaysper.disableBody(true,true);
        }

        //Si una bala toca el suelo se destruye
        var disparoSuelo = function(suelo,bullet){
            bullet.destroy();
        }

        lastFired = 0;

        bullets = this.physics.add.group();

        this.physics.add.collider(bullets);
//        bullets.setCollideWorldBounds();

        //Defino qué elementos deben colisionar con otros y si se debe activar alguna acción
        this.physics.add.collider(player, layer_suelo);
        this.physics.add.collider(ostias, layer_suelo);
        this.physics.add.overlap(player, ostias, cogerOstia, null, this);
        this.physics.add.collider(gayspers, layer_suelo);
        this.physics.add.collider(player, gayspers, chocaGaysper, null, this);
        this.physics.add.overlap(player, iglesia_final, chocaIglesia, null, this);    
        this.physics.add.overlap(gayspers, bullets, disparoGaysper, null, this);  
        this.physics.add.overlap(layer_suelo, bullets, disparoSuelo, null, this);   

        //Defino el cartel con los puntos acumulados (comienza en 0)
        textoPuntuacion = this.add.text(20, 20, puntuacion + ' Ostias', {
            fontSize: '30px',
            fill: '#ffffff'
        });
        textoPuntuacion.setScrollFactor(0);

        //Defino el cartel con el nivel
        textoNivel = this.add.text(570, 20, 'Domingo nº' + this.currentLevel, {
            fontSize: '30px',
            fill: '#ffffff'
        });
        textoNivel.setScrollFactor(0);

        //Coloco el jugador por encima del cartel inicial
        player.setDepth(1);
     
        //Creo los sonidos
        sonido_disparo = this.sound.add('sonido_disparo');
        sonido_disparo.setVolume(0.2);

        sonido_saltar = this.sound.add('sonido_saltar');

        sonido_moneda = this.sound.add('sonido_moneda');
        sonido_moneda.setVolume(0.5);

        sonido_muereGaysper = this.sound.add('sonido_muereGaysper');
        sonido_muereGaysper.setVolume(0.2);

        sonido_muereCayetana = this.sound.add('sonido_muereCayetana');

        sonido_exito = this.sound.add('sonido_exito');


    }

 update (time)
 {

        //Si hemos superado un nivel, subo la dificultad
        if ((exito)&&(cursors.shift.isDown))
        {
           exito = false;
           this.scene.restart({ level: this.currentLevel + 1 , puntos: puntuacion});
        }

        //Si hemos perdido, se detiene el juego
        if ((gameOver)&&(cursors.shift.isDown))
        {
            puntuacion = 0;
            gameOver = 0;
            this.scene.restart({ level: 1})
        }

        //Defino los movimientos del jugador segun las teclas que aprete
        if (cursors.left.isDown) //Izquierda
        {
            direccion_pistola = "L";
            player.setVelocityX(-200);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) //Derecha
        {
            direccion_pistola = "R";
            player.setVelocityX(200);

            player.anims.play('right', true);
        }
        else if(cursors.space.isDown|| !player.body.blocked.down){
            //no hacer nada
        }
        else //ni izq ni der
        {
            player.setVelocityX(0);
            player.anims.play('turn');
        }

        //Saltar
        if (cursors.up.isDown && player.body.blocked.down) 
        {
            player.setVelocityY(-500);
            sonido_saltar.play();
        }

        //Si despues de un salto queremos descender más rápido, apretamos DOWN
        if(cursors.down.isDown && !player.body.blocked.down){
            player.setVelocityY(300);
        }

        //Defino el comportamiento de la tecla espacio ( disparar )
        if (cursors.space.isDown && (time > lastFired)){
            switch(direccion_pistola)
            {
                case "R":
                    var bala = bullets.create(player.x + 40, player.y - 10,'bullet');
                    bala.setVelocityX(1500);
                    player.anims.play('right', true);
                break;
                    
                case "L":
                    var bala = bullets.create(player.x - 40, player.y - 10 ,'bullet');
                    bala.setVelocityX(-3000);
                    player.anims.play('left', true);
                break;
                    
                default:
                      var bala = bullets.create(player.x - 40, player.y - 10 ,'bullet');
                    bala.setVelocityX(-3000);
                    player.anims.play('left', true);
               break;
            }
            sonido_disparo.play();
            lastFired = time + 250;
        }

        //Muevo el fondo siguiendo al personaje, pero más lentamente
        this.mainGround.tilePositionX = this.cameras.main.scrollX * .2
}



}
