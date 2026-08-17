// ============================================================
// data.js — Toda la información de niveles y grados vive aquí.
// Para editar textos, edades o agregar fotos reales, solo
// modifica este archivo. No hace falta tocar el HTML ni el CSS.
// ============================================================

const NIVELES = [
  {
    id: "preescolar",
    nombre: "Preescolar",
    lema: "Los primeros pasos",
    descripcion: "El punto de partida: juego, exploración y las primeras letras.",
    color: "amarillo",
    imagen: "assets/nivel-preescolar.png",
    banner: "assets/banner-preescolar.png"
  },
  {
    id: "primaria",
    nombre: "Primaria",
    lema: "Construyendo las bases",
    descripcion: "De Primero a Quinto, donde se afianzan la lectura, la escritura y el pensamiento lógico.",
    color: "azul",
    imagen: "assets/nivel-primaria.png",
    banner: "assets/banner-primaria.png"
  },
  {
    id: "bachillerato",
    nombre: "Bachillerato",
    lema: "Formación con propósito",
    descripcion: "De Sexto a Noveno, formación integral y preparación para la etapa vocacional.",
    color: "azulOscuro",
    // OJO: estas imágenes son las que tenías para "Secundaria de Sexto a Once" —
    // el texto de la imagen (banner-secundaria.png / nivel-secundaria.png) ya no
    // coincide del todo (dice "de Sexto a Once"). Sirven de placeholder mientras
    // encargas unas nuevas que digan "Bachillerato, de Sexto a Noveno".
    imagen: "assets/nivel-secundaria.png",
    banner: "assets/banner-secundaria.png"
  },
  {
    id: "bachillerato-tecnico",
    nombre: "Bachillerato Técnico",
    lema: "Media vocacional",
    descripcion: "De Décimo a Once, con énfasis técnico: Enfermería, Servicios Farmacéuticos, Sistemas, Trabajo Social, Educación a la Primera Infancia y Seguridad y Salud en el Trabajo.",
    color: "azul",
    // Sin imagen propia todavía — el sitio usa un bloque de color con el
    // nombre en texto mientras encargas las imágenes de este nivel nuevo.
    imagen: null,
    banner: null
  },
  {
    id: "bachillerato-adultos",
    nombre: "Bachillerato por Ciclos CLEI",
    lema: "Educación flexible para adultos",
    descripcion: "De Quinto a Once, un programa pensado para personas adultas que quieren terminar el bachillerato, con requisitos de inscripción propios.",
    color: "azulOscuro",
    // Sin imagen propia todavía.
    imagen: null,
    banner: null
  }
];

