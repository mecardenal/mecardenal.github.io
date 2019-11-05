//Script per a que mostri una imatge aleatoria cada cop que es carregui la pàgina

//Defineixo la funció que canvia la imatge de fons
function canvi_imatge(){
	//Genero un número aleatori del 0 al 9
	var num_aleatori = Math.floor(Math.random() * 10)
	//Canvio el src de la imatge
	document.getElementById('imatge_art').src='img/imagen_article_' + num_aleatori + '.png'
}

//Cada cop que es carregui la pàgina s'executarà la funció anterior
window.onload = function () {
	canvi_imatge();
}