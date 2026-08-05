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
  NIVELES.forEach((nivel, i) => {
    const tarjeta = crearElemento(`
      <a class="tarjeta-nivel n-${nivel.id}" href="nivel.html?nivel=${nivel.id}">
        <span class="num">0${i + 1}</span>
        <div class="lema">${nivel.lema}</div>
        <h2>${nivel.nombre}</h2>
        <p>${nivel.descripcion}</p>
        <span class="ir">Ver grados ${ICONOS.flecha()}</span>
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

  $("#nivel-pastilla").textContent = nivel.nombre;
  if (nivel.color === "amarillo") $("#nivel-pastilla").classList.add("amarilla");
  $("#nivel-titulo").textContent = nivel.nombre;
  $("#nivel-descripcion").textContent = nivel.descripcion;
  document.title = `${nivel.nombre} — Registro Real Colegio San José`;

  const cont = $("#grados-cont");
  grados.forEach((grado, i) => {
    const tarjeta = crearElemento(`
      <a class="tarjeta-grado" href="grado.html?grado=${grado.id}">
        <span class="indice">Grado ${i + 1} de ${grados.length}</span>
        <h3>${grado.nombre}</h3>
        <p>${grado.descripcionCorta}</p>
        <div class="pie">
          <span class="pastilla">${grado.edad}</span>
          <span class="ver-mas">Ver grado ${ICONOS.flecha()}</span>
        </div>
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

function initInscripcion() {
  const gradoId = obtenerParametro("grado");
  const grado = obtenerGrado(gradoId) || GRADOS[0];

  $("#insc-miga").textContent = grado.nombre;
  $("#insc-miga").href = `grado.html?grado=${grado.id}`;
  $("#insc-titulo").textContent = `Inscripción — ${grado.nombre}`;
  $("#insc-grado-oculto").value = grado.nombre;

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
    botonEnviar.textContent = "Enviando...";

    const datos = new URLSearchParams(new FormData(form));

    try {
      const respuesta = await fetch(SHEETS_WEB_APP_URL, { method: "POST", body: datos });
      const resultado = await respuesta.json();

      if (resultado && resultado.resultado === "ok") {
        form.style.display = "none";
        const exito = $("#pantalla-exito");
        exito.querySelector(".icono-exito").innerHTML = ICONOS.check("#16305C");
        exito.style.display = "block";
      } else {
        throw new Error("Respuesta inesperada");
      }
    } catch (error) {
      mostrarEstado("No se pudo enviar la inscripción. Verifica tu conexión e inténtalo de nuevo.", "error");
      botonEnviar.disabled = false;
      botonEnviar.textContent = "Enviar inscripción";
    }
  });

  function mostrarEstado(texto, tipo) {
    estado.textContent = texto;
    estado.className = `mensaje-estado visible ${tipo}`;
  }
}
