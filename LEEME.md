# Sitio de registro — Real Colegio San José

Sitio estático (HTML + CSS + JS, sin backend propio) para que las familias
elijan un grado (Transición a Once), lo conozcan y llenen el formulario de
inscripción. Cada inscripción se guarda automáticamente en una pestaña de
Google Sheets según el grado.

## 1. Estructura del sitio

- `index.html` — Inicio: Preescolar / Primaria / Secundaria.
- `nivel.html?nivel=primaria` — Grilla de grados de ese nivel.
- `grado.html?grado=quinto` — Fotos, descripción y botón "Inscribirme".
- `inscripcion.html?grado=quinto` — Formulario, guarda en Google Sheets.
- `js/data.js` — **Aquí editas** nombres, edades y descripciones de cada
  grado, y aquí agregas las fotos reales cuando las tengas (ver sección 4).
- `js/sheets-config.js` — Aquí pegas el enlace de tu Google Apps Script
  (paso 3).

## 2. Crear la Google Sheet

1. Crea una hoja de cálculo nueva en Google Sheets, por ejemplo
   "Inscripciones Real Colegio San José".
2. Crea una pestaña (hoja) por cada grado, con estos nombres exactos:
   `Transición`, `Primero`, `Segundo`, `Tercero`, `Cuarto`, `Quinto`,
   `Sexto`, `Séptimo`, `Octavo`, `Noveno`, `Décimo`, `Once`.
3. En la fila 1 de cada pestaña, pon estos encabezados (en este orden):

```
Fecha | Estudiante - Nombre | Estudiante - Tipo de documento | Estudiante - Documento | Acudiente - Nombre | Acudiente - Tipo de documento | Acudiente - Documento | Acudiente - Teléfono
```

El script del paso siguiente crea la pestaña automáticamente si algún
nombre no coincide exacto (por ejemplo, si escribes "Transicion" sin
tilde), así que revisa que los nombres queden idénticos a los de arriba.

## 3. Conectar el formulario con la Sheet (Google Apps Script)

1. Abre tu Google Sheet → menú **Extensiones → Apps Script**.
2. Borra el código de ejemplo y pega este:

```javascript
function doPost(e) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var grado = e.parameter.grado;
  var hoja = libro.getSheetByName(grado);

  if (!hoja) {
    hoja = libro.insertSheet(grado);
    hoja.appendRow(["Fecha", "Estudiante - Nombre", "Estudiante - Tipo de documento",
      "Estudiante - Documento", "Acudiente - Nombre", "Acudiente - Tipo de documento",
      "Acudiente - Documento", "Acudiente - Teléfono"]);
  }

  hoja.appendRow([
    new Date(),
    e.parameter.estudiante_nombre,
    e.parameter.estudiante_tipo_documento,
    e.parameter.estudiante_documento,
    e.parameter.acudiente_nombre,
    e.parameter.acudiente_tipo_documento,
    e.parameter.acudiente_documento,
    e.parameter.acudiente_telefono
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ resultado: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Clic en **Implementar → Nueva implementación**.
4. En "Tipo", elige **Aplicación web**.
5. En "Ejecutar como": **Yo (tu correo)**.
6. En "Quién tiene acceso": **Cualquier usuario**.
7. Clic en **Implementar**. Te pedirá autorizar permisos (es tu propio
   script accediendo a tu propia hoja — es normal y seguro).
8. Copia la **URL de la aplicación web** que te entrega (termina en
   `/exec`).
9. Abre `js/sheets-config.js` en el sitio y reemplaza
   `PEGA_AQUI_TU_URL_DE_APPS_SCRIPT` con esa URL, entre comillas.

Cada vez que cambies el código del script, tienes que crear una
**nueva implementación** (o "Gestionar implementaciones" → editar) para
que los cambios queden activos en esa misma URL.

## 4. Agregar las fotos reales de los salones

Por ahora el sitio muestra un recuadro con un ícono y el texto
"Foto del salón — próximamente" en vez de fotos reales.

Cuando tengas las fotos:

1. Súbelas a la carpeta `assets/` (puedes crear una subcarpeta
   `assets/salones/` para mantenerlo ordenado).
2. Abre `js/data.js`, busca el grado correspondiente y reemplaza
   `fotos: [null, null]` con las rutas de los archivos, por ejemplo:

```javascript
fotos: ["assets/salones/quinto-1.jpg", "assets/salones/quinto-2.jpg"]
```

Puedes poner 1, 2 o más fotos por grado; el diseño se ajusta solo.

## 5. Publicar en GitHub Pages

Sube todos los archivos y carpetas manteniendo la estructura (`css/`,
`js/`, `assets/`, y los `.html` en la raíz). En Settings → Pages, publica
desde `main` / raíz — igual que el otro sitio del colegio.

## 6. Cosas que faltan por definir (para una próxima vuelta)

- Campos adicionales al formulario (por ejemplo correo electrónico,
  dirección, EPS) cuando el colegio los defina.
- Notificación automática por correo cuando llega una inscripción nueva
  (se puede agregar con el mismo Apps Script, es un paso aparte).
- Fotos reales de cada salón (ver sección 4).
