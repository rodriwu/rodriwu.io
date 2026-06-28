import type { CaseBlock } from "../caseStudies";
import type { CaseTextOverride } from "../caseStudies.i18n";

export const BODYBAR_ES: CaseTextOverride = {
  title: "Diseñando Ads Que Venden Franquicias",
  shortTitle: "BODYBAR Pilates",
  tagline: "Ads pensados para inversionistas, no solo para fans.",
  overview:
    "BODYBAR Pilates necesitaba más que altas en el gimnasio. Necesitaba inversionistas calificados listos para abrir una franquicia. Lideré la estrategia de diseño en Meta, Google y LinkedIn: benchmark de competencia, tres perfiles de inversionista y master designs por componentes que dejaban al equipo adaptar rápido en cada canal.",
  challenge:
    "Las agencias anteriores generaban clicks pero erraban el objetivo real. BODYBAR vende franquicias, no membresías. La creatividad tenía que hablarle a inversionistas, no a fans del fitness, y solo un ángulo realmente lo lograba.",
  role: "Diseñador Líder",
  deliverables: "Creatividad publicitaria, Meta, PPC, LinkedIn",
  tags: ["Creatividad Publicitaria", "Meta", "PPC", "Estrategia de Marca"],
  kinds: ["ADS", "MARCA"],
  metrics: [
    { label: "Leads generados", value: "567" },
    { label: "Impresiones en Google", value: "276K+" },
    { label: "Calificación de leads orgánicos", value: "78 a 80%" },
    { label: "Único ángulo de Meta que convirtió", value: "Power Couples" },
  ],
  conclusion: {
    quote:
      "Cinco meses de campañas nos dieron más que leads. Nos dieron un mapa claro de qué convierte y qué no. Ese es el tipo de output que sí cambia cómo una marca gasta su próximo dólar.",
    body: "El insight de Power Couples por sí solo valió todo el proyecto. La buena estrategia creativa se paga sola.",
    signoff: "¡Gracias por leer!",
  },
  sections: {
    snapshot: {
      label: "Resumen",
      heading: "El trabajo de un vistazo.",
      blocks: {
        0: {
          text: "BODYBAR Pilates necesitaba gente lista para invertir en abrir un estudio, no solo más altas en el gimnasio. Lideré la estrategia de diseño que convirtió el gasto en ads en leads de inversionistas calificados. Cinco meses de campañas, 567 leads y (más importante) un mapa claro de qué convierte de verdad.",
        },
        1: {
          items: [
            { value: "567", label: "Leads generados", sub: "Febrero a junio de 2026 en todos los canales." },
            { value: "276K+", label: "Impresiones en Google", sub: "$25,119 invertidos. Search y PMax generando leads calificados." },
            { value: "78 a 80%", label: "Tasa de calificación orgánica", sub: "Sitio de franquicias y búsqueda orgánica vs. ~23 a 27% del paid amplio." },
            { value: "Power Couples", label: "Audiencia de Meta con mejor desempeño", sub: "Ángulo ganador: 56 leads, 4 inversionistas calificados. Ningún otro creativo se acercó." },
          ],
        },
      },
    },
    challenge: {
      label: "Reto",
      heading: "Vender franquicias, no membresías.",
      blocks: {
        0: {
          text: "BODYBAR vende franquicias de Pilates. El objetivo real no son las membresías; es encontrar gente calificada que quiera ser dueña de un estudio. Las agencias anteriores no lo veían. Sus campañas generaban clicks e impresiones, pero los leads nunca empataban con lo que BODYBAR realmente vendía: una oportunidad de inversión seria.",
        },
        1: {
          text: "Necesitábamos creatividad que le hablara a inversionistas, no a fans del fitness. Eso significaba entender quiénes eran realmente esos inversionistas antes de tocar un solo ad.",
        },
        2: { text: "Qué no estaba funcionando" },
        3: {
          items: [
            "Creatividad apuntada a entusiastas del fitness, no a inversionistas de franquicia",
            "Mucho volumen de clicks con baja calidad de leads",
            "Sin claridad sobre qué canales o ángulos producían inversionistas serios",
            "Sin framework de personas; todas las audiencias tratadas igual",
            "Variantes de ad rehechas desde cero en lugar de componentizadas para velocidad",
          ],
        },
      },
    },
    research: {
      label: "Investigación y Personas",
      heading: "Conocer al inversionista antes de diseñar el ad.",
      blocks: {
        0: {
          text: "BODYBAR llegó con insights internos de su base actual de inversionistas: los perfiles, rasgos y patrones de la gente que había firmado y escalado. Ese conocimiento enmarcó la investigación desde el día uno y nos mantuvo enfocados en las audiencias que sí convierten.",
        },
        1: {
          text: "De ahí construimos un benchmark de competencia en Figma, desglosando cómo otras marcas de fitness y franquicias corrían sus ads: mensajes, visuales, ofertas y tono. Eso nos dio un mapa claro de la categoría y mostró dónde BODYBAR podía destacar en lugar de mimetizarse.",
        },
        2: {
          alt: "Tablero de benchmark de competencia en Figma con desglose de ads y anotaciones",
          caption: "Fig. 01. Auditoría de competencia en Figma: mensaje, visuales, oferta y tono en marcas de fitness y franquicia.",
        },
        3: {
          alt: "Síntesis de investigación de personas en Figma: rasgos, motivaciones y ángulos de ad por tipo de inversionista",
          caption: "Fig. 02. Síntesis de personas. Cada perfil se volvió una dirección creativa distinta.",
        },
        4: { text: "Tres perfiles de inversionista" },
        5: {
          text: "La investigación apuntó a tres audiencias que valía la pena diseñar. Tres perfiles, tres ángulos, tres direcciones creativas.",
        },
        6: {
          items: [
            {
              glyph: "exec",
              name: "El Ejecutivo Corporativo",
              profile: "Líder corporativo senior: CEO, VP, Director.",
              motivation: "Harto de la rutina de 80 horas. Quiere ser dueño.",
              financials: "$2M a $6M+ de patrimonio neto. Alta liquidez.",
              photoAlt: "Retrato del perfil del ejecutivo corporativo",
            },
            {
              glyph: "couple",
              name: "La Power Couple",
              profile: "Pareja casada con habilidades complementarias.",
              motivation: "Construir un negocio familiar. Ganar un mercado local.",
              financials: "$2M a $16M+ combinados. Autofinanciados o SBA.",
              photoAlt: "Retrato del perfil de la power couple",
            },
            {
              glyph: "passion",
              name: "El Apasionado",
              profile: "Practicante de Pilates y wellness de toda la vida.",
              motivation: "Convertir el estilo de vida en su forma de vida.",
              financials: "$500k a $1.5M. SBA, rollover de 401k o familia.",
              photoAlt: "Retrato del perfil del apasionado",
            },
          ],
        },
      },
    },
    design: {
      label: "Diseño y Producción",
      heading: "Construido para entregar, cada mes.",
      blocks: {
        0: {
          text: "Esto no era una campaña aislada. El equipo necesitaba un sistema que siguiera produciendo sin frenarse. Así que lo construimos.",
        },
        1: {
          text: "La estrategia arrancó donde terminó la investigación. Tres personas, tres ángulos por drop. Cada batch mensual sale como tres sets, uno por persona, cada uno construido alrededor de su propio mensaje y audiencia.",
        },
        2: {
          text: "Para mantener todo en orden conforme creció el volumen, fijamos una base de nomenclatura temprano: batch, persona, ad. Así 4.2.1 se lee como batch 4, persona 2, ad 1. Sin adivinanzas cuando un archivo cae en Slack o en una ronda de feedback, sin assets desencajados en producción.",
        },
        3: {
          text: "Cada ángulo arranca como un concepto master en un solo archivo de Figma: imagen hero, headline, sub-headline, copy, línea legal, isotipo, CTA. De ahí en adelante es adaptación, no rediseño.",
        },
        4: {
          alt: "Cuadrícula de conceptos master de ads BODYBAR: imagen hero, headline, sub-headline, copy, legal, CTA por ángulo",
          caption: "Fig. 03. Conceptos master en Figma. Una sola fuente de verdad por ángulo de persona.",
        },
        5: { text: "Un master, todos los canales" },
        6: {
          text: "Cada master tiene que vivir en PPC (Google), Meta y LinkedIn. Diferentes proporciones, zonas seguras, límites de caracteres, disclosures legales. Lo que se lee en 1080×1080 se rompe en un leaderboard 728×90. Afinamos cada uno para que el headline siga ganando el primer scroll-stop.",
        },
        7: {
          items: [
            "PPC / Google: responsive search ads más display banners (leaderboard, MPU, half-page, skyscraper).",
            "Meta: feed 1:1, vertical 4:5, stories y reels 9:16. Variantes de imagen y video por ángulo de persona.",
            "LinkedIn: ads de imagen única y document ads, dimensionados para el feed profesional y la audiencia de inversión.",
            "Legal: copy de disclosure de franquicia y líneas en letra chica afinadas por canal y geografía.",
            "Legibilidad: tamaños de tipografía, contraste y jerarquía reajustados por formato para que nada se pierda.",
          ],
        },
        8: {
          items: [
            { label: "Meta", caption: "Variantes para Meta: feed, vertical, stories, reels, todos los tamaños." },
            { label: "PPC", caption: "Variantes de display de Google en todas las proporciones de banner." },
          ],
        } as Partial<CaseBlock>,
        9: { text: "Construido para escalar" },
        10: {
          text: "Cada master es un sistema de componentes anidados. Headline, sub-headline, copy, línea legal, CTA, isotipo, slot de foto, todas son instancias de componentes base. Los frames por canal reutilizan esas mismas instancias con auto-layout y constraints.",
        },
        11: {
          text: "Cambias el master una vez y cada variante se actualiza. Cambias una foto hero, reescribes un CTA, sacas decenas de placements sin tocar archivos individuales. Cuando legal pide un cambio de una palabra en el disclosure de franquicia, aterriza en cada formato en segundos.",
        },
        12: {
          text: "Esto es lo que hace que la cadencia funcione: un nuevo set de 20 ads al mes desde abril, con adaptaciones completas de proporciones en PPC, Meta y LinkedIn. Mismo sistema, ángulo nuevo cada mes.",
        },
        13: { text: "IA en el flujo" },
        14: {
          text: "La IA aceleró las partes lentas en ambos extremos. Investigación: escaneo más rápido de competencia, síntesis de audiencia, encuadre de personas. Producción: assets gráficos de apoyo, tratamientos alternos del hero y (lo más útil) exportación automatizada de cada variante de componente al tamaño, proporción y peso correcto por canal. Nadie clickeando el panel de export de Figma un ad a la vez.",
        },
        15: {
          text: "Más tiempo en criterio creativo. Menos en el trabajo repetitivo.",
        },
      },
    },
    results: {
      label: "Resultados",
      heading: "567 leads y un roadmap.",
      blocks: {
        0: {
          text: "567 leads en cinco meses. Pero el resultado más valioso fue claridad sobre lo que realmente funciona: qué ángulos convierten, qué canales califican y dónde poner el presupuesto a continuación.",
        },
        1: {
          items: [
            { value: "567", label: "leads totales" },
            { value: "4", label: "calificados de Power Couples" },
            { value: "0", label: "calificados del resto de creativos en Meta" },
            { value: "78 a 80%", label: "tasa de calificación orgánica" },
            { value: "~23 a 27%", label: "tasa de calificación del paid amplio" },
          ],
        },
        2: {
          alt: "Ad de BODYBAR en un feed real de iPhone",
        },
        3: { text: "Qué significa esto" },
        4: {
          items: [
            "Escalar el creativo de Power Couples; es el único ángulo de Meta con output calificado",
            "Cortar los canales que traen volumen pero ningún inversionista calificado",
            "Doblar la apuesta en el sitio de franquicias y el orgánico: 78 a 80% de calificación vs. 23 a 27% del paid amplio",
            "Search y Performance Max (no Display) son los que están trayendo los leads calificados de Google",
          ],
        },
        5: {
          text: "Por primera vez, el gasto en ads de BODYBAR estaba atado directamente al objetivo que importa: vender más franquicias.",
        },
      },
    },
  },
};
