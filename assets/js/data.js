/*
  ============================================================
  CONTENIDO DE LA WEB
  ============================================================
  Todo el texto, la trayectoria, las fotos y los vídeos salen de
  este archivo. Edita aquí y no tendrás que tocar el HTML.

  - Fotos: deja tus imágenes en assets/img/foto/ y rellena "src".
    Mientras "src" esté vacío se muestra un hueco de color.
  - Vídeos: rellena "youtube" (solo el ID, p. ej. "dQw4w9WgXcQ"),
    o "url" para enlazar a Vimeo, Instagram, etc.
  ============================================================
*/
window.PORTFOLIO = {
  persona: {
    nombre: "José Álvarez",
    ubicacion: "Campo de Gibraltar, Cádiz",
    // Pon aquí el correo que quieras mostrar en la web.
    email: "tu-correo@ejemplo.com",
    linkedin: "https://www.linkedin.com/in/jose-alvarez-41983a25/",
    github: "https://github.com/JoseA-Alvarez",
    instagram: "",
    idiomas: "Español nativo, inglés profesional"
  },

  codigo: {
    anios: 19,
    rol: "Arquitectura de software, backend, infraestructura e IA",
    lead: "19 años programando, 16 de ellos de forma profesional. Empecé construyendo pasarelas de pago en Gibraltar, pasé años especializado en frontend con Angular y hoy diseño sistemas completos: arquitectura, backend, infraestructura y aplicaciones con IA, trabajando a partir de especificaciones.",

    capacidades: [
      {
        nombre: "Arquitectura de software",
        texto: "Sistemas distribuidos y orientados a eventos, límites claros entre servicios y decisiones documentadas que se pueden revisar.",
        tags: ["event-driven", "microservicios", "adr"]
      },
      {
        nombre: "IA aplicada",
        texto: "Aplicaciones con modelos de lenguaje en producción: agentes, recuperación de contexto, herramientas vía MCP y evaluación de resultados.",
        tags: ["llm", "agentes", "rag", "mcp", "evals"]
      },
      {
        nombre: "Desarrollo guiado por especificaciones",
        texto: "La spec como fuente de verdad. Cambios propuestos y revisados antes de tocar código, con OpenSpec como herramienta.",
        tags: ["sdd", "openspec"]
      },
      {
        nombre: "Cloud e infraestructura como código",
        texto: "Infraestructura en Azure descrita en Terraform, despliegues reproducibles y cargas en Kubernetes.",
        tags: ["azure", "terraform", "kubernetes", "github"]
      },
      {
        nombre: "Backend y datos",
        texto: "Servicios en .NET y antes en Java/Spring, mensajería y procesamiento de datos.",
        tags: [".net", "ef-core", "azure-sql", "service-bus", "kafka", "spark", "java", "spring"]
      },
      {
        nombre: "Frontend",
        texto: "Desde AngularJS hasta Angular moderno: monorepos con Nx, programación reactiva, PWAs, rendimiento y testing.",
        tags: ["angular", "typescript", "rxjs", "nx", "jest", "cypress"]
      }
    ],

    // De más reciente a más antigua.
    trayectoria: [
      {
        periodo: "2018 – hoy",
        empresa: "A.P. Moller – Maersk",
        puesto: "Full-stack Web Developer",
        texto: "Aplicaciones logísticas a escala global. Entré como desarrollador frontend senior con Angular (Nx, Jest, Cypress) y .NET en backend; hoy trabajo sobre todo en arquitectura, servicios backend, infraestructura en Azure con Terraform e IA aplicada."
      },
      {
        periodo: "2016 – 2018",
        empresa: "UST Global",
        puesto: "Java Full Stack Developer",
        texto: "Desarrollo full stack con Java y frontend web."
      },
      {
        periodo: "2013 – 2016",
        empresa: "Easy Payment Gateway",
        puesto: "Web Developer",
        lugar: "Gibraltar",
        texto: "Integración de soluciones de pago. Java, Spring MVC, Spring Security y MyBatis en backend; AngularJS y jQuery en frontend; TDD."
      },
      {
        periodo: "2011 – 2013",
        empresa: "PayPoint.net",
        puesto: "Java Developer",
        lugar: "Gibraltar",
        texto: "Spring MVC, Flex y testing (JUnit, Mockito, Selenium) en equipos ágiles con Scrum."
      },
      {
        periodo: "2010 – 2011",
        empresa: "Myriad Payments",
        puesto: "Java Developer",
        lugar: "Gibraltar",
        texto: "Frontend y back office de una plataforma de pagos con requisitos PCI y OWASP."
      }
    ],

    formacion: [
      { titulo: "Ingeniería Informática", centro: "ETSI Informática, Universidad de Málaga" },
      { titulo: "Ingeniería Informática (estancia 2008–2009)", centro: "Masaryk University, Brno" },
      { titulo: "Diseño gráfico y desarrollo web (2009–2010)", centro: "Forman, Málaga" }
    ],

    // Es una secuencia real: el orden importa.
    metodo: [
      { paso: "Especificar", texto: "Qué debe hacer el sistema, escrito y versionado junto al código." },
      { paso: "Proponer", texto: "Cada cambio llega como propuesta, con su delta sobre la spec." },
      { paso: "Diseñar", texto: "Arquitectura y decisiones documentadas, con su porqué." },
      { paso: "Desglosar", texto: "Tareas pequeñas, ordenadas y verificables." },
      { paso: "Implementar", texto: "Personas y agentes de IA implementan cada tarea contra la spec." },
      { paso: "Verificar y archivar", texto: "Tests y evaluaciones contra la spec. El cambio se archiva y la spec queda al día." }
    ]
  },

  foto: {
    lead: "Bodas, premamá, bautizos, retrato y viajes. Trabajo con luz natural siempre que puedo y con flash cuando la escena lo pide.",
    equipo: "Canon EOS R6 Mark II y flash Godox AD200 Pro.",
    categorias: [
      { id: "bodas", nombre: "Bodas", texto: "De los preparativos a la fiesta, contado como un reportaje." },
      { id: "premama", nombre: "Premamá", texto: "Sesiones tranquilas, en exterior o en casa." },
      { id: "bautizos", nombre: "Bautizos", texto: "La ceremonia y la familia, sin interrumpir." },
      { id: "retrato", nombre: "Retrato y moda", texto: "Sesiones con modelos, books y retrato editorial." },
      { id: "viajes", nombre: "Viajes", texto: "Paisaje, calle y gente de los sitios que visito." }
    ],
    /*
      Cada foto:
        src:    ruta de la imagen, p. ej. "assets/img/foto/bodas-01.jpg" (vacío = hueco)
        cat:    id de la categoría
        titulo: texto corto
        ratio:  proporción ancho/alto: "3/2", "2/3", "4/5", "1/1"...
        exif:   opcional, se muestra al pasar el ratón
    */
    fotos: [
      { src: "", cat: "bodas",    titulo: "Ceremonia",              ratio: "3/2", exif: "35 mm  f/2  1/320  ISO 200" },
      { src: "", cat: "premama",  titulo: "Atardecer en la playa",  ratio: "2/3", exif: "85 mm  f/1.8  1/500  ISO 100" },
      { src: "", cat: "retrato",  titulo: "Retrato de estudio",     ratio: "4/5", exif: "85 mm  f/5.6  1/200  ISO 100" },
      { src: "", cat: "viajes",   titulo: "Calle al amanecer",      ratio: "3/2", exif: "24 mm  f/8  1/250  ISO 100" },
      { src: "", cat: "bodas",    titulo: "Preparativos",           ratio: "2/3", exif: "50 mm  f/1.8  1/160  ISO 800" },
      { src: "", cat: "bautizos", titulo: "La familia",             ratio: "3/2", exif: "35 mm  f/2.8  1/200  ISO 1600" },
      { src: "", cat: "retrato",  titulo: "Editorial en exterior",  ratio: "2/3", exif: "70 mm  f/2.8  1/1000  ISO 100" },
      { src: "", cat: "viajes",   titulo: "Paisaje",                ratio: "16/9", exif: "16 mm  f/11  1/60  ISO 100" },
      { src: "", cat: "bodas",    titulo: "Primer baile",           ratio: "4/5", exif: "35 mm  f/1.8  1/125  ISO 3200" },
      { src: "", cat: "premama",  titulo: "Retrato en casa",        ratio: "4/5", exif: "50 mm  f/2  1/200  ISO 400" },
      { src: "", cat: "bautizos", titulo: "Detalles",               ratio: "1/1", exif: "100 mm  f/2.8  1/250  ISO 800" },
      { src: "", cat: "viajes",   titulo: "Mercado",                ratio: "2/3", exif: "35 mm  f/4  1/500  ISO 200" },
      { src: "", cat: "retrato",  titulo: "Book de modelo",         ratio: "3/2", exif: "85 mm  f/2  1/400  ISO 100" },
      { src: "", cat: "bodas",    titulo: "Salida de la iglesia",   ratio: "3/2", exif: "24 mm  f/4  1/800  ISO 200" }
    ]
  },

  video: {
    lead: "Planos aéreos con dron, piezas publicitarias y contenido para redes sociales. Me encargo de la grabación, el montaje y el color en DaVinci Resolve.",
    equipo: "Canon EOS R6 Mark II, DJI Osmo Action 4 y GoPro. Montaje y color en DaVinci Resolve.",
    duracion: 120, // segundos de la línea de tiempo de ejemplo
    // Pistas de arriba abajo. La de arriba tapa a las de abajo, como en un editor real.
    pistas: [
      { id: "redes", corto: "V3", nombre: "Redes sociales", color: "#D77A8F" },
      { id: "publicidad", corto: "V2", nombre: "Publicidad", color: "#F0B44C" },
      { id: "dron", corto: "V1", nombre: "Dron", color: "#4BA3C3" }
    ],
    servicios: [
      { nombre: "Dron", texto: "Planos aéreos para eventos, inmobiliaria, turismo y paisaje." },
      { nombre: "Publicidad y marketing", texto: "Spots de producto y vídeos de marca, de la idea a la entrega." },
      { nombre: "Redes sociales", texto: "Reels, stories y shorts en vertical, pensados para cada plataforma." }
    ],
    /*
      Cada clip:
        pista:   id de la pista
        inicio:  segundo en el que empieza en la línea de tiempo
        dur:     duración en segundos
        formato: "16:9", "2.39:1", "9:16", "4:5" o "1:1"
        poster:  imagen opcional (assets/img/video/...)
        youtube: ID de YouTube opcional (se reproduce dentro de la web)
        url:     enlace opcional (Vimeo, Instagram, TikTok...)
    */
    clips: [
      { pista: "dron", inicio: 0, dur: 26, titulo: "Paisaje aéreo", formato: "2.39:1", texto: "Costa y paisaje desde el aire, en formato panorámico.", poster: "", youtube: "", url: "" },
      { pista: "publicidad", inicio: 18, dur: 24, titulo: "Spot de producto", formato: "16:9", texto: "Pieza corta para presentar un producto.", poster: "", youtube: "", url: "" },
      { pista: "redes", inicio: 40, dur: 14, titulo: "Reel vertical", formato: "9:16", texto: "Formato vertical para Instagram y TikTok.", poster: "", youtube: "", url: "" },
      { pista: "dron", inicio: 52, dur: 30, titulo: "Inmobiliaria y turismo", formato: "16:9", texto: "Recorrido aéreo de una propiedad o un destino.", poster: "", youtube: "", url: "" },
      { pista: "publicidad", inicio: 60, dur: 22, titulo: "Vídeo de marca", formato: "2.39:1", texto: "La historia de una marca contada en un par de minutos.", poster: "", youtube: "", url: "" },
      { pista: "redes", inicio: 82, dur: 16, titulo: "Contenido para redes", formato: "9:16", texto: "Stories y shorts pensados para cada plataforma.", poster: "", youtube: "", url: "" },
      { pista: "dron", inicio: 96, dur: 24, titulo: "Eventos desde el aire", formato: "16:9", texto: "Bodas y eventos con planos aéreos.", poster: "", youtube: "", url: "" }
    ]
  },

  contacto: {
    intenciones: [
      { id: "software", nombre: "Un proyecto de software", asunto: "Proyecto de software" },
      { id: "foto", nombre: "Una sesión de fotos", asunto: "Sesión de fotos" },
      { id: "video", nombre: "Un vídeo", asunto: "Proyecto de vídeo" }
    ]
  }
};
