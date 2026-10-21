// Diagnóstico de exposición: 10 preguntas, 0–10 puntos cada una (más = mejor preparado).
// Cada pregunta trae la recomendación que se muestra si la respuesta quedó baja.
(function () {
  var PREGUNTAS = [
    {
      t: '¿Sabes en qué país están guardados los datos de tus clientes?',
      o: [['Sí, lo tengo documentado sistema por sistema', 10], ['Sí, de la mayoría', 6], ['Solo de algunos sistemas', 3], ['No lo sé', 0]],
      r: 'Haz un mapa simple: cada sistema que usas, qué datos guarda y en qué país está el servidor.'
    },
    {
      t: '¿Dónde funciona tu facturación, contabilidad o ERP?',
      o: [['En un servidor en Chile', 10], ['En una nube con región en Chile', 8], ['En una nube en el extranjero', 4], ['No lo sé', 0]],
      r: 'Pregunta a tu proveedor de facturación o ERP en qué país procesa los datos y si ofrece alojamiento en Chile.'
    },
    {
      t: '¿Dónde está el correo electrónico de tu empresa?',
      o: [['Con un proveedor que lo aloja en Chile', 10], ['Google Workspace o Microsoft 365', 5], ['En el hosting de mi sitio web', 4], ['No lo sé', 0]],
      r: 'Revisa dónde se almacena tu correo y quién tiene acceso administrativo; es donde más datos sensibles circulan.'
    },
    {
      t: '¿Tienes respaldos fuera de tu proveedor principal?',
      o: [['Sí, en Chile, y los hemos probado', 10], ['Sí, pero nunca los hemos restaurado', 5], ['Solo los que hace el mismo proveedor', 2], ['No lo sé', 0]],
      r: 'Ten al menos un respaldo independiente de tu proveedor principal, y restáuralo una vez para comprobar que sirve.'
    },
    {
      t: 'Si tu proveedor principal se cayera una semana, ¿podrías seguir operando?',
      o: [['Sí, tenemos un plan escrito', 10], ['Parcialmente', 5], ['No', 1], ['Nunca lo hemos pensado', 0]],
      r: 'Escribe un plan de una página: qué haces si un servicio crítico deja de estar disponible por días.'
    },
    {
      t: '¿Tus contratos dicen dónde se procesan los datos y bajo qué ley?',
      o: [['Sí, en todos', 10], ['En algunos', 5], ['No', 1], ['No lo sé', 0]],
      r: 'Revisa los términos de tus proveedores principales y busca la cláusula de ubicación y transferencia internacional de datos.'
    },
    {
      t: '¿Tienes un registro de qué datos personales tratas (clientes, trabajadores)?',
      o: [['Sí, y está actualizado', 10], ['Existe, pero está desactualizado', 5], ['No', 0]],
      r: 'Arma un registro básico de datos personales: qué datos, para qué, dónde están y quién accede. La Ley 21.719 lo va a exigir en la práctica.'
    },
    {
      t: '¿Hay alguien responsable de la protección de datos en tu empresa?',
      o: [['Sí, con tiempo asignado', 10], ['Alguien, a medias', 5], ['Nadie', 0]],
      r: 'Designa a una persona responsable de datos personales, aunque sea con algunas horas al mes.'
    },
    {
      t: '¿Cuántos servicios en la nube usa tu empresa?',
      o: [['Menos de 5 y los conozco todos', 10], ['Entre 5 y 15', 6], ['Más de 15', 3], ['No lo sé', 0]],
      r: 'Haz un inventario de las aplicaciones en la nube que usa tu equipo, incluidas las que alguien contrató por su cuenta.'
    },
    {
      t: '¿Sabes qué hacer si hay una filtración de datos?',
      o: [['Sí, hay un protocolo escrito', 10], ['Tenemos una idea general', 4], ['No', 0]],
      r: 'Define un protocolo de filtraciones: a quién se avisa, en qué plazo y qué se comunica a los afectados.'
    }
  ];

  var form = document.getElementById('diag');
  if (!form) return;
  var cuerpo = document.getElementById('diag-cuerpo');
  var paso = document.getElementById('diag-paso');
  var barra = document.getElementById('diag-barra');
  var nav = document.getElementById('diag-nav');
  var ant = document.getElementById('diag-ant');
  var sig = document.getElementById('diag-sig');

  var i = 0;
  var resp = new Array(PREGUNTAS.length).fill(null);

  for (var k = 0; k < PREGUNTAS.length; k++) barra.appendChild(document.createElement('span'));

  function dos(n) { return (n < 10 ? '0' : '') + n; }

  function pintarBarra() {
    Array.prototype.forEach.call(barra.children, function (el, k) {
      el.className = k < i ? 'hecho' : (k === i ? 'actual' : '');
    });
  }

  function mostrar() {
    var q = PREGUNTAS[i];
    paso.textContent = 'PREGUNTA ' + dos(i + 1) + ' / ' + PREGUNTAS.length;
    pintarBarra();
    var fs = document.createElement('fieldset');
    fs.className = 'diag-paso-in';
    var lg = document.createElement('legend');
    lg.textContent = q.t;
    fs.appendChild(lg);
    var ops = document.createElement('div');
    ops.className = 'diag-ops';
    q.o.forEach(function (op, j) {
      var lb = document.createElement('label');
      lb.className = 'diag-op';
      var inp = document.createElement('input');
      inp.type = 'radio';
      inp.name = 'q' + i;
      inp.value = j;
      if (resp[i] === j) inp.checked = true;
      inp.addEventListener('change', function () {
        resp[i] = j;
        sig.disabled = false;
      });
      lb.appendChild(inp);
      lb.appendChild(document.createTextNode(' ' + op[0]));
      ops.appendChild(lb);
    });
    fs.appendChild(ops);
    cuerpo.replaceChildren(fs);
    ant.hidden = i === 0;
    sig.disabled = resp[i] === null;
    sig.textContent = i === PREGUNTAS.length - 1 ? 'Ver resultado →' : 'Siguiente →';
    nav.hidden = false;
  }

  function resultado() {
    var total = 0;
    var bajas = [];
    PREGUNTAS.forEach(function (q, k) {
      var pts = q.o[resp[k]][1];
      total += pts;
      bajas.push({ pts: pts, r: q.r, k: k });
    });
    bajas.sort(function (a, b) { return a.pts - b.pts || a.k - b.k; });
    var recs = bajas.filter(function (b) { return b.pts < 10; }).slice(0, 3);

    var nivel, color;
    if (total < 40) { nivel = 'EXPOSICIÓN ALTA'; color = '#C2381A'; }
    else if (total < 70) { nivel = 'EXPOSICIÓN MEDIA'; color = '#8A5A00'; }
    else { nivel = 'EXPOSICIÓN BAJA'; color = '#0F6B45'; }

    paso.textContent = 'RESULTADO';
    i = PREGUNTAS.length;
    pintarBarra();

    var box = document.createElement('div');
    box.className = 'diag-res diag-paso-in';
    var num = document.createElement('div');
    num.className = 'diag-num';
    num.textContent = total;
    var de = document.createElement('small');
    de.textContent = ' / 100';
    num.appendChild(de);
    var etq = document.createElement('div');
    etq.className = 'diag-nivel';
    etq.style.background = color;
    etq.textContent = nivel;
    var txt = document.createElement('p');
    txt.style.margin = '20px 0 0';
    txt.textContent = recs.length
      ? 'Mientras más alto el puntaje, mejor preparada está tu empresa. Estos son los tres cambios que más te acercan a 100:'
      : 'Tu empresa sabe dónde están sus datos y tiene un plan. Mantén el inventario al día.';
    box.append(num, etq, txt);
    if (recs.length) {
      var ol = document.createElement('ol');
      ol.className = 'diag-recs';
      recs.forEach(function (rc, n) {
        var li = document.createElement('li');
        var b = document.createElement('b');
        b.textContent = dos(n + 1);
        var s = document.createElement('span');
        s.textContent = rc.r;
        li.append(b, s);
        ol.appendChild(li);
      });
      box.appendChild(ol);
    }
    var acc = document.createElement('div');
    acc.className = 'diag-nav';
    acc.style.padding = '24px 0 12px';
    var otra = document.createElement('button');
    otra.type = 'button';
    otra.className = 'diag-ant';
    otra.textContent = '↺ Volver a empezar';
    otra.addEventListener('click', function () {
      resp.fill(null);
      i = 0;
      mostrar();
    });
    var bol = document.createElement('a');
    bol.href = '#postular';
    bol.className = 'diag-sig';
    bol.style.textDecoration = 'none';
    bol.style.color = '#fff';
    bol.textContent = 'Recibir el boletín →';
    acc.append(otra, bol);
    box.appendChild(acc);

    cuerpo.replaceChildren(box);
    nav.hidden = true;
  }

  sig.addEventListener('click', function () {
    if (resp[i] === null) return;
    if (i < PREGUNTAS.length - 1) { i++; mostrar(); }
    else resultado();
    var leyenda = cuerpo.querySelector('legend, .diag-num');
    if (leyenda) { leyenda.setAttribute('tabindex', '-1'); leyenda.focus({ preventScroll: true }); }
  });

  ant.addEventListener('click', function () {
    if (i > 0) { i--; mostrar(); }
  });

  mostrar();
})();
