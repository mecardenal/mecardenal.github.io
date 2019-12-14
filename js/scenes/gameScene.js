//En esta escena se muestra el juego, listo para jugar

class gameScene extends Phaser.Scene {
	constructor(){
		super('gameScene');
	}

    init(props) {
        const { level = 1 } = props
        this.currentLevel = level
        //const { puntos = 1 } = points
        //this.puntuacionActual = puntos
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


                //Creo cartel inicio nivel
        var quieromisa_cartel = this.make.image({
            x: game.config.width / 2,
            y: game.config.height / 2,
            key: 'cartel_quieromisa'
        });

        //Coloco la iglesia al final del mapa
       iglesia_final = this.physics.add.staticImage(4650,400,'iglesia');
      //  iglesia_final = this.physics.add.staticImage(900,400,'iglesia');

        iglesia_final.setScale(2);
        //iglesia_final.setDepth(0);

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
            child.setDepth(1);
      
        });

        //Genero los enemigos
        gayspers = this.physics.add.group({
            key: 'gaysper',
            repeat: 10,
            setXY: { x: 900, y: 100, stepX: 200 }
        });


        //Defino el comportamiento de los enemigos
        
        var velocidad_min = 100 * this.currentLevel;
        var velocidad_max = 200 * this.currentLevel;
        
        gayspers.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
            child.allowGravity = false;
            child.body.bounce.y = 0;
            child.body.bounce.x = 1;
            child.body.collideWorldBounds = true;
            child.body.velocity.x = Phaser.Math.Between(velocidad_min, velocidad_max);
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
        



	    //Función al colisionar el personaje con una ostia
	    var cogerOstia = function(player, ostia) {
            ostia.disableBody(true, true);
            puntuacion += 10;
            textoPuntuacion.setText(puntuacion + ' Ostias');
	    }

	    //Función al colisionar el personaje con un enemigo
	    var chocaGaysper = function(player, gaysper){
	        this.physics.pause();
	        player.setTint(0xff0000);
	        player.anims.play('turn');
            //Creo el cartel de game over
            gameover_cartel = this.make.image({
                x: this.cameras.main.scrollX + 400,
                y: this.cameras.main.scrollY + 250,
                key: 'cartel_gameover'
            });
            gameover_cartel.setDepth(2);
            textoGO = this.add.text(this.cameras.main.scrollX + 280, this.cameras.main.scrollY + 380, ' Pulsa ESPACIO para\nvolver a intentarlo', {
                fontSize: '20px',
                fill: '#ffffff',
                fontStyle: 'bold',

            });
            textoGO.setDepth(2);
            gameOver = true;
	    }


        //Función al colisionar el personaje con la iglesia final (sube nivel)
        var chocaIglesia = function(player,iglesia){
             //Creo el cartel de final de nivel
             if(exito != 1){
                finalnivel_cartel = this.make.image({
                        x: this.cameras.main.scrollX + 400,
                        y: this.cameras.main.scrollY + 250,
                        key: 'cartel_amen'
                    });
                    finalnivel_cartel.setDepth(2);
                    
                    textoFinalNivel = this.add.text(this.cameras.main.scrollX + 200, this.cameras.main.scrollY + 270, 'Hasta el próximo domingo...',{
                    fontSize: '25px'
                });
                    this.scene.pause();
                  var exito = 1;
                  
                  setTimeout(() => {  this.scene.restart({ level: this.currentLevel + 1 , puntos: puntuacion}); }, 6000);
         
             }

          

        }



        var disparoGaysper = function(gaysper,bullet){
            bullet.destroy();
            gaysper.disableBody(true,true);
        }

        var disparoSuelo = function(suelo,bullet){
            bullet.destroy();
        }

        lastFired = 0;

        bullets = this.physics.add.group();
        this.physics.add.collider(bullets);

//bullets.body.collideWorldBounds=true;


        //Defino qué elementos deben colisionar con otros y si se debe activar alguna acción
        this.physics.add.collider(player, layer_suelo);
        this.physics.add.collider(ostias, layer_suelo);
        this.physics.add.overlap(player, ostias, cogerOstia, null, this);
        this.physics.add.collider(gayspers, layer_suelo);
        this.physics.add.collider(player, gayspers, chocaGaysper, null, this);
        this.physics.add.collider(player, iglesia_final, chocaIglesia, null, this);    
        this.physics.add.overlap(gayspers, bullets, disparoGaysper, null, this);  
        this.physics.add.overlap(layer_suelo, bullets, disparoSuelo, null, this);     
        //Defino el cartel con los puntos acumulados (comienza en 0)
        textoPuntuacion = this.add.text(20, 20, puntuacion + ' Ostias', {
            fontSize: '30px',
            fill: '#ffffff'
        });
        textoPuntuacion.setScrollFactor(0);

        //Defino el cartel con el nivel
        textoNivel = this.add.text(590, 20, 'Domingo nº' + this.currentLevel, {
            fontSize: '30px',
            fill: '#ffffff'
        });
        textoNivel.setScrollFactor(0);

        //Coloco el jugador por encima del cartel inicial
        player.setDepth(1);



    }

 update (time)
 {

        if(puntuacion >= 100){
           // puntuacion = 0;
            //this.scene.restart({ level: this.currentLevel + 1 })
        }


        //Si hemos perdido, se detiene el juego
        if ((gameOver)&&(cursors.space.isDown))
        {
            puntuacion = 0;
            gameOver = 0;
            this.scene.restart({ level: 1})
        }

        //Defino los movimientos del jugador segun las teclas que aprete
        if (cursors.left.isDown) //Izquierda
        {
            direccion_pistola = "L";
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) //Derecha
        {
            direccion_pistola = "R";
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else if(cursors.space.isDown){
            //no hacer nada
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
            lastFired = time + 250;
        }



        //Muevo el fondo siguiendo al personaje, pero más lentamente
        this.mainGround.tilePositionX = this.cameras.main.scrollX * .2
}



}
