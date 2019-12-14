//Creo la variable con la configuración del juego y añado las escenas
var config = {
type: Phaser.AUTO,
width: 800,
height: 600,
pixelArt: true,
parent: 'joc',
 physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 600 },
        debug: false
    }
},
scene: [loadingScene, homeScene, gameScene]
};

//Creo las variables que voy a utilizar en el juego
var player;
var cursors;
var puntuacion = 0;
var ostias;
var gayspers;
var gameOver = false;
var textoPuntuacion;
var textoNivel;
var textoFinalNivel;
var iglesia_final;
var gameover_cartel;
var textoGO;
var finalnivel_cartel;
var direccion_pistola;
var bullets;
var lastFired;
var game = new Phaser.Game(config);