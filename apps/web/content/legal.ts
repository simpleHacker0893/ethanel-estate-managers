/** Trust, privacy and terms. Trust copy from the canvas; privacy and terms are drafts pending counsel. */
export interface ContentSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export const trust = {
  eyebrow: 'Trust & security',
  title: 'Built like a ledger. Protected like one.',
  lede: "Ethanel handles other people's rent. This page says exactly what we do to keep it accurate and private — and what we don't yet claim.",
  groups: [
    {
      title: 'The ledger',
      items: [
        {
          title: 'Postings are permanent',
          body: 'Nothing is edited in place. A correction is a new posting that references the one it corrects, so every statement can be traced back to the M-Pesa receipt.',
        },
        {
          title: 'To the shilling',
          body: 'Statements and reports are derived from postings, never typed. If a number is on a landlord statement, it reconciles.',
        },
        {
          title: 'M-Pesa via Daraja',
          body: "Payments arrive through Safaricom's Daraja API. Ethanel never sees a resident's M-Pesa PIN and never stores card numbers.",
        },
      ],
    },
    {
      title: 'Your organization, your data',
      items: [
        {
          title: 'One tenancy per organization',
          body: "Each letting firm's portfolio is its own tenancy. Staff at one firm cannot see another firm's leases, landlords or residents.",
        },
        {
          title: 'Sign-in via Clerk, roles per person',
          body: 'Owners, office staff and caretakers get the access their role needs. Caretakers never see landlord finances.',
        },
        {
          title: 'Residents own their data',
          body: "A resident can ask for the data held about them and have it corrected. Requests go to the organization that manages their lease, with Ethanel's help.",
        },
      ],
    },
  ],
  roadmapTitle: "What we don't claim yet",
  roadmapLede:
    'Honesty is part of the product. These are on the roadmap and will move above this line only when true.',
  roadmap: [
    {
      title: 'Hosting in an African region',
      body: 'A go-live requirement for us, not something shipped today. We will state the region here when it is live.',
    },
    {
      title: 'Independent security audit',
      body: 'Planned before general availability. Findings and fixes will be summarised on this page.',
    },
    { title: 'Formal certifications', body: 'We hold none yet and will not imply otherwise.' },
    {
      title: 'Kiswahili interface',
      body: 'Coming in a later release; the ledger vocabulary is being translated with partner firms.',
    },
  ],
  report: {
    title: 'Report a problem',
    body: "Found a security issue or a posting that doesn't reconcile? WhatsApp us or use the contact form. A person replies within one working day; a confirmed issue gets a written timeline.",
    cta: 'Contact us',
  },
} as const;

export const privacy: {
  eyebrow: string;
  title: string;
  draftNote: string;
  sections: readonly ContentSection[];
} = {
  eyebrow: 'Privacy',
  title: 'Privacy policy',
  draftNote:
    'Draft. This page describes how we intend to handle personal data and is being finalised with counsel before launch. It is not yet a legal document.',
  sections: [
    {
      heading: 'What we collect',
      paragraphs: [
        'Contact details you give us (name, organization, WhatsApp number, email) when you book a demo, apply to the design partner programme or write to us.',
        'For organizations on Ethanel: the leases, residents, landlords, caretakers and postings your organization records, and the M-Pesa receipt references Safaricom sends us.',
      ],
    },
    {
      heading: 'Why we collect it',
      paragraphs: [
        'To run your organization’s rent, repairs and remittances, to reply to your enquiry, and to keep an accurate ledger you can audit.',
      ],
    },
    {
      heading: 'Who sees it',
      paragraphs: [
        'Your organization’s staff, according to their role. Ethanel staff when supporting you. Safaricom and Meta as the M-Pesa and WhatsApp providers. Nobody else without your instruction or a legal requirement.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'Under Kenya’s Data Protection Act you can ask what we hold about you, have it corrected, or object to its use. Requests go to the organization that manages your lease, with Ethanel’s help.',
      ],
    },
  ],
};

export const terms: {
  eyebrow: string;
  title: string;
  draftNote: string;
  sections: readonly ContentSection[];
} = {
  eyebrow: 'Terms',
  title: 'Terms of service',
  draftNote:
    'Draft. These terms are being finalised with counsel before launch. The agreement each organization signs takes precedence.',
  sections: [
    {
      heading: 'The service',
      paragraphs: [
        'Ethanel Estate Managers provides property-management software and a marketplace to organizations in Kenya. Fees, support and data terms are confirmed in each organization’s agreement.',
      ],
    },
    {
      heading: 'Your organization’s data',
      paragraphs: [
        'Your organization owns the records it keeps on Ethanel. We process them to provide the service and never sell them.',
      ],
    },
    {
      heading: 'The marketplace',
      paragraphs: [
        'Listings are published by the organizations that manage the properties. Prices shown are set by them. Viewings and payments are agreed between you and that organization.',
      ],
    },
    {
      heading: 'Changes',
      paragraphs: [
        'We will publish the final terms here and notify organizations before they take effect.',
      ],
    },
  ],
};
