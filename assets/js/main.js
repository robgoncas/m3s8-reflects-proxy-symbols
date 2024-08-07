// Objeto jugador
let jugador = {
    salud: 100,
    puntos: 0,
    habilidades: []
};

// Manejador del Proxy para interceptar operaciones


//#region Symbol

function mainSymbol() {
    // Crear un Symbol con una propiedad única
    const idJugador = Symbol('id');

    // Asignar el Symbol como una propiedad del objeto jugador
    jugador[idJugador] = 12345;

    // Mostrar todas las propiedades del objeto jugador, incluido el símbolo
    for (let key in jugador) {
        console.log(key, jugador[key]);
    }

    // Acceder a la propiedad simbolizada directamente
    console.log('ID del jugador:', jugador[idJugador]);

    // Mostrar todas las propiedades del objeto jugador, incluyendo los símbolos
    console.log('Propiedades del jugador:', Object.getOwnPropertyNames(jugador));
    console.log('Propiedades del jugador (símbolos):', Object.getOwnPropertySymbols(jugador));
}

//mainSymbol();

//#endregion

//#region Proxy

function mainProxy() {

    let manejador = {
        // Intercepta la lectura de propiedades
        get: function (obj, propiedad) {
            console.log(`[PROXY] Leyendo la propiedad ${propiedad}`);
            return propiedad in obj ? obj[propiedad] : `La propiedad ${propiedad} no existe.`;
        },
        // Intercepta la escritura o modificación de propiedades
        set: function (obj, propiedad, valor) {
            if (propiedad === 'salud' && (typeof valor !== 'number' || valor < 0 || valor > 100)) {
                console.log('[PROXY] Valor inválido para salud. Debe ser un número entre 0 y 100.');
                return false;
            }
            if (propiedad === 'puntos' && typeof valor !== 'number') {
                console.log('[PROXY] Valor inválido para puntos. Debe ser un número.');
                return false;
            }
            console.log(`[PROXY] Asignando ${valor} a la propiedad ${propiedad}`);
            obj[propiedad] = valor;
            return true;
        },
        // Intercepta la obtención de nombres de propiedades
        ownKeys: function (obj) {
            console.log('[PROXY] Obteniendo todas las propiedades del objeto');
            return Reflect.ownKeys(obj);
        }
    };
    
    // Crear el Proxy del jugador
    let jugadorProxy = new Proxy(jugador, manejador);
    // Leyendo la propiedad salud, 100
    console.log(jugadorProxy.salud);
    // Valor inválido para salud. Debe ser un número entre 0 y 100.
    jugadorProxy.salud = 110;
    // Asignando 90 a la propiedad salud
    jugadorProxy.salud = 90;
    // Leyendo la propiedad salud, 90
    console.log("-------------------------El Objeto jugadorProxy también cambia el objeto jugador---------------------------");
    console.log(jugadorProxy);
    console.log(jugador);


    // Valor inválido para puntos. Debe ser un número.
    jugadorProxy.puntos = 'cien';
    // Asignando 100 a la propiedad puntos
    jugadorProxy.puntos = 100;
    // Leyendo la propiedad puntos, 100
    console.log(jugadorProxy.puntos);

    // Añadiendo 'Fuerza' a habilidades
    jugadorProxy.habilidades.push('Fuerza');
    // Leyendo la propiedad habilidades, ['Fuerza']
    console.log(jugadorProxy.habilidades);

    // La propiedad nivel no existe.
    console.log(jugadorProxy.nivel);

    // Obtener todas las propiedades del objeto (incluyendo símbolos)

    // Obteniendo todas las propiedades del objeto, ['salud', 'puntos', 'habilidades']
    console.log(Object.getOwnPropertyNames(jugadorProxy));
    // Obteniendo todas las propiedades del objeto, []
    console.log(Object.getOwnPropertySymbols(jugadorProxy));
}

//mainProxy();

//#endregion

//#region Reflect

// Función para obtener una propiedad
// Utiliza Reflect.get para obtener el valor de una propiedad de un objeto
function obtenerPropiedad(objeto, propiedad) {
    return Reflect.get(objeto, propiedad);
}

// Función para establecer una propiedad
// Utiliza Reflect.set para establecer el valor de una propiedad de un objeto
function establecerPropiedad(objeto, propiedad, valor) {
    Reflect.set(objeto, propiedad, valor);
    return objeto;
}

// Función para verificar si una propiedad existe
// Utiliza Reflect.has para verificar si una propiedad existe en un objeto
function verificarPropiedad(objeto, propiedad) {
    return Reflect.has(objeto, propiedad);
}

// Función para eliminar una propiedad
// Utiliza Reflect.deleteProperty para eliminar una propiedad de un objeto
function eliminarPropiedad(objeto, propiedad) {
    Reflect.deleteProperty(objeto, propiedad);
    return objeto;
}

// Función para definir una nueva propiedad con características específicas
// Utiliza Reflect.defineProperty para definir una nueva propiedad en un objeto con configuraciones específicas
function definirPropiedad(objeto, propiedad, valor, writable, enumerable, configurable) {
    Reflect.defineProperty(objeto, propiedad, {
        value: valor,
        writable: writable,
        enumerable: enumerable,
        configurable: configurable
    });
    return objeto;
}

// Función para obtener todas las propiedades del objeto (incluyendo no enumerables)
// Utiliza Reflect.ownKeys para obtener todas las propiedades de un objeto, incluyendo las no enumerables
function obtenerTodasPropiedades(objeto) {
    return Reflect.ownKeys(objeto);
}

function mainReflect() {
    // Obtener la propiedad 'salud'
    let saludActual = obtenerPropiedad(jugador, 'salud');
    console.log(`Salud actual: ${saludActual}`); // Salud actual: 100

    // Establecer una nueva propiedad 'nivel'
    jugador = establecerPropiedad(jugador, 'nivel', 1);
    console.log(jugador); // { salud: 100, puntos: 0, habilidades: [], nivel: 1 }

    // Verificar si la propiedad 'puntos' existe
    let tienePuntos = verificarPropiedad(jugador, 'puntos');
    console.log(`¿El jugador tiene puntos?: ${tienePuntos}`); // ¿El jugador tiene puntos?: true

    // Eliminar la propiedad 'salud'
    jugador = eliminarPropiedad(jugador, 'salud');
    console.log(jugador); // { puntos: 0, habilidades: [], nivel: 1 }

    // Definir una nueva propiedad 'nombre' con ciertas características
    jugador = definirPropiedad(jugador, 'nombre', 'Guerrero', true, true, true);
    console.log(jugador);
    // { puntos: 0, habilidades: [], nivel: 1, nombre: 'Guerrero' }

    // Obtener todas las propiedades del objeto
    let propiedadesJugador = obtenerTodasPropiedades(jugador);

    console.log(`Propiedades del jugador: ${propiedadesJugador}`);
    // Propiedades del jugador: puntos, habilidades, nivel, nombre
}

// Ejecutar la función main
mainReflect();

//#endregion