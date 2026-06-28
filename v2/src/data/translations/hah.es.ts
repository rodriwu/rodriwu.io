import type { CaseTextOverride } from "../caseStudies.i18n";

export const HAH_ES: CaseTextOverride = {
  title: "HireAHelper: Rediseño de Conversión",
  shortTitle: "HireAHelper",
  company: "Porch Moving Group",
  year: "2024 a 2025",
  role: "Diseño UX, Dirección Creativa",
  deliverables: "Experiencia Optimizada, Desarrollo CMS, Sistema de Diseño",
  tagline: "Mudanzas simplificadas",
  overview:
    "Un rediseño de varios años de la experiencia de reservación de HireAHelper, convirtiendo un marketplace confuso en un flujo más rápido y amigable que ayuda a las personas a encontrar mudanceros sin volverse locas.",
  challenge:
    "El sitio se veía anticuado, los filtros confundían a la gente y el checkout se hacía eterno. La conversión se fugaba por todos lados. Había que hacerlo sentir moderno, rápido y confiable, sin romper lo que ya funcionaba.",
  tags: ["Diseño UX", "Dirección Creativa", "Sistema de Diseño", "Conversión"],
  kinds: ["UX/UI"],
  metrics: [
    { label: "Usuarios diarios", value: "14k" },
    { label: "Compras en sitio", value: "39%" },
    { label: "Ingreso por visitante", value: "17%" },
    { label: "Proveedores de servicio", value: "120k" },
  ],
  conclusion: {
    quote:
      "El trabajo que se muestra aquí es una instantánea de lo que construimos en Porch Moving Group: tres MVPs del flujo de reservación, el refresh de marca y el sistema de diseño que impulsó a HAH, desarrollado durante mis años ahí antes de cerrar mi etapa en agosto de 2025.",
    body:
      "Desde entonces, HAH ha seguido evolucionando bajo una nueva administración y ha tomado una dirección distinta. Lo que ves aquí refleja las decisiones de diseño, los compromisos y los sistemas de los que fui responsable durante esa etapa, desde el marketplace de la era verde hasta el funnel de la era azul, hasta llegar al MVP3 impulsado por cotizaciones. Estoy orgulloso de lo que el equipo entregó.",
    signoff: "Rodrigo Martínez · Porch Moving Group, 2022 a 2025",
  },
  sections: {
    snapshot: {
      label: "Resumen",
      heading: "Mudanzas simplificadas.",
      blocks: {
        0: {
          type: "p",
          text: "HireAHelper había superado a su propio sitio. La plataforma funcionaba, pero conforme creció el tráfico también creció la fricción: filtros confusos, un checkout largo, un estilo visual atorado en 2017. Mi trabajo fue reconstruir la experiencia de reservación en algo que la gente realmente quisiera usar.",
        },
        1: {
          type: "p",
          text: "A lo largo de tres MVPs, desenredamos el embudo, modernizamos el look y lanzamos un sistema de diseño que le permitió al equipo moverse más rápido sin romper la marca. Los números siguieron: mayor conversión, más ingreso por visitante y un recorrido más fluido de la búsqueda al checkout.",
        },
        2: {
          type: "metricCards",
          items: [
            { value: "14,000", label: "Usuarios diarios" },
            { value: "39%", label: "Compras en sitio" },
            { value: "17%", label: "Ingreso por visitante" },
            { value: "120k", label: "Proveedores de servicio" },
          ],
        },
      },
    },
    goals: {
      label: "Objetivos y retos",
      heading: "Diseñar una forma más fluida y rápida de reservar mudanceros en línea.",
      blocks: {
        0: {
          type: "p",
          text: "HireAHelper lleva conectando personas con mudanceros en todo Estados Unidos desde 2015, uno de los originales en reservación de mudanzas en línea. Después de siete años de crecimiento, el sitio que los trajo hasta aquí no era el sitio que los llevaría más lejos.",
        },
        1: {
          type: "image",
          src: "/case-studies/hah/goals/hah-2022.gif",
          alt: "Experiencia web de HireAHelper en 2022",
          caption: "La experiencia de HAH que heredamos en 2022.",
        },
        2: { type: "h3", text: "El reto" },
        3: {
          type: "p",
          text: "Los usuarios estaban frustrados. Los filtros los confundían, el checkout se alargaba y la marca se veía algunos años atrasada. La propuesta de valor tampoco aterrizaba. Necesitábamos hacer que todo se sintiera moderno, rápido y confiable, sin perder a los usuarios que ya teníamos.",
        },
        4: { type: "h3", text: "Tres objetivos" },
        5: {
          type: "objectives",
          items: [
            { emoji: "🙋‍♀️", label: "UX", sub: "Construir una plataforma que realmente se sintiera fácil de usar: usable, confiable y satisfactoria." },
            { emoji: "🎯", label: "Negocio", sub: "Crecer la cuota de mercado atrayendo nuevos usuarios y manteniendo a los que ya tenemos." },
            { emoji: "⭐", label: "Macro", sub: "Consolidar a HAH como la plataforma de referencia para reservar servicios de mudanza en línea." },
          ],
        },
        6: { type: "h3", text: "Puntos de dolor" },
        7: {
          type: "p",
          text: "Antes de rediseñar cualquier cosa, necesitábamos ver exactamente dónde se rompía la experiencia. Así que hablamos con la gente (stakeholders, agentes de servicio al cliente, mudanceros, clientes reales) y observamos cómo usaban realmente el sitio.",
        },
        8: {
          type: "p",
          text: "Junta eso con una auditoría heurística y los patrones aparecieron rápido.",
        },
        9: {
          type: "statPills",
          items: [
            { value: "11", label: "entrevistas a profundidad con usuarios" },
            { value: "+200", label: "grabaciones de interacción" },
          ],
        },
        10: {
          type: "list",
          marker: "x",
          items: [
            "El checkout se sentía abrumador, incluso para servicios sencillos.",
            "El lenguaje visual no se había movido desde 2017, y el engagement y la confianza lo estaban pagando.",
            "La búsqueda se sentía rígida: los usuarios casi no tenían forma de personalizar sus criterios.",
            "Los filtros eran demasiado técnicos, dificultando acotar de verdad las opciones.",
          ],
        },
        11: {
          type: "conceptTabs",
          items: [
            {
              src: "/case-studies/hah/goals/pain-point-1.gif",
              alt: "Problema 01: Flujo de checkout abrumador",
              label: "Problema 01 · Checkout abrumador",
              tabLabel: "Problema 01",
              description: "Incluso reservaciones sencillas arrastraban a los usuarios por un flujo de confirmación pesado, con demasiados pasos para el tamaño del trabajo.",
            },
            {
              src: "/case-studies/hah/goals/pain-point-2.gif",
              alt: "Problema 02: Filtros técnicos y búsqueda rígida",
              label: "Problema 02 · Filtros que peleaban",
              tabLabel: "Problema 02",
              description: "Los criterios de búsqueda eran rígidos y los filtros hablaban en lenguaje de operaciones, no del usuario, dificultando llegar al mudancero correcto.",
            },
          ],
        },
      },
    },
    research: {
      label: "Investigación",
      eyebrow: "Investigación y análisis",
      heading: "Investigación y análisis.",
      blocks: {
        0: {
          type: "p",
          text: "De las entrevistas surgió una persona clara, y con ella una imagen real de dónde se atoraba la gente, dónde se iba y dónde la experiencia podía conquistarlos.",
        },
        1: {
          type: "image",
          src: "/case-studies/hah/research/personas.avif",
          alt: "Persona de usuario de HAH y hallazgos de investigación",
          caption: "Trabajo de personas destilado de las entrevistas y sesiones de usabilidad.",
        },
        2: {
          type: "p",
          text: "Con nuestros propios clientes mapeados, miramos hacia afuera y estudiamos cómo manejaba la reservación el resto de la industria.",
        },
        3: {
          type: "p",
          text: "Al principio, el plan era modelar HAH como un marketplace de e-commerce: navegar, comparar, reservar, como un alquiler vacacional. Pero conforme nos metimos más en nuestros competidores y en nuestro propio modelo de servicio, quedó más claro: nuestra propuesta de valor no encajaba del todo en esa forma.",
        },
        4: {
          type: "ticker",
          aspect: "27/25",
          items: [
            { src: "/case-studies/hah/research/competitors/com-1.png", alt: "Competidor 01" },
            { src: "/case-studies/hah/research/competitors/com-2.png", alt: "Competidor 02" },
            { src: "/case-studies/hah/research/competitors/com-3.png", alt: "Competidor 03" },
            { src: "/case-studies/hah/research/competitors/com-4.png", alt: "Competidor 04" },
            { src: "/case-studies/hah/research/competitors/com-5.png", alt: "Competidor 05" },
            { src: "/case-studies/hah/research/competitors/com-6.png", alt: "Competidor 06" },
            { src: "/case-studies/hah/research/competitors/com-7.png", alt: "Competidor 07" },
          ],
        },
        5: {
          type: "statPills",
          items: [
            { value: "22", label: "competidores evaluados de principio a fin" },
            { value: "8 días", label: "de estudio competitivo enfocado" },
          ],
        },
      },
    },
    mvp1: {
      label: "Primer MVP",
      eyebrow: "1er mvp",
      heading: "Llevando ideas a la acción, 2022.",
      blocks: {
        0: {
          type: "p",
          text: "En lugar de reconstruir todo de golpe, tomamos nuestras páginas de aterrizaje con más tráfico (las páginas geo) y empezamos a probar. Cada variación cambiaba una versión distinta del formulario CTA. Unos meses después, teníamos datos reales que nos decían qué direcciones estaban funcionando.",
        },
        1: {
          type: "conceptTabs",
          items: [
            {
              src: "/case-studies/hah/mvp1/example-1.avif",
              alt: "MVP1 experimento 01, variación del formulario CTA original",
              label: "Variación 01 · CTA original",
              tabLabel: "Variación 01",
              description: "El formulario CTA base en las páginas geo: largo, vertical, ZIP primero.",
            },
            {
              src: "/case-studies/hah/mvp1/example-2.avif",
              alt: "MVP1 experimento 02, layout de CTA condensado",
              label: "Variación 02 · Layout condensado",
              tabLabel: "Variación 02",
              description: "Recortamos el formulario a lo esencial y apretamos la jerarquía visual alrededor de la acción principal.",
            },
            {
              src: "/case-studies/hah/mvp1/example-3.avif",
              alt: "MVP1 experimento 03, variación CTA ganadora",
              label: "Variación 03 · Ganadora",
              tabLabel: "Variación 03",
              description: "La variación que mejor convirtió: titular más claro, formulario más ligero, CTA más fuerte, lanzada a las páginas geo.",
              winner: true,
            },
          ],
        },
        2: {
          type: "list",
          marker: "check",
          items: [
            "Empezamos en pequeño, probando cambios quirúrgicos al CTA antes de reimaginar algo más grande.",
          ],
        },
        3: {
          type: "list",
          marker: "x",
          items: [
            "Los nuevos CTAs funcionaron, pero el resto del sitio seguía sintiéndose anticuado y poco atractivo.",
          ],
        },
      },
    },
    mvp2: {
      label: "Segundo MVP",
      eyebrow: "2do mvp",
      heading: "El punto de inflexión, 2023 a 2024.",
      blocks: {
        0: {
          type: "p",
          text: "Para 2023, era claro que HAH ya no era solo un marketplace. Así que nos apoyamos en eso, introduciendo tarjetas de servicio en el home, limpiando la UI del marketplace y cambiando el color primario de la marca de verde a azul para transmitir más confianza.",
        },
        1: {
          type: "p",
          text: "Eso arrancó un nuevo embudo de conversión paso a paso. Probamos todo con A/B para asegurarnos de que la conversión se mantuviera firme mientras evolucionábamos la experiencia por debajo.",
        },
        2: {
          type: "devicePair",
          desktop: { src: "/case-studies/hah/mvp2/desktop.webp", alt: "MVP2 desktop, marketplace renovado con tarjetas de servicio" },
          mobile:  { src: "/case-studies/hah/mvp2/mobile.gif",   alt: "MVP2 móvil, nuevo embudo paso a paso" },
          caption: "MVP2: marketplace renovado, nuevo embudo, color de marca azul.",
        },
        3: {
          type: "list",
          marker: "check",
          items: [
            "Agregamos un paso para recoger más contexto desde el inicio, para que los resultados sí coincidieran con lo que los usuarios necesitaban.",
          ],
        },
        4: {
          type: "list",
          marker: "x",
          items: [
            "El nuevo diseño funcionó mejor, pero el paso del formulario seguía siendo demasiado largo.",
          ],
        },
      },
    },
    mvp3: {
      label: "Últimas mejoras",
      eyebrow: "3er mvp",
      heading: "Las últimas mejoras.",
      blocks: {
        0: {
          type: "p",
          text: "Ahora estamos lanzando un flujo de reservación más detallado pero intuitivo, más cercano a lo que ofrecen nuestros competidores, pero con HAH como socio principal en lugar de un intermediario externo. Porch maneja las cotizaciones y la mudanza misma, de principio a fin.",
        },
        1: {
          type: "list",
          marker: "check",
          items: [
            "Reconstruimos el checkout desde cero: lo que antes era un modal de datos de tarjeta ahora es un resumen completo con horario, opciones y rutas de pago claras.",
          ],
        },
        2: {
          type: "image",
          src: "/case-studies/hah/mvp3/example-1.webp",
          alt: "MVP3, último checkout y flujo de reservación",
          caption: "MVP3: resumen integral, horario y múltiples opciones de pago.",
          frame: "#2B73DE",
          frameBleed: true,
        },
        3: {
          type: "p",
          text: "El MVP2 apretó el embudo aclarando la jerarquía visual y poniendo el resumen de la mudanza desde el inicio. Pero los usuarios todavía tenían que elegir al mudancero ellos mismos.",
        },
        4: {
          type: "p",
          text: "En el MVP3, el embudo creció: surgían múltiples cotizaciones rápido y los usuarios podían personalizar el resto de su mudanza, no solo al mudancero. Personalizado, pero todavía un marketplace por dentro.",
        },
        5: {
          type: "p",
          text: "El cambio: menos \"navega un directorio\", más \"aquí están las mejores opciones para ti\". El algoritmo de HAH, afinado con años de datos de clientes, hace el trabajo pesado de la preselección.",
        },
        6: {
          type: "image",
          src: "/case-studies/hah/mvp3/booking-diagram.png",
          alt: "Diagrama del embudo de reservación del MVP3, flujo completo impulsado por cotizaciones",
          caption: "Diagrama completo de la reservación del MVP3: de la captura, pasando por cotizaciones, hasta la confirmación.",
          frame: "#ffffff",
        },
        7: {
          type: "sectionBreak",
          src: "/case-studies/hah/mvp3/big-visual-break.png",
          alt: "MVP3 de HireAHelper, recap visual en escritorio y móvil",
        },
        8: {
          type: "h3",
          text: "Guardar cotización: retoma donde te quedaste.",
        },
        9: {
          type: "p",
          text: "Los usuarios pueden guardar una cotización en cualquier paso y recibirla por correo, para volver más tarde sin perder el avance.",
        },
        10: {
          type: "image",
          src: "/case-studies/hah/mvp3/save-quote.png",
          alt: "MVP3 Guardar Cotización, pantalla de confirmación más resumen enviado por correo",
          caption: "Guardar Cotización: confirmación, resumen por correo y una ruta de regreso al dashboard.",
        },
        11: {
          type: "h3",
          text: "Explorar mudanceros: sigue siendo un marketplace, solo que más inteligente.",
        },
        12: {
          type: "p",
          text: "El marketplace sigue ahí. El algoritmo preselecciona al mejor mudancero por defecto, pero los usuarios pueden cambiarlo, comparar reseñas y elegir otro en cualquier momento.",
        },
        13: {
          type: "image",
          src: "/case-studies/hah/mvp3/browse-movers.png",
          alt: "MVP3 Explorar Mudanceros, mudanceros alternos, reseñas y selección",
          caption: "Explorar Mudanceros: proveedores alternos, reseñas completas y reselección con un toque.",
        },
      },
    },
    cms: {
      label: "CMS y Sistema de Diseño",
      eyebrow: "CMS y Sistema de Diseño",
      heading: "Un look fresco y una experiencia de usuario mejorada.",
      blocks: {
        0: {
          type: "p",
          text: "Después de suficientes rondas de pruebas, construimos un sistema de diseño propio para HAH, montado sobre Bootstrap y potenciado por Flowbite. Le dio al equipo una base consistente y accesible, y nos permitió lanzar más rápido sin romper la marca cada dos sprints.",
        },
        1: {
          type: "p",
          text: "En paralelo, renovamos la capa de las landing pages: probamos con A/B las páginas geo, el home, las páginas de servicio, en cualquier lado donde la conversión estuviera en juego. (Honestamente, digno de su propio case study.)",
        },
        2: {
          type: "statPills",
          items: [
            { value: "+14", label: "landing pages a nivel CMS" },
            { value: "Tailwind", label: "componentes basados en" },
          ],
        },
        3: {
          type: "image",
          src: "/case-studies/hah/cms/design-system.avif",
          alt: "Sistema de diseño de HAH: colores, tipografía, componentes y plantillas de página",
          caption: "El sistema de diseño de HAH: colores, tipografía, componentes y plantillas de página, todo en un solo lugar.",
        },
        4: {
          type: "imagePair",
          items: [
            {
              src: "/case-studies/hah/cms/landing-page.avif",
              alt: "Landing page del CMS de HAH, mockup responsivo en iPad",
            },
            {
              src: "/case-studies/hah/cms/design-library.avif",
              alt: "Biblioteca de Diseño de HAH 2024, Porch Moving Group y HireAHelper",
            },
          ],
        },
        5: {
          type: "p",
          text: "HAH sigue evolucionando: los flujos cambian, los layouts cambian, el trabajo continúa. Cerré mi etapa en Porch en agosto de 2025, así que este case study es una instantánea de los años en los que fui parte de esto.",
        },
        6: {
          type: "externalLink",
          description: "Más trabajo de UI/UX de HAH en Behance",
          label: "ver publicación",
          href: "https://www.behance.net/gallery/228809041/HireAHelper-UI-UX",
        },
      },
    },
    timeline: {
      label: "Línea de tiempo",
      eyebrow: "Años en HAH",
      heading: "Cuatro años, tres MVPs, un sistema de diseño.",
      blocks: {
        0: {
          type: "p",
          text: "Una mirada al recorrido: desde heredar el marketplace de la era verde en 2022, pasando por la reconstrucción del embudo en la era azul, hasta el MVP3 impulsado por cotizaciones y el sistema de diseño que amarró todo.",
        },
        1: {
          type: "image",
          src: "/case-studies/hah/timeline.png",
          alt: "Línea de tiempo de HireAHelper, 2022 a 2025, tres MVPs, refresh de marca y sistema de diseño",
        },
      },
    },
  },
};
