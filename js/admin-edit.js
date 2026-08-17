// ============================================================
// admin-edit.js
// Este archivo hace 3 cosas:
// 1. Carga el contenido guardado en Firestore (si hay) y
//    reemplaza los textos/imágenes por defecto — esto pasa
//    para CUALQUIER visitante, con o sin sesión.
// 2. Si detecta que hay sesión de administrador iniciada,
//    activa el "modo edición": agrega el lapicito a cada
//    campo editable y una barra de admin arriba.
// 3. Al hacer clic en un lapicito, abre un cuadro para editar
//    texto o cambiar una imagen, y guarda el cambio.
//
// NOTA: las fotos NO usan Firebase Storage (eso requiere el
// plan de pago Blaze). En su lugar, cada foto se comprime en el
// navegador y se guarda como texto (base64) en su propio
// documento de Firestore — así todo funciona en el plan
// gratuito, sin necesidad de tarjeta.
//
// NOMBRE_DOCUMENTO identifica qué página es dentro de Firestore
// (cada página tiene su propio documento en la colección
// "contenido"). En conocenos.html ya está puesto:
// <script>const NOMBRE_DOCUMENTO = "conocenos";</script>
// ============================================================

const LADO_MAXIMO_ADMIN = 1400;
const CALIDAD_ADMIN = 0.78;

function iniciarModoEdicion() {
  const db = firebase.firestore();
  const refDocumento = db.collection("contenido").doc(NOMBRE_DOCUMENTO);
  const refImagenes = db.collection("imagenes_" + NOMBRE_DOCUMENTO);

  // ---------- 1. Cargar contenido guardado (para todos los visitantes) ----------
  refDocumento.get().then((snap) => {
    if (snap.exists) aplicarTextos(snap.data());
  }).catch((error) => console.error("No se pudo cargar el texto guardado:", error));

  refImagenes.get().then((coleccion) => {
    coleccion.forEach((doc) => {
      const el = document.querySelector(`[data-campo="${doc.id}"]`);
      if (el && el.tagName === "IMG") el.src = doc.data().datos;
    });
  }).catch((error) => console.error("No se pudieron cargar las fotos guardadas:", error));

  // ---------- 2. Detectar sesión de administrador ----------
  firebase.auth().onAuthStateChanged((usuario) => {
    if (usuario) {
      document.body.classList.add("modo-edicion");
      mostrarBarraAdmin(usuario.email);
      activarLapiceros(refDocumento, refImagenes);
    }
  });
}

function aplicarTextos(datos) {
  Object.keys(datos).forEach((campo) => {
    const el = document.querySelector(`[data-campo="${campo}"]`);
    if (el && el.tagName !== "IMG") el.textContent = datos[campo];
  });
}

function mostrarBarraAdmin(correo) {
  const barra = document.createElement("div");
  barra.className = "barra-admin";
  barra.innerHTML = `
    <span>✏️ Modo edición — sesión de ${correo}</span>
    <button type="button" id="boton-cerrar-sesion">Cerrar sesión</button>
  `;
  document.body.prepend(barra);
  document.getElementById("boton-cerrar-sesion").addEventListener("click", () => {
    firebase.auth().signOut().then(() => window.location.reload());
  });
}

function activarLapiceros(refDocumento, refImagenes) {
  document.querySelectorAll("[data-campo]").forEach((el) => {
    if (el.tagName === "IMG") {
      envolverConLapiz(el, "imagen", refDocumento, refImagenes);
    } else {
      envolverConLapiz(el, "texto", refDocumento, refImagenes);
    }
  });
}

function envolverConLapiz(el, tipo, refDocumento, refImagenes) {
  const envoltorio = document.createElement("span");
  envoltorio.className = "envoltorio-editable";
  el.parentNode.insertBefore(envoltorio, el);
  envoltorio.appendChild(el);

  const lapiz = document.createElement("button");
  lapiz.type = "button";
  lapiz.className = "boton-lapiz";
  lapiz.setAttribute("aria-label", "Editar");
  lapiz.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;
  envoltorio.appendChild(lapiz);

  lapiz.addEventListener("click", () => {
    if (tipo === "texto") abrirEditorTexto(el, refDocumento);
    else abrirEditorImagen(el, refImagenes);
  });
}

