# Sitio de registro — Real Colegio San José

Sitio estático (HTML + CSS + JS, sin backend propio) para que las familias
elijan un grado (Transición a Once), lo conozcan y llenen el formulario de
inscripción con sus documentos. Cada inscripción —datos y fotos— se guarda
automáticamente en Google Sheets + Google Drive, organizada por grado.

## 1. Estructura del sitio

- `index.html` — Inicio: Preescolar / Primaria / Secundaria.
- `nivel.html?nivel=primaria` — Grilla de grados de ese nivel.
- `grado.html?grado=quinto` — Fotos, descripción y botón "Inscribirme".
- `inscripcion.html?grado=quinto` — Formulario + documentos, guarda en Sheets/Drive.
- `js/data.js` — **Aquí editas** nombres, edades y descripciones de cada
  grado, y aquí agregas las fotos reales cuando las tengas.
- `js/sheets-config.js` — Aquí va el enlace de tu Google Apps Script.

## 2. Qué pide el formulario ahora

- Datos del estudiante y del acudiente (igual que antes).
- Foto del registro civil o tarjeta de identidad, **frente y reverso**.
- Foto de la constancia de comportamiento — **solo aparece de Primero a
  Once** (Transición no la pide, según los requisitos que diste).
- Foto del comprobante de pago de la inscripción ($15.000, convenio
  Supergiros 25755).
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
    urlComprobante
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ resultado: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
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

