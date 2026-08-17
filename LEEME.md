# Sitio de registro — Real Colegio San José

Sitio estático (HTML + CSS + JS, sin backend propio) para que las familias
elijan un grado (Transición a Once), lo conozcan y llenen el formulario de
inscripción con sus documentos. Cada inscripción —datos y fotos— se guarda
automáticamente en Google Sheets + Google Drive, organizada por grado.

## 1. Estructura del sitio

- `index.html` — Inicio: Preescolar / Primaria / Bachillerato / Bachillerato Técnico.
- `nivel.html?nivel=primaria` — Grilla de grados de ese nivel (y, solo para
  `bachillerato-tecnico`, los 6 énfasis que ofrece).
- `grado.html?grado=quinto` — Fotos, descripción y botón "Inscribirme".
- `inscripcion.html?grado=quinto` — Formulario + documentos, guarda en Sheets/Drive.
- `conocenos.html` — Página institucional nueva: presentación, datos del
  colegio, logro deportivo, galería de fotos (todavía con marcadores de
  posición) y los 4 proyectos transversales.
- `js/data.js` — **Aquí editas** nombres, edades y descripciones de cada
  grado y nivel, y aquí agregas las fotos reales cuando las tengas.
- `js/sheets-config.js` — Aquí va el enlace de tu Google Apps Script.

### Pendiente de tu lado en `conocenos.html` y `data.js`

- **Imágenes de "Bachillerato"**: por ahora sigue usando las mismas
  imágenes que tenías para "Secundaria" (`assets/banner-secundaria.png` y
  `assets/nivel-secundaria.png`), pero ese diseño dice **"de Sexto a
  Once"**, que ya no es exacto — ahora Bachillerato es Sexto a Noveno.
  Cuando tengas las imágenes nuevas, reemplaza esos dos archivos (mismo
  nombre) o avísame y ajusto `js/data.js` si les cambias el nombre.
- **Imágenes de "Bachillerato Técnico"**: no tiene imágenes propias
  todavía — el sitio muestra un bloque de color con el nombre mientras
  tanto. En `js/data.js`, dentro de `NIVELES`, busca `bachillerato-tecnico`
  y reemplaza `imagen: null` y `banner: null` con las rutas cuando las
  tengas.
- **Fotos de `conocenos.html`**: la foto de la institución del inicio, las
  12 fotos de "Conoce el colegio", el banner del logro de vóleibol, y las
  2 fotos de cada uno de los 4 proyectos transversales — todo está con
  marcadores de posición ("— próximamente"). Cuando tengas las fotos, dime
  cuál va en cada espacio y las pongo.
- Los textos de "Conócenos" y de los proyectos transversales (La Granja,
  Educación Emocional, Psicología, Robótica) los escribí yo con la
  información que me diste — revísalos y ajusta lo que no te cuadre.

## 2. Qué pide el formulario ahora

- Datos del estudiante y del acudiente (igual que antes).
- Foto del registro civil o tarjeta de identidad, **frente y reverso**.
- Foto de la constancia de comportamiento — **solo aparece de Primero a
  Once** (Transición no la pide, según los requisitos que diste).
- Foto del comprobante de pago de la inscripción ($15.000, convenio
  Supergiros 25755) — **este campo es opcional**. Si no se sube, la
  columna "Comprobante de pago" de esa fila queda en rojo con el texto
  "Pendiente de pago", para que sea fácil detectar a quién le falta pagar.
- Al enviar, se le ofrece al acudiente un botón para abrir WhatsApp con el
  primer número de contacto y un mensaje ya escrito, para que adjunte la
  foto del comprobante manualmente (ver sección 5, por qué no es 100% automático).

## 3. Actualiza tu Google Sheet: agrega 4 columnas nuevas

Ya tienes las 12 pestañas con estas 8 columnas (A a H):

```
Fecha | Estudiante - Nombre | Estudiante - Tipo de documento | Estudiante - Documento | Acudiente - Nombre | Acudiente - Tipo de documento | Acudiente - Documento | Acudiente - Teléfono
```

