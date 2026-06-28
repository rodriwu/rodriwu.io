import type { CaseTextOverride } from "../caseStudies.i18n";

export const RAPID_GARDEN_ES: CaseTextOverride = {
  title: "RapidGarden POS: crecimiento a través de UX",
  shortTitle: "Rapid Garden",
  tagline: "Crece con intención.",
  role: "Diseño UX/UI, diseño de producto",
  deliverables: "Sistema de diseño, plantillas responsivas, rediseño de blog, estrategia de PR",
  tags: ["Estrategia UX", "Diseño web", "Sistema de diseño", "Responsivo"],
  kinds: ["UX/UI", "WEB"],
  metrics: [
    { label: "Volumen de MQL", value: "+157%" },
    { label: "Conversión en formularios orgánicos", value: "+62%" },
    { label: "Tasa de engagement interanual", value: "+90%" },
    { label: "Costo por lead", value: "-55%" },
  ],
  overview:
    "RapidGarden POS, parte de la familia RapidPOS que atiende verticales de retail especializado como viveros y armerías, tenía un crecimiento estancado, una calidad de leads inconsistente y una experiencia digital que parecía un tema de WordPress de 2008. Usando los datos de marketing como investigación de usuario, ejecutamos una optimización integral de UX: un nuevo sistema de diseño alineado al ecosistema RapidPOS, plantillas responsivas especificadas en cada breakpoint y un blog rediseñado con una estrategia de PR renovada.",
  challenge:
    "Buen producto, destino roto. Los formularios spam contaminaban el pipeline de ventas, las landing pages genéricas hacían rebotar el tráfico y la identidad visual estaba totalmente desconectada de la marca matriz RapidPOS.",
  conclusion: {
    quote: "RapidGarden no necesitaba más tráfico. Necesitaba un destino que valiera la pena visitar.",
    body: "Cierra las brechas de confianza y las métricas siguen el camino. El trabajo se trató menos de llevar gente al sitio y más de ganarse la visita una vez que llegaban.",
    signoff: "¡Gracias por leer!",
  },
  sections: {
    snapshot: {
      label: "Resumen",
      heading: "El trabajo de un vistazo.",
      blocks: {
        0: {
          type: "p",
          text: "RapidGarden POS es parte de la familia RapidPOS, la plataforma de punto de venta para retail especializado como viveros y armerías. Buen producto. Clientes leales. Pero el sitio parecía atorado en 2008, los formularios estaban llenos de spam y el tráfico rebotaba antes de tener oportunidad de convertir.",
        },
        1: {
          type: "p",
          text: "Garden era su vertical de mayor apalancamiento: más de 200 viveros leales ya en la base de clientes, 12,000 en el mercado direccionable y un CEO que ya había puesto una raya en la arena. Mi trabajo era liderar la optimización de UX que convirtiera esa apuesta en pipeline.",
        },
        2: {
          type: "metricCards",
          items: [
            { value: "+157%", label: "Volumen de MQL", sub: "El mejor mes en récord después del relanzamiento." },
            { value: "+62%", label: "Conversión en formularios orgánicos", sub: "Validando las nuevas plantillas y la relevancia de cada página." },
            { value: "+90%", label: "Engagement interanual", sub: "En todo el sitio." },
            { value: "-55%", label: "Costo por lead", sub: "Desde el pico, gracias a datos más limpios." },
          ],
        },
      },
    },
    goals: {
      label: "Objetivos y retos",
      heading: "Buen producto, destino roto.",
      blocks: {
        0: {
          type: "p",
          text: "RapidGarden tenía un problema de negocio real escondido detrás de uno digital. El equipo de ventas se estaba ahogando en leads spam. El gasto de marketing no convertía. Y la marca no se sentía para nada como la de su empresa matriz. Antes de poder hacer crecer el embudo, teníamos que arreglar el destino al que la gente estaba llegando.",
        },
        1: {
          type: "quote",
          text: "Si la rompemos en Specialty Grocery y Garden, ese es todo el crecimiento que necesitamos.",
        },
        2: {
          type: "image",
          src: "/case-studies/rapid-garden/goals/old-home.png",
          alt: "Home page legacy de RapidGarden con diseño anticuado estilo 2008 y layout inconsistente",
          caption: "El sitio que heredamos: cargas pesadas, UI inconsistente y una marca desconectada de RapidPOS.",
        },
        3: { type: "h3", text: "Puntos de dolor" },
        4: {
          type: "list",
          marker: "x",
          items: [
            "Formularios propensos a spam que contaminaban el pipeline y frustraban a ventas con leads no calificados",
            "Recorridos genéricos: el tráfico pagado y el orgánico aterrizaban en páginas no optimizadas",
            "UI anticuada que parecía un tema de WordPress de 2008, con grandes inconsistencias visuales",
            "Cargas pesadas que creaban fricción antes de que los usuarios pudieran consumir el contenido",
            "Desconexión de marca con RapidPOS, sin aprovechar la autoridad de la empresa matriz",
          ],
        },
        5: { type: "h3", text: "Tres objetivos" },
        6: {
          type: "objectives",
          items: [
            { emoji: "🌱", label: "Optimizar el destino", sub: "Dejar de perseguir más tráfico. Convertir el que ya teníamos." },
            { emoji: "📐", label: "Diseñar con profundidad", sub: "Plantillas diseñadas con el equipo, especificadas de inicio a fin en cada breakpoint." },
            { emoji: "🔗", label: "Alinear el ecosistema", sub: "Hacer que RapidGarden se sintiera como una extensión natural de RapidPOS, no como una marca aparte." },
          ],
        },
      },
    },
    research: {
      label: "Investigación y descubrimiento",
      heading: "Dónde se rompía la confianza.",
      blocks: {
        0: {
          type: "p",
          text: "Antes de rediseñar nada, quería entender por qué el sitio no convertía. No teníamos presupuesto para entrevistas formales de usuarios, pero los datos de marketing ya estaban frente a nosotros. Y la respuesta también.",
        },
        1: {
          type: "p",
          text: "Tres señales se repetían. Todas apuntando al mismo problema: el sitio viejo rompía la confianza antes de que los usuarios pudieran siquiera empezar a evaluar el producto.",
        },
        2: { type: "h3", text: "Señal 1: la primera impresión no aguantaba" },
        3: {
          type: "p",
          text: "El sitio parecía atorado en 2008. Cargas pesadas, visuales inconsistentes, una marca que no se sentía para nada como la de su empresa matriz. Para un comprador que llegaba en frío, eso es una brecha de credibilidad antes de leer una sola palabra.",
        },
        4: {
          type: "p",
          text: "El lado de marketing contaba la misma historia. Solo el 6% del tráfico orgánico era no-branded. El sitio no estaba ganando nuevos visitantes que no conocieran ya la empresa. No había motor de descubrimiento, porque no había nada en la página que valiera la pena descubrir.",
        },
        5: {
          type: "statPills",
          items: [
            { value: "6%", label: "tráfico orgánico no-branded" },
            { value: "200+", label: "clientes viveros existentes" },
            { value: "12,000", label: "TAM en la vertical" },
          ],
        },
        6: {
          type: "image",
          src: "/case-studies/rapid-garden/research/old-blog.png",
          alt: "Blog legacy de RapidGarden con layout anticuado y contenido desconectado de la intención del comprador",
          caption: "El blog viejo hablaba de features del producto en un layout anticuado. Los datos de búsqueda decían que los compradores buscaban ayuda con dolor operativo.",
        },
        7: { type: "h3", text: "Señal 2: los formularios rompían el contrato" },
        8: {
          type: "p",
          text: "Un porcentaje considerable de los envíos eran spam. Del lado del usuario, un formulario con fugas y mucha fricción manda un mensaje claro: esta empresa no tiene su casa en orden. Del lado de marketing, ese mismo spam estaba envenenando las señales de conversión de Google, entrenando a las campañas a perseguir al público equivocado y alimentando a ventas con leads en los que no podían confiar.",
        },
        9: {
          type: "p",
          text: "Mismo problema, leído de dos formas. El arreglo no estaba en el formulario en sí, estaba en la confianza que la página debía ganarse antes de que los usuarios llegaran ahí.",
        },
        10: { type: "h3", text: "Señal 3: las páginas no hablaban el idioma del comprador" },
        11: {
          type: "p",
          text: "Las búsquedas nos decían que los usuarios no estaban buscando \"software POS\". Estaban buscando dolor operativo: exceso de inventario, mercancía muerta, velocidad de checkout, impresión de etiquetas para plantas. Problemas reales, con sus propias palabras.",
        },
        12: {
          type: "p",
          text: "El sitio hablaba de features del producto. Eso es una brecha de confianza antes de ser una de conversión. Si no me demuestras que entiendes mi problema, no voy a confiar en que lo puedes resolver.",
        },
      },
    },
    strategy: {
      label: "Estrategia",
      heading: "Deja de perseguir tráfico. Construye un destino al que valga la pena llegar.",
      blocks: {
        0: {
          type: "p",
          text: "Una vez que las brechas de confianza fueron obvias, la estrategia también lo fue. Pasamos el trabajo de \"generar más tráfico\" a \"ganarse la visita\". Cada punto de contacto tenía que hacer su trabajo antes de pedirle al usuario que convirtiera.",
        },
        1: { type: "h3", text: "Cuatro movimientos, en orden" },
        2: {
          type: "list",
          marker: "check",
          items: [
            "Un nuevo sistema de diseño alineado al ecosistema RapidPOS, para que RapidGarden pudiera tomar prestada la autoridad de la marca matriz",
            "Plantillas responsivas diseñadas con el equipo bajo la nueva identidad, cada una pensada para una vertical específica",
            "Profundidad a nivel breakpoint en cada plantilla: desktop, tablet, móvil, todo especificado de inicio a fin",
            "Rediseño del blog con una nueva plantilla de post y una estrategia de PR renovada, para que el contenido realmente capitalizara",
          ],
        },
      },
    },
    ux: {
      label: "Diseño UX/UI",
      heading: "Diseñando cada superficie con el equipo.",
      blocks: {
        0: { type: "h3", text: "Alineación del ecosistema" },
        1: {
          type: "p",
          text: "La confianza empieza con la primera impresión, así que arreglamos primero la desconexión de marca. El equipo y yo desarmamos el sitio matriz de RapidPOS y construimos una identidad coherente para RapidGarden que se sintiera como una extensión natural del ecosistema. Mismo lenguaje visual. Misma autoridad. Mismas señales de confianza.",
        },
        2: {
          type: "p",
          text: "Después la usamos para renovar el sitio de punta a punta. Fuera el tema estilo 2008. Entró imaginería WebP por debajo de 100KB y una UI modernizada que cargaba rápido y dejaba que el contenido aterrizara.",
        },
        3: {
          type: "carousel",
          aspect: "3992/2339",
          items: [
            {
              src: "/case-studies/rapid-garden/ux/rapid-garden-home.png",
              alt: "Nueva home page de RapidGarden con el sistema de diseño alineado",
              label: "RapidGarden",
              caption: "RapidGarden como una extensión natural del ecosistema.",
            },
            {
              src: "/case-studies/rapid-garden/ux/rapid-pos.png",
              alt: "Referencia del sitio matriz RapidPOS",
              label: "Marca matriz",
              caption: "RapidPOS, la marca matriz de la que tomamos prestada autoridad.",
            },
          ],
        },
        4: { type: "h3", text: "Plantillas con profundidad a nivel breakpoint" },
        5: {
          type: "p",
          text: "Las páginas genéricas hacían rebotar el tráfico, así que desarrollamos un nuevo set de plantillas bajo la nueva identidad. La aportación del equipo dio forma a la estructura y al contenido de cada página, con cada plantilla diseñada en torno a una vertical específica en lugar del abstracto \"comprador POS\".",
        },
        6: {
          type: "p",
          text: "Cada plantilla se entregó con profundidad a nivel breakpoint. Desktop, tablet, móvil, todo especificado de inicio a fin, sin layouts de respaldo ni piensos comprimidos. Ingeniería podía construir sin adivinar nada.",
        },
        7: {
          type: "p",
          text: "El principio detrás de cada página: escribe para quien toma la decisión, no para el producto. Encuéntralo en su dolor operativo y luego gánate el siguiente clic.",
        },
        8: {
          type: "image",
          src: "/case-studies/rapid-garden/ux/breakpoints.png",
          alt: "Plantillas verticales especificadas en breakpoints de desktop, tablet y móvil",
          caption: "Plantillas diseñadas con el equipo, especificadas para cada breakpoint.",
        },
        9: {
          type: "sectionBreak",
          src: "/case-studies/rapid-garden/ux/visual-break.png",
          alt: "Plantillas de RapidGarden POS mostradas en breakpoints de móvil, tablet y desktop",
        },
        10: { type: "h3", text: "Blog, plantilla de post y una estrategia de PR" },
        11: {
          type: "p",
          text: "Auditamos cada post existente y luego rediseñamos el blog desde cero. Una interfaz más limpia, una nueva plantilla de post que le dio aire al contenido editorial y una arquitectura de información que hizo el contenido encontrable en lugar de enterrado.",
        },
        12: {
          type: "p",
          text: "Para anclar el nuevo programa, publicamos un estudio original sobre programas de lealtad en viveros. El hallazgo principal: el 30% de los viveros con programas de lealtad generan el 56% de los ingresos de las tiendas participantes. Una sola estadística le dio a RapidGarden una voz creíble y respaldada por datos en las conversaciones de la industria.",
        },
        13: {
          type: "p",
          text: "Junto con una estrategia de PR renovada, el estudio aterrizó frente a la prensa de industria para la que estaba pensado. El contenido no solo se quedó en el blog. Capitalizó.",
        },
        14: {
          type: "image",
          src: "/case-studies/rapid-garden/ux/blog-post-template.png",
          alt: "Plantilla de post rediseñada con un layout editorial más limpio",
          caption: "Una nueva plantilla de post que le dio aire al contenido editorial, junto con una estrategia de PR que puso el trabajo frente a la industria.",
        },
        15: {
          type: "image",
          src: "/case-studies/rapid-garden/ux/blog-design.png",
          alt: "Índice del blog de RapidGarden rediseñado con mapa de contenido estructurado y layout editorial más limpio",
          caption: "El índice del blog rediseñado. Mapa de contenido estructurado, jerarquía más clara y metadata que ayudó al usuario a encontrar lo que vino a buscar.",
        },
      },
    },
    results: {
      label: "Resultados",
      heading: "De nota al pie digital a motor de crecimiento.",
      blocks: {
        0: {
          type: "p",
          text: "Al cambiar de volumen a precisión, los números aterrizaron donde tenían que aterrizar. El relanzamiento produjo el mejor mes de MQLs en la historia de RapidGarden, y los datos de calificación por fin coincidían con lo que ventas realmente necesitaba.",
        },
        1: {
          type: "sectionBreak",
          src: "/case-studies/rapid-garden/results/ornament.png",
          alt: "Visual del relanzamiento de RapidGarden POS",
        },
        2: {
          type: "statPills",
          items: [
            { value: "+62%", label: "conversión en formularios orgánicos" },
            { value: "+36%", label: "tasa de envío en tráfico pagado" },
            { value: "+90%", label: "tasa de engagement interanual" },
            { value: "+60%", label: "sesiones orgánicas con engagement" },
            { value: "-55%", label: "costo por lead desde el pico" },
            { value: "+157%", label: "volumen mensual de MQL" },
          ],
        },
        3: {
          type: "quote",
          text: "El crecimiento sostenible no se trata de generar más tráfico. Se trata de diseñar un destino en el que la gente realmente confíe.",
        },
        4: { type: "h3", text: "Aprendizajes clave" },
        5: {
          type: "list",
          marker: "check",
          items: [
            "La confianza es el lente. Cada arreglo (visual, marca, plantilla, contenido) tenía que cerrar una brecha de confianza antes de mover una métrica.",
            "Los datos de marketing también son investigación de usuario. La misma señal que rompía la conversión rompía la experiencia.",
            "Diseña con el equipo, no para el equipo. Las plantillas verticales aterrizan mejor cuando las arma la gente que es dueña de esas verticales.",
            "La profundidad en cada breakpoint no es opcional. El móvil no es un respaldo. Es donde de verdad sucede la mayor parte del recorrido del comprador.",
            "La alineación del ecosistema de marca capitaliza. La confianza que se gana la matriz se transfiere a la vertical, gratis.",
          ],
        },
      },
    },
  },
};
