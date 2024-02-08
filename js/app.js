
/************variables*************/
//contexto y canvas declarados glovales
var ctx, miCanvas;
var primerCarta = true;
var segundaCarta = true;
var cartaPrimera, cartaSegunda;
var colorDelante = "orange";
var colorCanvas = "#a599ff";
var colorAtras = "blue";
var inicioX = 45;
var inicioY = 50;
var cartaMargen = 30;
var cartaLon = 30;
var cartaAncho = 100;
var cartaLargo = 140;
var cartas_array = new Array();
var iguales=false;
var cartas=0; //numero de cartas encontradas
var pares = [ 
["inge1.png","inge2.png"],
["maestra1.png","maestra2.png"],
["doc1.png","doc2.png"],
["niño1.png","niño2.png"],
["carta05.png","carta05.png"],
["carta06.png","carta06.png"]
];
 
 var imagenTras = new Image();
 //var patronTras;

/***************funciones*********/
function  Carta(x,y,ancho,largo, img, info){
	this.x = x;
	this.y = y;
	this.ancho = ancho;
	this.largo = largo;
	this.info = info;
	this.img = img;
	this.dibuja = dibujaCarta;
	
}

function dibujaCarta(){
	
	
	//var patronTras = ctx.createPattern(imagenTras,"repeat");
	//ctx.clearRect(this.x, this.y, this.ancho, this.largo);
	//ctx.fillStyle = patronTras;
	ctx.clearRect(this.x, this.y, this.ancho, this.largo);
	ctx.fillRect(this.x, this.y, this.ancho, this.largo);
	ctx.drawImage(imagenTras,this.x, this.y, this.ancho, this.largo);
}

function tablero(){
	var i;
	var carta;
	var x = inicioX;
	var y = inicioY;
	for(i=0; i<4; i++)	{
		img = "images/"+pares[i][0];
		carta = new Carta(x,y,cartaAncho, cartaLargo, img, i);
		cartas_array.push(carta);
		carta.dibuja();
		
		//segunda carta
		img = "images/"+pares[i][1];
		carta = new Carta(x,y+cartaLargo+cartaMargen,cartaAncho, cartaLargo, img, i);
		cartas_array.push(carta);
		carta.dibuja();
		//aumentapos posicion en X
		//x+=cartaAncho + cartaMargen;
		
		x+=cartaAncho + cartaMargen;
	}
	x = inicioX;
	for(i=4; i<6; i++)	{
		
		img = "images/"+pares[i][0];
		carta = new Carta(x,y+cartaLargo+cartaMargen+cartaLargo+cartaMargen,cartaAncho, cartaLargo, img, i);
		cartas_array.push(carta);
		carta.dibuja();
		//aumentapos posicion en X
		x+=cartaAncho + cartaMargen;
		
		img = "images/"+pares[i][0];
		carta = new Carta(x,y+cartaLargo+cartaMargen+cartaLargo+cartaMargen,cartaAncho, cartaLargo, img, i);
		cartas_array.push(carta);
		carta.dibuja();
		//aumentapos posicion en X
		x+=cartaAncho + cartaMargen;
	}
}

function barajear(){
	var i,j,k;
	var temporalInfo, temporalImg;
	var lon = cartas_array.length;
	
	for(j=0; j<lon*3; j++){
		//numeros aletorios para barajear dos cartas
		i= Math.floor(Math.random()*lon);
		k= Math.floor(Math.random()*lon);
		
		temporalInfo = cartas_array[i].info;
		temporalImg = cartas_array[i].img;
		cartas_array[i].info = cartas_array[k].info;
		cartas_array[i].img = cartas_array[k].img;
		cartas_array[k].info = temporalInfo;
		cartas_array[k].img = temporalImg;
	}
}

//funcion selecciona de mouse
function ajusta(xx, yy){
	
	var posCanvas = miCanvas.getBoundingClientRect();
	var x= xx-posCanvas.left;
	var y= yy-posCanvas.top;
	
	return{x:x,y:y}
}