// ---------- Editor de texto ----------
function abrirEditorTexto(el, refDocumento) {
  const campo = el.getAttribute("data-campo");
  const valorActual = el.textContent;

  const overlay = crearOverlayModal(`
    <h3>Editar texto</h3>
    <textarea id="campo-editor-texto" rows="5">${valorActual}</textarea>
    <div class="acciones-modal">
      <button type="button" class="boton boton-fantasma" data-cerrar>Cancelar</button>
      <button type="button" class="boton boton-primario" id="guardar-texto">Guardar</button>
    </div>
  `);

  overlay.querySelector("#guardar-texto").addEventListener("click", () => {
    const nuevoValor = overlay.querySelector("#campo-editor-texto").value;
    refDocumento.set({ [campo]: nuevoValor }, { merge: true })
      .then(() => {
        el.textContent = nuevoValor;
        cerrarOverlayModal(overlay);
      })
      .catch((error) => alert("No se pudo guardar: " + error.message));
  });
}

// ---------- Editor de imagen (comprime y guarda en Firestore, sin Storage) ----------
function comprimirImagenAdmin(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => {
      const imagen = new Image();
      imagen.onload = () => {
        let { width, height } = imagen;
        if (width > LADO_MAXIMO_ADMIN || height > LADO_MAXIMO_ADMIN) {
          if (width > height) {
            height = Math.round(height * (LADO_MAXIMO_ADMIN / width));
            width = LADO_MAXIMO_ADMIN;
          } else {
            width = Math.round(width * (LADO_MAXIMO_ADMIN / height));
            height = LADO_MAXIMO_ADMIN;
          }
        }
        const lienzo = document.createElement("canvas");
        lienzo.width = width;
        lienzo.height = height;
        lienzo.getContext("2d").drawImage(imagen, 0, 0, width, height);
        resolve(lienzo.toDataURL("image/jpeg", CALIDAD_ADMIN));
      };
      imagen.onerror = () => reject(new Error("No se pudo procesar la imagen."));
      imagen.src = lector.result;
    };
    lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
    lector.readAsDataURL(archivo);
  });
}

function abrirEditorImagen(el, refImagenes) {
  const campo = el.getAttribute("data-campo");

  const overlay = crearOverlayModal(`
    <h3>Cambiar imagen</h3>
    <img src="${el.src}" style="width:100%; border-radius:10px; margin-bottom:14px;">
    <input type="file" id="campo-editor-imagen" accept="image/*">
    <div id="mensaje-editor-imagen" class="mensaje-estado"></div>
    <div class="acciones-modal">
      <button type="button" class="boton boton-fantasma" data-cerrar>Cancelar</button>
      <button type="button" class="boton boton-primario" id="guardar-imagen">Guardar</button>
    </div>
  `);

  overlay.querySelector("#guardar-imagen").addEventListener("click", async () => {
    const input = overlay.querySelector("#campo-editor-imagen");
    const archivo = input.files[0];
    const mensaje = overlay.querySelector("#mensaje-editor-imagen");

    if (!archivo) {
      mensaje.textContent = "Elige primero una foto.";
      mensaje.className = "mensaje-estado visible error";
      return;
    }

    mensaje.textContent = "Optimizando y guardando...";
    mensaje.className = "mensaje-estado visible";

    try {
      const dataUrl = await comprimirImagenAdmin(archivo);
      await refImagenes.doc(campo).set({ datos: dataUrl });
      el.src = dataUrl;
      cerrarOverlayModal(overlay);
    } catch (error) {
      mensaje.textContent = "No se pudo guardar: " + error.message;
      mensaje.className = "mensaje-estado visible error";
    }
  });
}

// ---------- Utilidades del modal ----------
function crearOverlayModal(contenidoHtml) {
  const overlay = document.createElement("div");
  overlay.className = "overlay-modal";
  overlay.innerHTML = `<div class="caja-modal">${contenidoHtml}</div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (evento) => {
    if (evento.target === overlay || evento.target.hasAttribute("data-cerrar")) {
      cerrarOverlayModal(overlay);
    }
  });

  return overlay;
}

function cerrarOverlayModal(overlay) {
  overlay.remove();
}

document.addEventListener("DOMContentLoaded", iniciarModoEdicion);
