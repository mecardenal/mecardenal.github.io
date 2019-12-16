//Esta escena se ve cuando estamos cargando los assets del juego
//Muestra una barra de progreso y el porcentaje cargado

class loadingScene extends Phaser.Scene {
	constructor(){
		super('loadingScene');
	}

	preload(){

		//Creo els elements de la pantalla de càrrega (barra que creix segons el progrés)
		var progressBar = this.add.graphics();
	    var progressBox = this.add.graphics();
	    progressBox.fillStyle(0x3C1F3D, 0.8);
	    progressBox.fillRect(240, 270, 320, 50);

		//Carrego els assets (imatges i sons)

		//El fons
	    this.load.image('fondo', 'assets/fondo_bosque.png');
	    
	    //Musica i sons
	    this.load.audio('musica_fons', 'assets/audio/Bella Ciao (8 Bit Mix).mp3');
	    this.load.audio('sonido_disparo', 'assets/audio/270343__littlerobotsoundfactory__shoot-01.wav');
	    this.load.audio('sonido_saltar', 'assets/audio/187025__lloydevans09__jump1.wav');
	    this.load.audio('sonido_moneda', 'assets/audio/341695__projectsu012__coins-1.wav');
	    this.load.audio('sonido_muereGaysper', 'assets/audio/170144__timgormly__8-bit-explosion2.wav');
	    this.load.audio('sonido_muereCayetana', 'assets/audio/350985__cabled-mess__lose-c-02.wav');
	    this.load.audio('sonido_exito', 'assets/audio/448274__henryrichard__sfx-success.wav');
	    
	    //Elmenents grafics (personatges, mapa, particules)
	    this.load.spritesheet('cayetana',  'assets/spritesheet_Cayetana.png', { frameWidth: 60, frameHeight: 70 });
	    this.load.image('ostia',  'assets/sprite_ostia.png');
	    this.load.tilemapTiledJSON('mapa', 'assets/Mapa_MisaQuest.json');
	    this.load.image('Tileset_MisaQuest', 'assets/Tileset_MisaQuest.png');
	    this.load.image('gaysper', 'assets/sprite_Gaysper.png');
		this.load.image('pantalla_home','assets/MisaQuest_cartel_insertcoin.png');
		this.load.image('cartel_gameover','assets/game_over_misaquest.png');
		this.load.image('cartel_quieromisa','assets/quieromisa_misaquest.png');
 		this.load.image("bullet", "assets/bullet.png");
 		this.load.image('cartel_amen','assets/amen_misaquest.png');
		this.load.image('iglesia','assets/iglesia.png');
    	this.load.image('fuego', 'assets/muzzleflash3.png');

        //Comença la part de la pantalla de carrega
	    this.load.on('progress', function (value) {
	        progressBar.clear();
	        progressBar.fillStyle(0xB43973, 1);
	        progressBar.fillRect(250, 280, 300 * value, 30);
	        percentText.setText(parseInt(value * 100) + '%');
	    });
	                    
	    //Actualitzo el progrés de la barra de càrrega a mesura que es carreguen els fitxers 
	    this.load.on('complete', function () {
	        progressBar.destroy();
	        progressBox.destroy();
	        loadingText.destroy();
	        percentText.destroy();
	    });

	    //Creo el text que indica el % de càrrega
	    var width = this.cameras.main.width;
	    var height = this.cameras.main.height;
	    var loadingText = this.make.text({
	        x: width / 2,
	        y: height / 2 - 50,
	        text: 'Cargando...',
	        style: {
	            font: '20px monospace',
	            fill: '#ffffff'
	        }
	    });
	    loadingText.setOrigin(0.5, 0.5);

	    var percentText = this.make.text({
	        x: width / 2,
	        y: height / 2 - 5,
	        text: '0%',
	        style: {
	            font: '18px monospace',
	            fill: '#ffffff'
	        }
	    });
	    percentText.setOrigin(0.5, 0.5);
	}

	create(){
		//Cuando termino de cargar, paso a la pantalla del título
		this.scene.start("homeScene");
	}


	

}
