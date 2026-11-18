/* Oficio Vivo · la web entera en un archivo, sin compilación.
   Rutas con # (funciona abierta en local y en cualquier alojamiento estático).
   Nada de onclick en el HTML: todos los botones llevan data-action y se escuchan aquí. */
"use strict";
(function () {
  var D = window.OV_DATOS;
  var app = document.getElementById("app");

  /* ---------- Almacén: registro único de claves ----------
     Publicada (http/https), la web manda los formularios al servidor y el panel los lee de la
     base de datos. Abierta como archivo (sin servidor), los guarda en este navegador. */
  var VERSION = "0.2.0";
  var CLAVES = { letra: "ov.letra", panel: "ov.panel", solicitudes: "ov.solicitudes", altas: "ov.altas", entidades: "ov.entidades" };
  // En GitHub Pages (web fija, sin servidor) la web va como demostración: modo sin servidor.
  var DEMO = /\.github\.io$/.test(location.hostname);
  var ENDPOINT = /^https?:$/.test(location.protocol) && !DEMO ? "/api" : null;
  function leerSesion(k) { try { return sessionStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function escribirSesion(k, v) { try { if (v) sessionStorage.setItem(k, v); else sessionStorage.removeItem(k); } catch (e) { /* sin sesión */ } }
  function leer(clave, porDefecto) {
    try { var v = localStorage.getItem(clave); return v === null ? porDefecto : JSON.parse(v); } catch (e) { return porDefecto; }
  }
  function escribir(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch (e) { return false; }
  }
  /** Devuelve una promesa: true si quedó guardado (en el servidor o, sin servidor, en el navegador). */
  function guardarEnvio(tipo, datos) {
    if (ENDPOINT) {
      return fetch(ENDPOINT + "/envios/" + tipo, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(datos) })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; });
    }
    var registro = Object.assign({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), fecha: new Date().toISOString() }, datos);
    delete registro.web;
    var lista = leer(CLAVES[tipo], []);
    lista.unshift(registro);
    return Promise.resolve(escribir(CLAVES[tipo], lista));
  }

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function norm(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
  function porId(lista, id) { for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i]; return null; }
  function tema(id) { return porId(D.TEMAS, id); }
  function modo(id) { return porId(D.MODOS, id); }
  function mentor(id) { return porId(D.MENTORES, id); }
  function nombrePila(m) { return m.nombre.split(" ").slice(0, m.id === "mariajesus" ? 2 : 1).join(" "); }
  function decimal(n) { return n.toFixed(1).replace(".", ","); }
  function avatar(m) {
    var bg = tema(m.tema).color.replace("#", "").toLowerCase();
    return "https://api.dicebear.com/9.x/notionists/svg?seed=" + encodeURIComponent(m.id) + "&backgroundColor=" + bg + "&glassesProbability=35&beardProbability=30";
  }
  function cuentaTema(id) { return D.MENTORES.filter(function (m) { return m.tema === id; }).length; }
  var PUEBLOS = D.MENTORES.map(function (m) { return m.pueblo; }).filter(function (p, i, a) { return a.indexOf(p) === i; }).sort();
  function modosTexto(m) { return m.modos.map(function (x) { return modo(x).corto; }).join(" y ").replace(/ y (?=.* y )/g, ", "); }

  var ICONOS = {
    costura: '<path d="M4 20 20 4"/><circle cx="18.3" cy="5.7" r="1.7"/><path d="M6.5 12.5c3 1 5 3 6 6.5"/>',
    carpinteria: '<path d="M14 3.5l6.5 6.5-3 3L11 6.5z"/><path d="M12.5 8 4 19.5 5.5 21 15 11.5"/>',
    campo: '<path d="M12 21V10"/><path d="M12 14.5c-4 0-6.5-3-6.5-6.5 4 0 6.5 3 6.5 6.5zM12 12c3.2 0 5.5-2.5 5.5-5.5-3.2 0-5.5 2.5-5.5 5.5z"/>',
    cocina: '<path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z"/><path d="M9 7.5c0-2 2-2 2-4M14 7.5c0-2 2-2 2-4"/>',
    dinero: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><circle cx="12" cy="12.5" r="3"/><path d="M6.5 9.5h.01M17.5 15.5h.01"/>',
    salud: '<path d="M12 20s-8-4.5-8-10a4 4 0 0 1 8-1.2A4 4 0 0 1 20 10c0 5.5-8 10-8 10z"/><path d="M9.5 11h5M12 8.5v5"/>',
    estudio: '<path d="M12 6.5c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1v-14c-3-1-6-1-9 1zM12 6.5v14"/>',
    mecanica: '<path d="M15 3.5a5 5 0 0 0-4.6 6.9L3.5 17.3 6.7 20.5l6.9-6.9A5 5 0 0 0 20.5 9l-3 .9-2.4-2.4.9-3z"/>'
  };
  function icono(id) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="#24201C" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONOS[id] || "") + "</svg>";
  }
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5l15 8.5-15 8.5z" fill="currentColor"/></svg>';

  function aviso(texto) {
    var t = document.getElementById("toast");
    t.textContent = texto;
    t.classList.add("visible");
    clearTimeout(aviso._t);
    aviso._t = setTimeout(function () { t.classList.remove("visible"); }, 3800);
  }

  /* ---------- Piezas reutilizadas ---------- */
  function tarjetaMentor(m) {
    var t = tema(m.tema);
    return '<a class="mc" href="#/mentor/' + m.id + '">' +
      '<div class="foto"><img src="' + avatar(m) + '" alt="" width="320" height="232"><span class="nota">' + m.edad + ' años</span></div>' +
      "<h3>" + esc(m.nombre) + "</h3>" +
      '<div class="meta">' + esc(t.nombre) + " · " + esc(m.pueblo) + " · " + esc(modosTexto(m)) + "</div>" +
      '<p class="frase">«' + esc(m.frase) + "»</p>" +
      '<div class="pie"><span>★ ' + decimal(m.valoracion) + " · " + m.sesiones + " sesiones</span><b>Ver perfil →</b></div></a>";
  }
  function chipTema(t, pulsado, comoBoton) {
    var dentro = '<span class="ic" style="background:' + t.color + '">' + icono(t.id) + "</span>" + esc(t.nombre) + " <small>" + cuentaTema(t.id) + "</small>";
    return comoBoton
      ? '<button type="button" class="tema" data-action="filtro" data-campo="tema" data-valor="' + t.id + '" aria-pressed="' + (pulsado ? "true" : "false") + '">' + dentro + "</button>"
      : '<a class="tema" href="#/buscar?tema=' + t.id + '">' + dentro + "</a>";
  }
  function pasos() {
    return '<div class="pasos">' +
      '<div class="paso"><div class="n">1.</div><h3>Elige</h3><p>Busca por oficio o por tema, lee su historia y mira cómo prefiere quedar.</p></div>' +
      '<div class="paso"><div class="n">2.</div><h3>Pide una sesión</h3><p>Rellenas un formulario corto. Te contesta en uno o dos días, por la web o por teléfono.</p></div>' +
      '<div class="paso"><div class="n">3.</div><h3>Quedad</h3><p>En un sitio público, en su taller o por videollamada. Después, los dos la valoráis.</p></div></div>';
  }
  function episodioFila(e, conResumen) {
    var m = mentor(e.mentor);
    return '<div class="ep"><button type="button" class="play" data-action="escuchar" aria-label="Escuchar «' + esc(e.titulo) + '»">' + PLAY + "</button>" +
      "<div><b>" + esc(e.titulo) + "</b><small>Ep. " + e.n + " · con " + esc(m.nombre) + " · " + e.minutos + " min</small>" +
      (conResumen ? "<p>" + esc(e.resumen) + "</p>" : "") + "</div></div>";
  }
  function campo(o) {
    // o: {nombre, etiqueta, tipo, requerido, opciones, ayuda, valor, auto}
    var id = "c-" + o.nombre + "-" + (campo.n = (campo.n || 0) + 1);
    var req = o.requerido ? " required" : "";
    var ctrl;
    if (o.tipo === "select") {
      ctrl = '<select id="' + id + '" name="' + o.nombre + '"' + req + '><option value="">Elige una opción</option>' +
        o.opciones.map(function (op) { var v = typeof op === "string" ? op : op.v; var tx = typeof op === "string" ? op : op.t; return '<option value="' + esc(v) + '"' + (o.valor === v ? " selected" : "") + ">" + esc(tx) + "</option>"; }).join("") + "</select>";
    } else if (o.tipo === "textarea") {
      ctrl = '<textarea id="' + id + '" name="' + o.nombre + '"' + req + ">" + esc(o.valor || "") + "</textarea>";
    } else {
      ctrl = '<input id="' + id + '" name="' + o.nombre + '" type="' + (o.tipo || "text") + '"' + req + (o.auto ? ' autocomplete="' + o.auto + '"' : "") + ' value="' + esc(o.valor || "") + '">';
    }
    return '<div class="campo"><label for="' + id + '">' + esc(o.etiqueta) + (o.requerido ? "" : ' <span style="font-weight:400;color:var(--muted)">(opcional)</span>') + "</label>" + ctrl +
      (o.ayuda ? '<span class="ayuda-campo">' + esc(o.ayuda) + "</span>" : "") + "</div>";
  }

  /* ---------- Páginas ---------- */
  var V = {};

  V.inicio = function () {
    var destacados = ["carmen", "manuel", "pilar"].map(mentor);
    var foto = function (m, cls, texto) {
      return '<a class="pol ' + cls + '" href="#/mentor/' + m.id + '"><img src="' + avatar(m) + '" alt="" width="240" height="240"><figcaption>' + texto + "</figcaption></a>";
    };
    return '<div class="wrap">' +
      '<section class="portada">' +
        '<div><div class="mano">lo que no viene en los libros…</div>' +
          "<h1>…te lo cuenta quien <em>lo vivió.</em></h1>" +
          '<p class="entradilla">Mayores de Zamora con oficio y ganas de enseñar, y jóvenes con ganas de aprender. Gratis para quien aprende.</p>' +
          '<form class="buscador" data-form="busqueda" role="search"><label class="oculto" for="q-inicio">¿Qué quieres aprender?</label>' +
            '<input id="q-inicio" name="q" type="search" placeholder="¿Qué quieres aprender? Costura, viñedo, cocina…" autocomplete="off">' +
            '<button class="btn rojo" type="submit">Buscar</button></form>' +
          '<div class="modos-rapidos">' + D.MODOS.map(function (x) { return '<a class="etiqueta" href="#/buscar?modo=' + x.id + '">' + esc(x.nombre) + "</a>"; }).join("") + "</div>" +
        "</div>" +
        '<div class="collage" aria-label="Algunos de nuestros mentores">' +
          foto(mentor("carmen"), "p1", "Carmen, costura") + foto(mentor("antonio"), "p2", "Antonio, finanzas") +
          foto(mentor("julian"), "p3", "Julián, ebanista") + foto(mentor("pilar"), "p4", "Pilar, maestra") +
          '<div class="pegatina">¡gratis para ti!</div>' +
        "</div>" +
      "</section>" +
      '<section class="seccion"><div class="mano">¿por dónde empiezas?</div><h2 style="margin-bottom:1.6rem">Oficios y <em>saberes</em></h2>' +
        '<div class="temas">' + D.TEMAS.map(function (t) { return chipTema(t, false, false); }).join("") + "</div></section>" +
      '<section class="seccion"><div class="cab-seccion"><div><div class="mano">del álbum de esta semana</div><h2>Mentores <em>cerca de ti</em></h2></div>' +
        '<a class="btn borde" href="#/buscar">Ver los ' + D.MENTORES.length + " mentores</a></div>" +
        '<div class="rejilla">' + destacados.map(tarjetaMentor).join("") + "</div></section>" +
      '<section class="seccion"><div class="mano">así de sencillo</div><h2 style="margin-bottom:1.8rem">Cómo <em>funciona</em></h2>' + pasos() + "</section>" +
      '<section class="seccion"><div class="mano verde">lo que cuentan</div><h2 style="margin-bottom:1.8rem">Parejas que <em>ya funcionan</em></h2><div class="notas">' +
        ["carmen", "antonio", "pilar"].map(function (id) { var m = mentor(id), o = m.opiniones[0]; return '<div class="post"><p>«' + esc(o.texto) + '»</p><span>' + esc(o.autor) + " · con " + esc(nombrePila(m)) + "</span></div>"; }).join("") +
      "</div></section>" +
      '<section class="seccion duo">' +
        '<div class="caja azul"><div class="mano azul">para colegios y empresas</div><h2>Un mentor en <em>tu centro</em></h2><ul class="lista">' +
          D.SERVICIOS.map(function (s) { return "<li>" + esc(s.nombre) + "<span>" + esc(s.para) + "</span></li>"; }).join("") +
          '</ul><a class="btn rojo" href="#/entidades">Pedir información</a></div>' +
        '<div class="caja rosa"><div class="mano">el podcast</div><h2>Voces con <em>oficio</em></h2>' +
          D.EPISODIOS.slice(0, 3).map(function (e) { return episodioFila(e, false); }).join("") +
          '<p style="margin:1rem 0 0"><a href="#/podcast">Todos los episodios →</a></p></div>' +
      "</section>" +
      bandaMentor() + "</div>";
  };

  function bandaMentor() {
    return '<section class="banda"><div><div class="mano oro">¿y si el mentor eres tú?</div><h2>Tu oficio merece <em>otra vida</em></h2>' +
      "<p>No hace falta ordenador: nos llamas y te hacemos el perfil.</p></div>" +
      '<div><a class="telefono-grande" href="tel:' + D.TELEFONO.replace(/\s/g, "") + '">' + D.TELEFONO + '</a><a class="btn rojo" href="#/hazte-mentor">Apuntarme en la web</a></div></section>';
  }

  /* Buscador */
  var filtros = { q: "", tema: "", modo: "", pueblo: "" };
  function resultados() {
    var q = norm(filtros.q).trim();
    return D.MENTORES.filter(function (m) {
      if (filtros.tema && m.tema !== filtros.tema) return false;
      if (filtros.modo && m.modos.indexOf(filtros.modo) < 0) return false;
      if (filtros.pueblo && m.pueblo !== filtros.pueblo) return false;
      if (!q) return true;
      var texto = norm([m.nombre, tema(m.tema).nombre, m.pueblo, m.frase, m.historia, m.aprendes.join(" ")].join(" "));
      return q.split(/\s+/).every(function (p) { return texto.indexOf(p) >= 0; });
    });
  }
  function pintaResultados() {
    var lista = resultados();
    var caja = document.getElementById("resultados");
    if (!caja) return;
    var n = lista.length;
    document.getElementById("cuantos").textContent = n === 1 ? "1 mentor" : n + " mentores";
    caja.innerHTML = n
      ? '<div class="rejilla">' + lista.map(tarjetaMentor).join("") + "</div>"
      : '<div class="vacio"><div class="mano">vaya…</div><h2>Todavía no hay nadie para eso</h2><p>Prueba con otro tema o quita algún filtro. Y si conoces a alguien mayor que sepa de ello, invítale a ser mentor.</p>' +
        '<button class="btn borde" type="button" data-action="limpiar">Quitar filtros</button> <a class="btn rojo" href="#/hazte-mentor">Proponer un mentor</a></div>';
    var hayFiltro = filtros.q || filtros.tema || filtros.modo || filtros.pueblo;
    document.getElementById("limpiar").hidden = !hayFiltro;
    var qs = Object.keys(filtros).filter(function (k) { return filtros[k]; }).map(function (k) { return k + "=" + encodeURIComponent(filtros[k]); }).join("&");
    history.replaceState(null, "", "#/buscar" + (qs ? "?" + qs : ""));
  }
  V.buscar = function (params) {
    filtros = { q: params.q || "", tema: params.tema || "", modo: params.modo || "", pueblo: params.pueblo || "" };
    setTimeout(pintaResultados, 0);
    return '<div class="wrap"><div class="cabeza-pagina"><div class="mano">encuentra a tu mentor</div><h1>¿Qué quieres <em>aprender?</em></h1></div>' +
      '<div class="filtros" role="search">' +
        '<div class="fila-filtros"><div class="campo" style="flex:3"><label for="q">Busca por oficio, tema o nombre</label><input id="q" type="search" value="' + esc(filtros.q) + '" placeholder="Por ejemplo: patrones, queso, francés…" autocomplete="off"></div>' +
        '<div class="campo"><label for="pueblo">Dónde</label><select id="pueblo"><option value="">Toda la provincia</option>' +
          PUEBLOS.map(function (p) { return '<option value="' + esc(p) + '"' + (filtros.pueblo === p ? " selected" : "") + ">" + esc(p) + "</option>"; }).join("") + "</select></div></div>" +
        '<div><div class="lab" style="font-weight:600;margin-bottom:.5rem">Cómo prefieres quedar</div><div class="segmentos">' +
          D.MODOS.map(function (x) { return '<button type="button" class="seg" data-action="filtro" data-campo="modo" data-valor="' + x.id + '" aria-pressed="' + (filtros.modo === x.id) + '">' + esc(x.nombre) + "</button>"; }).join("") + "</div></div>" +
        '<div><div class="lab" style="font-weight:600;margin-bottom:.5rem">Tema</div><div class="temas">' + D.TEMAS.map(function (t) { return chipTema(t, filtros.tema === t.id, true); }).join("") + "</div></div>" +
      "</div>" +
      '<div class="resumen"><p aria-live="polite"><b id="cuantos"></b> encontrados</p><button class="btn borde" type="button" id="limpiar" data-action="limpiar" hidden>Quitar filtros</button></div>' +
      '<div id="resultados"></div></div>';
  };

  /* Perfil */
  V.mentor = function (params, id) {
    var m = mentor(id);
    if (!m) return V.noEncontrado();
    var t = tema(m.tema);
    document.title = m.nombre + " · Oficio Vivo";
    return '<div class="wrap"><nav class="migas" aria-label="Estás en"><a href="#/">Inicio</a> › <a href="#/buscar?tema=' + t.id + '">' + esc(t.nombre) + "</a> › " + esc(m.nombre) + "</nav>" +
      '<div class="perfil">' +
        '<figure class="pol"><img src="' + avatar(m) + '" alt="Ilustración de ' + esc(m.nombre) + '" width="320" height="320"><figcaption>' + esc(nombrePila(m)) + ", " + m.edad + " años</figcaption></figure>" +
        "<div>" +
          '<div class="datos-perfil"><span class="etiqueta"><span class="ic" style="display:inline-grid;place-items:center;width:1.5rem;height:1.5rem;border-radius:50%;background:' + t.color + '">' + icono(t.id).replace('stroke-width="1.7"', 'stroke-width="2" width="15" height="15"') + "</span>" + esc(t.nombre) + "</span>" +
            '<span class="etiqueta">📍 ' + esc(m.pueblo) + "</span>" + m.modos.map(function (x) { return '<span class="etiqueta">' + esc(modo(x).nombre) + "</span>"; }).join("") + "</div>" +
          "<h1>" + esc(m.nombre) + "</h1>" +
          '<p class="cita">«' + esc(m.frase) + "»</p>" +
          "<h2>Su historia</h2><p>" + esc(m.historia) + "</p>" +
          "<h2>Qué puedes aprender</h2><ul class=\"checks\">" + m.aprendes.map(function (a) { return "<li>" + esc(a) + "</li>"; }).join("") + "</ul>" +
          "<h2>Cuándo puede</h2><p>" + esc(m.disponibilidad) + ". ★ " + decimal(m.valoracion) + " de valoración media en " + m.sesiones + " sesiones.</p>" +
          (m.opiniones.length ? "<h2>Lo que dicen</h2>" + m.opiniones.map(function (o) { return '<div class="opinion"><p>«' + esc(o.texto) + "»</p><span>" + esc(o.autor) + "</span></div>"; }).join("") : "") +
        "</div>" +
        '<aside class="ficha" id="ficha">' + formSolicitud(m) + "</aside>" +
      "</div>" +
      (function () {
          var mismos = D.MENTORES.filter(function (x) { return x.id !== m.id && x.tema === m.tema; });
          var otros = mismos.concat(D.MENTORES.filter(function (x) { return x.id !== m.id && x.tema !== m.tema; })).slice(0, 3);
          var titulo = mismos.length ? "Más mentores de <em>" + esc(t.nombre.toLowerCase()) + "</em>" : "Otros mentores <em>que te pueden gustar</em>";
          return '<section class="seccion"><div class="cab-seccion"><h2>' + titulo + '</h2></div><div class="rejilla">' + otros.map(tarjetaMentor).join("") + "</div>";
        })() +
      "</section></div>";
  };
  function formSolicitud(m) {
    return '<h2>Pide una sesión con ' + esc(nombrePila(m)) + '</h2><p class="sub">Gratis. Te contestará en uno o dos días.</p>' +
      '<form class="form" data-form="solicitudes" data-mentor="' + m.id + '" novalidate>' +
      '<div class="oculto" aria-hidden="true"><label>No rellenes este campo <input name="web" tabindex="-1" autocomplete="off"></label></div>' +
      campo({ nombre: "nombre", etiqueta: "Tu nombre", requerido: true, auto: "given-name" }) +
      campo({ nombre: "edad", etiqueta: "Tu edad", tipo: "select", requerido: true, opciones: [{ v: "menor", t: "Menos de 18 años" }, { v: "18-25", t: "De 18 a 25 años" }, { v: "26+", t: "Más de 25 años" }] }) +
      campo({ nombre: "contacto", etiqueta: "Correo o teléfono", requerido: true, auto: "email", ayuda: "Solo lo verá " + nombrePila(m) + " para contestarte." }) +
      campo({ nombre: "modo", etiqueta: "Cómo prefieres", tipo: "select", requerido: true, opciones: m.modos.map(function (x) { return { v: x, t: modo(x).nombre }; }), valor: m.modos.length === 1 ? m.modos[0] : "" }) +
      campo({ nombre: "mensaje", etiqueta: "Qué te gustaría aprender", tipo: "textarea", requerido: true }) +
      '<label class="marca" data-permiso hidden><input type="checkbox" name="permiso"> <span>Soy menor de edad y mi familia sabe que pido esta sesión.</span></label>' +
      '<button class="btn rojo ancho" type="submit">Enviar solicitud</button></form>';
  }

  /* Hazte mentor */
  V["hazte-mentor"] = function () {
    return '<div class="wrap"><div class="cabeza-pagina"><div class="mano">¿y si el mentor eres tú?</div><h1>Tu oficio merece <em>otra vida</em></h1>' +
      '<p class="entradilla">Si tienes más de 60 años y algo que enseñar (un oficio, una profesión, una afición de toda la vida), aquí hay alguien que quiere aprenderlo.</p></div>' +
      '<div class="dos-col">' +
        '<div class="tarjeta"><h2>Te llamamos nosotros</h2><p style="color:var(--ink-2);margin-top:0">Déjanos tu nombre y tu teléfono. Te llamamos, charlamos un rato y te hacemos el perfil. No necesitas ordenador.</p>' +
          '<form class="form" data-form="altas" novalidate>' +
      '<div class="oculto" aria-hidden="true"><label>No rellenes este campo <input name="web" tabindex="-1" autocomplete="off"></label></div>' +
          campo({ nombre: "nombre", etiqueta: "Nombre y apellidos", requerido: true, auto: "name" }) +
          campo({ nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", requerido: true, auto: "tel" }) +
          campo({ nombre: "hora", etiqueta: "Cuándo te viene bien que llamemos", tipo: "select", requerido: true, opciones: ["Por la mañana", "Al mediodía", "Por la tarde", "Me da igual"] }) +
          campo({ nombre: "oficio", etiqueta: "¿Qué sabes hacer o a qué te dedicaste?", tipo: "textarea", ayuda: "Por ejemplo: «fui carpintero 40 años» o «hago punto desde niña»." }) +
          campo({ nombre: "pueblo", etiqueta: "Pueblo o ciudad", requerido: true }) +
          '<label class="marca"><input type="checkbox" name="acepto" required> <span>Acepto que Oficio Vivo me llame para hacerme el perfil.</span></label>' +
          '<button class="btn rojo ancho" type="submit">Quiero que me llaméis</button></form></div>' +
        "<div>" +
          '<div class="caja verde" style="margin-bottom:1.75rem"><div class="mano verde">o llámanos tú</div><a class="telefono-grande" href="tel:' + D.TELEFONO.replace(/\s/g, "") + '">' + D.TELEFONO + '</a><p style="margin:0;color:var(--ink-2)">De lunes a viernes, de 10 a 14 h. Es gratis.</p></div>' +
          '<div class="preguntas"><h2 style="font-size:2.2rem;margin-bottom:1rem">Lo que suele preguntarse</h2>' +
            "<details><summary>¿Cuánto tiempo tengo que dedicar?</summary><p>Lo que tú quieras. La mayoría hace una o dos sesiones al mes, de una hora.</p></details>" +
            "<details><summary>¿Dónde se queda?</summary><p>Donde prefieras: en tu taller, en un centro cívico, en una cafetería o por videollamada. Siempre en un sitio cómodo y seguro para los dos.</p></details>" +
            "<details><summary>¿Me pagan?</summary><p>Las mentorías son voluntarias. Las charlas en colegios y empresas pueden tener una pequeña compensación.</p></details>" +
            "<details><summary>¿Y si no sé usar el móvil?</summary><p>No pasa nada. Te avisamos por teléfono cuando alguien quiera aprender contigo y lo organizamos nosotros.</p></details>" +
            "<details><summary>¿Quién puede pedirme una sesión?</summary><p>Jóvenes y estudiantes. Si son menores, sus familias lo saben, y las primeras sesiones son en sitios públicos o en el centro educativo.</p></details>" +
          "</div>" +
        "</div></div></div>";
  };

  /* Entidades */
  V.entidades = function () {
    return '<div class="wrap"><div class="cabeza-pagina"><div class="mano azul">para colegios, residencias y empresas</div><h1>Un mentor en <em>tu centro</em></h1>' +
      '<p class="entradilla">Charlas, prácticas en un taller y programas de todo el curso. Experiencia de verdad para tus alumnos, residentes o empleados.</p></div>' +
      '<div class="servicios">' + D.SERVICIOS.map(function (s) {
        return '<article class="servicio cinta"><h3>' + esc(s.nombre) + "</h3><p>" + esc(s.texto) + "</p><dl><dt>Para</dt><dd>" + esc(s.para) + "</dd><dt>Duración</dt><dd>" + esc(s.duracion) + "</dd></dl></article>";
      }).join("") + "</div>" +
      '<div class="dos-col">' +
        '<div class="tarjeta"><h2>Cuéntanos qué buscas</h2><p style="color:var(--ink-2);margin-top:0">Te contestamos en menos de una semana con una propuesta.</p>' +
          '<form class="form" data-form="entidades" novalidate>' +
      '<div class="oculto" aria-hidden="true"><label>No rellenes este campo <input name="web" tabindex="-1" autocomplete="off"></label></div>' +
          campo({ nombre: "tipo", etiqueta: "Tipo de entidad", tipo: "select", requerido: true, opciones: ["Colegio o instituto", "Residencia o centro de día", "Asociación", "Ayuntamiento", "Empresa", "Otra"] }) +
          campo({ nombre: "centro", etiqueta: "Nombre del centro", requerido: true, auto: "organization" }) +
          campo({ nombre: "persona", etiqueta: "Persona de contacto", requerido: true, auto: "name" }) +
          campo({ nombre: "contacto", etiqueta: "Correo o teléfono", requerido: true, auto: "email" }) +
          campo({ nombre: "servicio", etiqueta: "Qué os interesa", tipo: "select", requerido: true, opciones: D.SERVICIOS.map(function (s) { return s.nombre; }).concat(["Aún no lo sé"]) }) +
          campo({ nombre: "mensaje", etiqueta: "Cuéntanos un poco más", tipo: "textarea", ayuda: "Edad del grupo, número de personas, fechas que os vendrían bien…" }) +
          '<button class="btn rojo ancho" type="submit">Enviar</button></form></div>' +
        '<div><h2 style="font-size:2.4rem;margin-bottom:1.2rem">Cómo lo <em>organizamos</em></h2>' +
          '<ol class="lista" style="list-style:none">' +
            "<li><b>1. Hablamos</b><span>qué necesitáis y para quién</span></li>" +
            "<li><b>2. Elegimos mentor</b><span>según el tema y la edad del grupo</span></li>" +
            "<li><b>3. Preparamos la sesión</b><span>con el mentor y el profesor</span></li>" +
            "<li><b>4. Lo valoramos</b><span>con una encuesta corta al final</span></li></ol>" +
          '<div class="post" style="transform:rotate(-1deg)"><p>«Fuimos un sábado a la viña y nos explicó cada cepa. Lo mejor de la excursión.»</p><span>Grupo de 1º de Bachillerato · con Manuel</span></div>' +
        "</div></div></div>";
  };

  /* Podcast */
  V.podcast = function () {
    var e = D.EPISODIOS[0], m = mentor(e.mentor);
    var onda = "";
    for (var i = 0; i < 64; i++) onda += '<i class="' + (i < 18 ? "on" : "") + '" style="height:' + Math.round(22 + 74 * Math.abs(Math.sin(i * 0.47) * Math.cos(i * 0.13))) + '%"></i>';
    return '<div class="wrap"><div class="cabeza-pagina"><div class="mano">el podcast</div><h1>Voces con <em>oficio</em></h1>' +
      '<p class="entradilla">Cada mes, un mentor cuenta su vida y su oficio. Para escuchar antes de pedirle una sesión.</p></div>' +
      '<div class="reproductor"><a class="pol" href="#/mentor/' + m.id + '"><img src="' + avatar(m) + '" alt="" width="200" height="200"><figcaption>' + esc(nombrePila(m)) + ", " + m.edad + "</figcaption></a>" +
        '<div><div class="mano oro">último episodio · ep. ' + e.n + '</div><h2 style="color:#FBF6EE">' + esc(e.titulo) + '</h2><p style="color:#D8CDBE;margin:.5rem 0 0">' + esc(e.resumen) + "</p>" +
        '<div class="onda" aria-hidden="true">' + onda + "</div>" +
        '<div class="controles"><button type="button" class="play" data-action="escuchar" aria-label="Escuchar el episodio">' + PLAY + "</button><small>00:00 / " + e.minutos + ':00</small><a class="btn blanco" href="#/mentor/' + m.id + '">Pedir sesión con ' + esc(nombrePila(m)) + "</a></div></div></div>" +
      '<h2 style="margin-top:3.5rem">Todos los <em>episodios</em></h2><div class="lista-ep">' + D.EPISODIOS.map(function (x) { return episodioFila(x, true); }).join("") + "</div>" +
      bandaMentor() + "</div>";
  };

  /* Panel de organizadores */
  var pestanaPanel = "solicitudes";
  var COLUMNAS = {
    solicitudes: [["fecha", "Fecha"], ["mentor", "Mentor"], ["nombre", "Nombre"], ["edad", "Edad"], ["contacto", "Contacto"], ["modo", "Modo"], ["mensaje", "Mensaje"]],
    altas: [["fecha", "Fecha"], ["nombre", "Nombre"], ["telefono", "Teléfono"], ["hora", "Llamar"], ["pueblo", "Pueblo"], ["oficio", "Oficio"]],
    entidades: [["fecha", "Fecha"], ["tipo", "Tipo"], ["centro", "Centro"], ["persona", "Persona"], ["contacto", "Contacto"], ["servicio", "Interés"], ["mensaje", "Mensaje"]]
  };
  var NOMBRES_PESTANA = { solicitudes: "Solicitudes de sesión", altas: "Nuevos mentores", entidades: "Entidades" };
  function valorCelda(fila, k) {
    if (k === "fecha") return new Date(fila.fecha).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
    if (k === "mentor") { var m = mentor(fila.mentor); return m ? m.nombre : fila.mentor; }
    if (k === "modo") { var x = modo(fila.modo); return x ? x.nombre : fila.modo; }
    return fila[k] || "";
  }
  // Con servidor, las filas vienen de la base de datos y se guardan aquí mientras se mira el panel.
  var panel = { filas: null, cuentas: {}, error: "", cargando: false };
  function filasPanel() { return ENDPOINT ? (panel.filas || []) : leer(CLAVES[pestanaPanel], []); }
  function cuentaPanel(k) { return ENDPOINT ? (panel.cuentas[k] || 0) : leer(CLAVES[k], []).length; }
  function pidePanel(metodo) {
    return fetch(ENDPOINT + "/panel/" + pestanaPanel, { method: metodo, headers: { Authorization: "Bearer " + leerSesion(CLAVES.panel) } });
  }
  function cargaPanel() {
    if (panel.cargando) return;
    panel.cargando = true;
    pidePanel("GET").then(function (r) {
      if (r.status === 401) { escribirSesion(CLAVES.panel, ""); panel.error = "Contraseña incorrecta."; return null; }
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (d) {
      if (d) { panel.filas = d.filas; panel.cuentas = d.cuentas; panel.error = ""; }
    }).catch(function () {
      panel.error = "No se ha podido conectar con el servidor. Inténtalo de nuevo.";
    }).then(function () {
      panel.cargando = false;
      if (location.hash.indexOf("#/panel") === 0) ruta();
    });
  }
  function entradaPanel() {
    return '<div class="wrap"><div class="cabeza-pagina"><div class="mano">solo para organizadores</div><h1>Panel</h1></div>' +
      '<div class="tarjeta" style="max-width:30rem;margin-top:2rem"><h2>Entrar</h2><p style="color:var(--ink-2);margin-top:0">Escribe la contraseña del panel.</p>' +
      '<form class="form" data-form="panel-clave" novalidate>' +
      '<div class="campo' + (panel.error ? " error" : "") + '"><label for="clave-panel">Contraseña</label><input id="clave-panel" name="clave" type="password" autocomplete="current-password" required>' +
      (panel.error ? '<span class="msg-error">' + esc(panel.error) + "</span>" : "") + "</div>" +
      '<button class="btn rojo ancho" type="submit">Entrar</button></form></div></div>';
  }
  V.panel = function () {
    if (ENDPOINT && !leerSesion(CLAVES.panel)) return entradaPanel();
    if (ENDPOINT && panel.filas === null) {
      if (!panel.error) setTimeout(cargaPanel, 0);
      return '<div class="wrap"><div class="cabeza-pagina"><div class="mano">solo para organizadores</div><h1>Panel</h1></div>' +
        (panel.error ? '<div class="vacio"><h2>Vaya</h2><p>' + esc(panel.error) + '</p><button class="btn rojo" type="button" data-action="reintentar">Reintentar</button></div>' : '<p class="entradilla" style="margin-top:2rem">Cargando…</p>') + "</div>";
    }
    var filas = filasPanel();
    var cols = COLUMNAS[pestanaPanel];
    return '<div class="wrap"><div class="cabeza-pagina"><div class="mano">solo para organizadores</div><h1>Panel</h1>' +
      '<p class="entradilla">Todo lo que llega desde los formularios de la web.</p></div>' +
      '<div class="pestanas" role="tablist">' + Object.keys(COLUMNAS).map(function (k) {
        return '<button type="button" role="tab" class="seg" data-action="pestana" data-tab="' + k + '" aria-pressed="' + (k === pestanaPanel) + '" aria-selected="' + (k === pestanaPanel) + '">' + NOMBRES_PESTANA[k] + " (" + cuentaPanel(k) + ")</button>";
      }).join("") + (ENDPOINT ? '<button type="button" class="seg" data-action="salir-panel" style="margin-left:auto">Salir</button>' : "") + "</div>" +
      (filas.length
        ? '<div class="tabla-envoltura"><table><thead><tr>' + cols.map(function (c) { return "<th>" + c[1] + "</th>"; }).join("") + "</tr></thead><tbody>" +
          filas.map(function (f) { return "<tr>" + cols.map(function (c) { return "<td>" + esc(valorCelda(f, c[0])) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>" +
          '<div style="display:flex;gap:.75rem;margin-top:1.25rem;flex-wrap:wrap"><button class="btn borde" type="button" data-action="csv">Descargar en Excel (CSV)</button><button class="btn borde" type="button" data-action="borrar">Vaciar esta lista</button></div>'
        : '<div class="vacio"><h2>Aún no ha llegado nada</h2><p>Cuando alguien rellene un formulario, aparecerá aquí.</p></div>') +
      (ENDPOINT ? "" : '<p class="aviso">Abierta sin servidor: los envíos se guardan solo en este navegador. En la web publicada van a la base de datos.</p>') + "</div>";
  };

  V.noEncontrado = function () {
    return '<div class="wrap"><div class="vacio" style="margin-top:3rem"><div class="mano">ups</div><h2>Esta página no existe</h2><p>Puede que el enlace esté mal escrito.</p><a class="btn rojo" href="#/">Volver al inicio</a></div></div>';
  };

  /* ---------- Rutas ---------- */
  var TITULOS = { "": "Oficio Vivo · Mentoría entre generaciones", buscar: "Buscar mentor · Oficio Vivo", "hazte-mentor": "Hazte mentor · Oficio Vivo", entidades: "Colegios y entidades · Oficio Vivo", podcast: "Podcast · Oficio Vivo", panel: "Panel · Oficio Vivo" };
  function ruta() {
    var h = location.hash.replace(/^#\/?/, "");
    var partes = h.split("?");
    var trozos = partes[0].split("/");
    var params = {};
    (partes[1] || "").split("&").forEach(function (p) { if (!p) return; var kv = p.split("="); params[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " ")); });
    var nombre = trozos[0] || "";
    var vista = nombre === "" ? V.inicio : nombre === "mentor" ? V.mentor : V[nombre];
    if (!vista || nombre === "inicio" || nombre === "noEncontrado") vista = V.noEncontrado;
    document.title = TITULOS[nombre] || "Oficio Vivo";
    app.innerHTML = vista(params, trozos[1]);
    document.querySelectorAll(".menu a").forEach(function (a) {
      if (a.getAttribute("data-ruta") === nombre) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    cierraMenu();
  }
  // Los filtros del buscador cambian la dirección con replaceState, que no dispara hashchange:
  // cualquier hashchange es una navegación de verdad.
  window.addEventListener("hashchange", function () {
    ruta();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  });

  /* ---------- Formularios ---------- */
  function contactoValido(v) { return /\S+@\S+\.\S+/.test(v) || v.replace(/\D/g, "").length >= 9; }
  function marcaError(input, texto) {
    var c = input.closest(".campo");
    if (!c) { input.closest(".marca").style.color = "var(--red-dark)"; return; }
    c.classList.add("error");
    var m = c.querySelector(".msg-error") || c.appendChild(document.createElement("span"));
    m.className = "msg-error"; m.textContent = texto;
    input.setAttribute("aria-invalid", "true");
  }
  function limpiaErrores(form) {
    form.querySelectorAll(".campo.error").forEach(function (c) { c.classList.remove("error"); var m = c.querySelector(".msg-error"); if (m) m.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (i) { i.removeAttribute("aria-invalid"); });
    form.querySelectorAll(".marca").forEach(function (l) { l.style.color = ""; });
  }
  function enviaFormulario(form) {
    var tipo = form.getAttribute("data-form");
    if (tipo === "busqueda") { location.hash = "#/buscar?q=" + encodeURIComponent(form.q.value.trim()); return; }
    if (tipo === "panel-clave") {
      if (!form.clave.value) { form.clave.focus(); return; }
      escribirSesion(CLAVES.panel, form.clave.value);
      panel.filas = null; panel.error = ""; ruta();
      return;
    }
    limpiaErrores(form);
    var datos = {}, primero = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      var v = el.type === "checkbox" ? el.checked : el.value.trim();
      datos[el.name] = v;
      var falta = el.required && (el.type === "checkbox" ? !v : !v);
      if (falta) { marcaError(el, el.type === "checkbox" ? "" : "Falta este dato."); primero = primero || el; }
      else if ((el.name === "contacto") && v && !contactoValido(v)) { marcaError(el, "Escribe un correo o un teléfono de 9 cifras."); primero = primero || el; }
      else if (el.name === "telefono" && v && v.replace(/\D/g, "").length < 9) { marcaError(el, "El teléfono debe tener 9 cifras."); primero = primero || el; }
    });
    if (tipo === "solicitudes" && datos.edad === "menor" && !datos.permiso) { marcaError(form.permiso, ""); primero = primero || form.permiso; }
    if (primero) { primero.focus(); aviso("Revisa los datos marcados en rojo."); return; }
    if (tipo === "solicitudes") datos.mentor = form.getAttribute("data-mentor");
    delete datos.acepto;
    var boton = form.querySelector('button[type="submit"]');
    var textoBoton = boton.textContent;
    boton.disabled = true; boton.textContent = "Enviando…";
    guardarEnvio(tipo, datos).then(function (ok) {
      if (!ok) {
        boton.disabled = false; boton.textContent = textoBoton;
        aviso("No se ha podido enviar. Inténtalo otra vez o llámanos al " + D.TELEFONO + ".");
        return;
      }
      var caja = form.parentNode;
      var m = datos.mentor ? mentor(datos.mentor) : null;
      var texto = {
        solicitudes: function () { return ["¡Solicitud enviada!", (m ? nombrePila(m) : "El mentor") + " recibirá tu mensaje y te contestará en uno o dos días."]; },
        altas: function () { return ["¡Gracias, " + esc(datos.nombre.split(" ")[0]) + "!", "Te llamaremos " + ({ "Por la mañana": "por la mañana", "Al mediodía": "al mediodía", "Por la tarde": "por la tarde" }[datos.hora] || "en cuanto podamos") + " para hacerte el perfil."]; },
        entidades: function () { return ["¡Recibido!", "Os escribiremos en menos de una semana con una propuesta."]; }
      }[tipo]();
      caja.innerHTML = '<div class="hecho" tabindex="-1"><div class="sello" aria-hidden="true">✓</div><h3>' + texto[0] + "</h3><p>" + texto[1] + "</p>" +
        '<a class="btn borde" href="#/buscar">Ver más mentores</a></div>';
      caja.querySelector(".hecho").focus();
    });
  }
  document.addEventListener("submit", function (e) {
    var form = e.target.closest("form[data-form]");
    if (!form) return;
    e.preventDefault();
    enviaFormulario(form);
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.name === "edad") { var p = t.form.querySelector("[data-permiso]"); if (p) { p.hidden = t.value !== "menor"; p.querySelector("input").required = t.value === "menor"; } }
    if (t.id === "pueblo") { filtros.pueblo = t.value; pintaResultados(); }
  });
  var espera;
  document.addEventListener("input", function (e) {
    if (e.target.id === "q") { clearTimeout(espera); espera = setTimeout(function () { filtros.q = e.target.value; pintaResultados(); }, 160); }
  });

  /* ---------- Botones ---------- */
  function cierraMenu() {
    var b = document.querySelector(".abre-menu");
    document.getElementById("menu").classList.remove("abierto");
    if (b) b.setAttribute("aria-expanded", "false");
  }
  function ponLetra(n) {
    document.documentElement.setAttribute("data-letra", n);
    document.querySelectorAll('[data-action="letra"]').forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-nivel") === String(n))); });
  }
  function descargaCSV() {
    var filas = filasPanel(), cols = COLUMNAS[pestanaPanel];
    var celda = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; };
    var csv = "﻿" + cols.map(function (c) { return celda(c[1]); }).join(";") + "\n" +
      filas.map(function (f) { return cols.map(function (c) { return celda(valorCelda(f, c[0])); }).join(";"); }).join("\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "oficio-vivo-" + pestanaPanel + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-action]");
    if (!b) return;
    var accion = b.getAttribute("data-action");
    if (accion === "menu") {
      var abierto = document.getElementById("menu").classList.toggle("abierto");
      b.setAttribute("aria-expanded", String(abierto));
    } else if (accion === "letra") {
      var n = Number(b.getAttribute("data-nivel"));
      ponLetra(n); escribir(CLAVES.letra, n);
    } else if (accion === "filtro") {
      var campoF = b.getAttribute("data-campo"), valor = b.getAttribute("data-valor");
      filtros[campoF] = filtros[campoF] === valor ? "" : valor;
      document.querySelectorAll('[data-action="filtro"][data-campo="' + campoF + '"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-valor") === filtros[campoF])); });
      pintaResultados();
    } else if (accion === "limpiar") {
      if (location.hash === "#/buscar") ruta(); else location.hash = "#/buscar";
    } else if (accion === "escuchar") {
      aviso("Episodio de ejemplo: el audio se grabará con el mentor.");
    } else if (accion === "pestana") {
      pestanaPanel = b.getAttribute("data-tab"); panel.filas = null; ruta();
    } else if (accion === "csv") {
      descargaCSV();
    } else if (accion === "borrar") {
      if (!confirm("¿Vaciar la lista «" + NOMBRES_PESTANA[pestanaPanel] + "»? Se borra para siempre y no se puede deshacer.")) return;
      if (!ENDPOINT) { escribir(CLAVES[pestanaPanel], []); ruta(); return; }
      pidePanel("DELETE").then(function (r) { if (!r.ok) throw new Error(r.status); panel.filas = null; ruta(); })
        .catch(function () { aviso("No se ha podido vaciar la lista. Inténtalo de nuevo."); });
    } else if (accion === "reintentar") {
      panel.error = ""; ruta();
    } else if (accion === "salir-panel") {
      escribirSesion(CLAVES.panel, ""); panel.filas = null; ruta();
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cierraMenu(); });

  /* ---------- Arranque ---------- */
  document.querySelectorAll("[data-telefono]").forEach(function (el) { el.textContent = D.TELEFONO; });
  document.querySelectorAll("[data-version]").forEach(function (el) { el.textContent = "Versión " + VERSION + " · mentores de ejemplo"; });
  if (DEMO) {
    var banda = document.createElement("div");
    banda.className = "aviso";
    banda.setAttribute("role", "note");
    banda.style.cssText = "margin:0;border-radius:0;text-align:center";
    banda.textContent = "Versión de demostración: los mentores son de ejemplo y lo que escribas en los formularios no se envía a nadie.";
    document.body.insertBefore(banda, document.body.children[1] || null);
  }
  ponLetra(leer(CLAVES.letra, 0));
  ruta();
  window.OV = { CLAVES: CLAVES, resultados: resultados, filtros: function () { return filtros; } };
})();
