// ============================================================
// firebase-config.js
// Reemplaza estos valores por los que copiaste en el paso
// "Registra una app web" de la consola de Firebase.
// Estas claves NO son secretas — están pensadas para ir en el
// código del sitio; lo que protege tus datos son las reglas de
// seguridad de Firestore y Storage (ver LEEME.md), no esconder
// esta configuración.
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI_TU_PROYECTO.firebaseapp.com",
  projectId: "PEGA_AQUI_TU_PROJECT_ID",
  storageBucket: "PEGA_AQUI_TU_PROYECTO.appspot.com",
  messagingSenderId: "PEGA_AQUI_TU_SENDER_ID",
  appId: "PEGA_AQUI_TU_APP_ID"
};

firebase.initializeApp(FIREBASE_CONFIG);
