import type { CaseTextOverride } from "../caseStudies.i18n";

export const MP_ES: CaseTextOverride = {
  title: "Rediseñando la experiencia de mudanza",
  shortTitle: "MovingPlace",
  tagline: "Mudanzas, simplificadas.",
  role: "Diseño UX, dirección creativa",
  deliverables: "Experiencia optimizada, desarrollo de CMS, sistema de diseño",
  tags: ["Diseño UX", "Dirección creativa", "Sistema de diseño", "CMS"],
  kinds: ["UX/UI"],
  metrics: [
    { label: "Competidores analizados", value: "30+" },
    { label: "Hallazgos de pruebas de usuario", value: "22" },
    { label: "Landing pages en CMS", value: "14+" },
    { label: "Pasos del flujo de reserva", value: "6 pasos" },
  ],
  overview:
    "Frente a un mercado competitivo y altas tasas de abandono, MovingPlace necesitaba un diseño modernizado para simplificar la reserva, mejorar la transparencia y aumentar la conversión. A través de investigación de usuarios a profundidad, análisis de personas y benchmarking de competidores, identificamos puntos de dolor clave, como precios poco claros y un flujo de reserva complejo. El rediseño simplificó las interacciones con un sistema de reserva claro e intuitivo, mientras establecía una identidad de marca coherente.",
  challenge:
    "El sitio original intentaba recolectar un sinfín de información en cajas difíciles de navegar. Tras enviar la solicitud de cotización, el usuario tenía que esperar a que un CSR le llamara — no era la experiencia ideal para una audiencia digital.",
  conclusion: {
    quote: "El trabajo que se muestra aquí es una instantánea de lo que construimos en Porch Moving Group — el flujo de reserva, el sistema de marca y el framework del CMS — desarrollado durante mi tiempo ahí antes de mi salida en 2024.",
    body: "Desde entonces, MovingPlace ha evolucionado bajo una nueva administración y ha tomado una dirección distinta. Lo que ves aquí refleja las decisiones de diseño, los tradeoffs y los sistemas de los que fui responsable durante esa etapa. Estoy orgulloso de lo que el equipo entregó.",
    signoff: "Rodrigo Martínez — Porch Moving Group, 2022–2024",
  },
  sections: {
    snapshot: {
      label: "Resumen",
      heading: "El trabajo de un vistazo.",
      blocks: {
        0: {
          type: "p",
          text: "MovingPlace estaba perdiendo clientes en cada paso de un proceso que la gente de por sí detesta. Pasé ocho días en investigación y luego reconstruí todo — marca, flujo de reserva, CMS — de un solo golpe. Precios al frente, seis pasos claros, nuevas ciudades arriba en horas.",
        },
        1: {
          type: "metricCards",
          items: [
            { value: "30+", label: "Competidores analizados", sub: "Auditoría competitiva directa e indirecta." },
            { value: "22", label: "Hallazgos de pruebas de usuario", sub: "Entrevistas conductuales y sesiones de usabilidad." },
            { value: "14+", label: "Landing pages en CMS", sub: "Nuevas páginas de ciudad: de semanas a horas." },
            { value: "6 pasos", label: "Flujo de reserva", sub: "Precio visible en cada paso." },
          ],
        },
      },
    },
    goals: {
      label: "Objetivos y retos",
      heading: "Mudarse es difícil.",
      blocks: {
        0: {
          type: "p",
          text: "Me uní a Porch Moving Group para rediseñar MovingPlace — una plataforma atorada en los 2010s que estaba perdiendo gente en cada paso. La meta: hacerla lo suficientemente confiable para ganar la reserva en la primera visita.",
        },
        1: {
          type: "p",
          text: "El formulario viejo pedía un muro de datos personales solo para dar una cotización — y luego te hacía esperar a que alguien te devolviera la llamada. En 2024, así no se espera reservar nada.",
        },
        2: {
          type: "image",
          src: "/case-studies/mp/goals/goals-challenges.png",
          alt: "Resumen de objetivos y retos del rediseño de MovingPlace",
          caption: "La experiencia de 2022 — precios opacos, un formulario monolítico y una llamada de regreso como única vía a una cotización.",
        },
        3: { type: "h3", text: "Puntos de dolor" },
        4: {
          type: "list",
          marker: "x",
          items: [
            "Proceso de reserva poco confiable y poco claro",
            "Sin una identidad de mercado fuerte que anclara la primera impresión",
            "El precio aparecía tarde, después de recolectar los datos personales",
            "El tiempo de respuesta dependía de una llamada de un CSR",
            "La experiencia móvil se sentía como una ocurrencia tardía",
          ],
        },
        5: {
          type: "conceptTabs",
          items: [
            {
              src: "/case-studies/mp/goals/pain-points-1.png",
              alt: "Problema 01 — Precios enterrados detrás de formularios de contacto",
              label: "Problema 01 — Precio al final",
              tabLabel: "Problema 01",
              description: "El formulario recolectaba datos personales antes de mostrar cualquier precio. El usuario no tenía idea de a qué se estaba comprometiendo hasta que un CSR le devolvía la llamada.",
            },
            {
              src: "/case-studies/mp/goals/pain-points-2.png",
              alt: "Problema 02 — Experiencia móvil como ocurrencia tardía",
              label: "Problema 02 — Móvil como ocurrencia tardía",
              tabLabel: "Problema 02",
              description: "La experiencia móvil era un layout de desktop encogido — sin pensar en el toque, sin pensar en alguien reservando desde su teléfono mientras empacaba.",
            },
          ],
        },
        6: { type: "h3", text: "Tres objetivos" },
        7: {
          type: "objectives",
          items: [
            { emoji: "📈", label: "Macro", sub: "Posicionar a MovingPlace como una solución de primer nivel y abrir el camino a una rentabilidad sostenible." },
            { emoji: "🏷️", label: "Negocio", sub: "Posicionar la marca como líder de categoría, crecer participación de mercado y retener a los clientes que ya teníamos." },
            { emoji: "🧭", label: "UX", sub: "Construir una plataforma centrada en el usuario que priorice usabilidad, confianza y precios visibles." },
          ],
        },
      },
    },
    research: {
      label: "Investigación y análisis",
      heading: "Escuchar antes de rediseñar.",
      blocks: {
        0: {
          type: "p",
          text: "Antes de abrir Figma, pasé ocho días investigando — más de 30 competidores, una encuesta a consumidores y entrevistas con gente que había contratado un servicio completo de mudanza en los últimos seis meses.",
        },
        1: {
          type: "statPills",
          items: [
            { value: "30+", label: "competidores analizados" },
            { value: "22", label: "hallazgos de prueba" },
            { value: "3", label: "personas clave" },
            { value: "8d", label: "sprint de investigación" },
          ],
        },
        2: {
          type: "image",
          src: "/case-studies/mp/research/benchmark.gif",
          alt: "Tablero de benchmark competitivo con más de 30 servicios de mudanza",
          caption: "Más de 30 competidores mapeados por transparencia de precios, longitud de flujo y señales de confianza.",
        },
        3: {
          type: "image",
          src: "/case-studies/mp/research/personas.png",
          alt: "Tres personas de usuario para MovingPlace",
          caption: "Tres personas anclaron cada decisión de flujo aguas abajo.",
        },
        4: {
          type: "p",
          text: "El hallazgo era bastante obvio en retrospectiva: las empresas que mostraban el precio al frente convertían. Las que lo escondían detrás de un formulario, no.",
        },
      },
    },
    strategy: {
      label: "Estrategia y exploración",
      heading: "Mapea el árbol de decisiones antes de tocar pixeles.",
      blocks: {
        0: {
          type: "p",
          text: "Seis recorridos de reserva en borrador. Tres días de pizarra blanca. Lo primero que había que cerrar no era la marca — era la lógica. ¿Qué tipo de servicio? ¿Qué distancia? ¿De qué se construye la cotización?",
        },
        1: { type: "h3", text: "Desglosando la lógica de reserva" },
        2: {
          type: "p",
          text: "Una mudanza tiene tres trabajos distintos: solo carga para quien maneja su propio camión, servicio completo para quien quiere todo resuelto, y larga distancia para cualquier cosa más allá de 40 millas. Cada uno tiene preguntas diferentes, un checkout distinto y un riesgo distinto. Mapeamos los tres y encontramos las ramas donde un solo flujo podía manejar todos — divulgación progresiva, mostrando la complejidad solo cuando el usuario realmente la necesitaba.",
        },
        3: {
          type: "image",
          src: "/case-studies/mp/strategy/decision-tree.png",
          alt: "Árbol de decisiones completo del flujo de reserva con todos los tipos de servicio y puntos de decisión",
          caption: "Árbol completo: tipo de servicio → umbral de distancia → artículos → fecha/hora → cotización → confirmar.",
          wide: true,
          fit: "natural",
        },
        4: { type: "h3", text: "El principio al que regresábamos una y otra vez" },
        5: {
          type: "p",
          text: "Precio al frente. Cada borrador que enterraba el precio detrás de un formulario perdía gente. El flujo ganador pone una cotización personalizada frente al usuario lo más temprano posible — primero las direcciones, segundo el tipo de servicio, tercero el precio — para que sepa en qué se está metiendo antes de entregar sus datos personales.",
        },
        6: {
          type: "statPills",
          items: [
            { value: "6+", label: "recorridos borrador" },
            { value: "3d", label: "sprint de ideación" },
          ],
        },
        7: { type: "h3", text: "Dos direcciones de marca" },
        8: {
          type: "p",
          text: "Con el flujo cerrado, exploramos dos direcciones para envolverlo en una marca.",
        },
        9: {
          type: "conceptTabs",
          items: [
            {
              src: "/case-studies/mp/strategy/concept-a.webp",
              alt: "Concepto A — Dirección de marca derivada de HireAHelper",
              label: "Concepto A — Spin-off de HireAHelper",
              description: "Hereda señales visuales de la marca matriz — posicionamiento familiar, paleta reconocible. Un punto de partida seguro.",
            },
            {
              src: "/case-studies/mp/strategy/concept-b.avif",
              alt: "Concepto B — Nueva dirección de marca minimalista, ganadora",
              label: "Concepto B — Nueva marca minimalista",
              description: "Paleta neutra, identidad enfocada en tipografía, se sostenía completamente por sí sola. Se probó como más confiable y permitió que MovingPlace construyera su propia reputación.",
              winner: true,
            },
          ],
        },
      },
    },
    brand: {
      label: "Identidad de marca",
      heading: "Nació una nueva MovingPlace.",
      blocks: {
        0: {
          type: "p",
          text: "Liderazgo tomó la decisión de tercerizar el rebrand a una agencia especializada — lo que pausó nuestro trabajo de UI mientras ellos hacían investigación de consumidor, exploraban conceptos y cerraban la identidad. La paleta amarilla vibrante, el logotipo, el lenguaje de motion — todo salió de ese proceso.",
        },
        1: {
          type: "carousel",
          aspect: "3/2",
          items: [
            { src: "/case-studies/mp/brand/1.avif", alt: "Vista general de la identidad de marca de MovingPlace", caption: "Vista general de marca" },
            { src: "/case-studies/mp/brand/2.avif", alt: "Variantes del logotipo de MovingPlace", caption: "Logotipo" },
            { src: "/case-studies/mp/brand/3.avif", alt: "Paleta de color de MovingPlace", caption: "Paleta de color" },
            { src: "/case-studies/mp/brand/4.avif", alt: "Sistema tipográfico de MovingPlace", caption: "Tipografía" },
            { src: "/case-studies/mp/brand/5.avif", alt: "Motion e iconos de MovingPlace", caption: "Motion e iconos" },
          ],
        },
      },
    },
    platform: {
      label: "Identidad de plataforma",
      heading: "Construido para inspirar confianza a primera vista.",
      blocks: {
        0: {
          type: "p",
          text: "Mientras diseñaba el flujo de reserva, colaboré de cerca con los equipos de marketing y producto para elevar cada aspecto de la UI y UX del sitio — home, blog, landing pages geo-segmentadas y varios subcomponentes — todo escalable y listo para integrarse al CMS.",
        },
        1: {
          type: "p",
          text: "Con el manual de marca finalizado, rellenamos las plantillas pre-diseñadas con los nuevos tokens y assets. El resultado fue una experiencia moderna y coherente, hecha a la medida del cliente objetivo: confiable a primera vista, clara sobre lo que entrega MovingPlace.",
        },
        2: {
          type: "image",
          src: "/case-studies/mp/platform-new-home.webp",
          alt: "Nueva home de MovingPlace con la identidad de marca aplicada",
          wide: true,
          caption: "Home — tokens de marca aplicados al punto principal de entrada al flujo de reserva.",
        },
      },
    },
    ux: {
      label: "Diseño UX/UI",
      heading: "Mejorando el flujo de reserva",
      blocks: {
        0: {
          type: "p",
          text: "Desarrollamos y refinamos un nuevo flujo de reserva, probándolo en HireAHelper mientras MovingPlace se preparaba. Una vez que los diseños finales recibieron aprobación, observamos su desempeño comparado con su empresa hermana, HAH. Ambas plataformas hoy usan la misma estructura de embudo de reserva.",
        },
        1: {
          type: "p",
          text: "Mientras la mayoría de los competidores entregaba una sola cotización después de múltiples pasos, nosotros buscábamos entregar una experiencia más completa y flexible ofreciendo tres niveles distintos de servicio — Good, Better, Best. Esto se alineaba con nuestras personas diversas y estableció nuestra diferenciación competitiva.",
        },
        2: {
          type: "statPills",
          items: [
            { value: "22", label: "hallazgos de pruebas de usuario" },
            { value: "6 pasos", label: "flujo de reserva" },
            { value: "38 → 80%", label: "tasa de finalización" },
          ],
        },
        3: {
          type: "phoneFlow",
          heading: "Flujo de reserva",
          description: "Aunque MovingPlace y HireAHelper comparten algunas similitudes en su enfoque de embudo de reserva, no son idénticos. MovingPlace se diferencia al introducir una nueva funcionalidad que permite a los usuarios elegir entre tres niveles distintos de servicio.",
          mobileImage: "/case-studies/mp/ux/17.png",
          mobileAlt: "Flujo de reserva de MovingPlace — los 8 pasos desde la home hasta la confirmación",
          items: [
            { label: "Home", description: "Indica las ubicaciones de tu mudanza y la fecha preferida.", src: "/case-studies/mp/ux/1.png", alt: "Pantalla de home de MovingPlace" },
            { label: "Detalles de la mudanza", description: "Ajusta el tamaño de tu mudanza para que podamos entregar el mejor resultado.", src: "/case-studies/mp/ux/2.png", alt: "Pantalla del formulario de detalles de la mudanza" },
            { label: "Artículos pesados", description: "¿Tienes artículos pesados que mover? Cuéntanos los requerimientos específicos.", src: "/case-studies/mp/ux/3.png", alt: "Pantalla de selección de artículos pesados" },
            { label: "Selecciona tu plan", description: "Elige entre 3 niveles distintos de experiencia según tu presupuesto.", src: "/case-studies/mp/ux/4.avif", alt: "Pantalla de selección de plan de servicio" },
            { label: "Obtén cotización", description: "Obtén múltiples cotizaciones y compara proveedores para personalizar tu experiencia.", src: "/case-studies/mp/ux/5.png", alt: "Pantalla de comparación de cotizaciones" },
            { label: "Hora y contacto", description: "¡Ya casi! Selecciona la hora de llegada y proporciona tus datos de contacto.", src: "/case-studies/mp/ux/6.png", alt: "Pantalla de hora y datos de contacto" },
            { label: "Checkout", description: "Agrega un método de pago para completar tu mudanza.", src: "/case-studies/mp/ux/7.png", alt: "Pantalla de pago en checkout" },
            { label: "Confirmación", description: "Contrata cargadores eficientes y amables para empacar, cargar, descargar o reacomodar tu espacio a tiempo.", src: "/case-studies/mp/ux/8.png", alt: "Pantalla de confirmación de reserva" },
          ],
        },
        4: {
          type: "p",
          text: "La tasa de finalización pasó del 38% al 80% en el primer mes. Pero el número que realmente me importaba fue la caída del 40% en tickets de soporte del tipo \"¿cómo funciona esto?\".",
        },
        5: { type: "h3", text: "Probando cómo personalizar una cotización" },
        6: {
          type: "p",
          text: "Probamos dos patrones de personalización: un modal que mantenía todo compacto pero escondía opciones detrás de un clic, y un editor en línea que ponía todo en contexto. Contra todo pronóstico — y contra las apuestas de casi todo el equipo — la Versión B, el editor en línea, salió arriba: mejores puntajes de confianza en las pruebas y más cotizaciones completadas.",
        },
        7: {
          type: "conceptTabs",
          items: [
            {
              src: "/case-studies/mp/ux/customize-quote-a.png",
              alt: "Versión A — Personalizador con modal que escondía opciones detrás de un clic",
              label: "Versión A — Con modal",
              tabLabel: "Versión A",
              description: "Layout compacto, pero las opciones de personalización estaban detrás de un modal — el usuario tenía que comprometerse a un clic antes de ver qué estaba cambiando.",
            },
            {
              src: "/case-studies/mp/ux/customize-quote-b.png",
              alt: "Versión B — Editor en línea con cada opción visible en contexto (ganadora)",
              label: "Versión B — Editor en línea",
              tabLabel: "Versión B",
              description: "Cada opción visible en contexto. Mejores puntajes de confianza en las pruebas y más cotizaciones completadas — esta es la versión que enviamos a producción.",
              winner: true,
            },
          ],
        },
        8: {
          type: "p",
          text: "Algo que vale la pena mencionar antes de seguir: las diferencias sutiles que notarás entre las capturas y los ejemplos de flujo a lo largo de este caso no son accidentes. Reflejan los A/B tests continuos que corrieron entre los cambios grandes de diseño — cada vez que aterrizábamos en un ganador, probábamos variaciones más pequeñas encima (copy, layout, valores por defecto, etiquetas) para seguir afinando la decisión. El producto final es el resultado acumulado de esas micro-iteraciones, no de un solo rediseño.",
        },
        9: {
          type: "sectionBreak",
          src: "/case-studies/mp/ux/big-break.png",
          alt: "Flujo de reserva de MovingPlace — recap visual del UX rediseñado",
        },
      },
    },
    cms: {
      label: "CMS y sistema de diseño",
      heading: "Diseñamos patrones a nivel atómico que se combinan en plantillas.",
      blocks: {
        0: {
          type: "p",
          text: "Una vez cerrado el flujo de reserva, nos fuimos al sistema de diseño. Tailwind nos dio una base sólida — tokens y componentes que podíamos reutilizar en todo el sitio, no solo en checkout.",
        },
        1: {
          type: "p",
          text: "Pero la jugada grande fue el front del sitio. Ya habíamos wireframeado un stack de plantillas desde el inicio — páginas de ciudad, páginas de estado, páginas de servicio — todas construidas alrededor de SEO y linking interno.",
        },
        2: {
          type: "statPills",
          items: [
            { value: "+14", label: "landing pages a nivel CMS" },
            { value: "Tailwind", label: "Componentes basados en" },
          ],
        },
        3: {
          type: "image",
          src: "/case-studies/mp/cms/image1.png",
          alt: "CMS y sistema de diseño de MovingPlace — imagen 1",
        },
        4: {
          type: "image",
          src: "/case-studies/mp/cms/image2.png",
          alt: "CMS y sistema de diseño de MovingPlace — imagen 2",
        },
        5: {
          type: "p",
          text: "A partir de ahí montamos un sistema modular flexible impulsado por CMS para poder levantar y administrar estas plantillas sin fricción — algo que pudiera escalar con el negocio.",
        },
        6: {
          type: "image",
          src: "/case-studies/mp/cms/image3.png",
          alt: "CMS y sistema de diseño de MovingPlace — imagen 3",
        },
        7: {
          type: "image",
          src: "/case-studies/mp/cms/image4.png",
          alt: "CMS y sistema de diseño de MovingPlace — imagen 4",
        },
        8: { type: "h3", text: "Vista panorámica" },
        9: {
          type: "p",
          text: "A lo largo del proyecto, el trabajo se movió por tres fases — descubrimiento, estrategia y soluciones — con cada corriente traslapándose con la siguiente. La investigación alimentó al branding, el branding al wireframing, el wireframing al UX/UI, y el sistema de diseño creció debajo de todo.",
        },
        10: {
          type: "image",
          src: "/case-studies/mp/timeline.png",
          alt: "Línea del tiempo del proyecto MovingPlace — Descubrimiento, Estrategia, Soluciones",
          caption: "Línea del tiempo del proyecto — del descubrimiento hasta el sistema de diseño.",
        },
      },
    },
  },
};
