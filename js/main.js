// ============================================================
// main.js — Renderiza cada página a partir de data.js
// ============================================================

function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $all(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function obtenerParametro(nombre) {
  return new URLSearchParams(window.location.search).get(nombre);
}

function crearElemento(html) {
  const envoltorio = document.createElement("div");
  envoltorio.innerHTML = html.trim();
  return envoltorio.firstElementChild;
}

// ---------- INICIO (index.html) ----------

function initInicio() {
  const cont = $("#niveles-cont");
  NIVELES.forEach((nivel) => {
    const tarjeta = crearElemento(`
      <a class="tarjeta-nivel" href="nivel.html?nivel=${nivel.id}">
        <div class="tarjeta-nivel-insignia">
          <img src="${nivel.imagen}" alt="Insignia de ${nivel.nombre}">
        </div>
        <div class="tarjeta-nivel-contenido">
          <span class="lema">${nivel.lema}</span>
          <p>${nivel.descripcion}</p>
          <span class="ir">Ver grados ${ICONOS.flecha()}</span>
        </div>
      </a>
    `);
    cont.appendChild(tarjeta);
  });

  renderCaminoCompleto($("#camino-cont"));
}

function renderCaminoCompleto(cont) {
  if (!cont) return;
  const n = GRADOS.length;
  const ancho = 1120;
  const alto = 92;
  const margen = 44;
  const paso = (ancho - margen * 2) / (n - 1);
  const y = 46;

  let puntos = "";
  let linea = `M ${margen} ${y} `;
  GRADOS.forEach((grado, i) => {
    const x = margen + paso * i;
    if (i > 0) linea += `L ${x} ${y} `;
    puntos += `
      <g>
        <circle class="camino-punto" cx="${x}" cy="${y}" r="7"></circle>
        <text x="${x}" y="${y + 26}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="10.5" fill="#5C6478">${grado.nombre}</text>
      </g>`;
  });

  cont.innerHTML = `
    <svg class="camino-svg" viewBox="0 0 ${ancho} ${alto}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Camino de grados desde Transición hasta Once">
      <path class="camino-linea" d="${linea}"></path>
      ${puntos}
    </svg>`;
}

// ---------- NIVEL (nivel.html) ----------

function initNivel() {
  const nivelId = obtenerParametro("nivel");
  const nivel = obtenerNivel(nivelId) || NIVELES[0];
  const grados = gradosPorNivel(nivel.id);

  $("#nivel-banner-img").src = nivel.banner;
  $("#nivel-banner-img").alt = `Inscripciones abiertas — ${nivel.nombre}, Real Colegio San José`;

  $("#nivel-pastilla").textContent = nivel.nombre;
  if (nivel.color === "amarillo") $("#nivel-pastilla").classList.add("amarilla");
  $("#nivel-titulo").textContent = `Grados de ${nivel.nombre}`;
  $("#nivel-descripcion").textContent = nivel.descripcion;
  document.title = `${nivel.nombre} — Registro Real Colegio San José`;
  const miga = $("#nivel-titulo-miga");
  if (miga) miga.textContent = nivel.nombre;

  const cont = $("#grados-cont");
  grados.forEach((grado) => {
    const tarjeta = crearElemento(`
      <a class="tarjeta-grado" href="grado.html?grado=${grado.id}">
        <span class="edad">${grado.edad}</span>
        <h3>${grado.nombre}</h3>
        <span class="ver-mas">Ver grado ${ICONOS.flecha()}</span>
      </a>
    `);
    cont.appendChild(tarjeta);
  });
}

// ---------- GRADO (grado.html) ----------

function initGrado() {
  const gradoId = obtenerParametro("grado");
  const grado = obtenerGrado(gradoId) || GRADOS[0];
  const nivel = obtenerNivel(grado.nivelId);

  document.title = `${grado.nombre} — Registro Real Colegio San José`;

  $("#miga-nivel").textContent = nivel.nombre;
  $("#miga-nivel").href = `nivel.html?nivel=${nivel.id}`;
  $("#grado-pastilla-nivel").textContent = nivel.nombre;
  $("#grado-titulo").textContent = grado.nombre;
  $("#grado-edad").textContent = grado.edad;
  $("#grado-descripcion-corta").textContent = grado.descripcionCorta;
  $("#grado-descripcion").textContent = grado.descripcion;

  $all(".boton-inscribirse").forEach(b => b.href = `inscripcion.html?grado=${grado.id}`);

  // Galería con marcadores de posición (aún no hay fotos reales)
  const galeria = $("#galeria-cont");
  grado.fotos.forEach((foto) => {
    if (foto) {
      galeria.appendChild(crearElemento(`<div class="foto-placeholder" style="background-image:url('${foto}'); background-size:cover; background-position:center; border-style:solid;"></div>`));
    } else {
      galeria.appendChild(crearElemento(`
        <div class="foto-placeholder">
          <div class="contenido-vacio">
            ${ICONOS.foto("#2C58A0")}
            <span>Foto del salón<br>de ${grado.nombre}<br>— próximamente</span>
          </div>
        </div>
      `));
    }
  });

  // Navegación al grado anterior / siguiente dentro del mismo recorrido
  const idx = GRADOS.findIndex(g => g.id === grado.id);
  const anterior = GRADOS[idx - 1];
  const siguiente = GRADOS[idx + 1];
  const nav = $("#grado-nav");
  nav.innerHTML = `
    ${anterior ? `<a class="boton boton-fantasma" href="grado.html?grado=${anterior.id}">${ICONOS.flecha()} ${anterior.nombre}</a>` : `<span></span>`}
    ${siguiente ? `<a class="boton boton-fantasma" href="grado.html?grado=${siguiente.id}">${siguiente.nombre} <span style="display:inline-block; transform:rotate(180deg);">${ICONOS.flecha()}</span></a>` : `<span></span>`}
  `;
}

// ---------- INSCRIPCIÓN (inscripcion.html) ----------

const TAMANO_MAXIMO_ARCHIVO = 8 * 1024 * 1024; // 8 MB por foto
const WHATSAPP_NUMERO = "573218114521"; // primer número de contacto, con indicativo de Colombia

function archivoABase64(input) {
  return new Promise((resolve, reject) => {
    const archivo = input.files && input.files[0];
    if (!archivo) { resolve(null); return; }

    if (archivo.size > TAMANO_MAXIMO_ARCHIVO) {
      reject(new Error(`La foto "${archivo.name}" pesa más de 8 MB. Usa una foto más liviana.`));
      return;
    }

    const lector = new FileReader();
    lector.onload = () => {
      const resultado = lector.result; // "data:image/jpeg;base64,AAAA..."
      const base64 = resultado.split(",")[1];
      resolve({ nombre: archivo.name, tipo: archivo.type || "image/jpeg", datos: base64 });
    };
    lector.onerror = () => reject(new Error(`No se pudo leer la foto "${archivo.name}".`));
    lector.readAsDataURL(archivo);
  });
}

function initInscripcion() {
  const gradoId = obtenerParametro("grado");
  const grado = obtenerGrado(gradoId) || GRADOS[0];
  const nivel = obtenerNivel(grado.nivelId);
  const requiereConstancia = grado.nivelId !== "preescolar";
  $("#insc-miga").textContent = grado.nombre;
  $("#insc-miga").href = `grado.html?grado=${grado.id}`;
  $("#insc-titulo").textContent = `Inscripción — ${grado.nombre}`;
  $("#insc-grado-oculto").value = grado.nombre;

  const grupoConstancia = $("#grupo-constancia");
  const campoConstancia = $("#doc-constancia");
  if (!requiereConstancia) {
    grupoConstancia.style.display = "none";
  } else {
    campoConstancia.required = true;
  }

  const form = $("#form-inscripcion");
  const estado = $("#mensaje-estado");
  const botonEnviar = $("#boton-enviar");

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    if (SHEETS_WEB_APP_URL.includes("PEGA_AQUI")) {
      mostrarEstado("Falta conectar este formulario con Google Sheets. Revisa LEEME.md.", "error");
      return;
    }

    botonEnviar.disabled = true;
    botonEnviar.textContent = "Subiendo fotos...";
    ocultarEstado();

    try {
      const [documentoFrente, documentoReverso, constancia, comprobante] = await Promise.all([
        archivoABase64($("#doc-frente")),
        archivoABase64($("#doc-reverso")),
        archivoABase64(campoConstancia),
        archivoABase64($("#doc-comprobante"))
      ]);

      const datosFormulario = new FormData(form);
      const carga = {
        grado: datosFormulario.get("grado"),
        estudiante_nombre: datosFormulario.get("estudiante_nombre"),
        estudiante_tipo_documento: datosFormulario.get("estudiante_tipo_documento"),
        estudiante_documento: datosFormulario.get("estudiante_documento"),
        acudiente_nombre: datosFormulario.get("acudiente_nombre"),
        acudiente_tipo_documento: datosFormulario.get("acudiente_tipo_documento"),
        acudiente_documento: datosFormulario.get("acudiente_documento"),
        acudiente_telefono: datosFormulario.get("acudiente_telefono"),
        archivo_documento_frente: documentoFrente,
        archivo_documento_reverso: documentoReverso,
        archivo_constancia: constancia,
        archivo_comprobante: comprobante
      };

      botonEnviar.textContent = "Enviando...";

      await fetch(SHEETS_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(carga)
      });

      // En modo "no-cors" el navegador no deja leer la respuesta de Google,
      // así que si el envío no lanzó un error de red, lo damos por enviado.
      form.style.display = "none";
      const mensajeWa = encodeURIComponent(
        `Hola, envío el comprobante de pago de la inscripción de ${carga.estudiante_nombre} — grado ${grado.nombre}.`
      );
      $("#boton-whatsapp").href = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensajeWa}`;
      $("#pantalla-exito").style.display = "block";
    } catch (error) {
      mostrarEstado(error.message || "No se pudo enviar la inscripción. Verifica tu conexión e inténtalo de nuevo.", "error");
      botonEnviar.disabled = false;
      botonEnviar.textContent = "Enviar inscripción";
    }
  });

  function mostrarEstado(texto, tipo) {
    estado.textContent = texto;
    estado.className = `mensaje-estado visible ${tipo}`;
  }

  function ocultarEstado() {
    estado.className = "mensaje-estado";
  }
}
