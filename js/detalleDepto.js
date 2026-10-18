//contenedores que ya existen en InfoDpto.html
const badge = document.getElementById("badge-departamento");
const contSilueta = document.getElementById("contenedor-silueta-depto");
const contTexto = document.getElementById("contenedor-texto-depto");
const contHistoria = document.getElementById("contenido-historia");
const contTradiciones = document.getElementById("contenido-tradiciones");
const contGastronomia = document.getElementById("contenido-gastronomia");
const contLugares = document.getElementById("contenido-lugares");

//el id llega por la url, por ejemplo InfoDpto.html?depto=SVSS
const params = new URLSearchParams(window.location.search);
const idDepto = params.get("depto");
 
//arma una lista con los elementos de un arreglo
function crearLista(arreglo) {
    const items = arreglo.map(elemento => `<li>${elemento}</li>`).join("");
    return `<ul>${items}</ul>`;
}

//quita el estilo gris del esqueleto y pone el contenido
function llenarContenedor(contenedor, html) {
    contenedor.classList.remove("contenedor-placeholder");
    contenedor.classList.add("contenedor-contenido");
    contenedor.innerHTML = html;
}
 
function mostrarError(mensaje) {
    badge.textContent = "Departamento no encontrado";
    contTexto.innerHTML = `<p>${mensaje}</p>`;
    document.getElementById("submenus").style.display = "none";
    document.querySelectorAll(".modulo-seccion").forEach(seccion => {
        seccion.style.display = "none";
    });
}
 
//trae img/sv.svg con ajax y deja solo el departamento que se esta viendo
function cargarSilueta(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "img/sv.svg", true);
 
    xhr.onload = function () {
        if (xhr.status === 200) {
            contSilueta.innerHTML = xhr.responseText;
            const svg = contSilueta.querySelector("svg");
 
            //quitamos los demas departamentos
            svg.querySelectorAll("#features path").forEach(path => {
                if (path.id !== id) {
                    path.remove();
                }
            });
 
            //los puntos y etiquetas del mapa no se ocupan en esta pagina
            const puntos = svg.querySelector("#points");
            if (puntos) {
                puntos.remove();
            }
            const etiquetas = svg.querySelector("#label_points");
            if (etiquetas) {
                etiquetas.remove();
            }
 
            //ajustamos el viewBox al tamaño del departamento para que se vea completo
            const caja = svg.querySelector("#features path").getBBox();
            svg.setAttribute("viewBox", `${caja.x} ${caja.y} ${caja.width} ${caja.height}`);
        } else {
            console.warn("No se pudo cargar la silueta, codigo: " + xhr.status);
        }
    };
 
    xhr.onerror = function () {
        console.warn("Error de red al cargar la silueta");
    };
 
    xhr.send();
}
 
function mostrarDepartamento(depto) {
    document.title = `${depto.nombre} - Nuestras Raíces`;
    badge.textContent = depto.nombre;

  //imagen representativa segun el id del departamento 
    if (imgDepto) {
        imgDepto.src = `img/${depto.id}.jpg`;
        imgDepto.alt = `Fotografía de ${depto.nombre}`;
        imgDepto.onerror = function () {
            this.src = "img/default.jpg";
        };
    }
 
    contTexto.innerHTML = `
        <p>${depto.nombre} es un departamento ubicado en la zona ${depto.zona} de El Salvador, su cabecera departamental es ${depto.cabecera}.</p>
        <p>Tiene una población aproximada de ${depto.poblacion.toLocaleString("es-SV")} habitantes y una extensión de ${depto.extensionKm2.toLocaleString("es-SV")} km².</p>
    `;
 
    llenarContenedor(contHistoria, `
        <p>${depto.historia}</p>
        <h3 class="h5">Municipios</h3>
        ${crearLista(depto.municipios)}
    `);
 
    llenarContenedor(contTradiciones, `
        <h3 class="h5">Fiestas patronales</h3>
        <p>${depto.fiestasPatronales}</p>
        <h3 class="h5">Personajes célebres</h3>
        ${crearLista(depto.personajesCelebres)}
    `);
 
    //el json todavia no tiene gastronomia, asi que por ahora esta vacío
    if (depto.gastronomia && depto.gastronomia.length > 0) {
        llenarContenedor(contGastronomia, `
            ${crearLista(depto.gastronomia)}
        `);
    } else {
        llenarContenedor(contGastronomia, `<p>La información de gastronomía de ${depto.nombre} se agregará pronto.</p>`);
    }
 
    llenarContenedor(contLugares, `
        <h3 class="h5">Lugares turísticos</h3>
        ${crearLista(depto.lugaresTuristicos)}
        <h3 class="h5">Ríos</h3>
        ${crearLista(depto.geografia.rios)}
        <h3 class="h5">Lagos y lagunas</h3>
        ${crearLista(depto.geografia.lagos)}
        <h3 class="h5">Volcanes y cerros</h3>
        ${crearLista(depto.geografia.volcanesCerros)}
    `);
 
    cargarSilueta(depto.id);
}
 
async function iniciar() {
    //si entran a InfoDpto.html sin elegir departamento
    if (!idDepto) {
        mostrarError("No se eligió ningún departamento, regresa al mapa y selecciona uno.");
        return;
    }
 
    const depto = await API.obtenerDepartamentoPorId(idDepto);
 
    if (!depto) {
        mostrarError(`No se encontró información para el departamento ${idDepto}.`);
        return;
    }
 
    mostrarDepartamento(depto);
}
 
iniciar();