// "fotos" son marcadores de posición (placeholders) — no son fotos reales
// todavía. Cuando el colegio entregue fotos de los salones, se reemplazan
// aquí poniendo la ruta del archivo, por ejemplo: "assets/salones/primero-1.jpg"
const GRADOS = [
  {
    id: "transicion",
    nombre: "Transición",
    nivelId: "preescolar",
    edad: "5 a 6 años",
    descripcionCorta: "El primer salón, pensado para jugar y descubrir.",
    descripcion: "En Transición los niños dan su primer paso dentro del aula formal: aprenden compartiendo, jugando y explorando. El salón está diseñado a su altura, con rincones de lectura, arte y construcción, para que cada día sea una nueva aventura de descubrimiento.",
    fotos: [null]
  },
  {
    id: "primero",
    nombre: "Primero",
    nivelId: "primaria",
    edad: "6 a 7 años",
    descripcionCorta: "Las primeras letras y los primeros números.",
    descripcion: "Primero de primaria es el salto a la lectura y la escritura autónoma. El salón está ambientado con material didáctico y rincones temáticos que acompañan el proceso de cada estudiante a su propio ritmo.",
    fotos: [null]
  },
  {
    id: "segundo",
    nombre: "Segundo",
    nivelId: "primaria",
    edad: "7 a 8 años",
    descripcionCorta: "Afianzando la lectura y la escritura.",
    descripcion: "En Segundo se consolidan las habilidades de lectura y escritura, y se introducen proyectos de trabajo en equipo. Un espacio luminoso, pensado para la concentración y el trabajo colaborativo.",
    fotos: [null]
  },
  {
    id: "tercero",
    nombre: "Tercero",
    nivelId: "primaria",
    edad: "8 a 9 años",
    descripcionCorta: "Pensamiento lógico y primeros proyectos.",
    descripcion: "Tercero incorpora proyectos más elaborados y el pensamiento lógico-matemático toma protagonismo. El salón cuenta con espacio para exposiciones y trabajo en grupos pequeños.",
    fotos: [null]
  },
  {
    id: "cuarto",
    nombre: "Cuarto",
    nivelId: "primaria",
    edad: "9 a 10 años",
    descripcionCorta: "Autonomía y pensamiento crítico en desarrollo.",
    descripcion: "En Cuarto los estudiantes ganan autonomía: investigan, argumentan y sustentan sus ideas. El aula está equipada para apoyar proyectos de ciencias y trabajo en equipo.",
    fotos: [null]
  },
  {
    id: "quinto",
    nombre: "Quinto",
    nivelId: "primaria",
    edad: "10 a 11 años",
    descripcionCorta: "El cierre de la primaria, listos para un nuevo reto.",
    descripcion: "Quinto cierra el ciclo de primaria consolidando hábitos de estudio y liderazgo, preparando a los estudiantes para el paso a secundaria con confianza y herramientas propias.",
    fotos: [null]
  },
  {
    id: "sexto",
    nombre: "Sexto",
    nivelId: "bachillerato",
    edad: "11 a 12 años",
    descripcionCorta: "La bienvenida al bachillerato.",
    descripcion: "Sexto marca el ingreso al bachillerato: nuevas asignaturas, nuevos docentes y mayor independencia. El salón está adaptado para el trabajo por áreas y proyectos interdisciplinarios.",
    fotos: [null]
  },
  {
    id: "septimo",
    nombre: "Séptimo",
    nivelId: "bachillerato",
    edad: "12 a 13 años",
    descripcionCorta: "Profundizando en cada asignatura.",
    descripcion: "En Séptimo se profundiza el contenido de cada área y se fortalecen las habilidades de investigación y análisis, con espacios para el trabajo práctico y en grupo.",
    fotos: [null]
  },
  {
    id: "octavo",
    nombre: "Octavo",
    nivelId: "bachillerato",
    edad: "13 a 14 años",
    descripcionCorta: "Pensamiento crítico y proyectos propios.",
    descripcion: "Octavo impulsa el pensamiento crítico y la argumentación, con proyectos que integran varias asignaturas y un acompañamiento cercano en la etapa de adolescencia.",
    fotos: [null]
  },
  {
    id: "noveno",
    nombre: "Noveno",
    nivelId: "bachillerato",
    edad: "14 a 15 años",
    descripcionCorta: "Orientación vocacional y cierre del bachillerato.",
    descripcion: "En Noveno inicia el proceso de orientación vocacional, cerrando el bachillerato y preparando al estudiante para elegir su énfasis dentro del Bachillerato Técnico.",
    fotos: [null]
  },
  {
    id: "decimo",
    nombre: "Décimo",
    nivelId: "bachillerato-tecnico",
    edad: "15 a 16 años",
    descripcionCorta: "Media técnica y proyecto de vida.",
    descripcion: "Décimo profundiza en el proyecto de vida de cada estudiante, con énfasis técnico en áreas como Enfermería, Sistemas, Trabajo Social, Educación a la Primera Infancia, Servicios Farmacéuticos o Seguridad y Salud en el Trabajo.",
    fotos: [null]
  },
  {
    id: "once",
    nombre: "Once",
    nivelId: "bachillerato-tecnico",
    edad: "16 a 17 años",
    descripcionCorta: "El último año, rumbo a la universidad.",
    descripcion: "Once es el cierre del colegio: preparación para las pruebas Saber 11, culminación del énfasis técnico elegido, y acompañamiento en la elección de carrera antes de dar el salto a la educación superior.",
    fotos: [null]
  },
  {
    id: "quinto-adultos",
    nombre: "Quinto-A de adultos",
    nivelId: "bachillerato-adultos",
    edad: "Población adulta",
    descripcionCorta: "Bachillerato por Ciclos CLEI para adultos.",
    descripcion: "Quinto dentro del programa de Bachillerato por Ciclos CLEI, pensado para personas adultas que retoman sus estudios de primaria/bachillerato.",
    fotos: ["assets/clei-info.jpg"]
  },
  {
    id: "sexto-adultos",
    nombre: "Sexto-A de adultos",
    nivelId: "bachillerato-adultos",
    edad: "Población adulta",
    descripcionCorta: "Bachillerato por Ciclos CLEI para adultos.",
    descripcion: "Sexto dentro del programa de Bachillerato por Ciclos CLEI, pensado para personas adultas que retoman sus estudios de secundaria.",
    fotos: ["assets/clei-info.jpg"]
  },
  {
    id: "septimo-adultos",
    nombre: "Séptimo-A de adultos",
    nivelId: "bachillerato-adultos",
    edad: "Población adulta",
    descripcionCorta: "Bachillerato por Ciclos CLEI para adultos.",
    descripcion: "Séptimo dentro del programa de Bachillerato por Ciclos CLEI, pensado para personas adultas que retoman sus estudios de secundaria.",
    fotos: ["assets/clei-info.jpg"]
  },
  {
    id: "octavo-adultos",
    nombre: "Octavo-A de adultos",
    nivelId: "bachillerato-adultos",
    edad: "Población adulta",
    descripcionCorta: "Bachillerato por Ciclos CLEI para adultos.",
    descripcion: "Octavo dentro del programa de Bachillerato por Ciclos CLEI, pensado para personas adultas que retoman sus estudios de secundaria.",
    fotos: ["assets/clei-info.jpg"]
  },
  {
    id: "noveno-adultos",
    nombre: "Noveno-A de adultos",
    nivelId: "bachillerato-adultos",
    edad: "Población adulta",
    descripcionCorta: "Bachillerato por Ciclos CLEI para adultos.",
    descripcion: "Noveno dentro del programa de Bachillerato por Ciclos CLEI, pensado para personas adultas que retoman sus estudios de secundaria.",
    fotos: ["assets/clei-info.jpg"]
  },
  {
    id: "decimo-adultos",
    nombre: "Décimo-A de adultos",
    nivelId: "bachillerato-adultos",
    edad: "Población adulta",
    descripcionCorta: "Bachillerato por Ciclos CLEI para adultos.",
    descripcion: "Décimo dentro del programa de Bachillerato por Ciclos CLEI, pensado para personas adultas que retoman sus estudios de secundaria.",
    fotos: ["assets/clei-info.jpg"]
  },
  {
    id: "once-adultos",
    nombre: "Once-A de adultos",
    nivelId: "bachillerato-adultos",
    edad: "Población adulta",
    descripcionCorta: "El último ciclo del proceso para adultos.",
    descripcion: "Once dentro del programa de Bachillerato por Ciclos CLEI, el último paso antes de obtener el título de bachiller.",
    fotos: ["assets/clei-info.jpg"]
  }
];

// Los 6 énfasis del Bachillerato Técnico (Décimo y Once).
const ENFASIS_TECNICOS = [
  { nombre: "Enfermería", descripcion: "Formación técnica en cuidado básico de la salud." },
  { nombre: "Servicios Farmacéuticos", descripcion: "Manejo y dispensación de medicamentos." },
  { nombre: "Sistemas", descripcion: "Fundamentos de programación y soporte informático." },
  { nombre: "Trabajo Social", descripcion: "Acompañamiento y desarrollo comunitario." },
  { nombre: "Educación a la Primera Infancia", descripcion: "Pedagogía orientada a los primeros años de vida." },
  { nombre: "Seguridad y Salud en el Trabajo", descripcion: "Prevención de riesgos en entornos laborales." }
];

function obtenerNivel(id) {
  return NIVELES.find(n => n.id === id);
}

function obtenerGrado(id) {
  return GRADOS.find(g => g.id === id);
}

function gradosPorNivel(nivelId) {
  return GRADOS.filter(g => g.nivelId === nivelId);
}
