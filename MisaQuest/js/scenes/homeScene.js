//esta es la pantalla del título
//Una vez cargada, el jugador debe presionar cualquier tecla, y se cargará el juego

class homeScene extends Phaser.Scene {
	constructor(){
		super('homeScene');
	}

	create(){
		
		//Pongo la imagen de fondo
		let background = this.add.sprite(400,300,'pantalla_home');

		//Creo un texto para indicar cómo continuar
		var tconfig = {
		      x: 200,
		      y: 450,
		      text: 'PULSA CUALQUIER TECLA',
		      style: {
		        fontSize: '30px',
		        fontFamily: 'Courier New',
		        color: '#ffffff',
		        align: 'center',
		        lineSpacing: 44,
		      }
		    };
		var text = this.make.text(tconfig);
			
		//defino la transparencia del texto
		text.alpha = 0.1;

		//Creo un tween para el texto, de manera que aparezca y desaparezca suavemente (animo propiedad alpha)
	    this.tweens.add({	
	        targets: text,
	        alpha: { value: 1, duration: 1000, ease: 'Power1' },
	        yoyo: true,
	        loop: -1
	    });

		//Al premer qualsevol tecla, apareix l'escena del joc
        this.input.keyboard.on('keydown', function (event) {
           	this.scene.start("gameScene");
        }, this);

	}
}
