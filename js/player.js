/* =========================================================================
   LA RADIO DEL RINCON 98.7 - Reproductor YouTube
   - Extrae el ID de una URL de YouTube (watch, youtu.be, live, embed, shorts)
   - Embebe con youtube-nocookie
   - Usa YouTube IFrame API para detectar estado EN VIVO (LIVE_STREAMED)
   - Arranca mudo (autoplay permitido por navegador) y gestiona volumen
   ========================================================================= */

var RADIO_PLAYER = (function () {
  'use strict';

  var YT_API_CARGADA = false;
  var CALLBACKS_ESPERANDO = [];
  var YT_PLAYER = null;
  var ID_ACTUAL = null;
  var URL_ACTUAL = '';
  var ESTADO_VIVO = false;
  var EN_ERROR = false;
  var INTERVALO_DETECCION = null;

  function onYouTubeIframeAPIReady() {
    YT_API_CARGADA = true;
    var i;
    for (i = 0; i < CALLBACKS_ESPERANDO.length; i++) {
      if (typeof CALLBACKS_ESPERANDO[i] === 'function') CALLBACKS_ESPERANDO[i]();
    }
    CALLBACKS_ESPERANDO = [];
  }

  /* Exponemos globalmente para que el script de YouTube llame */
  if (typeof window !== 'undefined') {
    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  }

  function cargarApiYT() {
    if (YT_API_CARGADA || (typeof window !== 'undefined' && window.YT && window.YT.Player)) {
      YT_API_CARGADA = true;
      return Promise.resolve();
    }
    return new Promise(function (resolver) {
      CALLBACKS_ESPERANDO.push(resolver);
      if (typeof document !== 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
      }
    });
  }

  /* Extrae ID de YouTube a partir de varias formas */
  function extraerIdYoutube(url) {
    if (!url || typeof url !== 'string') return null;
    var cadena = url.trim();
    if (cadena === '') return null;

    try {
      var u = new URL(cadena, window.location.origin);
      var host = u.hostname.toLowerCase();
      var path = u.pathname;
      var search = u.searchParams;

      if (host === 'youtu.be') {
        var idShort = path.replace('/', '').trim();
        return idShort ? idShort : null;
      }

      if (host === 'www.youtube.com' || host === 'youtube.com' || host === 'm.youtube.com') {
        if (path === '/watch') {
          return search.get('v');
        }
        if (path.startsWith('/live/')) {
          return path.split('/live/')[1] ? path.split('/live/')[1].split('?')[0].split('#')[0] : null;
        }
        if (path.startsWith('/embed/')) {
          return path.split('/embed/')[1] ? path.split('/embed/')[1].split('?')[0].split('#')[0] : null;
        }
        if (path.startsWith('/shorts/')) {
          return path.split('/shorts/')[1] ? path.split('/shorts/')[1].split('?')[0].split('#')[0] : null;
        }
      }

      /* Casos con embed directo o dominios con @ */
      if (cadena.includes('/embed/')) {
        var m1 = cadena.match(/\/embed\/([A-Za-z0-9_-]{3,})/);
        if (m1) return m1[1];
      }
      if (cadena.includes('v=')) {
        var m2 = cadena.match(/[?&]v=([A-Za-z0-9_-]{3,})/);
        if (m2) return m2[1];
      }
      if (cadena.includes('youtu.be/')) {
        var m3 = cadena.match(/youtu\.be\/([A-Za-z0-9_-]{3,})/);
        if (m3) return m3[1];
      }
      if (cadena.includes('/live/')) {
        var m4 = cadena.match(/\/live\/([A-Za-z0-9_-]{3,})/);
        if (m4) return m4[1];
      }
    } catch (e) {
      /* fallback regex */
    }

      /* Fallback robusto */
      var rg = /(youtu\.be\/|v=|\/embed\/|\/live\/|\/shorts\/)([0-9A-Za-z_-]{3,})/;
      var mm = cadena.match(rg);
      if (mm) return mm[2];

      /* ID suelto, sin URL */
      if (/^[0-9A-Za-z_-]{11}$/.test(cadena)) return cadena;

      return null;
    }

  function limpiarContenedor() {
    var cont = document.getElementById('youtube-player');
    if (cont) cont.innerHTML = '';
  }

  function mostrarPortada() {
    var wrap = document.getElementById('player-wrap');
    var estado = document.getElementById('estado-stream');
    var titulo = document.getElementById('titulo-vivo');
    var present = document.getElementById('presentador-vivo');
    var vTitulo = document.getElementById('player-vacio-titulo');
    var vTexto = document.getElementById('player-vacio-texto');
    var vBoton = document.getElementById('player-vacio-boton');
    if (wrap) {
      wrap.classList.add('player--sin-stream');
      wrap.dataset.motivo = 'vacio';
    }
    if (estado) {
      estado.textContent = 'Sin directo';
      estado.classList.remove('activo');
      estado.classList.remove('error');
    }
    if (titulo) titulo.textContent = 'Entra al panel para poner un directo';
    if (present) present.textContent = '';
    if (vTitulo) vTitulo.textContent = 'Ahora mismo no suena nada';
    if (vTexto) {
      vTexto.textContent =
        'Todavía no hay ningún directo configurado. Entra al panel y pon la dirección de tu emisión en vivo.';
    }
    if (vBoton) {
      vBoton.textContent = 'Abrir el panel';
      vBoton.setAttribute('data-accion', 'panel');
    }
    ESTADO_VIVO = false;
    EN_ERROR = false;
    marcarVivo();
  }

  function mostrarErrorEmbed() {
    var wrap = document.getElementById('player-wrap');
    var estado = document.getElementById('estado-stream');
    var titulo = document.getElementById('titulo-vivo');
    var vTitulo = document.getElementById('player-vacio-titulo');
    var vTexto = document.getElementById('player-vacio-texto');
    var vBoton = document.getElementById('player-vacio-boton');
    if (wrap) {
      wrap.classList.add('player--sin-stream');
      wrap.dataset.motivo = 'embed';
    }
    if (estado) {
      estado.textContent = 'No se puede insertar';
      estado.classList.remove('activo');
      estado.classList.add('error');
    }
    if (titulo) {
      titulo.textContent = 'Este directo no deja insertarse — puedes abrirlo en YouTube';
    }
    if (vTitulo) vTitulo.textContent = 'Este directo no se puede ver aquí';
    if (vTexto) {
      vTexto.textContent =
        'El canal tiene desactivada la inserción, así que YouTube no deja reproducirlo dentro de la web. Puedes abrirlo directamente en YouTube.';
    }
    if (vBoton) {
      vBoton.textContent = 'Abrir en YouTube';
      vBoton.setAttribute('data-accion', 'youtube');
    }
    ESTADO_VIVO = false;
    EN_ERROR = true;
    marcarVivo();
  }

  function mostrarCargando() {
    var estado = document.getElementById('estado-stream');
    var titulo = document.getElementById('titulo-vivo');
    if (estado) {
      estado.textContent = 'Conectando...';
      estado.classList.remove('activo');
      estado.classList.remove('error');
    }
    if (titulo) titulo.textContent = 'Un momento, estamos ajustando la señal...';
    ESTADO_VIVO = false;
    EN_ERROR = false;
    marcarVivo();
  }

  function marcarVivo() {
    var badge = document.querySelector('.badge-live');
    var led = document.querySelector('.led-live');
    if (badge) {
      if (ESTADO_VIVO) badge.classList.add('activo');
      else badge.classList.remove('activo');
    }
    if (led) {
      if (ESTADO_VIVO) led.classList.add('activo');
      else led.classList.remove('activo');
    }
    document.dispatchEvent(
      new CustomEvent('radio:estado-vivo', {
        detail: { vivo: ESTADO_VIVO, error: EN_ERROR, url: URL_ACTUAL }
      })
    );
  }

  function setInfoVivo(titulo, presentador) {
    var t = document.getElementById('titulo-vivo');
    var p = document.getElementById('presentador-vivo');
    if (t && titulo) t.textContent = titulo;
    if (p && presentador) p.textContent = presentador;
  }

  function detenerDeteccion() {
    if (INTERVALO_DETECCION) {
      clearInterval(INTERVALO_DETECCION);
      INTERVALO_DETECCION = null;
    }
  }

  /* El badge EN VIVO se enciende solo cuando la API confirma que es un directo.
     YT no expone "isLive" de forma estable en todos los navegadores, asi que
     usamos el evento LIVE_STREAMED y, como refuerzo, el texto del reproductor. */
  function comprobarEstadoVivo() {
    if (!YT_PLAYER) return;
    var sigue = true;

    try {
      var datos = YT_PLAYER.getVideoData ? YT_PLAYER.getVideoData() : null;
      if (datos && typeof datos.isLive === 'boolean') {
        sigue = false;
        if (datos.isLive) {
          ESTADO_VIVO = true;
          EN_ERROR = false;
          marcarVivo();
          return;
        }
      }
    } catch (e) {
      /* algunos navegadores bloquean getVideoData: seguimos con el sondeo */
    }

    try {
      var estado = YT_PLAYER.getPlayerState();
      if (estado === 0) {
        /* ha terminado: no es un directo en marcha */
        sigue = false;
        ESTADO_VIVO = false;
        marcarVivo();
        return;
      }
    } catch (e) {}

    if (sigue) detenerDeteccion();
  }

  function iniciarDeteccion() {
    detenerDeteccion();
    /* Algunos canales tardan unos segundos en identificarse como directo */
    var intentos = 0;
    INTERVALO_DETECCION = setInterval(function () {
      intentos++;
      comprobarEstadoVivo();
      if (!INTERVALO_DETECCION) return;
      if (intentos > 40) detenerDeteccion(); /* ~20s */
    }, 500);
  }

  function onPlayerStateChange(event) {
    /* YT notifica LIVE_STREAMED con event.data === 'liveStreaming' */
    if (event.data === 'liveStreaming') {
      ESTADO_VIVO = true;
      EN_ERROR = false;
      detenerDeteccion();
      marcarVivo();
      return;
    }
    if (event.data === 0) {
      /* el vídeo ha terminado: ya no estamos en directo */
      ESTADO_VIVO = false;
      detenerDeteccion();
      marcarVivo();
      return;
    }
    if (event.data === 1 || event.data === 3) {
      comprobarEstadoVivo();
    }
  }

  function onPlayerError(event) {
    /* Error frecuente 100/101/150 cuando no permite inserción */
    EN_ERROR = true;
    mostrarErrorEmbed();
    detenerDeteccion();
  }

  function crearPlayer(id) {
    var cont = document.getElementById('youtube-player');
    if (!cont) return;
    limpiarContenedor();
    cargarApiYT().then(function () {
      YT_PLAYER = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: id,
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: function (ev) {
            try {
              ev.target.setVolume(40);
            } catch (e) {}
            var estado = document.getElementById('estado-stream');
            if (estado) {
              estado.textContent = 'Buscando la señal...';
              estado.classList.remove('error');
            }
            iniciarDeteccion();
          },
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    });
  }

  function reproducirUrl(url, tituloVivo, presentador) {
    URL_ACTUAL = url || '';
    var id = extraerIdYoutube(URL_ACTUAL);
    var wrap = document.getElementById('player-wrap');
    if (wrap) {
      wrap.classList.remove('player--sin-stream');
      wrap.dataset.motivo = '';
    }

    if (!id) {
      ID_ACTUAL = null;
      if (YT_PLAYER && typeof YT_PLAYER.destroy === 'function') {
        try {
          YT_PLAYER.destroy();
        } catch (e) {}
        YT_PLAYER = null;
      }
      mostrarPortada();
      setInfoVivo(tituloVivo || 'Todavía no hay directo', presentador || '');
      return { ok: false, motivo: 'sin-id' };
    }

    ID_ACTUAL = id;
    mostrarCargando();
    setInfoVivo(tituloVivo || 'En directo', presentador || '');
    crearPlayer(id);
    return { ok: true, id: id };
  }

  function destruir() {
    detenerDeteccion();
    if (YT_PLAYER && typeof YT_PLAYER.destroy === 'function') {
      try {
        YT_PLAYER.destroy();
      } catch (e) {}
    }
    YT_PLAYER = null;
    ID_ACTUAL = null;
    URL_ACTUAL = '';
    ESTADO_VIVO = false;
    EN_ERROR = false;
  }

  function subirVolumen() {
    if (YT_PLAYER && typeof YT_PLAYER.setVolume === 'function') {
      var v = YT_PLAYER.getVolume ? YT_PLAYER.getVolume() : 40;
      v = Math.min(100, v + 10);
      YT_PLAYER.setVolume(v);
      if (YT_PLAYER.unMute) YT_PLAYER.unMute();
      return v;
    }
    return 40;
  }

  function bajarVolumen() {
    if (YT_PLAYER && typeof YT_PLAYER.setVolume === 'function') {
      var v = YT_PLAYER.getVolume ? YT_PLAYER.getVolume() : 40;
      v = Math.max(0, v - 10);
      YT_PLAYER.setVolume(v);
      return v;
    }
    return 40;
  }

  function mutear() {
    if (YT_PLAYER && typeof YT_PLAYER.mute === 'function') {
      YT_PLAYER.mute();
    }
  }

  function activar() {
    if (YT_PLAYER && typeof YT_PLAYER.unMute === 'function') {
      YT_PLAYER.unMute();
    }
  }

  function abrirEnYoutube() {
    if (URL_ACTUAL) window.open(URL_ACTUAL, '_blank', 'noopener,noreferrer');
    else if (ID_ACTUAL) window.open('https://www.youtube.com/watch?v=' + ID_ACTUAL, '_blank', 'noopener,noreferrer');
  }

  function obtenerUrlActual() {
    return URL_ACTUAL;
  }

  function obtenerIdActual() {
    return ID_ACTUAL;
  }

  function estaVivo() {
    return ESTADO_VIVO;
  }

  function hayError() {
    return EN_ERROR;
  }

  return {
    extraerIdYoutube: extraerIdYoutube,
    reproducirUrl: reproducirUrl,
    destruir: destruir,
    subirVolumen: subirVolumen,
    bajarVolumen: bajarVolumen,
    mutear: mutear,
    activar: activar,
    abrirEnYoutube: abrirEnYoutube,
    obtenerUrlActual: obtenerUrlActual,
    obtenerIdActual: obtenerIdActual,
    estaVivo: estaVivo,
    hayError: hayError,
    mostrarPortada: mostrarPortada,
    mostrarErrorEmbed: mostrarErrorEmbed
  };
})();