Agrega 4 columnas más (I a L) en **cada una de las 12 pestañas** — puedes
escribirlas en la primera pestaña y copiar esa fila a las otras 11, igual
que hiciste antes:

```
Documento - Frente | Documento - Reverso | Constancia de comportamiento | Comprobante de pago
```

En esas columnas va a quedar el enlace a cada foto (no la imagen en sí,
sino un link que abre la foto guardada en Drive).

## 4. Actualiza el código en Apps Script

1. Abre tu Google Sheet → **Extensiones → Apps Script** (el mismo proyecto
   de antes).
2. Borra todo el código que había y reemplázalo por este:

```javascript
function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    var libro = SpreadsheetApp.getActiveSpreadsheet();
    var grado = datos.grado;
    var hoja = libro.getSheetByName(grado);

    var encabezados = ["Fecha", "Estudiante - Nombre", "Estudiante - Tipo de documento",
      "Estudiante - Documento", "Acudiente - Nombre", "Acudiente - Tipo de documento",
      "Acudiente - Documento", "Acudiente - Teléfono", "Documento - Frente",
      "Documento - Reverso", "Constancia de comportamiento", "Comprobante de pago"];

    if (!hoja) {
      hoja = libro.insertSheet(grado);
      hoja.appendRow(encabezados);
    }

    var carpeta = obtenerCarpetaInscripciones();
    var prefijoArchivo = grado + " - " + (datos.estudiante_nombre || "sin nombre");

    var urlFrente = guardarArchivo(carpeta, datos.archivo_documento_frente, prefijoArchivo + " - documento frente");
    var urlReverso = guardarArchivo(carpeta, datos.archivo_documento_reverso, prefijoArchivo + " - documento reverso");
    var urlConstancia = guardarArchivo(carpeta, datos.archivo_constancia, prefijoArchivo + " - constancia");
    var urlComprobante = guardarArchivo(carpeta, datos.archivo_comprobante, prefijoArchivo + " - comprobante de pago");
    var textoComprobante = urlComprobante ? urlComprobante : "Pendiente de pago";

    hoja.appendRow([
      new Date(),
      datos.estudiante_nombre,
      datos.estudiante_tipo_documento,
      datos.estudiante_documento,
      datos.acudiente_nombre,
      datos.acudiente_tipo_documento,
      datos.acudiente_documento,
      datos.acudiente_telefono,
      urlFrente,
      urlReverso,
      urlConstancia,
      textoComprobante
    ]);

    if (!urlComprobante) {
      var filaNueva = hoja.getLastRow();
      hoja.getRange(filaNueva, 12)
        .setBackground("#F4C7C3")
        .setFontColor("#990000")
        .setFontWeight("bold");
    }

    return ContentService
      .createTextOutput(JSON.stringify({ resultado: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    registrarError(error);
    return ContentService
      .createTextOutput(JSON.stringify({ resultado: "error", mensaje: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function registrarError(error) {
  try {
    var libro = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = libro.getSheetByName("Errores_Debug");
    if (!hoja) {
      hoja = libro.insertSheet("Errores_Debug");
      hoja.appendRow(["Fecha", "Mensaje de error", "Detalle"]);
    }
    hoja.appendRow([new Date(), error.message, error.stack || ""]);
  } catch (errorSecundario) {
    // si ni esto funciona, no hacemos nada más — no queremos que falle doblemente
  }
}

function obtenerCarpetaInscripciones() {
  var nombreCarpeta = "Inscripciones — Real Colegio San José";
  var carpetas = DriveApp.getFoldersByName(nombreCarpeta);
  if (carpetas.hasNext()) return carpetas.next();
  return DriveApp.createFolder(nombreCarpeta);
}

function guardarArchivo(carpeta, archivo, nombreBase) {
  if (!archivo || !archivo.datos) return "";
  var bytes = Utilities.base64Decode(archivo.datos);
  var blob = Utilities.newBlob(bytes, archivo.tipo, nombreBase);
  var creado = carpeta.createFile(blob);
  creado.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return creado.getUrl();
}
```

