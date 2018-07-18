
const ranges= Array.from(document.querySelectorAll('.range'));
var cajas=null;
var posicion=[];
var div=null;
var posicionClicked=null;
var numeroCajas=null;
var anchuraImagen=null;
var alturaImgane=null;
var puzzle1=null;

const Puzzle= (numeroColumnas, numeroFilas) => {

    var numeroColumnas=numeroColumnas;
    var numeroFilas=numeroFilas;
    const container=document.querySelector('.miPuzzle');
    let anchuraPuzzle= container.offsetWidth;
    const alturaPuzzle= container.offsetHeight;
    if(numeroColumnas==7 ||numeroColumnas==9){
      anchuraPuzzle=anchuraPuzzle+30;
    }
    numeroCajas= (numeroColumnas*numeroFilas)-1;
    anchuraImagen= Math.trunc(anchuraPuzzle/numeroColumnas);
    alturaImgane= Math.trunc(alturaPuzzle/numeroFilas);
    var maximaAnchuraImagen= anchuraPuzzle-anchuraImagen;
    var maximaALturaImagen= alturaPuzzle-alturaImgane;

    var htmlPiezas= [];
    var x=0;
    var y=0;
    var apollo=0;
    var a=[]
    var random=[];
    var signo=null;

    return{
        crearDivs: () => {
            for(var i=0; i<=numeroCajas; i++) {
               htmlPiezas.push(`<div class="puzzle" id="piece${i}"></div>`);
            };
            htmlPiezas= htmlPiezas.join('');
            container.innerHTML = htmlPiezas;
            cajas= Array.from(document.querySelectorAll('.puzzle'));
            cajas.map(caja => {
               caja.style.width= `${anchuraImagen}px`;
               caja.style.height= `${alturaImgane}px`;
            })
            cajas[numeroCajas].style.background= 'white';
        },
        ponerImagen: () => {
            cajas.map( caja => {
                caja.style.backgroundPosition = `${x}px ${y}px`;
                x <= -maximaAnchuraImagen ? x=0 : x=x-anchuraImagen;
                apollo++;
                if(apollo>= numeroColumnas){
                  y=y-alturaImgane;
                  apollo=0;
                }
            });
        },
        desordenarCajas: () => {
            x=0, y=0, apollo=0;
            cajas.map( (caja, index) => a.push(index));
            for (a, i = a.length; i--; ) {
                random.push(a.splice(Math.floor(Math.random() * (i + 1)), 1)[0]);
            }
            random.map( num=> {
              cajas[num].style.position= 'absolute';
              cajas[num].style.left = `${x}px`;
              cajas[num].style.top = `${y}px`;
              x >= maximaAnchuraImagen ? x=0 : x=x+anchuraImagen;
              apollo++;
              if(apollo>= numeroColumnas){
                y >= maximaALturaImagen ? y=0 : y=y+alturaImgane;
                apollo=0;
              }
              posicion.push(cajas[num].id);//posicion de las cajas

            });
            return posicion;
        },
        posicionBlanca: () => {
            posicion.map((valor, index)=>{
              if(valor== 'piece'+numeroCajas){
                div=index;
              }
            })
        },
        mover: (e, posicion) => {
          if(e.target.classList!= 'puzzle') return;
              posicion.map((id, i)=>{
                if(id==e.target.id){
                  posicionClicked=i;
                }
              })
              let targetTop= Number(getStringNumber(e.target.style.top));
              let cajaTop= Number(getStringNumber(cajas[numeroCajas].style.top));
              let targetLeft= Number(getStringNumber(e.target.style.left));
              let cajaLeft= Number(getStringNumber(cajas[numeroCajas].style.left));

              if(cajaLeft == targetLeft & targetTop == (cajaTop-alturaImgane)){signo=0;moverDiv()}
              if(cajaLeft == targetLeft & targetTop == (cajaTop+alturaImgane) ){signo=1;moverDiv()}
              if(posicionClicked==div-1 & targetLeft != maximaAnchuraImagen){signo=0;moverDiv()}
              if(posicionClicked==div+1 & targetLeft != 0){signo=1;moverDiv()}
              let sumando=0;
              posicion.map((piece,i) => {
                piece=='piece'+i ? sumando++ : null;
              })
              if(sumando==numeroCajas) {
                alert('Well Done!!');
              }
              function moverDiv(){
                  x=cajas[numeroCajas].style.left;
                  y=cajas[numeroCajas].style.top;
                  let xTarget=e.target.style.left;
                  let yTarget= e.target.style.top;

                  cajas[numeroCajas].style.left = xTarget;
                  cajas[numeroCajas].style.top = yTarget;
                  e.target.style.left = x;
                  e.target.style.top = y;

                  move(posicion, posicionClicked, div);
                  signo==1 ? move(posicion, div+1, posicionClicked) : move(posicion, div-1, posicionClicked);
                  div=posicionClicked;
                  posicionClicked=div;
              }
        },
    }
}
function getStringNumber(string){
  var txt = string;
  var numb = txt.match(/\d/g);
  numb = numb.join("");
  return numb;
}
function move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        let k = new_index - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
}
function crearPuzzle(numColumnas, numFilas){
  puzzle1= Puzzle(numColumnas,numFilas);
  puzzle1.crearDivs();
  puzzle1.ponerImagen();
  puzzle1.desordenarCajas();
  puzzle1.posicionBlanca();
}
crearPuzzle(3, 4);
var numColumnas=3;
var numFilas= 3;
function changeRange(e){
  e.target.id == 'range1' ? numColumnas= Number(e.target.value) : numFilas= Number(e.target.value);
  posicion=[];
  crearPuzzle(numColumnas, numFilas);
}
function funcc(e) {
  puzzle1.mover(e, posicion)
}

ranges.forEach(range=> addEventListener('input', changeRange))
cajas.forEach(caja=> addEventListener('click', funcc));
