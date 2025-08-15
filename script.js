const tablero = document.getElementById("tablero");
const jugar = document.getElementById("jugar");
const nivel = document.getElementById("nivel");

let imagenes = [
    "images/m1.png",
    "images/m2.png",
    "images/m6.png",
    "images/m11.png",
    "images/m5.png",
    "images/m13.png",
    "images/m7.png",
    "images/m16.png",
    "images/m15.png",
    "images/m3.png",
    "images/m17.png",
    "images/m12.png",
    "images/m4.png",
    "images/m14.png",
    "images/m9.png",
    "images/m10.png",
    "images/m21.png",
    "images/m18.png",
    "images/m19.png",
    "images/m8.png",
    "images/m20.png"
]
let cartasVolteadas = [];
let paresEncontrados = 0;
let paresNecesarios = 0;
let filas = 0;
let columnas = 0;
let tiempo = 0;
let intervalo = null;



jugar.addEventListener("click", () => {
    const dificultad = nivel.value;

    if (dificultad === "facil") {
        filas = 3; columnas = 4;
    } else if (dificultad === "medio") {
        filas = 4; columnas = 4;
    } else if (dificultad === "dificil") {
        filas = 5; columnas = 8;
    }

    iniciarJuego(filas, columnas, dificultad);
});

function iniciarJuego(filas, columnas, dificultad) {
    tablero.innerHTML = ""; 
    const totalCartas = filas * columnas;
    paresNecesarios = totalCartas / 2;
    paresEncontrados = 0;

    let imgNecesarias = imagenes.slice(0, paresNecesarios);
    let cartas = [...imgNecesarias, ...imgNecesarias];
    cartas.sort(() => Math.random() - 0.5);

    tablero.style.display = "grid";
    // auto-fit rellena tantas columnas como entren, minmax asegura tamaño adaptable
    if (dificultad === "facil" || dificultad === "medio") {
        tablero.style.gridTemplateColumns = `repeat(${columnas}, 100px)`;
    } else {
        tablero.style.gridTemplateColumns = `repeat(auto-fit, 80px)`;
    }
    
    tablero.style.maxWidth = "fit-content"; 
    tablero.style.margin = "0 auto";
    
    tablero.style.maxWidth = "100%";

    iniciarTemporizador();

    cartas.forEach(imgSrc => {
        const carta = document.createElement("div");
        carta.classList.add("carta");

        const img = document.createElement("img");
        img.src = imgSrc;
        carta.appendChild(img);
        carta.addEventListener("click", () => voltearCarta(carta));
        tablero.appendChild(carta);
    });
}


function voltearCarta(carta){
    if(cartasVolteadas.length < 2 && !carta.classList.contains("volteada")){
        carta.classList.add("volteada");
        cartasVolteadas.push(carta);

        if(cartasVolteadas.length === 2){
            setTimeout(() => {
                if(cartasVolteadas[0].querySelector("img").src !== cartasVolteadas[1].querySelector("img").src){
                    cartasVolteadas.forEach(c => c.classList.remove("volteada"));
                } else {
                    paresEncontrados++;
                    if(paresEncontrados === paresNecesarios){
                        detenerTemporizador();
                        cartelVictoria();
                    }
                }
                cartasVolteadas = [];
            }, 800);
        }
    }
}

function cartelVictoria(){
    document.getElementById("tiempoFinal").textContent = `Tu tiempo final: ${tiempo}s`;
    let modal = new bootstrap.Modal(document.getElementById('modalVictoria'));
    modal.show();
    const btnReiniciar = document.getElementById('reiniciarJuego');
    btnReiniciar.onclick = () => {
        modal.hide();               // Cerramos modal
        iniciarJuego(filas, columnas); // Reiniciamos juego con las mismas filas y columnas
    };
}

function iniciarTemporizador() {
    tiempo = 0;
    document.getElementById("tiempo").textContent = `0s`;
    intervalo = setInterval(() => {
        tiempo++;
        document.getElementById("tiempo").textContent = `${tiempo}s`;
    }, 1000);
}

function detenerTemporizador() {
    clearInterval(intervalo);
}