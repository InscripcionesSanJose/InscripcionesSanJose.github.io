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
    color: "amarillo"
  },
  {
    id: "primaria",
    nombre: "Primaria",
    lema: "Construyendo las bases",
    descripcion: "De Primero a Quinto, donde se afianzan la lectura, la escritura y el pensamiento lógico.",
    color: "azul"
  },
  {
    id: "secundaria",
    nombre: "Secundaria",
    lema: "Rumbo a la universidad",
    descripcion: "De Sexto a Once, formación integral y preparación para la vida después del colegio.",
    color: "azulOscuro"
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
    fotos: [null, null]
  },
  {
    id: "primero",
    nombre: "Primero",
    nivelId: "primaria",
    edad: "6 a 7 años",
    descripcionCorta: "Las primeras letras y los primeros números.",
    descripcion: "Primero de primaria es el salto a la lectura y la escritura autónoma. El salón está ambientado con material didáctico y rincones temáticos que acompañan el proceso de cada estudiante a su propio ritmo.",
    fotos: [null, null]
  },
  {
    id: "segundo",
    nombre: "Segundo",
    nivelId: "primaria",
    edad: "7 a 8 años",
    descripcionCorta: "Afianzando la lectura y la escritura.",
    descripcion: "En Segundo se consolidan las habilidades de lectura y escritura, y se introducen proyectos de trabajo en equipo. Un espacio luminoso, pensado para la concentración y el trabajo colaborativo.",
    fotos: [null, null]
  },
  {
    id: "tercero",
    nombre: "Tercero",
    nivelId: "primaria",
    edad: "8 a 9 años",
    descripcionCorta: "Pensamiento lógico y primeros proyectos.",
    descripcion: "Tercero incorpora proyectos más elaborados y el pensamiento lógico-matemático toma protagonismo. El salón cuenta con espacio para exposiciones y trabajo en grupos pequeños.",
    fotos: [null, null]
  },
  {
    id: "cuarto",
    nombre: "Cuarto",
    nivelId: "primaria",
    edad: "9 a 10 años",
    descripcionCorta: "Autonomía y pensamiento crítico en desarrollo.",
    descripcion: "En Cuarto los estudiantes ganan autonomía: investigan, argumentan y sustentan sus ideas. El aula está equipada para apoyar proyectos de ciencias y trabajo en equipo.",
    fotos: [null, null]
  },
  {
    id: "quinto",
    nombre: "Quinto",
    nivelId: "primaria",
    edad: "10 a 11 años",
    descripcionCorta: "El cierre de la primaria, listos para un nuevo reto.",
    descripcion: "Quinto cierra el ciclo de primaria consolidando hábitos de estudio y liderazgo, preparando a los estudiantes para el paso a secundaria con confianza y herramientas propias.",
    fotos: [null, null]
  },
  {
    id: "sexto",
    nombre: "Sexto",
    nivelId: "secundaria",
    edad: "11 a 12 años",
    descripcionCorta: "La bienvenida a la secundaria.",
    descripcion: "Sexto marca el ingreso a la secundaria: nuevas asignaturas, nuevos docentes y mayor independencia. El salón está adaptado para el trabajo por áreas y proyectos interdisciplinarios.",
    fotos: [null, null]
  },
  {
    id: "septimo",
    nombre: "Séptimo",
    nivelId: "secundaria",
    edad: "12 a 13 años",
    descripcionCorta: "Profundizando en cada asignatura.",
    descripcion: "En Séptimo se profundiza el contenido de cada área y se fortalecen las habilidades de investigación y análisis, con espacios para el trabajo práctico y en grupo.",
    fotos: [null, null]
  },
  {
    id: "octavo",
    nombre: "Octavo",
    nivelId: "secundaria",
    edad: "13 a 14 años",
    descripcionCorta: "Pensamiento crítico y proyectos propios.",
    descripcion: "Octavo impulsa el pensamiento crítico y la argumentación, con proyectos que integran varias asignaturas y un acompañamiento cercano en la etapa de adolescencia.",
    fotos: [null, null]
  },
  {
    id: "noveno",
    nombre: "Noveno",
    nivelId: "secundaria",
    edad: "14 a 15 años",
    descripcionCorta: "Orientación vocacional y mayor exigencia académica.",
    descripcion: "En Noveno inicia el proceso de orientación vocacional, junto con una exigencia académica mayor que prepara el camino hacia la media técnica.",
    fotos: [null, null]
  },
  {
    id: "decimo",
    nombre: "Décimo",
    nivelId: "secundaria",
    edad: "15 a 16 años",
    descripcionCorta: "Media técnica y proyecto de vida.",
    descripcion: "Décimo profundiza en el proyecto de vida de cada estudiante, con énfasis en la media técnica y en las competencias necesarias para la educación superior.",
    fotos: [null, null]
  },
  {
    id: "once",
    nombre: "Once",
    nivelId: "secundaria",
    edad: "16 a 17 años",
    descripcionCorta: "El último año, rumbo a la universidad.",
    descripcion: "Once es el cierre del colegio: preparación para las pruebas Saber 11, acompañamiento en la elección de carrera y los últimos proyectos antes de dar el salto a la universidad.",
    fotos: [null, null]
  }
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
