// Trayectoria, formación y habilidades: una única fuente para "Sobre mí" y para el CV en PDF
// (specs/010-experience-and-web-cv). Los textos vienen de los CV originales de Victor.
// Nunca incluir aquí teléfono ni dirección postal (R4).
import type { Lang } from '@/i18n/ui';

export type Localized<T = string> = Record<Lang, T>;

/** 'YYYY-MM'. `null` en `end` significa "actualidad". */
type YearMonth = `${number}-${string}`;

export interface Role {
  title: Localized;
  start: YearMonth;
  end: YearMonth | null;
  highlights: Localized<string[]>;
}

export interface Job {
  company: string;
  location: Localized;
  sector: Localized;
  roles: Role[];
}

export interface Education {
  institution: string;
  location?: Localized;
  degree: Localized;
  detail?: Localized;
  start?: YearMonth;
  end: YearMonth;
  /** false = se muestra en la web pero no en el CV en PDF (R5). */
  inCv: boolean;
}

export interface SkillGroup {
  label: Localized;
  items: Localized<string[]>;
}

export const cv = {
  headline: {
    es: 'Ingeniero de IA · Ingeniero de Machine Learning',
    en: 'AI Engineer · Machine Learning Engineer',
  } satisfies Localized,

  /** Solo ciudad y país, nunca la dirección. */
  location: { es: 'Caracas, Venezuela', en: 'Caracas, Venezuela' } satisfies Localized,

  summary: {
    es: 'Profesional de Datos e Inteligencia de Negocios con más de 5 años de experiencia en BI, análisis de datos y soporte técnico, ampliando mi perfil hacia la Ingeniería de IA y Machine Learning. Construyo modelos predictivos, trabajo con modelos de lenguaje (LLMs) y pipelines de Generación Aumentada por Recuperación (RAG), y aplico prácticas modernas de desarrollo (Docker, Git/GitHub, Desarrollo Guiado por Especificaciones) para entregar soluciones confiables basadas en datos. Traduzco datos complejos en información accionable en los sectores fintech, salud e industrial.',
    en: 'Data and Business Intelligence professional with 5+ years of experience across BI, analytics and technical support, now expanding into AI and Machine Learning engineering. I build predictive models, work with Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) pipelines, and apply modern software practices (Docker, Git/GitHub, Spec-Driven Development) to deliver reliable, data-driven solutions. I turn complex data into actionable insights across fintech, healthcare and industrial sectors.',
  } satisfies Localized,

  skills: [
    {
      label: { es: 'IA y Machine Learning', en: 'AI & Machine Learning' },
      items: {
        es: ['Machine Learning', 'Deep Learning', 'LLMs', 'RAG', 'Bases de datos vectoriales', 'IA generativa', 'Desarrollo guiado por especificaciones'],
        en: ['Machine Learning', 'Deep Learning', 'LLMs', 'RAG', 'Vector databases', 'Generative AI', 'Spec-Driven Development'],
      },
    },
    {
      label: { es: 'Programación', en: 'Programming' },
      items: { es: ['Python', 'C#', 'Docker', 'Git', 'GitHub'], en: ['Python', 'C#', 'Docker', 'Git', 'GitHub'] },
    },
    {
      label: { es: 'BI y datos', en: 'BI & data' },
      items: {
        es: ['Power BI', 'Tableau', 'SQL Server', 'Excel', 'Google Sheets'],
        en: ['Power BI', 'Tableau', 'SQL Server', 'Excel', 'Google Sheets'],
      },
    },
    {
      label: { es: 'Otros', en: 'Other' },
      items: { es: ['Postman', 'Zendesk', 'SAP'], en: ['Postman', 'Zendesk', 'SAP'] },
    },
    {
      label: { es: 'Idiomas', en: 'Languages' },
      items: { es: ['Español (nativo)', 'Inglés (avanzado)'], en: ['Spanish (native)', 'English (advanced)'] },
    },
  ] satisfies SkillGroup[],

  experience: [
    {
      company: 'PengCorp',
      location: { es: 'Calgary, Canadá · remoto', en: 'Calgary, Canada · remote' },
      sector: { es: 'Inteligencia de negocio', en: 'Business intelligence' },
      roles: [
        {
          title: { es: 'Especialista en Inteligencia de Negocios Operacional', en: 'Operational Business Intelligence Specialist' },
          start: '2025-01',
          end: null,
          highlights: {
            es: [
              'Diseño técnico, programación, pruebas, implementación, mantenimiento y soporte de las actividades de BI.',
              'Diseño y desarrollo de soluciones analíticas de datos con herramientas de BI como Power BI.',
            ],
            en: [
              'Technical design, coding, testing, implementation, maintenance and support for BI activities.',
              'Design and development of analytical data solutions with BI tools such as Power BI.',
            ],
          },
        },
      ],
    },
    {
      company: 'Digisalud',
      location: { es: 'Caracas, Venezuela', en: 'Caracas, Venezuela' },
      sector: { es: 'Salud y agritech', en: 'Healthcare & agritech' },
      roles: [
        {
          title: { es: 'Analista de Datos', en: 'Data Analyst' },
          start: '2024-06',
          end: '2025-01',
          highlights: {
            es: [
              'Integración de información basada en datos con equipos multifuncionales, usando Tableau.',
              'Redes neuronales para aumentar la productividad de la caña de azúcar: modelos predictivos que mejoraron de forma significativa la toma de decisiones en operaciones agrícolas.',
            ],
            en: [
              'Worked with cross-functional teams to integrate data-driven insights using Tableau.',
              'Neural networks to increase sugarcane productivity: predictive models that significantly improved decision-making in agricultural operations.',
            ],
          },
        },
      ],
    },
    {
      company: 'Ugami',
      location: { es: 'Key Biscayne, EE. UU. · remoto', en: 'Key Biscayne, FL · remote' },
      sector: { es: 'Fintech', en: 'Fintech' },
      roles: [
        {
          title: { es: 'Gerente de Operaciones', en: 'Operations Manager' },
          start: '2022-12',
          end: '2024-05',
          highlights: {
            es: [
              'Cumplimiento normativo en fintech: implementación de procedimientos y regulaciones.',
              'Análisis de datos de los tickets de soporte con Python, Google Sheets y Tableau.',
            ],
            en: [
              'Fintech compliance: implementation of procedures and regulations.',
              'Data analysis of customer support tickets using Python, Google Sheets and Tableau.',
            ],
          },
        },
        {
          title: { es: 'Analista de Soporte al Cliente', en: 'Customer Support Analyst' },
          start: '2022-03',
          end: '2022-12',
          highlights: {
            es: ['Detección de problemas técnicos en la app de Ugami y análisis de datos de las solicitudes de clientes.'],
            en: ['Identified technical issues in the Ugami app and analysed customer request data.'],
          },
        },
      ],
    },
    {
      company: 'National Oilwell Varco (NOV)',
      location: { es: 'Neuquén, Argentina', en: 'Neuquén, Argentina' },
      sector: { es: 'Petróleo y gas', en: 'Oil & gas' },
      roles: [
        {
          title: { es: 'Analista de Soporte Técnico', en: 'Technical Support Analyst' },
          start: '2020-01',
          end: '2021-07',
          highlights: {
            es: [
              'Reportes y scripts para completación y cementación de pozos con Power BI y C#.',
              'Monitoreo de datos de actividades industriales como el procesamiento de residuos.',
            ],
            en: [
              'Reports and scripts for well completion and cementing activities using Power BI and C#.',
              'Monitored data from industrial activities such as waste processing.',
            ],
          },
        },
      ],
    },
    {
      company: 'Establecimientos Gamar',
      location: { es: 'Tigre, Argentina', en: 'Tigre, Argentina' },
      sector: { es: 'Automotriz', en: 'Automotive' },
      roles: [
        {
          title: { es: 'Analista Comercial', en: 'Commercial Analyst' },
          start: '2018-05',
          end: '2020-01',
          highlights: {
            es: ['Gestión de solicitudes de cotización de autopartes y análisis de la documentación técnica de clientes.'],
            en: ['Managed quotation requests for automotive parts and analysed customer technical documentation.'],
          },
        },
      ],
    },
    {
      company: 'Halliburton',
      location: { es: 'Maturín, Venezuela', en: 'Maturín, Venezuela' },
      sector: { es: 'Petróleo y gas', en: 'Oil & gas' },
      roles: [
        {
          title: { es: 'Ingeniero de Confiabilidad', en: 'Reliability Engineer' },
          start: '2015-01',
          end: '2017-06',
          highlights: {
            es: ['Análisis de causa raíz de fallas e incidentes de calidad de servicio con SAP.'],
            en: ['Root cause analysis of failures and service quality incidents using SAP.'],
          },
        },
        {
          title: { es: 'Ingeniero de Campo L/MWD', en: 'L/MWD Engineer' },
          start: '2008-09',
          end: '2015-01',
          highlights: {
            es: ['Preparación y ensamblaje de herramientas de telemetría y registro para perforación.'],
            en: ['Prepared and assembled telemetry and logging tools for drilling.'],
          },
        },
      ],
    },
  ] satisfies Job[],

  education: [
    {
      institution: 'Pontia',
      degree: {
        es: 'Máster en Inteligencia Artificial, Cloud Computing y DevOps',
        en: 'MSc in Artificial Intelligence, Cloud Computing and DevOps',
      },
      detail: {
        es: 'Trabajo Fin de Máster: Economicon, asistente FinOps multi-tenant.',
        en: 'Master’s thesis: Economicon, a multi-tenant FinOps assistant.',
      },
      end: '2026-10',
      // Pendiente de recibir el título: solo en la web (specs/010 R5).
      inCv: false,
    },
    {
      institution: 'Universidad Central de Venezuela',
      location: { es: 'Caracas, Venezuela', en: 'Caracas, Venezuela' },
      degree: { es: 'Ingeniero de Petróleo', en: 'Petroleum Engineer' },
      detail: {
        es: 'Promedio 15,53/20, segundo de 19 estudiantes de la promoción.',
        en: 'GPA 15.53/20, ranked 2nd out of 19 students.',
      },
      start: '2002-09',
      end: '2008-07',
      inCv: true,
    },
  ] satisfies Education[],
};

/** "sept. 2008", "Sep 2008"… según el idioma; `null` → "actualidad" / "present". */
export function formatYearMonth(value: YearMonth | null, lang: Lang, presentLabel: string): string {
  if (!value) return presentLabel;
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

/** Rango de años de un empleo completo: "2008 – 2017". */
export function jobYears(job: Job, presentLabel: string): string {
  const starts = job.roles.map((r) => r.start).sort();
  const ends = job.roles.map((r) => r.end);
  const first = starts[0].slice(0, 4);
  const last = ends.includes(null) ? presentLabel : ends.filter(Boolean).sort().at(-1)!.slice(0, 4);
  return first === last ? first : `${first} – ${last}`;
}
