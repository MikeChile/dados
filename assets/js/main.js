
//clase
function Jugador(nombre) {
    // Nombre del jugador
    this.nombre = nombre;
    // ID del jugador usando Symbol
    this[simboloJugador] = 'jugador_' + (jugadores.length + 1);
}

//arreglo de jugadores
let jugadores = [];

//arreglo de resultados
let resultados = [];

// Symbol para identificar a los jugadores
var simboloJugador = Symbol('id');

// Proxy para validar y manejar los jugadores
var manejadorJugador = {

    set: function (target, prop, value) {
        //alert("estoy modificando una propiedad del objeto jugador")
        // Validar y establecer el nombre del jugador
        if (prop === 'nombre' && typeof value === 'string' && value.trim().length > 0) {
            Reflect.set(target, prop, value.trim());

            alert('Nombre valido');
            return true;
        } else {
            alert('Nombre inválido');
            return false;
        }

    },
    get: function (target, prop) {

        // Obtener el ID del jugador usando Symbol
        if (prop === 'id') {
            return Reflect.get(target, simboloJugador);
        }
        // Obtener el nombre del jugador
        else if (prop === 'nombre') {
            return Reflect.get(target, 'nombre');
        }
        // Devolver undefined para cualquier otra propiedad
        else {
            return undefined;
        }
    }
};

//agregar jugador
function agregarJugador() {
    let nombreJugador = prompt('Añade nombre del jugador');

    //validar que el nombre no sea nulo ni este vacio
    if (nombreJugador != '' && nombreJugador.trim().length > 0) {

        //crear objeto jugador
        // Crear un nuevo jugador
        var jugador = new Jugador(nombreJugador);
        // Crear un proxy para el jugador
        var proxyJugador = new Proxy(jugador, manejadorJugador);
        // Agregar el jugador al arreglo de jugadores
        jugadores.push(proxyJugador);
        alert('Jugador agregado: ' + nombreJugador + ' (' + proxyJugador.id + ')');

        // Actualizar el contenido del div con los jugadores agregados
        let jugadoresDiv = document.getElementById('cajaJugadores');
        jugadoresDiv.innerHTML = '';
        jugadores.forEach(jugador => {
            jugadoresDiv.innerHTML += `<div class="col col-md-3">${jugador.nombre} (${jugador.id})</div>`;
        });

        // Mostrar el div con los jugadores agregados
        jugadoresDiv.style.display = 'flex';
    } else {
        alert('Nombre no valido');
    }

}

let historialTiradas = {};


//funcion lanzar dados
function lanzarDados() {

    resultados = []; // Reiniciar el arreglo de resultados

    //validar que haya 2 jugadores
    if (jugadores.length < 2) {
        alert('Necesita al menos dos jugadores');
    } else {
        let html = "<table class='table table-striped'>";
        html += "<tr><th>Jugador</th><th>Resultado</th></tr>";

        //recorrer la cantidad de jugadores
        for (let i = 0; i < jugadores.length; i++) {

            //generar numeros aleatorios del 1 al 6
            let dado = Math.floor(Math.random() * 6) + 1;

            html += `<tr><td>${jugadores[i].nombre}(${jugadores[i].id})</td><td>${dado}</td></tr>`;

            let jugador = jugadores[i];

            // Inicializar el historial del jugador si no existe
            if (!historialTiradas[jugador.nombre]) {
                historialTiradas[jugador.nombre] = [];
            }

            // Agregar la tirada al historial del jugador
            historialTiradas[jugador.nombre].push(dado);

            //guardar resultados
            resultados.push(dado);
            console.log(dado);
        }

        mostrarGanador();

        function mostrarGanador() {
            let ganador = "";
            let maxResultado = Math.max(...resultados);
            let indicesGanadores = [];

            // Buscar todos los jugadores con el máximo resultado
            for (let i = 0; i < resultados.length; i++) {
                if (resultados[i] === maxResultado) {
                    indicesGanadores.push(i);
                }
            }

            // Verificar si hay un empate
            if (indicesGanadores.length > 1) {
                ganador = "Empate";
            } else {
                let indiceGanador = indicesGanadores[0];
                ganador = `El ganador de la ronda es el jugador: <b>${jugadores[indiceGanador].nombre.toUpperCase()}</b> (${indiceGanador + 1})`;
            }

            document.getElementById("ganador").innerHTML = ganador;
        }


        document.getElementById("cajaResultado").innerHTML = html;
    }

}

// Función para mostrar el historial de tiradas de cada jugador
function mostrarHistorialTiradas() {
    let htmlt = "";
    let totalRondas = 0;
    let acumulaciones = {};

    // Calcular el total de rondas
    for (let jugador in historialTiradas) {
        totalRondas = Math.max(totalRondas, historialTiradas[jugador].length);
        acumulaciones[jugador] = 0;
    }

    // Mostrar el total de rondas
    htmlt += `<p>Total de rondas: ${totalRondas}</p>`;
    htmlt += `<hr>`;
    // Mostrar las tiradas de cada jugador por ronda
    for (let i = 0; i < totalRondas; i++) {
        htmlt += `<p>Ronda ${i + 1}</p>`;
        for (let jugador in historialTiradas) {
            let tiradas = historialTiradas[jugador];
            let tirada = tiradas[i];
            if (tirada !== undefined) {
                let objetoJugador = jugadores.find(j => j.nombre === jugador);
                htmlt += `<p>Jugador ${objetoJugador.nombre} (${objetoJugador.id}): ${tirada}</p>`;
                acumulaciones[jugador] += tirada;
            }
        }
        htmlt += `<hr>`;
    }

    // Mostrar el resumen de acumulaciones
    htmlt += "<p>Resumen:</p>";
    for (let jugador in acumulaciones) {
        let objetoJugador = jugadores.find(j => j.nombre === jugador);
        htmlt += `<p>Jugador ${objetoJugador.nombre} (${objetoJugador.id}): ${acumulaciones[jugador]}</p>`;
    }

    // Determinar al ganador
    let maxAcumulacion = Math.max(...Object.values(acumulaciones));
    let ganador = Object.keys(acumulaciones).find(jugador => acumulaciones[jugador] === maxAcumulacion);
    let objetoGanador = jugadores.find(j => j.nombre === ganador);
    htmlt += `<p>Ganador: Jugador ${objetoGanador.nombre} (${objetoGanador.id})</p>`;

    document.getElementById("historialTiradas").innerHTML = htmlt;
}