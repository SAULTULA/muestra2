/* =========================================================================
   LA RADIO DEL RINCON 98.7 - Datos de la aplicacion
   Configuracion por defecto, credenciales de muestra y persistencia
   en localStorage (solo afecta al navegador desde el que se edita).
   ========================================================================= */

var RADIO = (function () {
  'use strict';

  var CLAVE_ALMACEN = 'radio_rincon_config';
  var CLAVE_SESION = 'radio_rincon_sesion';

  /* ------------------------------------------------------------------
     Credenciales de muestra.
     OJO: van en el codigo del navegador, cualquiera que abra el codigo
     fuente de la web puede leerlas. Es solo para demos, nunca para un
     panel de verdad.
     ------------------------------------------------------------------ */
  var CREDENCIALES = {
    usuario: 'admin',
    clave: '1234'
  };

  /* ------------------------------------------------------------------
     Configuracion por defecto: contenido inventado de la radio.
     Lo que el visitante ve la primera vez (directo vacio a proposito).
     ------------------------------------------------------------------ */
  var CONFIG_POR_DEFECTO = {
    nombre: 'LA RADIO DEL RINCON',
    frecuencia: '98.7',
    lema: 'La radio de casa, con cariño',
    colorAcento: '#c2703f',
    colorSecundario: '#7d8f6a',
    logo: 'assets/logo.svg',

    stream: {
      youtubeUrl: '',
      tituloVivo: 'A la hora de la merienda',
      presentador: 'Marisol'
    },

    nosotros: {
      titular: 'Una radio pequeña hecha entre todos',
      texto:
        'La Radio del Rincon nacio en una cocina, con un microfono prestado y la ' +
        'necesidad de acompanar las tardes. Hoy seguimos emitiendo desde el mismo ' +
        'rincon de siempre: con voces conocidas, musica que no cansa y programacion ' +
        'pensada para estar en casa. Es una radio ficticia creada como muestra de ' +
        'demostracion, nada de lo que ocurra aqui es real.',
      stats: [
        { valor: '24/7', etiqueta: 'Siempre con la radio puesta' },
        { valor: '1996', etiqueta: 'Anio en que empezamos' },
        { valor: '7', etiqueta: 'Dias de programacion' }
      ]
    },

    programacion: [
      { dia: 'Lunes',     hora: '00:00 - 07:00', programa: 'Cuentos para dormir',    presentador: 'La Nurse de Noche' },
      { dia: 'Lunes',     hora: '07:00 - 13:00', programa: 'Desayuno en la cocina',  presentador: 'Carmen y el cafe' },
      { dia: 'Lunes',     hora: '13:00 - 19:00', programa: 'Musiquita para cocinar', presentador: 'Tio Paco' },
      { dia: 'Lunes',     hora: '19:00 - 24:00', programa: 'Buenas noches, radio',    presentador: 'Marisol' },

      { dia: 'Martes',    hora: '00:00 - 07:00', programa: 'Cuentos para dormir',    presentador: 'La Nurse de Noche' },
      { dia: 'Martes',    hora: '07:00 - 13:00', programa: 'Desayuno en la cocina',  presentador: 'Carmen y el cafe' },
      { dia: 'Martes',    hora: '13:00 - 19:00', programa: 'La hora del te',         presentador: 'Marisol' },
      { dia: 'Martes',    hora: '19:00 - 24:00', programa: 'Tapas y armonias',       presentador: 'Angel' },

      { dia: 'Miercoles', hora: '00:00 - 07:00', programa: 'Suenos de invierno',     presentador: 'La Nurse de Noche' },
      { dia: 'Miercoles', hora: '07:00 - 13:00', programa: 'Panaderia',              presentador: 'Carmen y el cafe' },
      { dia: 'Miercoles', hora: '13:00 - 19:00', programa: 'Tarde de labor',         presentador: 'Tio Paco' },
      { dia: 'Miercoles', hora: '19:00 - 24:00', programa: 'Vecinos en antena',      presentador: 'Angel' },

      { dia: 'Jueves',    hora: '00:00 - 07:00', programa: 'Cuentos para dormir',    presentador: 'La Nurse de Noche' },
      { dia: 'Jueves',    hora: '07:00 - 13:00', programa: 'Desayuno en la cocina',  presentador: 'Carmen y el cafe' },
      { dia: 'Jueves',    hora: '13:00 - 19:00', programa: 'Deberes y melodias',     presentador: 'Marisol' },
      { dia: 'Jueves',    hora: '19:00 - 24:00', programa: 'Noche de copla',         presentador: 'Tio Paco' },

      { dia: 'Viernes',   hora: '00:00 - 07:00', programa: 'Suenos de verano',      presentador: 'La Nurse de Noche' },
      { dia: 'Viernes',   hora: '07:00 - 13:00', programa: 'Desayuno en la cocina',  presentador: 'Carmen y el cafe' },
      { dia: 'Viernes',   hora: '13:00 - 19:00', programa: 'Tarde de pelicula',      presentador: 'Marisol' },
      { dia: 'Viernes',   hora: '19:00 - 24:00', programa: 'Vamos a bailar',         presentador: 'Angel' },

      { dia: 'Sabado',    hora: '00:00 - 07:00', programa: 'Cantando hasta el alba', presentador: 'Tio Paco' },
      { dia: 'Sabado',    hora: '07:00 - 13:00', programa: 'Almuerzo de domingo',    presentador: 'Carmen y el cafe' },
      { dia: 'Sabado',    hora: '13:00 - 19:00', programa: 'Tarde de balcon',        presentador: 'Marisol' },
      { dia: 'Sabado',    hora: '19:00 - 24:00', programa: 'Baile en el salon',      presentador: 'Angel' },

      { dia: 'Domingo',   hora: '00:00 - 07:00', programa: 'Dulces suenos',          presentador: 'La Nurse de Noche' },
      { dia: 'Domingo',   hora: '07:00 - 13:00', programa: 'Domingos lentos',        presentador: 'Marisol' },
      { dia: 'Domingo',   hora: '13:00 - 19:00', programa: 'Cocina de domingo',      presentador: 'Tio Paco' },
      { dia: 'Domingo',   hora: '19:00 - 24:00', programa: 'Cierre de la semana',    presentador: 'Carmen y el cafe' }
    ],

    noticias: [
      {
        fecha: '2026-09-28',
        tag: 'LA CASA',
        titulo: 'Vuelve "Cuentos para dormir", la seccion que todos pedian',
        texto:
          'La Nurse de Noche vuelve a leer cuentos a medianoche. Mandanos tu cuento ' +
          'favorito y lo leemos en antena.'
      },
      {
        fecha: '2026-09-22',
        tag: 'ENCUENTRO',
        titulo: ' cafes con los vecinos del barrio',
        texto:
          'Nos tomamos un cafe (de verdad, no de radio) con la asociacion de vecinos. ' +
          'Os contamos como fue, con muchas tazas y mucha risa.'
      },
      {
        fecha: '2026-09-15',
        tag: 'AYUDA',
        titulo: 'Abrimos una bolsa de ropa y libros para quien lo necesite',
        texto:
          'Recogemos ropa de adulto, infantil y libros en buen estado. La entrega se ' +
          'hace los sabados por la manana en el rincon de siempre.'
      },
      {
        fecha: '2026-09-08',
        tag: 'SALA',
        titulo: 'Asi suena nuestro estudio por dentro',
        texto:
          'Un recorrido tranquilo por la mesa de mezcla, los microfonos y el radiocasete ' +
          'de los 80 que aun seguimos usando.'
      },
      {
        fecha: '2026-09-02',
        tag: 'OJALAS',
        titulo: 'Nueva seccion de mensajes para los oyentes',
        texto:
          'Los mensajes de voz se leen cada viernes. Cuentanos como te va y te ' +
          'dedicamos una cancion.'
      },
      {
        fecha: '2026-08-25',
        tag: 'GRACIAS',
        titulo: 'Cumplimos 30 anos en el rincon',
        texto:
          'Celebramos con un especial de archivo de seis horas con lo mejor de las ' +
          'primeras emisiones, remasterizado con mucho cariño para la occasion.'
      }
    ],

    contactos: {
      whatsapp: '34600123456',
      telefono: '900 55 44 33',
      email: 'hola@radiorincon.demo',
      direccion: 'Calle del Home 12, 28004 Madrid',
      instagram: 'radiorincon',
      facebook: 'radiorincon',
      youtube: '@radiorincon'
    }
  };

  /* ------------------------------------------------------------------
     Utilidades internas
     ------------------------------------------------------------------ */

  function esObjeto(valor) {
    return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
  }

  function clonar(valor) {
    if (Array.isArray(valor)) return valor.map(clonar);
    if (esObjeto(valor)) {
      var copia = {};
      Object.keys(valor).forEach(function (clave) {
        copia[clave] = clonar(valor[clave]);
      });
      return copia;
    }
    return valor;
  }

  /* Fusiona datos guardados sobre la base por defecto, tolerante a que
     falten campos o tengan tipos raros (config de otra version, etc.). */
  function fusionar(base, extra) {
    if (extra === undefined || extra === null) return clonar(base);
    if (Array.isArray(base)) return Array.isArray(extra) ? clonar(extra) : clonar(base);
    if (esObjeto(base) && esObjeto(extra)) {
      var salida = clonar(base);
      Object.keys(extra).forEach(function (clave) {
        if (Object.prototype.hasOwnProperty.call(base, clave)) {
          salida[clave] = fusionar(base[clave], extra[clave]);
        }
      });
      return salida;
    }
    return typeof extra === typeof base ? extra : clonar(base);
  }

  function disponible() {
    try {
      var prueba = '__rincon__';
      window.localStorage.setItem(prueba, '1');
      window.localStorage.removeItem(prueba);
      return true;
    } catch (error) {
      return false;
    }
  }

  /* ------------------------------------------------------------------
     API publica
     ------------------------------------------------------------------ */

  function leer() {
    if (!disponible()) return clonar(CONFIG_POR_DEFECTO);
    try {
      var crudo = window.localStorage.getItem(CLAVE_ALMACEN);
      if (!crudo) return clonar(CONFIG_POR_DEFECTO);
      return fusionar(CONFIG_POR_DEFECTO, JSON.parse(crudo));
    } catch (error) {
      return clonar(CONFIG_POR_DEFECTO);
    }
  }

  function escribir(config) {
    var limpio = fusionar(CONFIG_POR_DEFECTO, config);
    if (!disponible()) return false;
    try {
      window.localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(limpio));
      return true;
    } catch (error) {
      return false;
    }
  }

  function restablecer() {
    if (!disponible()) return clonar(CONFIG_POR_DEFECTO);
    try {
      window.localStorage.removeItem(CLAVE_ALMACEN);
    } catch (error) {
      /* sin almacenamiento: se queda la de por defecto en memoria */
    }
    return clonar(CONFIG_POR_DEFECTO);
  }

  function hayCambiosGuardados() {
    return disponible() && !!window.localStorage.getItem(CLAVE_ALMACEN);
  }

  function iniciarSesion() {
    if (disponible()) window.sessionStorage.setItem(CLAVE_SESION, '1');
  }

  function cerrarSesion() {
    if (disponible()) window.sessionStorage.removeItem(CLAVE_SESION);
  }

  function sesionActiva() {
    return disponible() && window.sessionStorage.getItem(CLAVE_SESION) === '1';
  }

  return {
    CREDENCIALES: CREDENCIALES,
    dias: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    porDefecto: function () {
      return clonar(CONFIG_POR_DEFECTO);
    },
    leer: leer,
    escribir: escribir,
    restablecer: restablecer,
    hayCambiosGuardados: hayCambiosGuardados,
    iniciarSesion: iniciarSesion,
    cerrarSesion: cerrarSesion,
    sesionActiva: sesionActiva
  };
})();