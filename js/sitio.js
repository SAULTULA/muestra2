/* =========================================================================
   LA RADIO DEL RINCON 98.7 - Renderizado del sitio
   - Lee configuracion (RADIO.leer)
   - Actualiza header, hero, programacion, noticias, nosotros, contacto
   - Sincroniza colores de acento con CSS
   ========================================================================= */

var RADIO_SITIO = (function () {
  'use strict';

  var CONFIG_ACTUAL = null;

  function actualizarAcento() {
    if (!CONFIG_ACTUAL) return;
    var root = document.documentElement;
    if (root) {
      root.style.setProperty('--acento', CONFIG_ACTUAL.colorAcento);
      root.style.setProperty('--acento2', CONFIG_ACTUAL.colorSecundario);
    }
    var logoImg = document.getElementById('logo-img');
    if (logoImg && CONFIG_ACTUAL.logo) {
      logoImg.src = CONFIG_ACTUAL.logo;
      logoImg.alt = CONFIG_ACTUAL.nombre + ' - logo';
    }
  }

  function renderHeader() {
    var nombre = document.getElementById('nombre-radio');
    var lema = document.getElementById('lema-radio');
    var freq = document.getElementById('frecuencia-radio');
    if (nombre) nombre.textContent = CONFIG_ACTUAL.nombre || 'LA RADIO DEL RINCON';
    if (lema) lema.textContent = CONFIG_ACTUAL.lema || '';
    if (freq) freq.textContent = CONFIG_ACTUAL.frecuencia ? CONFIG_ACTUAL.frecuencia + ' FM' : '98.7 FM';
    document.title =
      (CONFIG_ACTUAL.nombre || 'LA RADIO DEL RINCON') +
      ' ' +
      (CONFIG_ACTUAL.frecuencia || '98.7') +
      ' FM — Web de muestra';
  }

  function renderHero() {
    var tituloVivo = document.getElementById('titulo-vivo');
    var presentadorVivo = document.getElementById('presentador-vivo');
    if (tituloVivo) tituloVivo.textContent = CONFIG_ACTUAL.stream.tituloVivo || 'Sin directo configurado';
    if (presentadorVivo) presentadorVivo.textContent = CONFIG_ACTUAL.stream.presentador || '';
  }

  function renderProgramacion() {
    var tbody = document.getElementById('tbody-programacion');
    if (!tbody) return;
    tbody.innerHTML = '';
    var lista = CONFIG_ACTUAL.programacion || [];
    var i;
    for (i = 0; i < lista.length; i++) {
      var item = lista[i];
      var tr = document.createElement('tr');
      var tdDia = document.createElement('td');
      var tdHora = document.createElement('td');
      var tdProg = document.createElement('td');
      var tdPres = document.createElement('td');
      tdDia.textContent = item.dia || '';
      tdHora.textContent = item.hora || '';
      tdProg.textContent = item.programa || '';
      tdPres.textContent = item.presentador || '';
      tr.appendChild(tdDia);
      tr.appendChild(tdHora);
      tr.appendChild(tdProg);
      tr.appendChild(tdPres);
      tbody.appendChild(tr);
    }
  }

  function renderNoticias() {
    var grid = document.getElementById('grid-noticias');
    if (!grid) return;
    grid.innerHTML = '';
    var lista = CONFIG_ACTUAL.noticias || [];
    var i;
    for (i = 0; i < lista.length; i++) {
      var n = lista[i];
      var card = document.createElement('article');
      card.className = 'card-noticia';
      var fecha = document.createElement('div');
      fecha.className = 'noticia-fecha';
      fecha.textContent = formatearFecha(n.fecha);
      var tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = n.tag || 'NOVA';
      var titulo = document.createElement('h3');
      titulo.textContent = n.titulo || '';
      var texto = document.createElement('p');
      texto.textContent = n.texto || '';
      card.appendChild(fecha);
      card.appendChild(tag);
      card.appendChild(titulo);
      card.appendChild(texto);
      grid.appendChild(card);
    }
  }

  function formatearFecha(f) {
    if (!f) return '';
    var d = new Date(f + 'T00:00:00');
    if (isNaN(d.getTime())) return f;
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function renderNosotros() {
    var titular = document.getElementById('nosotros-titular');
    var texto = document.getElementById('nosotros-texto');
    var stats = document.getElementById('nosotros-stats');
    if (titular) titular.textContent = CONFIG_ACTUAL.nosotros.titular || '';
    if (texto) texto.textContent = CONFIG_ACTUAL.nosotros.texto || '';
    if (stats) {
      stats.innerHTML = '';
      var s = CONFIG_ACTUAL.nosotros.stats || [];
      var i;
      for (i = 0; i < s.length; i++) {
        var it = s[i];
        var div = document.createElement('div');
        div.className = 'stat';
        var val = document.createElement('span');
        val.className = 'stat-valor';
        val.textContent = it.valor || '';
        var et = document.createElement('span');
        et.className = 'stat-etiqueta';
        et.textContent = it.etiqueta || '';
        div.appendChild(val);
        div.appendChild(et);
        stats.appendChild(div);
      }
    }
  }

  function renderContactos() {
    var w = document.getElementById('contacto-whatsapp');
    var t = document.getElementById('contacto-telefono');
    var e = document.getElementById('contacto-email');
    var dir = document.getElementById('contacto-direccion');
    var ig = document.getElementById('contacto-instagram');
    var fb = document.getElementById('contacto-facebook');
    var yt = document.getElementById('contacto-youtube');

    var c = CONFIG_ACTUAL.contactos || {};
    if (w) w.textContent = c.whatsapp || '';
    if (t) t.textContent = c.telefono || '';
    if (e) e.textContent = c.email || '';
    if (dir) dir.textContent = c.direccion || '';
    if (ig) ig.textContent = c.instagram ? '@' + c.instagram.replace('@', '') : '';
    if (fb) fb.textContent = c.facebook ? '/' + c.facebook.replace('/', '') : '';
    if (yt) yt.textContent = c.youtube || '';

    var linkW = document.getElementById('link-whatsapp');
    var linkT = document.getElementById('link-telefono');
    var linkE = document.getElementById('link-email');
    var linkIg = document.getElementById('link-instagram');
    var linkFb = document.getElementById('link-facebook');
    var linkYt = document.getElementById('link-youtube');

    if (linkW && c.whatsapp) {
      var num = c.whatsapp.replace(/[^0-9]/g, '');
      linkW.href = 'https://wa.me/' + num;
    } else if (linkW) {
      linkW.removeAttribute('href');
    }
    if (linkT && c.telefono) linkT.href = 'tel:' + c.telefono.replace(/\s+/g, '');
    else if (linkT) linkT.removeAttribute('href');
    if (linkE && c.email) linkE.href = 'mailto:' + c.email;
    else if (linkE) linkE.removeAttribute('href');
    if (linkIg && c.instagram) {
      var igClean = c.instagram.replace('@', '');
      linkIg.href = 'https://www.instagram.com/' + igClean + '/';
    } else if (linkIg) linkIg.removeAttribute('href');
    if (linkFb && c.facebook) {
      var fbClean = c.facebook.replace(/^\/+/, '');
      linkFb.href = 'https://www.facebook.com/' + fbClean;
    } else if (linkFb) linkFb.removeAttribute('href');
    if (linkYt && c.youtube) {
      var ytClean = c.youtube.replace('@', '');
      linkYt.href = 'https://www.youtube.com/' + (c.youtube.startsWith('@') ? c.youtube : '@' + ytClean);
    } else if (linkYt) linkYt.removeAttribute('href');
  }

  function actualizarStream() {
    if (window.RADIO_PLAYER && CONFIG_ACTUAL.stream) {
      RADIO_PLAYER.reproducirUrl(
        CONFIG_ACTUAL.stream.youtubeUrl || '',
        CONFIG_ACTUAL.stream.tituloVivo || '',
        CONFIG_ACTUAL.stream.presentador || ''
      );
    }
  }

  function aplicar() {
    CONFIG_ACTUAL = RADIO.leer();
    renderHeader();
    renderHero();
    renderProgramacion();
    renderNoticias();
    renderNosotros();
    renderContactos();
    actualizarAcento();
    actualizarStream();
  }

  document.addEventListener('radio:config-cambiada', aplicar);

  return {
    aplicar: aplicar
  };
})();