Si algo falla, ahora va a aparecer automáticamente una pestaña nueva llamada
**"Errores_Debug"** en tu Google Sheet, con el mensaje exacto del error. Esa
es la forma más fácil de ver qué está pasando, sin depender del panel de
"Ejecuciones" de Apps Script.

3. Guarda (Ctrl+S).
4. Como este código ahora también usa Google Drive (antes solo usaba
   Sheets), Google te va a pedir autorizar permisos nuevos. Ve a
   **Implementar → Gestionar implementaciones**, edita tu implementación
   (ícono del lápiz), y en el desplegable de "Versión" elige **Nueva
   versión**, luego dale a **Implementar**. Te va a volver a salir la
   pantalla de "Google no verificó esta app" — es normal, es el mismo
   caso de antes: dale a **Advanced/Avanzado → Ir a Inscripciones (no
   seguro) → Permitir**.
5. La URL del formulario (la que está en `js/sheets-config.js`) **no
   cambia** — sigue siendo la misma, solo se actualizó lo que hace el
   script por dentro.

Con esto, cada foto que suban las familias va a quedar guardada dentro de
una carpeta de tu Google Drive llamada **"Inscripciones — Real Colegio San
José"**, y el enlace a cada una aparece en la fila correspondiente de la
hoja.

## 5. Por qué el envío por WhatsApp no es 100% automático

WhatsApp no deja que una página web mande fotos automáticamente a un
número — solo se puede si usas su "API de WhatsApp Business", que es de
pago, requiere aprobación de Meta y verificación como empresa. Como pediste
que se enviara al menos a un número si no se podía a los dos, lo que hace
el sitio es: al terminar la inscripción, aparece un botón que abre WhatsApp
con el número **321 811 4521** y un mensaje ya escrito con el nombre del
estudiante y el grado — el acudiente solo tiene que darle "adjuntar" y
elegir la misma foto del comprobante que ya subió al formulario.

Si en algún momento el colegio quiere automatizar esto de verdad (sin ese
paso manual), la única forma es contratar ese servicio de WhatsApp Business
de pago — puedo ayudarte a evaluarlo si llegan a esa etapa.

## 6. Publicar en GitHub Pages

Sube todos los archivos y carpetas manteniendo la estructura (`css/`,
`js/`, `assets/`, y los `.html` en la raíz). En Settings → Pages, publica
desde `main` / raíz.

## 7. Antes de recibir inscripciones reales

- Haz una inscripción de prueba completa (con fotos) y confirma que:
  - aparece la fila en la pestaña del grado correcto,
  - los 4 enlaces de documentos abren las fotos correctas,
  - la carpeta "Inscripciones — Real Colegio San José" apareció en tu
    Google Drive.
- Borra esa fila y esos archivos de prueba antes de publicar de verdad.

## 8. Cosas que faltan por definir (para una próxima vuelta)

- Fotos reales de cada salón (edítalas en `js/data.js`).
- Si quieren un número de WhatsApp distinto como principal, dime y cambio
  el número en `js/main.js` (variable `WHATSAPP_NUMERO`).


## 9. Panel de administración (editar textos e imágenes en vivo)

`conocenos.html` ahora se puede editar directamente desde el navegador,
sin tocar código, usando Firebase — **sin necesidad de tarjeta ni del
plan de pago Blaze**. Así queda armado:

- `login.html` — página para iniciar sesión con tu correo y contraseña
  de administrador.
- `js/firebase-config.js` — **aquí debes pegar** las claves de tu
  proyecto de Firebase (ver más abajo).
- `js/admin-edit.js` — el motor del modo edición: cuando inicias sesión,
  le agrega un lapicito ✏️ a cada texto e imagen editable de la página.

**Nota técnica:** las fotos no usan "Firebase Storage" (ese servicio
ahora exige el plan pago Blaze, aunque el uso real sea gratis). En vez
de eso, cada foto que subas se comprime en el navegador y se guarda
como texto dentro de Firestore — el mismo servicio gratis que ya usas
para los textos. Solo necesitas activar Firestore, no Storage.

### 9.1 Completa `js/firebase-config.js`

