/* =========================================================================
   LA RADIO DEL RINCON 98.7 - Panel de administracion
   - Login con usuario/clave: admin / 1234
   - Pestañas: Identidad, Directo, Programacion, Noticias, Contactos
   - Guarda en localStorage, restaura por defecto
   ========================================================================= */

var RADIO_ADMIN = (function () {
  'use strict';

  var MODAL_LOGIN = null;
  var MODAL_PANEL = null;
  var FORM_LOGIN = null;
  var BTN_ADMIN = null;
  var BTN_CERRAR_LOGIN = null;
  var BTN_CERRAR_PANEL = null;
  var BTN_LOGOUT = null;
  var BTN_GUARDAR = null;
  var BTN_RESTABLECER = null;
  var BTN_PROBAR = null;
  var ERROR_LOGIN = null;
  var AVISO_DEMO = null;

  var TABS = [];
  var TAB_CONTENTS = [];

  var CONFIG_EDIT = null;

  function obtenerElementos() {
    MODAL_LOGIN = document.getElementById('modal-login');
    MODAL_PANEL = document.getElementById('modal-panel');
    FORM_LOGIN = document.getElementById('form-login');
    BTN_ADMIN = document.getElementById('btn-admin');
    BTN_CERRAR_LOGIN = document.getElementById('btn-cerrar-login');
    BTN_CERRAR_PANEL = document.getElementById('btn-cerrar-panel');
    BTN_LOGOUT = document.getElementById('btn-logout');
    BTN_GUARDAR = document.getElementById('btn-guardar');
    BTN_RESTABLECER = document.getElementById('btn-restablecer');
    BTN_PROBAR = document.getElementById('btn-probar');
    ERROR_LOGIN = document.getElementById('error-login');
    AVISO_DEMO = document.getElementById('aviso-demo');

    TABS = Array.prototype.slice.call(document.querySelectorAll('.tab'));
    TAB_CONTENTS = Array.prototype.slice.call(document.querySelectorAll('.tab-content'));
  }

  function abrirLogin() {
    if (MODAL_LOGIN) MODAL_LOGIN.classList.add('abierto');
    var usuario = document.getElementById('input-usuario');
    if (usuario) usuario.focus();
    if (ERROR_LOGIN) ERROR_LOGIN.textContent = '';
  }

  function cerrarLogin() {
    if (MODAL_LOGIN) MODAL_LOGIN.classList.remove('abierto');
    if (FORM_LOGIN) FORM_LOGIN.reset();
    if (ERROR_LOGIN) ERROR_LOGIN.textContent = '';
  }

  function abrirPanel() {
    if (MODAL_PANEL) MODAL_PANEL.classList.add('abierto');
    activarTab('identidad');
  }

  function cerrarPanel() {
    if (MODAL_PANEL) MODAL_PANEL.classList.remove('abierto');
  }

  function activarTab(id) {
    var i;
    for (i = 0; i < TABS.length; i++) {
      if (TABS[i].dataset.tab === id) TABS[i].classList.add('activo');
      else TABS[i].classList.remove('activo');
    }
    for (i = 0; i < TAB_CONTENTS.length; i++) {
      if (TAB_CONTENTS[i].id === 'tab-' + id) TAB_CONTENTS[i].classList.add('activo');
      else TAB_CONTENTS[i].classList.remove('activo');
    }
  }

  function cargarConfigEnFormulario() {
    CONFIG_EDIT = RADIO.leer();
    var c = CONFIG_EDIT;

    document.getElementById('nombre').value = c.nombre || '';
    document.getElementById('frecuencia').value = c.frecuencia || '';
    document.getElementById('lema').value = c.lema || '';
    document.getElementById('colorAcento').value = c.colorAcento || '#ff2d95';
    document.getElementById('colorSecundario').value = c.colorSecundario || '#00e5ff';
    document.getElementById('logo').value = c.logo || 'assets/logo.svg';

    document.getElementById('youtubeUrl').value = (c.stream && c.stream.youtubeUrl) || '';
    document.getElementById('tituloVivo').value = (c.stream && c.stream.tituloVivo) || '';
    document.getElementById('presentadorVivo').value = (c.stream && c.stream.presentador) || '';

    cargarTablaProgramacion();
    cargarTablaNoticias();
    cargarContactos();
    actualizarVistaPreviaColor();
    if (AVISO_DEMO) AVISO_DEMO.textContent = RADIO.hayCambiosGuardados() ? 'Hay cambios guardados en este navegador' : 'Usando configuración por defecto';
  }

  function cargarTablaProgramacion() {
    var tbody = document.getElementById('tbody-prog');
    if (!tbody) return;
    tbody.innerHTML = '';
    var lista = CONFIG_EDIT.programacion || [];
    var i;
    for (i = 0; i < lista.length; i++) {
      tbody.appendChild(filaProgramacion(lista[i]));
    }
  }

  function filaProgramacion(item) {
    var tr = document.createElement('tr');
    var tdDia = document.createElement('td');
    var selDia = document.createElement('select');
    var dias = RADIO.dias || ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    var j;
    for (j = 0; j < dias.length; j++) {
      var opt = document.createElement('option');
      opt.value = dias[j];
      opt.textContent = dias[j];
      if (item && item.dia === dias[j]) opt.selected = true;
      selDia.appendChild(opt);
    }
    tdDia.appendChild(selDia);
    tr.appendChild(tdDia);

    var tdHora = document.createElement('td');
    var inpHora = document.createElement('input');
    inpHora.type = 'text';
    inpHora.placeholder = '00:00 - 06:00';
    inpHora.value = (item && item.hora) || '';
    tdHora.appendChild(inpHora);
    tr.appendChild(tdHora);

    var tdProg = document.createElement('td');
    var inpProg = document.createElement('input');
    inpProg.type = 'text';
    inpProg.placeholder = 'Nombre del programa';
    inpProg.value = (item && item.programa) || '';
    tdProg.appendChild(inpProg);
    tr.appendChild(tdProg);

    var tdPres = document.createElement('td');
    var inpPres = document.createElement('input');
    inpPres.type = 'text';
    inpPres.placeholder = 'Presentador';
    inpPres.value = (item && item.presentador) || '';
    tdPres.appendChild(inpPres);
    tr.appendChild(tdPres);

    var tdAcc = document.createElement('td');
    var btnB = document.createElement('button');
    btnB.type = 'button';
    btnB.className = 'btn btn--ghost btn--small';
    btnB.textContent = 'Borrar';
    btnB.addEventListener('click', function () {
      tr.remove();
    });
    tdAcc.appendChild(btnB);
    tr.appendChild(tdAcc);
    return tr;
  }

  function agregarProgramacion() {
    var tbody = document.getElementById('tbody-prog');
    if (tbody) tbody.appendChild(filaProgramacion({}));
  }

  function cargarTablaNoticias() {
    var tbody = document.getElementById('tbody-noticias');
    if (!tbody) return;
    tbody.innerHTML = '';
    var lista = CONFIG_EDIT.noticias || [];
    var i;
    for (i = 0; i < lista.length; i++) {
      tbody.appendChild(filaNoticia(lista[i]));
    }
  }

  function filaNoticia(item) {
    var tr = document.createElement('tr');
    var tdFecha = document.createElement('td');
    var inpF = document.createElement('input');
    inpF.type = 'date';
    inpF.value = (item && item.fecha) || '';
    tdFecha.appendChild(inpF);
    tr.appendChild(tdFecha);

    var tdTag = document.createElement('td');
    var inpT = document.createElement('input');
    inpT.type = 'text';
    inpT.placeholder = 'TAG';
    inpT.value = (item && item.tag) || '';
    tdTag.appendChild(inpT);
    tr.appendChild(tdTag);

    var tdTit = document.createElement('td');
    var inpTit = document.createElement('input');
    inpTit.type = 'text';
    inpTit.placeholder = 'Titular';
    inpTit.value = (item && item.titulo) || '';
    tdTit.appendChild(inpTit);
    tr.appendChild(tdTit);

    var tdTxt = document.createElement('td');
    var txt = document.createElement('textarea');
    txt.rows = 2;
    txt.placeholder = 'Texto de la noticia';
    txt.value = (item && item.texto) || '';
    tdTxt.appendChild(txt);
    tr.appendChild(tdTxt);

    var tdAcc = document.createElement('td');
    var btnB = document.createElement('button');
    btnB.type = 'button';
    btnB.className = 'btn btn--ghost btn--small';
    btnB.textContent = 'Borrar';
    btnB.addEventListener('click', function () {
      tr.remove();
    });
    tdAcc.appendChild(btnB);
    tr.appendChild(tdAcc);
    return tr;
  }

  function agregarNoticia() {
    var tbody = document.getElementById('tbody-noticias');
    if (tbody) tbody.appendChild(filaNoticia({}));
  }

  function cargarContactos() {
    var c = CONFIG_EDIT.contactos || {};
    document.getElementById('whatsapp').value = c.whatsapp || '';
    document.getElementById('telefono').value = c.telefono || '';
    document.getElementById('email').value = c.email || '';
    document.getElementById('direccion').value = c.direccion || '';
    document.getElementById('instagram').value = c.instagram || '';
    document.getElementById('facebook').value = c.facebook || '';
    document.getElementById('youtube').value = c.youtube || '';
  }

  function actualizarVistaPreviaColor() {
    var c1 = document.getElementById('colorAcento').value;
    var c2 = document.getElementById('colorSecundario').value;
    var prev = document.getElementById('color-prev');
    if (prev) prev.style.background = 'linear-gradient(45deg, ' + c1 + ' 0%, ' + c2 + ' 100%)';
  }

  function recogerFormulario() {
    var c = JSON.parse(JSON.stringify(CONFIG_EDIT));

    c.nombre = document.getElementById('nombre').value.trim();
    c.frecuencia = document.getElementById('frecuencia').value.trim();
    c.lema = document.getElementById('lema').value.trim();
    c.colorAcento = document.getElementById('colorAcento').value;
    c.colorSecundario = document.getElementById('colorSecundario').value;
    c.logo = document.getElementById('logo').value.trim();

    c.stream = {
      youtubeUrl: document.getElementById('youtubeUrl').value.trim(),
      tituloVivo: document.getElementById('tituloVivo').value.trim(),
      presentador: document.getElementById('presentadorVivo').value.trim()
    };

    c.programacion = recogerTablaProgramacion();
    c.noticias = recogerTablaNoticias();

    c.contactos = {
      whatsapp: document.getElementById('whatsapp').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      email: document.getElementById('email').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      instagram: document.getElementById('instagram').value.trim(),
      facebook: document.getElementById('facebook').value.trim(),
      youtube: document.getElementById('youtube').value.trim()
    };
    return c;
  }

  function recogerTablaProgramacion() {
    var tbody = document.getElementById('tbody-prog');
    if (!tbody) return [];
    var filas = tbody.querySelectorAll('tr');
    var res = [];
    var i;
    for (i = 0; i < filas.length; i++) {
      var tr = filas[i];
      var sel = tr.querySelector('select');
      var inps = tr.querySelectorAll('input');
      var dia = sel ? sel.value : '';
      var hora = inps[0] ? inps[0].value.trim() : '';
      var prog = inps[1] ? inps[1].value.trim() : '';
      var pres = inps[2] ? inps[2].value.trim() : '';
      if (dia || hora || prog || pres) {
        res.push({ dia: dia, hora: hora, programa: prog, presentador: pres });
      }
    }
    return res;
  }

  function recogerTablaNoticias() {
    var tbody = document.getElementById('tbody-noticias');
    if (!tbody) return [];
    var filas = tbody.querySelectorAll('tr');
    var res = [];
    var i;
    for (i = 0; i < filas.length; i++) {
      var tr = filas[i];
      var inps = tr.querySelectorAll('input, textarea');
      var fecha = inps[0] ? inps[0].value : '';
      var tag = inps[1] ? inps[1].value.trim() : '';
      var tit = inps[2] ? inps[2].value.trim() : '';
      var txt = inps[3] ? inps[3].value.trim() : '';
      if (fecha || tag || tit || txt) {
        res.push({ fecha: fecha, tag: tag, titulo: tit, texto: txt });
      }
    }
    return res;
  }

  function guardar() {
    var nueva = recogerFormulario();
    if (RADIO.escribir(nueva)) {
      CONFIG_EDIT = nueva;
      document.dispatchEvent(new CustomEvent('radio:config-cambiada'));
      if (AVISO_DEMO) AVISO_DEMO.textContent = 'Cambios guardados en este navegador';
      cerrarPanel();
      abrirAviso('Cambios guardados correctamente. Se aplican sin recargar.');
    } else {
      abrirAviso('No se ha podido guardar en localStorage. El navegador puede bloquearlo.');
    }
  }

  function restablecer() {
    RADIO.restablecer();
    document.dispatchEvent(new CustomEvent('radio:config-cambiada'));
    cargarConfigEnFormulario();
    abrirAviso('Configuración restablecida a los valores por defecto.');
  }

  function abrirAviso(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    setTimeout(function () {
      el.classList.remove('visible');
    }, 2200);
  }

  function probarDirecto() {
    var url = document.getElementById('youtubeUrl').value.trim();
    var t = document.getElementById('tituloVivo').value.trim();
    var p = document.getElementById('presentadorVivo').value.trim();
    if (window.RADIO_PLAYER) {
      RADIO_PLAYER.reproducirUrl(url, t, p);
      abrirAviso('Probando directo en el reproductor...');
    }
  }

  function login() {
    var u = document.getElementById('input-usuario').value.trim();
    var k = document.getElementById('input-clave').value.trim();
    var cred = RADIO.CREDENCIALES;
    if (u === cred.usuario && k === cred.clave) {
      RADIO.iniciarSesion();
      cerrarLogin();
      cargarConfigEnFormulario();
      abrirPanel();
    } else {
      if (ERROR_LOGIN) ERROR_LOGIN.textContent = 'Usuario o contraseña incorrectos.';
      var inpK = document.getElementById('input-clave');
      if (inpK) {
        inpK.value = '';
        inpK.focus();
      }
    }
  }

  function logout() {
    RADIO.cerrarSesion();
    cerrarPanel();
  }

  function vincularEventos() {
    if (BTN_ADMIN) BTN_ADMIN.addEventListener('click', function () {
      if (RADIO.sesionActiva()) {
        cargarConfigEnFormulario();
        abrirPanel();
      } else {
        abrirLogin();
      }
    });
    if (BTN_CERRAR_LOGIN) BTN_CERRAR_LOGIN.addEventListener('click', cerrarLogin);
    if (BTN_CERRAR_PANEL) BTN_CERRAR_PANEL.addEventListener('click', cerrarPanel);
    if (BTN_LOGOUT) BTN_LOGOUT.addEventListener('click', logout);
    if (BTN_GUARDAR) BTN_GUARDAR.addEventListener('click', guardar);
    if (BTN_RESTABLECER) BTN_RESTABLECER.addEventListener('click', restablecer);
    if (BTN_PROBAR) BTN_PROBAR.addEventListener('click', probarDirecto);
    if (FORM_LOGIN) FORM_LOGIN.addEventListener('submit', function (e) {
      e.preventDefault();
      login();
    });

    var btnAddProg = document.getElementById('btn-add-prog');
    if (btnAddProg) btnAddProg.addEventListener('click', agregarProgramacion);
    var btnAddNot = document.getElementById('btn-add-noticia');
    if (btnAddNot) btnAddNot.addEventListener('click', agregarNoticia);

    var color1 = document.getElementById('colorAcento');
    var color2 = document.getElementById('colorSecundario');
    if (color1) color1.addEventListener('input', actualizarVistaPreviaColor);
    if (color2) color2.addEventListener('input', actualizarVistaPreviaColor);

    var i;
    for (i = 0; i < TABS.length; i++) {
      (function (el) {
        el.addEventListener('click', function () {
          activarTab(el.dataset.tab);
        });
      })(TABS[i]);
    }

    document.addEventListener('click', function (e) {
      if (e.target === MODAL_LOGIN) cerrarLogin();
      if (e.target === MODAL_PANEL) cerrarPanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        cerrarLogin();
        cerrarPanel();
      }
    });
  }

  function init() {
    obtenerElementos();
    vincularEventos();
    if (RADIO.sesionActiva()) {
      cargarConfigEnFormulario();
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return {};
})();