function selecciona(e){
	if(segundaCarta==true){
		var pos = ajusta(e.clientX, e.clientY);
		//alert (pos.x+" , "+pos.y);
		for(var i=0; i<cartas_array.length; i++){
			var carta = cartas_array[i];	
			if(carta.x>0){
				if((pos.x>carta.x) && (pos.x<carta.x+carta.ancho) && (pos.y>carta.y) && (pos.y<carta.y+carta.largo)){
					if((primerCarta) || (i!=cartaPrimera)){
						break;	
					}
					
				}
			}
		}
		//encontramos la carta
		if(i<cartas_array.length){
			//alert("carta "+i);	
			if(primerCarta){
				//se encuentra primer carta
				cartaPrimera = i;
				primerCarta = false;
				pinta(carta);	
			}else{
				//se encuentra la segunda
				cartaSegunda = i;
				pinta(carta);
				primerCarta = true;
				
				//si las cartas son iguales
				if(cartas_array[cartaPrimera].info == cartas_array[cartaSegunda].info){
					
					iguales=true;
				}else{
					
					iguales=false;
				}
				setTimeout(volteaCarta,1000); //tiempo de 1 segundo	
				segundaCarta = false;
			}
		}
	}
}

function volteaCarta(){
	if(iguales==true){
		//eliminan cartas esncontradas
		ctx.clearRect(cartas_array[cartaPrimera].x,cartas_array[cartaPrimera].y, cartas_array[cartaPrimera].ancho, cartas_array[cartaPrimera].largo);
		
		ctx.clearRect(cartas_array[cartaSegunda].x,cartas_array[cartaSegunda].y, cartas_array[cartaSegunda].ancho, cartas_array[cartaSegunda].largo);
		
		cartas_array[cartaPrimera].x = -1;
		cartas_array[cartaSegunda].x = -1;
		cartas+=1;
		
		aciertos();
		
	}else{
		//regresan las cartas
		cartas_array[cartaPrimera].dibuja();	
		cartas_array[cartaSegunda].dibuja();
	}
	segundaCarta = true;
}

function pinta(carta){
	//ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    
	ctx.fillRect(carta.x, carta.y, carta.ancho, carta.largo); 
	/*ctx.font = "bold 40px Comic";
	ctx.fillStyle = "black";
	ctx.fillText(String(carta.info), carta.x+carta.ancho/2-10, carta.y+carta.largo/2+10);*/
	var imagen = new Image();
	imagen.src = carta.img;
	imagen.onload = function(){
		ctx.drawImage(imagen, carta.x, carta.y, carta.ancho, carta.largo);	
	}
}

function aciertos(){
	//alert (cartas);
	ctx.save();
	//ctx.fillStyle = "black";
	if(cartas==6){
		ctx.font = "bold 60px Comic";
		ctx.clearRect(0, 0, miCanvas.width, miCanvas.height);
		ctx.fillText("GAME OVER!!", 50,300);
		//guarda datos
	}else{
		ctx.font = "normal 40px Verdana";
		ctx.clearRect(3, 560, miCanvas.width, 200);
		ctx.fillText("Aciertos: "+String(cartas), 30,590);
	}
	ctx.restore();
	
}

/******* TO DO **********/
window.onload=function(){
	miCanvas= document.getElementById("canvas1");
	if(miCanvas && miCanvas.getContext){
		ctx = miCanvas.getContext("2d");
		if(ctx){
			//var imagenTras = new Image();
			imagenTras.src = "images/image.png";;
			imagenTras.onload = function(){
				miCanvas.addEventListener("click", selecciona, false);
				tablero();//se agregan las barajas
				barajear();//se modifica el orden de las barajas
				aciertos();
			}
						
		}else{
			alert ("Error al crear el contexto");
		}
	}
}

