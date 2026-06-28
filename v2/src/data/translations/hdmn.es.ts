import type { CaseTextOverride } from "../caseStudies.i18n";

export const HDMN_ES: CaseTextOverride = {
  title: "Nueva función de chat SMS para agentes telefónicos",
  shortTitle: "Hahdmin",
  role: "Diseño UX",
  deliverables: "Función SMS, flujo de usuario",
  tagline: "Un solo hub. Todos los canales.",
  overview:
    "La comunicación directa entre los agentes de Hahdmin y los clientes a lo largo del proceso de contratación es clave. El dashboard de Hahdmin en Porch era una plataforma fragmentada: los usuarios (representantes de servicio al cliente) tenían que moverse entre varias herramientas para chatear. Eso generaba ineficiencia, confusión y tiempos de respuesta lentos para agentes, clientes y empresas de mudanza. Para resolverlo, nuestro equipo desarrolló una función de chat unificada que integró SMS y email directamente al sistema existente.",
  challenge:
    "Los agentes telefónicos (CSRs) coordinan las mudanzas de los clientes desde el dashboard de Hahdmin, una plataforma interna construida para manejar la logística de las mudanzas y comunicarse con los socios y clientes de Porch. El problema: nuestros sistemas anteriores no tenían integración directa de SMS, lo que dificultaba conectarse y compartir información.",
  tags: ["Diseño UX", "Herramientas internas", "SMS", "Workflow"],
  kinds: ["UX"],
  metrics: [
    { label: "CSRs entrevistados", value: "5" },
    { label: "Días dedicados al estudio", value: "7" },
    { label: "Journeys dibujados", value: "+6" },
  ],
  conclusion: {
    quote:
      "Me di cuenta de que lo que parece una adición \"pequeña\" — en este caso, un panel de notificaciones — puede tener un impacto enorme cuando se combina con la lógica y el contexto correctos. El reto real no era solo mostrar mensajes, sino decidir cuáles eventos realmente importan.",
    body: "Al combinar el nuevo modal de SMS con una lógica de notificaciones inteligente, Hahdmin ofrece hoy una experiencia unificada y sin distracciones, donde los agentes se mantienen al día con las conversaciones y responden más rápido, sin salir de su espacio de trabajo principal.",
    signoff: "Rodrigo Martínez — Diseñador UX",
  },
  sections: {
    snapshot: {
      label: "Resumen",
      eyebrow: "Rediseñando la experiencia de mudanza",
      heading: "Nueva función de chat SMS para agentes telefónicos.",
      blocks: {
        0: {
          type: "p",
          text: "La comunicación directa entre los agentes de Hahdmin y los clientes a lo largo del proceso de contratación es clave.",
        },
        1: {
          type: "p",
          text: "El dashboard de Hahdmin en Porch era una plataforma fragmentada: los usuarios (representantes de servicio al cliente) tenían que moverse entre varias herramientas para chatear. Eso generaba ineficiencia, confusión y tiempos de respuesta lentos para agentes, clientes y empresas de mudanza.",
        },
        2: {
          type: "p",
          text: "Para resolverlo, nuestro equipo desarrolló una función de chat unificada que integró SMS y email directamente al sistema existente.",
        },
        3: {
          type: "p",
          text: "A base de entrevistas con usuarios, prototipado rápido y retroalimentación iterativa, diseñamos una interfaz intuitiva con roles codificados por color y mensajería en tiempo real. La nueva solución agilizó los flujos de trabajo, mejoró la claridad y permitió una comunicación más rápida y fluida para todos.",
        },
        4: {
          type: "p",
          text: "El resultado: los agentes podían gestionar conversaciones de forma eficiente, los clientes recibían actualizaciones a tiempo y las empresas de mudanza tenían mejor coordinación, mejorando la experiencia general de la mudanza.",
        },
        5: {
          type: "metricCards",
          items: [
            { value: "5", label: "CSRs entrevistados", sub: "Cada agente activo del equipo." },
            { value: "7 días", label: "Dedicados a un estudio detallado", sub: "Estudio de workflow y journey mapping." },
            { value: "+6", label: "Journeys dibujados", sub: "Variantes de flujo puestas a prueba." },
            { value: "3 días", label: "Exploración de páginas", sub: "Sprint de exploración lo-fi." },
          ],
        },
      },
    },
    goals: {
      label: "Objetivos y retos",
      heading: "El reto.",
      blocks: {
        0: {
          type: "p",
          text: "Los agentes telefónicos (CSRs) coordinan las mudanzas de los clientes desde el dashboard de Hahdmin, una plataforma interna construida para manejar la logística de las mudanzas y comunicarse con los socios y clientes de Porch. El problema: nuestros sistemas anteriores no tenían integración directa de SMS, lo que dificultaba conectarse y compartir información.",
        },
        1: {
          type: "image",
          alt: "Workflow heredado del agente de Hahdmin usando varias apps externas",
        },
      },
    },
    role: {
      label: "¿Cuál es el rol de Hahdmin?",
      heading: "¿Cuál es el rol de Hahdmin?",
      blocks: {
        0: {
          type: "p",
          text: "Hahdmin ofrece la infraestructura y los servicios de captura de datos esenciales para que las mudanzas operen sin tropiezos. Proporciona información completa sobre cotizaciones, mudanceros y clientes, permitiendo a los representantes de servicio al cliente gestionar de forma eficiente un alto volumen de tickets logísticos al día, incluyendo enviar cotizaciones por teléfono y email.",
        },
        1: {
          type: "p",
          text: "Una función crucial que faltaba era la de SMS. Esa incorporación simplificaría la comunicación para todos los involucrados y ahorraría tiempo al permitir que las partes interactúen en una sala de chat, en lugar de depender de llamadas o emails.",
        },
        2: {
          type: "image",
          alt: "Vista general del dashboard de Hahdmin: cotizaciones, mudanceros e información de cliente",
        },
      },
    },
    "user-insights": {
      label: "Insights de usuario",
      eyebrow: "insights de usuario",
      heading: "Los agentes de Hahdmin necesitaban ayuda.",
      blocks: {
        0: {
          type: "p",
          text: "Empezamos recopilando insights con los agentes para identificar los principales obstáculos que enfrentaban y explorar formas de simplificar su workflow. Pronto quedó claro que una renovación completa del framework de Hahdmin no era viable por restricciones de tiempo y recursos, así que cambiamos el foco a mejorar la interfaz existente.",
        },
        1: {
          type: "p",
          text: "Eso implicó atender las necesidades distintas de varios grupos de usuarios: administradores, supervisores, agentes, clientes y mudanceros, que interactúan con Hahdmin en capacidades diferentes. Al planear la integración del nuevo chat, pensamos cuidadosamente cómo introducirlo de forma suave sin romper la experiencia general.",
        },
        2: {
          type: "statPills",
          items: [
            { value: "7 días", label: "dedicados a un estudio detallado" },
            { value: "5", label: "CSRs entrevistados" },
          ],
        },
        3: {
          type: "list",
          marker: "x",
          items: [
            "El propio dashboard del CSR en Hahdmin. Es abrumador y poco intuitivo.",
            "Los agentes tenían que saltar entre apps distintas para manejar mensajes, correos y llamadas, lo cual es frustrante para los clientes.",
          ],
        },
        4: {
          type: "p",
          text: "Había un detalle importante: cada seis meses, los CSRs tenían que aprender herramientas completamente nuevas para manejar llamadas, correos y mensajes, lo cual interrumpía la operación diaria y generaba una experiencia frustrante para todos. Para empeorarlo, el dashboard de Hahdmin era abrumador y poco intuitivo.",
        },
      },
    },
    market: {
      label: "Análisis de mercado",
      eyebrow: "análisis de mercado",
      heading: "Análisis de mercado.",
      blocks: {
        0: {
          type: "p",
          text: "Revisamos cómo las empresas grandes manejan sus funciones de chat y nos clavamos en algunas buenas prácticas para entender mejor las microinteracciones.",
        },
        1: {
          type: "p",
          text: "Eso nos ayudó a mapear y lluvia de ideas nuestros propios procesos, apoyándonos en los aprendizajes de quienes ya habían resuelto el reto con éxito. Estudiamos empresas como Twilio, Textline e incluso WhatsApp, reconocidas por sus funciones de comunicación SMS multipartita.",
        },
        2: {
          type: "image",
          alt: "Análisis de mercado: Twilio, Textline, WhatsApp",
        },
        3: {
          type: "p",
          text: "Era importante recordar que Hahdmin era exclusivamente una aplicación de escritorio diseñada para los representantes de servicio al cliente. Los únicos usuarios que podían acceder desde el móvil eran clientes y proveedores; los agentes no estaban contemplados.",
        },
        4: {
          type: "statPills",
          items: [
            { value: "+6", label: "journeys dibujados" },
            { value: "3 días", label: "dedicados a explorar páginas" },
          ],
        },
      },
    },
    strategy: {
      label: "Hallazgos y estrategia",
      eyebrow: "Hallazgos y estrategia",
      heading: "Exploraciones lo-fi.",
      blocks: {
        0: {
          type: "p",
          text: "Después de varias rondas de testing con stakeholders y usuarios, nuestros bocetos iniciales evolucionaron a prototipos que trazaron el camino para integrar la mensajería SMS al sistema existente. Implementamos un tablero de scope para priorizar las interacciones más relevantes, refinado con la retroalimentación constante de los agentes.",
        },
        1: {
          type: "p",
          text: "Para que los usuarios pudieran identificar rápido a los participantes de la conversación y sus roles, introdujimos un sistema de colores que creó una jerarquía visual clara entre clientes, mudanceros y agentes. Ese enfoque aclaró las interacciones y agilizó la comunicación.",
        },
        2: {
          type: "image",
          alt: "Exploraciones lo-fi con roles codificados por color para clientes, mudanceros y agentes",
        },
      },
    },
    ux: {
      label: "Diseño UX/UI",
      eyebrow: "diseño ui/ux",
      heading: "El producto final.",
      blocks: {
        0: {
          type: "p",
          text: "Después de varias rondas de feedback, presentamos el nuevo flujo del chat, que integró sin fricción no solo SMS sino también email a la plataforma Hahdmin, creando un hub central para todas las comunicaciones. La mejora elevó la experiencia para agentes, clientes y empresas de mudanza por igual.",
        },
        1: {
          type: "p",
          text: "Los agentes no tendrían que aprender plataformas nuevas; al contrario, se sentirían en casa con nuestra solución. Integramos al workflow del admin las mismas interacciones de las plataformas que ya usaban. Además, sumamos un modal de comunicaciones para que los agentes se comuniquen y tengan visibilidad de todos los eventos.",
        },
        2: {
          type: "image",
          alt: "Función final de chat que integra SMS y email en Hahdmin",
        },
        3: { type: "h3", text: "Nuevo modal de SMS" },
        4: {
          type: "p",
          text: "La novedad principal es el nuevo modal de SMS, que se activa desde varios CTAs a lo largo del dashboard, cerca de la información de contacto. Permite a los usuarios iniciar hilos de SMS con las partes relevantes agregadas de forma dinámica. Una vez que arranca la conversación, el agente puede ver la información pertinente en el panel de contacto del lado derecho.",
        },
        5: {
          type: "p",
          text: "Otra función interesante es la capacidad nativa de mantener varios modales activos incluso cuando el usuario navega a otros dashboards de admin. Eso le da a los agentes más flexibilidad para gestionar la logística y mejorar la comunicación.",
        },
        6: {
          type: "image",
          alt: "Nuevo modal de SMS con varias conversaciones simultáneas",
        },
        7: { type: "h3", text: "Se implementó un sistema de notificaciones" },
        8: {
          type: "p",
          text: "Tras integrar el modal de SMS a Hahdmin, lanzamos un sistema de notificaciones nativo para llevar las alertas de mensajes en tiempo real directo a la plataforma. Históricamente, las conversaciones por SMS se monitoreaban desde herramientas externas, lo que obligaba a los agentes a malabarear pestañas y contextos. Esta actualización cerró esa brecha.",
        },
        9: {
          type: "p",
          text: "Ahora, los mensajes nuevos y los eventos de comunicación relevantes aparecen al instante en un panel de notificaciones dedicado dentro de Hahdmin. El sistema sigue una lógica clara para mantener la información relevante y accionable. No todos los eventos generan notificaciones. Solo las acciones críticas para el workflow del agente.",
        },
        10: {
          type: "image",
          alt: "Sistema de notificaciones nativo con panel dedicado en Hahdmin",
        },
        11: { type: "h3", text: "De los bocetos a los prototipos" },
        12: {
          type: "p",
          text: "Los agentes ya no malabareaban varias herramientas. Gestionaban conversaciones más rápido y con menos fricción. Los clientes recibían actualizaciones más ágiles y mejor soporte. Los mudanceros coordinaban con más eficiencia. En general, la comunicación se volvió más rápida, clara y fluida para todos. Nos enfocamos en cambios que cupieran dentro del sistema existente. Usamos prototipado rápido y feedback constante. La capacitación ayudó a que los agentes adoptaran la nueva función sin tropiezos.",
        },
        13: {
          type: "p",
          text: "La función de chat final integró SMS y email a Hahdmin. Se convirtió en un hub central para toda la comunicación. Al combinar el nuevo modal de SMS con esa lógica de notificaciones inteligente, Hahdmin ofrece ahora una experiencia unificada y sin distracciones, donde los agentes se mantienen al día con las conversaciones y responden más rápido, sin salir de su espacio de trabajo principal.",
        },
      },
    },
  },
};
