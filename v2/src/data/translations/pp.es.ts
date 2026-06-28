import type { CaseTextOverride } from "../caseStudies.i18n";

export const PP_ES: CaseTextOverride = {
  title: "Permisos de mudanza: convertir la burocracia en confianza",
  shortTitle: "PermitPuller",
  role: "Diseño UX, Diseño UI",
  deliverables: "Experiencia optimizada, flujo de contratación",
  tagline: "Permisos, sin dolor.",
  overview:
    "Rediseño completo de Permit Puller, la plataforma para tramitar permisos de mudanza en ciudades de EE.UU. El producto heredado perdía usuarios en cada paso. Lo reconstruimos pensando en claridad, confianza y velocidad.",
  challenge:
    "El sistema anterior era un solo formulario gigante sin ninguna retroalimentación después de enviarlo. Los usuarios lo abandonaban, una y otra vez.",
  tags: ["Diseño UX", "Diseño UI", "Flujo de contratación", "B2C"],
  kinds: ["UX/UI"],
  metrics: [
    { label: "Tramitación de permisos más rápida", value: "18%" },
    { label: "Satisfacción del usuario", value: "91%" },
    { label: "Clientes recurrentes tras la primera compra", value: "80%+" },
  ],
  conclusion: {
    quote:
      "Lo que se muestra aquí es una instantánea de lo que construimos en Porch Moving Group: el flujo de permisos rediseñado, el refresh de marca y el panel de estado, desarrollados durante mi paso por ahí antes de salir en 2024.",
    body: "Permit Puller sigue activo hoy en movingpermits.com, con la misma estructura paso a paso que lanzamos y solo ajustes menores al flujo. Reemplazamos el silencio con claridad y convertimos un trámite burocrático en algo en lo que los usuarios realmente podían confiar. Diseñar para la claridad dentro de un sistema tan complejo es un reto que volvería a aceptar sin pensarlo.",
    signoff: "Rodrigo Martínez · Porch Moving Group, 2022 a 2024",
  },
  sections: {
    snapshot: {
      label: "Resumen",
      eyebrow: "Rediseñando la experiencia de mudanza",
      heading: "Permisos de mudanza: convertir la burocracia en confianza.",
      blocks: {
        0: {
          type: "p",
          text: "Permit Puller es la plataforma que la gente usa para tramitar permisos de mudanza en ciudades de Estados Unidos. Para 2023 el producto perdía usuarios en cada paso: precios poco claros, un formulario monolítico y cero actualizaciones de estado tras el envío.",
        },
        1: {
          type: "p",
          text: "Lo reconstruimos de cero. Entre entrevistas, trabajo de personas y análisis de la competencia, mapeamos la fricción real y diseñamos un flujo paso a paso que hizo que la burocracia se sintiera como un servicio.",
        },
        2: {
          type: "p",
          text: "El nuevo producto subió las tasas de finalización, aceleró la tramitación y trajo a los usuarios de vuelta para sacar más permisos. La claridad, resulta, escala.",
        },
        3: {
          type: "metricCards",
          items: [
            { value: "18%", label: "Tramitación más rápida", sub: "Menos errores, menos correcciones." },
            { value: "91%", label: "Satisfacción del usuario", sub: "Encuesta posterior al lanzamiento." },
            { value: "80%+", label: "Clientes que regresan", sub: "Vuelven por un segundo permiso." },
          ],
        },
      },
    },
    goals: {
      label: "Objetivos y retos",
      heading: "¿Qué es Permit Puller?",
      blocks: {
        0: {
          type: "p",
          text: "Imagínate esto. Por fin te estás mudando a la ciudad, diez pisos arriba, con vistas en todas direcciones. Ya coordinaste a los de la mudanza, planeaste los tiempos y solo quieres meter las cajas.",
        },
        1: {
          type: "p",
          text: "Llega el día. Subes a dirigir al equipo, bajas a checarlos. Es un caos.",
        },
        2: {
          type: "p",
          text: "Y entonces la ves: una multa por estacionarte en zona prohibida, metida bajo el limpiaparabrisas.",
        },
        3: {
          type: "p",
          text: "Permit Puller existe para que eso nunca pase. Tú te encargas de las cajas. Nosotros, de la banqueta.",
        },
        4: {
          type: "image",
          src: "/case-studies/pp/goals/pp-2022.png",
          alt: "Experiencia web de PermitPuller en 2022",
          caption: "La experiencia de PermitPuller que heredamos en 2022.",
        },
        5: { type: "h3", text: "El reto" },
        6: {
          type: "p",
          text: "El sistema heredado era un formulario largo y confuso, sin actualizaciones de estado después del envío. La gente lo abandonaba constantemente.",
        },
        7: { type: "h3", text: "Puntos de dolor" },
        8: {
          type: "p",
          text: "Un solo formulario gigante. Sin retroalimentación. Sin confianza. Hicimos entrevistas, revisamos tickets de soporte y vimos grabaciones de sesión. Dos problemas no dejaban de aparecer.",
        },
        9: {
          type: "list",
          marker: "x",
          items: [
            "El 📜 formulario monolítico causaba errores constantes: tipo de permiso equivocado, información faltante, campos poco claros.",
            "Después de enviar, los usuarios se sentían 👻 ghosteados. Sin confirmación, sin estado, sin idea de qué seguía.",
          ],
        },
        10: {
          type: "conceptTabs",
          items: [
            {
              src: "/case-studies/pp/goals/pain-point-1.gif",
              alt: "Problema 01, formulario monolítico en una sola página",
              label: "Problema 01 · Formulario monolítico",
              tabLabel: "Problema 01",
              description:
                "Todos los campos vivían en una sola página. Los usuarios elegían el tipo de permiso equivocado, se saltaban información obligatoria y abandonaban a la mitad sin poder retomar.",
            },
            {
              src: "/case-studies/pp/goals/pain-point-2.png",
              alt: "Problema 02, ghosteo tras el envío sin estado",
              label: "Problema 02 · Ghosteo tras el envío",
              tabLabel: "Problema 02",
              description:
                "Después de enviar, los usuarios recibían silencio absoluto. Sin confirmación, sin estado, sin tiempo estimado de respuesta. Muchos asumían que la solicitud nunca llegó y la volvían a enviar, o de plano se rendían.",
            },
          ],
        },
      },
    },
    research: {
      label: "Investigación y análisis",
      eyebrow: "investigación y análisis",
      heading: "Buscando inspiración.",
      blocks: {
        0: {
          type: "p",
          text: "Los competidores directos iban todos por el mismo lado: el teléfono primero. Express Permits, Permit Pushers, Suncoast Permits, todos empujaban a los usuarios a formularios de \"Contáctanos\" y centros de llamadas.",
        },
        1: {
          type: "p",
          text: "Eso significaba comunicación fragmentada y cero transparencia. Suncoast ponía un número de teléfono al frente y al centro, mandando a cualquiera que prefiriera lo digital directo al teclado.",
        },
        2: {
          type: "p",
          text: "Permit Place y Burnham Nationwide eran completos, pero seguían apoyándose mucho en el teléfono. Una oportunidad clara para una experiencia digital nativa.",
        },
        3: {
          type: "ticker",
          aspect: "27/25",
          items: [
            { src: "/case-studies/pp/research/comp-1.avif", alt: "Express Permits" },
            { src: "/case-studies/pp/research/comp-2.avif", alt: "Permit Pushers" },
            { src: "/case-studies/pp/research/comp-3.avif", alt: "Suncoast Permits" },
            { src: "/case-studies/pp/research/comp-4.webp", alt: "Burnham Nationwide" },
          ],
        },
        4: {
          type: "p",
          text: "Así que mejor volteamos a ver a Angi y Thumbtack. Flujos paso a paso, captura de datos estructurada, menos ida y vuelta. Ese era el modelo.",
        },
      },
    },
    strategy: {
      label: "Estrategia y exploración",
      eyebrow: "estrategia y exploración",
      heading: "Simplificar el flujo. Aclarar el precio. Modernizar la imagen.",
      blocks: {
        0: {
          type: "p",
          text: "Tres principios guiaron el rediseño.",
        },
        1: { type: "h3", text: "Una perspectiva totalmente fresca" },
        2: {
          type: "p",
          text: "Más allá del flujo, refrescamos la marca y metimos la nueva UI dentro del creciente Sistema de Diseño de PMG.",
        },
        3: {
          type: "p",
          text: "Nueva voz, nuevas ilustraciones, nuevo logo.",
        },
        4: {
          type: "image",
          src: "/case-studies/pp/strategy/strategy.png",
          alt: "Refresh de marca y exploración de layout",
          caption: "Exploración de layouts a lo largo del nuevo flujo.",
        },
        5: {
          type: "image",
          src: "/case-studies/pp/strategy/confirmation.png",
          alt: "Exploración de la pantalla de confirmación",
          caption: "Borradores de confirmación integrados al Sistema de Diseño de PMG.",
        },
        6: {
          type: "statPills",
          items: [
            { value: "+6", label: "layouts dibujados" },
            { value: "3 días", label: "dedicados a explorar páginas" },
          ],
        },
      },
    },
    ux: {
      label: "Diseño UX/UI",
      eyebrow: "diseño ui / ux",
      heading: "Solicitudes de permiso más fáciles, más rápidas y más intuitivas.",
      blocks: {
        0: { type: "h3", text: "Paso 1: Ubicación" },
        1: {
          type: "p",
          text: "Pones un pin en el lugar exacto donde necesitas el permiso. Mapa interactivo, sin batallar con direcciones.",
        },
        2: {
          type: "image",
          src: "/case-studies/pp/ux/location.png",
          alt: "Paso 1, selección de ubicación con mapa interactivo",
        },
        3: { type: "h3", text: "Pasos 2 y 3: Tipo de permiso y detalles" },
        4: {
          type: "p",
          text: "Eliges de una lista curada, en su mayoría permisos de mudanza. Cada tarjeta muestra la tarifa y el tiempo de respuesta desde el inicio, así coordinar con los de la mudanza es directo.",
        },
        5: {
          type: "carousel",
          aspect: "16/10",
          items: [
            { src: "/case-studies/pp/ux/permit.png", alt: "Selección del tipo de permiso", caption: "Tipo de permiso" },
            { src: "/case-studies/pp/ux/details.png", alt: "Formulario de detalles del permiso", caption: "Detalles del permiso" },
          ],
        },
        6: { type: "h3", text: "Paso 3: Fechas" },
        7: {
          type: "p",
          text: "Eliges la fecha y la ventana de tiempo. El permiso se alinea con la mudanza, sin adivinar.",
        },
        8: {
          type: "image",
          src: "/case-studies/pp/ux/date.png",
          alt: "Paso 3, selección de fechas",
        },
        9: { type: "h3", text: "Paso 4: Complementos" },
        10: {
          type: "p",
          text: "Aquí está el diferenciador real. \"Verified Site Review\" revisa el cumplimiento antes de la mudanza. \"Permit Signage Removal\" se encarga de poner y retirar la señalización.",
        },
        11: {
          type: "carousel",
          aspect: "16/10",
          items: [
            { src: "/case-studies/pp/ux/add-ons.png", alt: "Paso de complementos, vista principal", caption: "Complementos" },
            { src: "/case-studies/pp/ux/add-ons-1.png", alt: "Paso de complementos, vista de detalle", caption: "Detalle del complemento" },
          ],
        },
        12: { type: "h3", text: "Checkout" },
        13: {
          type: "p",
          text: "Algunos permisos se cobran por adelantado. Otros, sobre todo en ciudades nuevas, necesitan una revisión rápida primero. En cualquier caso, los usuarios reciben respuesta en menos de 24 horas con un siguiente paso claro.",
        },
        14: {
          type: "image",
          src: "/case-studies/pp/ux/confirmation.png",
          alt: "Paso de checkout",
        },
        15: { type: "h3", text: "Un dashboard unificado y moderno", mt: 48 },
        16: {
          type: "p",
          text: "Un dashboard de estado con actualizaciones en tiempo real, más notificaciones por SMS y email. Se acabó el ghosteo.",
        },
        17: {
          type: "sectionBreak",
          src: "/case-studies/pp/ux/dashboard.png",
          alt: "Dashboard de estado con actualizaciones en tiempo real y notificaciones",
        },
      },
    },
    accomplishments: {
      label: "Logros",
      eyebrow: "Logros",
      heading: "Flujo de captura de datos fácil de seguir, paso a paso.",
      blocks: {
        0: { type: "h3", text: "De la ansiedad a la confianza." },
        1: {
          type: "p",
          text: "El trabajo dio resultados.",
        },
        2: {
          type: "list",
          marker: "check",
          items: [
            "📈 Las tasas de finalización del formulario subieron a lo largo del nuevo flujo",
            "🏃 La tramitación de permisos se volvió 18% más rápida",
            "👍 La satisfacción del usuario llegó al 91%",
          ],
        },
        3: {
          type: "image",
          src: "/case-studies/pp/accomplishments/accomplishments.avif",
          alt: "Resultados de PermitPuller, recap del flujo paso a paso",
        },
        4: {
          type: "p",
          text: "Más del 80% de los clientes que sacaron su primer permiso volvieron por otro. Así que apostamos por eso: datos precargados, flujos más cortos, menos fricción cada vez. El segundo trámite es prácticamente automático.",
        },
      },
    },
    timeline: {
      label: "Línea de tiempo",
      eyebrow: "Años en PermitPuller",
      heading: "Dos años, un rediseño, una forma más tranquila de sacar un permiso.",
      blocks: {
        0: {
          type: "p",
          text: "Un vistazo atrás: desde que heredamos el formulario monolítico de 2022, pasando por la investigación y el refresh de marca, hasta el flujo paso a paso y el dashboard de estado que cerró el ciclo.",
        },
        1: {
          type: "image",
          src: "/case-studies/pp/timeline.png",
          alt: "Línea de tiempo de PermitPuller, 2022 a 2024, investigación, refresh de marca y flujo paso a paso",
        },
      },
    },
  },
};