Abre ese archivo y reemplaza los 6 valores (`apiKey`, `authDomain`,
`projectId`, `storageBucket`, `messagingSenderId`, `appId`) por los que
copiaste en "Configuración del proyecto → Tus apps" de la consola de
Firebase.

### 9.2 Pega las reglas de seguridad de Firestore

Estas reglas dicen: "cualquiera puede ver el contenido, pero solo alguien
con sesión iniciada puede modificarlo". Ve a consola de Firebase →
Firestore Database → pestaña "Reglas", borra lo que haya y pega esto
(ya cubre las 5 páginas: inicio, conócenos, nivel, grado e inscripción):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contenido/{documento} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /imagenes_index/{documento} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /imagenes_conocenos/{documento} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /imagenes_nivel/{documento} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /imagenes_grado/{documento} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Dale clic a "Publicar".

### 9.3 Cómo se usa

1. Entra a `login.html` desde el link "Acceso administrador" que está en
   el pie de página de **cualquier** página del sitio (inicio, conócenos,
   niveles, grados, inscripción).
2. Inicia sesión con el usuario que creaste en Authentication.
3. La sesión queda activa en todo el sitio — puedes navegar a cualquier
   página y vas a seguir viendo la barra de "Modo edición" y los
   lapicitos ✏️ junto a lo que sea editable en esa página, sin tener que
   volver a iniciar sesión.
4. Clic en un lapicito de texto → se abre un cuadro para editarlo →
   "Guardar". Clic en un lapicito de foto → eliges el archivo nuevo →
   "Guardar" (tarda un par de segundos porque la comprime antes).
5. Los cambios quedan guardados de inmediato — cualquier visitante que
   entre después (con o sin sesión) va a ver la versión nueva.
6. "Cerrar sesión" en la barra azul para salir del modo edición (esto
   también cierra la sesión en las demás páginas).

### 9.4 Qué es editable por ahora

- **Inicio (`index.html`)**: el texto y la foto del banner de bienvenida
  ("Calidad que forma..."), el título/descripción de "Elige el nivel
  para empezar", y **la imagen de cada una de las 4 tarjetas de nivel**
  (Preescolar, Primaria, Bachillerato, Bachillerato Técnico).
- **Conócenos (`conocenos.html`)**: el título y párrafo de "Conócenos",
  los 6 datos institucionales (título + descripción de cada uno), el
  título/descripción/foto del logro deportivo, las 11 fotos de "Conoce
  el colegio", y en cada uno de los 5 proyectos pedagógicos: sus 2
  fotos, título y descripción.
- **Nivel (`nivel.html`)**: **la foto grande del banner de arriba**
  (distinta para cada nivel), y **la foto de cada cuadrito de grado**
  dentro de la lista (por ejemplo, la foto de "Primero" dentro de
  Primaria) — mientras no se suba una foto, el cuadrito se ve con su
  color de siempre.
- **Grado (`grado.html`)**: el texto de los 2 botones "Inscribirme a
  este grado", el título "Sobre este grado", el título/descripción de
  la franja "¿Listo para dar el paso?" (estos textos son los mismos
  para cualquier grado, es la misma plantilla), y **las 2 fotos del
  salón de cada grado** (sí son distintas por cada grado).
- **Inscripción (`inscripcion.html`)**: el valor de la inscripción, el
  número de convenio Supergiros, la nota de instrucciones de pago, y el
  título/descripción de la pantalla "¡Inscripción enviada!".

Lo que **no** es editable todavía: los íconos, los botones de WhatsApp,
la descripción particular de cada grado y cada nivel (por ejemplo el
párrafo propio de "Quinto" o de "Primaria" — solo las fotos de esas
partes son editables por ahora, el texto todavía sale de `data.js`).

### 9.5 Nota sobre "es gratis"

Firestore (sin Storage) tiene un plan gratuito (Spark) que alcanza de
sobra para esto — decenas de miles de lecturas y escrituras al día,
sin necesidad de tarjeta registrada. Para los volúmenes de un sitio de
colegio, esto no debería costar nada nunca.

