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

// Un pixel 100% transparente — se usa como "src" de una foto que
// todavía no se ha subido, para que el fondo/marcador de abajo se
// siga viendo hasta que alguien suba la foto real desde el modo edición.
const PIXEL_TRANSPARENTE = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

// Paleta de colores para los botones con forma de crayón
// (Preescolar y Primaria) — se van repitiendo en este orden.
const PALETA_CRAYONES = ["#F2994A", "#2FB6B2", "#EB5757", "#F2C94C", "#5B8DEF", "#6FCF97"];

// Paleta neutra y profesional para los botones con forma de
// lapicero (Bachillerato Técnico y CLEI).
const PALETA_LAPICEROS = ["#5C6478", "#495166", "#6B7A99", "#3D4459"];

// Paleta color mostaza/madera para los botones con forma de
// regla (Bachillerato).
const PALETA_REGLAS = ["#D9A441", "#C68F2E", "#E0AC54", "#B8862A"];

// ---------- INICIO (index.html) ----------

function initInicio() {
  const cont = $("#niveles-cont");
  NIVELES.forEach((nivel) => {
    const tarjeta = crearElemento(`
      <a class="tarjeta-nivel" href="nivel.html?nivel=${nivel.id}">
        <div class="tarjeta-nivel-imagen-cont">
          <div class="tarjeta-nivel-imagen-marcador-texto">
            <span>${nivel.nombre}</span>
            <span class="lema">${nivel.lema}</span>
          </div>
          <img class="tarjeta-nivel-imagen" data-campo="nivel_img_${nivel.id}" data-sin-envoltorio src="${nivel.imagen || PIXEL_TRANSPARENTE}" alt="${nivel.nombre} — ${nivel.lema}">
        </div>
        <div class="tarjeta-nivel-pie">
          <span class="ir">Ver grados de ${nivel.nombre} ${ICONOS.flecha()}</span>
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

  const contBanner = $(".banner-cont");
  contBanner.innerHTML = `
    <div class="hero-nivel-marcador">
      <span>${nivel.nombre}</span>
      <span class="lema">${nivel.lema}</span>
    </div>
    <img class="hero-nivel-foto-editable" id="nivel-banner-img" data-campo="nivel_banner_${nivel.id}" data-sin-envoltorio src="${nivel.banner || PIXEL_TRANSPARENTE}" alt="Inscripciones abiertas — ${nivel.nombre}, Real Colegio San José">
  `;

  $("#nivel-pastilla").textContent = nivel.nombre;
  if (nivel.color === "amarillo") $("#nivel-pastilla").classList.add("amarilla");
  $("#nivel-titulo").textContent = `Grados de ${nivel.nombre}`;
  $("#nivel-descripcion").textContent = nivel.descripcion;
  document.title = `${nivel.nombre} — Registro Real Colegio San José`;
  const miga = $("#nivel-titulo-miga");
  if (miga) miga.textContent = nivel.nombre;

  const cont = $("#grados-cont");
  const esNivelCrayon = nivel.id === "preescolar" || nivel.id === "primaria";
  const esNivelLapiz = nivel.id === "bachillerato-tecnico" || nivel.id === "bachillerato-adultos";
  const esNivelRegla = nivel.id === "bachillerato";

  if (esNivelCrayon || esNivelLapiz) {
    const paleta = esNivelCrayon ? PALETA_CRAYONES : PALETA_LAPICEROS;
    cont.classList.add("grados-grilla-crayones");
    grados.forEach((grado, i) => {
      const color = paleta[i % paleta.length];
      const tarjeta = crearElemento(`
        <a class="tarjeta-grado-crayon" href="grado.html?grado=${grado.id}" style="--color-crayon:${color};">
          <span class="crayon-punta"></span>
          <span class="crayon-cuerpo">
            <span class="crayon-banda b1"></span>
            <span class="crayon-banda b2"></span>
            <span class="crayon-texto">
              <h3>${grado.nombre}</h3>
              <span class="ver-mas">Ver grado ${ICONOS.flecha()}</span>
            </span>
          </span>
        </a>
      `);
      cont.appendChild(tarjeta);
    });
  } else if (esNivelRegla) {
    cont.classList.add("grados-grilla-crayones");
    grados.forEach((grado, i) => {
      const color = PALETA_REGLAS[i % PALETA_REGLAS.length];
      const tarjeta = crearElemento(`
        <a class="tarjeta-grado-regla" href="grado.html?grado=${grado.id}" style="--color-regla:${color};">
          <span class="regla-marcas"></span>
          <span class="crayon-texto">
            <h3>${grado.nombre}</h3>
            <span class="ver-mas">Ver grado ${ICONOS.flecha()}</span>
          </span>
        </a>
      `);
      cont.appendChild(tarjeta);
    });
  } else {
    grados.forEach((grado) => {
      const decoracion = DECORACION_NIVEL[nivel.id] || "";
      const tarjeta = crearElemento(`
        <a class="tarjeta-grado" href="grado.html?grado=${grado.id}">
          <div class="tarjeta-grado-decoracion">${decoracion}</div>
          <h3>${grado.nombre}</h3>
          <span class="ver-mas">Ver grado ${ICONOS.flecha()}</span>
        </a>
      `);
      cont.appendChild(tarjeta);
    });
  }

  if (nivel.id === "bachillerato-tecnico") {
    const panel = $(".panel-grados");
    const seccionEnfasis = crearElemento(`
      <div class="seccion-enfasis">
        <h3>Énfasis que ofrece el Bachillerato Técnico</h3>
        <p class="subtexto">En Décimo y Once, cada estudiante elige uno de estos seis énfasis técnicos.</p>
        <div class="enfasis-grilla"></div>
      </div>
    `);
    const grillaEnfasis = seccionEnfasis.querySelector(".enfasis-grilla");
    ENFASIS_TECNICOS.forEach((enfasis) => {
      grillaEnfasis.appendChild(crearElemento(`
        <div class="tarjeta-enfasis">
          <h4>${enfasis.nombre}</h4>
          <p>${enfasis.descripcion}</p>
        </div>
      `));
    });
    panel.appendChild(seccionEnfasis);
  }
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
  $("#grado-descripcion-corta").textContent = grado.descripcionCorta;
  $("#grado-descripcion").textContent = grado.descripcion;

  $all(".boton-inscribirse").forEach(b => b.href = `inscripcion.html?grado=${grado.id}`);

  // Galería con fotos editables (si no hay foto todavía, se ve el
  // patrón a rayas — en cuanto se suba una desde el modo edición,
  // esta la reemplaza automáticamente).
  const galeria = $("#galeria-cont");
  if (grado.fotos.length === 1) galeria.classList.add("galeria-una-foto");
  grado.fotos.forEach((foto, i) => {
    const clase = foto ? "foto-real foto-con-borde" : "foto-placeholder foto-real";
    galeria.appendChild(crearElemento(
      `<img class="${clase}" data-campo="grado_foto${i + 1}_${grado.id}" data-sin-envoltorio src="${foto || PIXEL_TRANSPARENTE}" alt="Foto del salón de ${grado.nombre}">`
    ));
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

const TAMANO_MAXIMO_ARCHIVO = 8 * 1024 * 1024; // 8 MB por foto (límite de seguridad, tras comprimir casi nunca se llega aquí)
const LADO_MAXIMO_FOTO = 2000; // px — conserva el texto y números legibles en documentos, aun impresos
const CALIDAD_COMPRESION = 0.85;
const WHATSAPP_NUMERO = "573218114521"; // primer número de contacto, con indicativo de Colombia

// Redibuja la foto en un lienzo más chico y la exporta como JPEG liviano.
// Así lo que llega a Drive pesa mucho menos que la foto original del celular.
function comprimirImagen(archivo, ladoMaximo = LADO_MAXIMO_FOTO, calidad = CALIDAD_COMPRESION) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => {
      const imagen = new Image();
      imagen.onload = () => {
        let { width, height } = imagen;
        if (width > ladoMaximo || height > ladoMaximo) {
          if (width > height) {
            height = Math.round(height * (ladoMaximo / width));
            width = ladoMaximo;
          } else {
            width = Math.round(width * (ladoMaximo / height));
            height = ladoMaximo;
          }
        }
        const lienzo = document.createElement("canvas");
        lienzo.width = width;
        lienzo.height = height;
        lienzo.getContext("2d").drawImage(imagen, 0, 0, width, height);
        lienzo.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("No se pudo comprimir la imagen.")),
          "image/jpeg",
          calidad
        );
      };
      imagen.onerror = () => reject(new Error("No se pudo procesar la imagen para comprimirla."));
      imagen.src = lector.result;
    };
    lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
    lector.readAsDataURL(archivo);
  });
}

async function archivoABase64(input) {
  const archivo = input.files && input.files[0];
  if (!archivo) return null;

  let blobFinal = archivo;
  if (archivo.type && archivo.type.startsWith("image/") && archivo.type !== "image/gif") {
    try {
      blobFinal = await comprimirImagen(archivo);
    } catch (error) {
      blobFinal = archivo; // si la compresión falla por algo, se sube la foto tal cual
    }
  }

  if (blobFinal.size > TAMANO_MAXIMO_ARCHIVO) {
    throw new Error(`La foto "${archivo.name}" sigue pesando mucho. Usa una foto más liviana.`);
  }

  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => {
      const base64 = lector.result.split(",")[1];
      resolve({
        nombre: archivo.name.replace(/\.[^.]+$/, "") + ".jpg",
        tipo: "image/jpeg",
        datos: base64
      });
    };
    lector.onerror = () => reject(new Error(`No se pudo leer la foto "${archivo.name}".`));
    lector.readAsDataURL(blobFinal);
  });
}

function initInscripcion() {
  const gradoId = obtenerParametro("grado");
  const grado = obtenerGrado(gradoId) || GRADOS[0];
  const nivel = obtenerNivel(grado.nivelId);
  const esCLEI = grado.nivelId === "bachillerato-adultos";
  const esTecnico = grado.nivelId === "bachillerato-tecnico";
  const requiereConstancia = grado.nivelId !== "preescolar" && !esCLEI;
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

  // Bachillerato Técnico y CLEI piden teléfono directo del estudiante
  // y preguntan la modalidad (presencial o virtual).
  if (esCLEI || esTecnico) {
    $("#grupo-modalidad").style.display = "block";
    $("#grupo-est-telefono").style.display = "block";
    $("#est-telefono").required = true;
  }

  if (esCLEI) {
    $("#grupo-clei").style.display = "block";
    $("#grupo-documento-identidad").style.display = "none";
    $("#grupo-pago").style.display = "none";
    $("#doc-frente").required = false;
    $("#doc-reverso").required = false;

    // Para este programa el acudiente solo aplica si el estudiante es
    // menor de edad — se deja de pedir como obligatorio.
    $("#acudiente-subtexto").textContent = "Solo diligencia esto si el estudiante es menor de edad.";
    ["#acu-nombre", "#acu-tipo-doc", "#acu-documento", "#acu-telefono"].forEach((sel) => {
      $(sel).required = false;
    });
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
    botonEnviar.textContent = "Optimizando fotos...";
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
        formato: esCLEI ? "clei" : (esTecnico ? "tecnico" : "estandar"),
        grado: datosFormulario.get("grado"),
        estudiante_nombre: datosFormulario.get("estudiante_nombre"),
        estudiante_tipo_documento: datosFormulario.get("estudiante_tipo_documento"),
        estudiante_documento: datosFormulario.get("estudiante_documento"),
        estudiante_telefono: (esCLEI || esTecnico) ? datosFormulario.get("estudiante_telefono") : "",
        modalidad: (esCLEI || esTecnico) ? datosFormulario.get("modalidad") : "",
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

// ---------- Botón flotante de redes sociales (expandible) ----------
// En computador, con :hover en el CSS ya se expande solo. Esto es lo
// que hace falta para cuando alguien lo TOCA (celular, o clic en
// computador): abre/cierra, y si tocas afuera, se cierra solo.
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.getElementById("fab-redes");
  if (!fab) return;
  const boton = fab.querySelector(".fab-trigger");

  boton.addEventListener("click", (evento) => {
    evento.preventDefault();
    const abierto = fab.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto ? "true" : "false");
  });

  document.addEventListener("click", (evento) => {
    if (!fab.contains(evento.target)) {
      fab.classList.remove("abierto");
      boton.setAttribute("aria-expanded", "false");
    }
  });
});
