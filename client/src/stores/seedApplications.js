// Seed-Daten: die 3 Beispiel-Bewerbungen, mit denen der Store startet,
// wenn localStorage leer oder unlesbar ist (siehe applications.js).
// Gehalt ist immer Jahresbrutto in Euro.
// ids sind Strings, weil neue Einträge UUID-Strings bekommen und
// Route-Params (/applications/:id) ebenfalls Strings sind.
export const seedApplications = [
  {
    id: 'seed-1',
    company: 'SAP SE',
    position: 'Junior Frontend Developer (Vue.js)',
    link: 'https://jobs.sap.com/job/12345',
    ort: 'Walldorf',
    gehaltMin: 48000,
    gehaltMax: 55000,
    status: 'beworben',
    datum: '2026-09-10',
    notizen: 'Bewerbung über Karriereportal, Ansprechpartnerin Frau Müller.',
    createdAt: '2026-09-10T09:15:00.000Z',
    updatedAt: '2026-09-10T09:15:00.000Z',
  },
  {
    id: 'seed-2',
    company: 'Zalando SE',
    position: 'Werkstudent Web Development',
    link: 'https://jobs.zalando.com/de/jobs/67890',
    ort: 'Berlin',
    // Werkstudent: 1.800–2.200 € / Monat → Jahresbrutto
    gehaltMin: 21600,
    gehaltMax: 26400,
    status: 'interview',
    datum: '2026-09-03',
    notizen: 'Erstes Gespräch am 22.09. per Video, Fragen zu Vue und REST vorbereiten.',
    createdAt: '2026-09-03T14:30:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 'seed-3',
    company: 'Deutsche Telekom IT GmbH',
    position: 'Frontend-Entwickler (m/w/d)',
    link: 'https://www.telekom.com/de/karriere/jobsuche/24680',
    ort: 'Bonn',
    gehaltMin: 50000,
    gehaltMax: 60000,
    status: 'gespeichert',
    datum: '2026-09-20',
    notizen: 'Stelle gemerkt, Anschreiben noch schreiben. Bewerbungsfrist 15.10.',
    createdAt: '2026-09-20T18:45:00.000Z',
    updatedAt: '2026-09-20T18:45:00.000Z',
  },
]
