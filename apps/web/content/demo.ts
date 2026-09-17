import type {
  currentTools,
  featuresWanted,
  mpesaSetups,
  organizationTypes,
  painPoints,
  portfolioSizes,
  preferredChannels,
  questionnaireCounties,
  timelines,
  whatsappBusinessOptions,
} from '@ethanel/contracts/demo-questionnaire';

type Opt<T extends readonly string[]> = readonly {
  value: T[number];
  label: string;
  hint?: string;
}[];

/** Book-a-demo questionnaire copy. Written like a discovery call, one screen at a time. */
export const demo = {
  eyebrow: 'Book a demo',
  title: 'Bring your rent roll. Leave with a plan.',
  lede: 'Four short screens so the walkthrough is built around your properties, not a generic deck. Takes about three minutes; we reply on WhatsApp within one working day.',
  // ASSUMPTION (QUESTIONS.md Q-04): reply-time wording is copy, not a commitment.
  aside: {
    title: 'What happens next',
    steps: [
      'We read your answers and load a sample of your portfolio shape before the call.',
      'A 30-minute walkthrough on a video call, or in person in Kiambu and Nairobi.',
      'You leave with a written plan: what changes on the first of next month, and the plan that fits.',
    ],
    privacy: 'Your answers go to our team only. No mailing lists.',
  },
  progressLabel: 'Progress',
  back: 'Back',
  next: 'Continue',
  submit: 'Send and book the call',
  submitting: 'Sending…',
  success: {
    title: "Thanks — we'll WhatsApp you within one working day.",
    body: 'Keep your rent roll handy for the call. If it is quicker, WhatsApp us now.',
  },
  steps: {
    organization: {
      title: 'Who you are',
      lede: 'So the demo speaks your language.',
      organizationType: 'Which describes you best?',
      organizationTypeOther: 'Tell us what you do',
      portfolioSize: 'How many units or plots do you manage?',
      counties: 'Which counties are they in?',
      countiesHint: 'Pick all that apply.',
    },
    today: {
      title: 'How it works today',
      lede: 'What you use now, and what hurts.',
      currentTools: 'What do you run the rent roll on today?',
      otherSoftwareName: 'Which software?',
      painPoints: 'What costs you the most time each month?',
      painPointsHint: 'Pick up to four.',
      painPointsOther: 'Tell us more',
    },
    needs: {
      title: 'What you need',
      lede: 'What should be different on the first of next month?',
      featuresWanted: 'Which of these matter most?',
      mpesaSetup: 'How do residents pay today?',
      whatsappBusiness: 'Do you have a WhatsApp Business account?',
      timeline: 'When would you like to start?',
    },
    contact: {
      title: 'How to reach you',
      lede: 'A person replies, on the channel you prefer.',
      name: 'Your name',
      role: 'Your role (optional)',
      organization: 'Organization',
      email: 'Work email',
      whatsapp: 'WhatsApp number',
      preferredChannel: 'Reply by',
      consent: 'You may contact me about this demo request.',
    },
  },
  options: {
    organizationType: [
      { value: 'letting-firm', label: 'Letting or property management firm' },
      { value: 'land-selling-company', label: 'Land-selling company' },
      { value: 'landlord', label: 'Landlord managing my own units' },
      { value: 'other', label: 'Something else' },
    ] satisfies Opt<typeof organizationTypes>,
    portfolioSize: [
      { value: '1-5', label: '1 – 5' },
      { value: '6-20', label: '6 – 20' },
      { value: '21-50', label: '21 – 50' },
      { value: '51-150', label: '51 – 150' },
      { value: '151-300', label: '151 – 300' },
      { value: '301-plus', label: 'More than 300' },
    ] satisfies Opt<typeof portfolioSizes>,
    counties: [
      { value: 'nairobi', label: 'Nairobi' },
      { value: 'kiambu', label: 'Kiambu' },
      { value: 'kajiado', label: 'Kajiado' },
      { value: 'machakos', label: 'Machakos' },
      { value: 'mombasa', label: 'Mombasa' },
      { value: 'nakuru', label: 'Nakuru' },
      { value: 'kisumu', label: 'Kisumu' },
      { value: 'uasin-gishu', label: 'Uasin Gishu' },
      { value: 'other', label: 'Another county' },
    ] satisfies Opt<typeof questionnaireCounties>,
    currentTools: [
      { value: 'spreadsheet', label: 'A spreadsheet' },
      { value: 'paper', label: 'Paper and receipt books' },
      { value: 'other-software', label: 'Other software' },
      { value: 'none', label: 'Nothing yet' },
    ] satisfies Opt<typeof currentTools>,
    painPoints: [
      { value: 'arrears', label: 'Chasing arrears' },
      { value: 'mpesa-reconciliation', label: 'Matching M-Pesa payments to leases' },
      { value: 'landlord-statements', label: 'Landlord statements and remittances' },
      { value: 'repairs', label: 'Repairs and caretaker follow-up' },
      { value: 'vacancies', label: 'Filling vacancies' },
      { value: 'caretaker-coordination', label: 'Coordinating field staff' },
      { value: 'deposits-and-site-visits', label: 'Deposits and site visits (land)' },
      { value: 'other', label: 'Something else' },
    ] satisfies Opt<typeof painPoints>,
    featuresWanted: [
      { value: 'rent-collection', label: 'Rent collection over M-Pesa' },
      { value: 'landlord-statements', label: 'Landlord statements and remittances' },
      { value: 'repairs-work-orders', label: 'Repair requests and work orders' },
      { value: 'whatsapp-channel', label: 'WhatsApp as the resident channel' },
      { value: 'marketplace-listings', label: 'Marketplace listings and viewings' },
      { value: 'reports-exports', label: 'Reports and Excel exports' },
      { value: 'public-api', label: 'Public API (coming)' },
    ] satisfies Opt<typeof featuresWanted>,
    mpesaSetup: [
      { value: 'own-paybill', label: 'Our own Paybill' },
      { value: 'own-till', label: 'Our own Till number' },
      { value: 'none', label: 'Personal M-Pesa or cash' },
      { value: 'unsure', label: 'Not sure' },
    ] satisfies Opt<typeof mpesaSetups>,
    whatsappBusiness: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unsure', label: 'Not sure' },
    ] satisfies Opt<typeof whatsappBusinessOptions>,
    timeline: [
      { value: 'this-month', label: 'This month' },
      { value: 'this-quarter', label: 'This quarter' },
      { value: 'later-this-year', label: 'Later this year' },
      { value: 'exploring', label: 'Just exploring' },
    ] satisfies Opt<typeof timelines>,
    preferredChannel: [
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'email', label: 'Email' },
      { value: 'call', label: 'Phone call' },
    ] satisfies Opt<typeof preferredChannels>,
  },
} as const;
