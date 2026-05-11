export interface CaseStudy {
  id: string;
  title: string;
  shortTitle: string;
  company: string;
  year: string;
  role: string;
  deliverables: string;
  tagline: string;
  cover: string;
  accent: string;
  size: "large" | "wide" | "tall" | "small";
  metrics: { label: string; value: string }[];
  overview: string;
  challenge: string;
  tags: string[];
  images: string[];
  url: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "mp",
    title: "Redesigning The Moving Experience",
    shortTitle: "MovingPlace",
    company: "Porch Moving Group",
    year: "2024 – 2025",
    role: "UX Design, Creative Direction",
    deliverables: "Optimized Experience, CMS Dev, Design System",
    tagline: "Moving simplified.",
    cover: "/case-studies/mp-cover.png",
    accent: "#f59e0b",
    size: "large",
    metrics: [
      { label: "Competitors analyzed", value: "30+" },
      { label: "User testing insights", value: "22" },
      { label: "CMS landing pages", value: "14+" },
      { label: "Booking flow steps", value: "6-step" },
    ],
    overview:
      "Faced with a competitive market and high user drop-off rates, MovingPlace needed a modernized design to streamline booking, improve transparency, and increase conversion. Through in-depth user research, persona analysis, and competitor benchmarking, we identified key pain points including unclear pricing and a complex booking flow. The redesign simplified interactions with a clear, intuitive booking system while establishing a cohesive brand identity.",
    challenge:
      "The original site attempted to collect a myriad of information in challenging-to-navigate boxes. After submitting a quote, users had to wait for a CSR to call them — not the ideal experience for a digital-first audience.",
    tags: ["UX Design", "Creative Direction", "Design System", "CMS"],
    images: ["/case-studies/mp-01.png", "/case-studies/mp-02.png", "/case-studies/mp-03.png", "/case-studies/mp-04.png"],
    url: "https://www.rodriwu.com/mp",
  },
  {
    id: "pp",
    title: "Moving Permits: Turning Bureaucracy Into Trust",
    shortTitle: "PermitPuller",
    company: "Porch Moving Group",
    year: "2023 – 2024",
    role: "UX Design, UI Design",
    deliverables: "Optimized Experience, Booking Flow",
    tagline: "Permits, painlessly.",
    cover: "/case-studies/pp-cover.png",
    accent: "#6366f1",
    size: "tall",
    metrics: [
      { label: "Form completion rate", value: "38% → 80%" },
      { label: "Faster fulfillment", value: "18%" },
      { label: "User satisfaction", value: "91%" },
      { label: "Repeat clients", value: "80%+" },
    ],
    overview:
      "A comprehensive redesign of PermitPuller, a platform for securing moving permits across US cities. The legacy system featured a daunting single-page form with 22+ fields and no status updates, leading to abandonment and frustration. The new flow guides users step-by-step through location, permit type, timeline, and add-ons — with a transparent dashboard and real-time notifications.",
    challenge:
      "Users faced a monolithic form, frequent mistakes from misunderstood fields, and felt ghosted after submitting. The redesign replaced this with a structured 5-step flow that reduced support queries by 40%.",
    tags: ["UX Design", "UI Design", "Booking Flow", "B2C"],
    images: ["/case-studies/pp-01.png", "/case-studies/pp-02.png", "/case-studies/pp-03.png"],
    url: "https://www.rodriwu.com/pp",
  },
  {
    id: "hah",
    title: "HireAHelper: Conversion Redesign",
    shortTitle: "HireAHelper",
    company: "Porch Moving Group",
    year: "2024 – 2025",
    role: "UX Design, Creative Direction",
    deliverables: "Optimized Experience, CMS Dev, Design System",
    tagline: "From good to great.",
    cover: "/case-studies/hah-cover.png",
    accent: "#0ea5e9",
    size: "wide",
    metrics: [
      { label: "User interviews", value: "11" },
      { label: "Interaction recordings", value: "200+" },
      { label: "Competitors evaluated", value: "22" },
      { label: "CMS landing pages", value: "14+" },
    ],
    overview:
      "HireAHelper has connected people with moving services across the US since 2015. After rapid growth, the platform needed a simpler, faster, more reliable experience. Through three iterative MVPs — from a marketplace redesign to a full booking funnel — we overhauled the UI, rebuilt the design system on Tailwind/Flowbite, and revamped checkout from a simple modal to a comprehensive summary with multiple payment options.",
    challenge:
      "Users expressed confusion over filters, criticized the outdated visual style (unchanged since 2017), and found the booking process unnecessarily long. The value proposition failed to resonate with user expectations.",
    tags: ["UX Design", "Creative Direction", "Design System", "Conversion"],
    images: ["/case-studies/hah-01.png", "/case-studies/hah-02.png", "/case-studies/hah-03.png", "/case-studies/hah-04.png"],
    url: "https://www.rodriwu.com/hah",
  },
  {
    id: "hdmn",
    title: "New SMS Chat Feature For Phone Agents",
    shortTitle: "Hahdmin",
    company: "Porch Moving Group",
    year: "2021",
    role: "UX Design",
    deliverables: "SMS Feature, User Flow",
    tagline: "One hub. All channels.",
    cover: "/case-studies/hdmn-cover.png",
    accent: "#10b981",
    size: "small",
    metrics: [
      { label: "CSRs interviewed", value: "5" },
      { label: "Days of research", value: "7" },
      { label: "Support queries reduction", value: "Significant" },
    ],
    overview:
      "The Hahdmin dashboard required CSRs to juggle multiple tools for SMS, email, and calls — creating inefficiency and slow response times. We developed a unified chat feature integrating SMS and email directly into the existing platform, with a native notification system and color-coded conversation hierarchy for customers, movers, and agents.",
    challenge:
      "Agents had to switch between apps constantly, leading to delays and frustrated customers. The new SMS modal activates from existing CTAs throughout the dashboard and supports multiple simultaneous modals across different admin views.",
    tags: ["UX Design", "Internal Tools", "SMS", "Workflow"],
    images: ["/case-studies/hdmn-01.png", "/case-studies/hdmn-02.png", "/case-studies/hdmn-03.png"],
    url: "https://www.rodriwu.com/hdmn",
  },
];
