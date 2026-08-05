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
