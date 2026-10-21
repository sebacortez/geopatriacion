// Suscripción al boletín: envía el correo a FormSubmit sin salir de la página.
// Sin JavaScript, el formulario hace un POST normal y FormSubmit redirige a /gracias/.
(function () {
  var form = document.getElementById('boletin-form');
  if (!form) return;
  var estado = document.getElementById('boletin-estado');
  var boton = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (form.elements._honey.value) return;

    var datos = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name && el.name !== '_next') datos[el.name] = el.value;
    });

    boton.disabled = true;
    estado.textContent = 'Enviando…';

    fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(datos)
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (String(r.success) !== 'true') throw new Error(r.message || 'error');
        form.reset();
        estado.textContent = '¡Listo! Te llegará el próximo boletín.';
      })
      .catch(function () {
        estado.textContent = 'No pudimos registrarte. Escríbenos a contacto@geopatriacion.cl.';
      })
      .then(function () { boton.disabled = false; });
  });
})();
