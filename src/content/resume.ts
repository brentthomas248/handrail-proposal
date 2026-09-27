interface ResumeExperience {
  role: string;
  organization: string;
  period: string;
  bullets: readonly string[];
}

interface ResumeContribution {
  id: string;
  title: string;
  body: string;
  foundation: string;
}

interface ResumeProof {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

interface ResumeContent {
  name: string;
  title: string;
  preparedFor: string;
  profile: string;
  pdf: string;
  github: string;
  product: string;
  experience: readonly ResumeExperience[];
  earlier: string;
  education: { institution: string; degree: string; graduate: string };
  skills: readonly { label: string; value: string }[];
  contributionTitle: string;
  contributionIntro: string;
  contributions: readonly ResumeContribution[];
  proof: readonly ResumeProof[];
  closing: string;
  labels: {
    experience: string;
    earlier: string;
    education: string;
    skills: string;
    proof: string;
    download: string;
    github: string;
    product: string;
  };
}

/** Public resume copy shared by the page, its print view and PDF verification. */
export const resume = {
  name: 'Brent Showalter',
  title: 'Applied AI, workflow software and customer solutions',
  preparedFor: 'Prepared for Handrail',
  profile:
    'I build practical software around business workflows, using AI-assisted engineering to turn requirements into tested implementations. My background combines a B2B workflow product, forecasting and analytics work, public engineering contributions, and customer-facing sales and operations experience.',
  pdf: 'brent-showalter-handrail-resume.pdf',
  github: 'https://github.com/brentthomas248',
  product: 'https://armsinventory.com',
  experience: [
    {
      role: 'Founder and product builder',
      organization: 'Arms Inventory',
      period: '2024–present',
      bullets: [
        'Built a workflow product that turns vendor PDF invoices and Excel order writeups into structured inventory records, reconciliation and downstream system handoffs.',
        'Designed around inconsistent source data, tenant boundaries, validation and human confirmation before consequential inventory changes.',
        'Developed Python, FastAPI, Pydantic and MongoDB workflows through AI-assisted engineering, with regression checks, operator documentation and POS/FastBound handoffs.',
      ],
    },
    {
      role: 'AI software and analytics',
      organization: 'National Association of Sporting Goods Wholesalers',
      period: '2025',
      bullets: [
        'Built a Python/Streamlit forecasting and operations dashboard with ETL, product filters, seasonality views and units/dollars reporting.',
        'Reduced holdout forecasting error by 24.1% relative to a seasonal-naive baseline (14.12% vs. 18.60% MAPE), using XGBoost and temporal train, validation and test splits.',
        'Investigated data-quality issues and documented evaluation limits so results could be interpreted responsibly.',
      ],
    },
  ],
  earlier:
    'Retail sales at Integrity Gun & Pawn included negotiating deals, explaining products and supporting inventory processes. At Swyft Real Property, I met prospective tenants, showed properties and explained occupancy terms. A management internship at The Archer in summer 2023 provided exposure to six departments, including sales and operations.',
  education: {
    institution: 'Kansas State University',
    degree: 'B.S., Management Information Systems, 2025',
    graduate: 'Graduate coursework in Data Science',
  },
  skills: [
    {
      label: 'Software and data',
      value:
        'Python, FastAPI, Pydantic, REST APIs, SQL, MongoDB, ETL, Streamlit, TypeScript',
    },
    {
      label: 'Delivery and verification',
      value: 'pytest, Playwright, Docker, Claude Code, Codex',
    },
  ],
  contributionTitle: 'How I could contribute at Handrail',
  contributionIntro:
    'The starting point is helping Handrail win and deliver useful work. I am open to the combination of commercial, technical and customer responsibilities where I can contribute most.',
  contributions: [
    {
      id: 'discovery',
      title: 'Sales and discovery',
      body: 'Help customers identify a useful first workflow, clarify the problem and define a practical starting scope with the team.',
      foundation:
        'Built on customer-facing sales experience and translating operational needs into product requirements.',
    },
    {
      id: 'engineering',
      title: 'Engineering and implementation',
      body: 'Build prototypes, data workflows and integrations; define acceptance criteria and test the result before handing it over.',
      foundation:
        'Built on Python/API development, document ingestion, reconciliation and public testing contributions.',
    },
    {
      id: 'customers',
      title: 'Customer and account support',
      body: 'Keep requirements, open issues and next steps clear. Support onboarding and maintain continuity between the sale and delivery.',
      foundation:
        'Built on operator documentation, issue investigation and earlier customer-facing work.',
    },
    {
      id: 'delivery',
      title: 'Forward-deployed delivery',
      body: 'Work close to the customer to map the real process, adapt the implementation and verify that it fits how people work.',
      foundation:
        'Built on turning inconsistent business documents into validated workflows and downstream handoffs.',
    },
  ],
  proof: [
    {
      title: 'This Handrail proposal',
      description:
        'A responsive paper experience with scroll-directed motion, an ordinary reading view and downloadable proposal notes.',
      href: 'https://github.com/brentthomas248/handrail-proposal',
      linkLabel: 'Explore the source',
    },
    {
      title: 'Rust property-based testing',
      description:
        'Merged property-based tests and fixes for refund and payout accounting in BOXMEOUT-STELLA.',
      href: 'https://github.com/GruftNet/BOXMEOUT-STELLA/pull/44',
      linkLabel: 'Review the merged contribution',
    },
    {
      title: 'Browser workflow testing',
      description:
        'Merged Playwright coverage for Open-Stellar across onboarding, navigation, wallet reachability and admin flows.',
      href: 'https://github.com/Bitcoindefi/Open-Stellar/pull/430',
      linkLabel: 'Review the merged contribution',
    },
  ],
  closing:
    'I see this as the beginning of a working relationship. My contribution can grow with Handrail as we agree on priorities and support.',
  labels: {
    experience: 'Experience',
    earlier: 'Earlier customer-facing experience',
    education: 'Education',
    skills: 'Tools and technical context',
    proof: 'Work you can explore',
    download: 'Download my resume',
    github: 'Explore my GitHub',
    product: 'Arms Inventory',
  },
} as const satisfies ResumeContent;

/** Complete expected print text, grouped by the two intentional pages. */
export const resumePrintPages: readonly (readonly string[])[] = [
  [
    resume.preparedFor,
    resume.name,
    resume.title,
    resume.labels.github,
    resume.labels.product,
    resume.profile,
    resume.labels.experience,
    ...resume.experience.flatMap((item) => [
      item.role,
      item.organization,
      item.period,
      ...item.bullets,
    ]),
    resume.labels.earlier,
    resume.earlier,
    resume.labels.education,
    resume.education.institution,
    resume.education.degree,
    resume.education.graduate,
    resume.labels.skills,
    ...resume.skills.flatMap((skill) => [skill.label, skill.value]),
  ],
  [
    resume.preparedFor,
    resume.name,
    resume.contributionTitle,
    resume.contributionIntro,
    ...resume.contributions.flatMap((item) => [
      item.title,
      item.body,
      item.foundation,
    ]),
    resume.labels.proof,
    ...resume.proof.flatMap((item) => [
      item.title,
      item.description,
      item.linkLabel,
    ]),
    resume.closing,
  ],
];
