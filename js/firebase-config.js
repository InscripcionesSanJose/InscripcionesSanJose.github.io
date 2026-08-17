// ============================================================
// firebase-config.js
// Configuración real de tu proyecto de Firebase
// (scripcionessanjose). Estas claves NO son secretas — están
// pensadas para ir en el código del sitio; lo que protege tus
// datos son las reglas de seguridad de Firestore (ver LEEME.md),
// no esconder esta configuración.
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD8ohSbPCpfJl7A5WF68p1rb6OpkSuNgbk",
  authDomain: "scripcionessanjose.firebaseapp.com",
  projectId: "scripcionessanjose",
  storageBucket: "scripcionessanjose.firebasestorage.app",
  messagingSenderId: "862610166801",
  appId: "1:862610166801:web:17734f28c73b9a334c0db0"
};

firebase.initializeApp(FIREBASE_CONFIG);
