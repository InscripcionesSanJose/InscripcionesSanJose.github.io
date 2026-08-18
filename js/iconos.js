// Íconos SVG pequeños y reutilizables, como funciones que devuelven texto (string).

const ICONOS = {
  flecha: (color = "currentColor") => `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  foto: (color = "currentColor") => `
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2.2" stroke="${color}" stroke-width="1.5"/>
      <circle cx="8.5" cy="10.5" r="1.6" stroke="${color}" stroke-width="1.5"/>
      <path d="M4 16.5L8.5 12.5L11.5 15L15.5 10.5L20.5 16" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  check: (color = "currentColor") => `
    <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="1.6"/>
      <path d="M7.5 12.3L10.3 15L16.5 9" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
};

// Decoraciones grandes y tenues para los cuadritos de grado, distintas
// según el nivel académico (útiles escolares para los chicos, algo más
// "adulto" para los mayores). Se usan de fondo, en baja opacidad.
const DECORACION_NIVEL = {
  preescolar: `
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <g transform="rotate(-15 60 60)"><rect x="35" y="20" width="14" height="70" rx="6"/><path d="M35 20 L42 6 L49 20 Z" fill="currentColor" stroke="none"/></g>
      <g transform="rotate(6 60 60)"><rect x="55" y="12" width="14" height="82" rx="6"/><path d="M55 12 L62 -2 L69 12 Z" fill="currentColor" stroke="none"/></g>
      <g transform="rotate(22 60 60)"><rect x="76" y="26" width="14" height="64" rx="6"/><path d="M76 26 L83 12 L90 26 Z" fill="currentColor" stroke="none"/></g>
    </svg>`,
  primaria: `
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 92 L72 38 L88 54 L34 108 Z"/>
      <path d="M72 38 L88 22 L100 34 L88 54"/>
      <path d="M18 92 L12 108 L28 102 Z" fill="currentColor" stroke="none"/>
    </svg>`,
  bachillerato: `
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 46 L60 24 L112 46 L60 68 Z"/>
      <path d="M34 57 V82 Q60 98 86 82 V57"/>
      <path d="M112 46 V78"/>
      <circle cx="112" cy="86" r="3.5" fill="currentColor" stroke="none"/>
    </svg>`,
  "bachillerato-tecnico": `
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="60" cy="60" r="24"/>
      <circle cx="60" cy="60" r="8"/>
      <path d="M60 16v16M60 88v16M16 60h16M88 60h16M27 27l11 11M82 82l11 11M93 27l-11 11M38 82l-11 11"/>
    </svg>`,
  "bachillerato-adultos": `
    <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <rect x="18" y="46" width="84" height="56" rx="8"/>
      <path d="M44 46v-11a10 10 0 0 1 10-10h12a10 10 0 0 1 10 10v11"/>
      <path d="M18 72h84"/>
      <path d="M52 72h16v10H52z" fill="currentColor" stroke="none"/>
    </svg>`
};
