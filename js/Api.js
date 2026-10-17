
//URL del endpoint en MockAPI o el JSON local
const API_URL = "https://6ad3b70d59dd78397bbc0878.mockapi.io/departamentos";
const LOCAL_JSON_URL = "data/departamentos.json";

//Variable global en memoria para evitar peticiones repetidas
let cacheDepartamentos = null;

const API = {
  
    solicitarDatosAJAX(url) {
        return new Promise((resolve, reject) => {
            //Instancia del objeto XMLHttpRequest
            const xhr = new XMLHttpRequest();

            //Configuración de la petición HTTP GET asíncrona
            xhr.open("GET", url, true);

            //Manejador de evento al completarse la respuesta del servidor
            xhr.onload = function () {
                if (xhr.status === 200) {
                    try {
                        //Conversión de responseText a objeto JS mediante JSON.parse()
                        const datos = JSON.parse(xhr.responseText);
                        resolve(datos);
                    } catch (errorParse) {
                        reject("Error al procesar el formato JSON: " + errorParse);
                    }
                } else {
                    reject("Error en la petición. Código de estado HTTP: " + xhr.status);
                }
            };

            //Manejo de error de conexión a nivel de red
            xhr.onerror = function () {
                reject("Error de red al intentar conectar con el servidor.");
            };

            //Envío de la petición HTTP
            xhr.send(null);
        });
    },

   //Obtiene la informacion de los 14 departamentos o del archivo JSON local por si falla la red
    async obtenerDepartamentos() {
        if (cacheDepartamentos && cacheDepartamentos.length > 0) {
            return cacheDepartamentos;
        }

        try {
            console.log("Realizando petición AJAX con XMLHttpRequest a:", API_URL);
            cacheDepartamentos = await this.solicitarDatosAJAX(API_URL);
            return cacheDepartamentos;
        } catch (error) {
            console.warn("Fallo en la API REST externa. Intentando respaldo local...", error);
            try {
                cacheDepartamentos = await this.solicitarDatosAJAX(LOCAL_JSON_URL);
                return cacheDepartamentos;
            } catch (errorLocal) {
                console.error("No se pudo cargar la información:", errorLocal);
                return [];
            }
        }
    },

    
    async obtenerDepartamentoPorId(id) {
        const departamentos = await this.obtenerDepartamentos();
        return departamentos.find(d => d.id === id) || null;
    },

  
    async obtenerDepartamentosPorZona(zona) {
        const departamentos = await this.obtenerDepartamentos();
        return departamentos.filter(d => d.zona.toLowerCase() === zona.toLowerCase());
    }
};

//Se expone globalmente para que menuPrincipal.js y detalleDepto.js puedan hacer uso de el
window.API = API;