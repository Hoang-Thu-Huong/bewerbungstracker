<script setup>
import { ref } from 'vue'

// Fest codierte Beispieldaten (MVP, noch ohne localStorage/Backend).
// Felder entsprechen dem Data model in CLAUDE.md / PLAN.md.
const applications = ref([
  {
    id: 1,
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
    id: 2,
    company: 'Zalando SE',
    position: 'Werkstudent Web Development',
    link: 'https://jobs.zalando.com/de/jobs/67890',
    ort: 'Berlin',
    gehaltMin: 1800,
    gehaltMax: 2200,
    status: 'interview',
    datum: '2026-09-03',
    notizen: 'Erstes Gespräch am 22.09. per Video, Fragen zu Vue und REST vorbereiten.',
    createdAt: '2026-09-03T14:30:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z',
  },
  {
    id: 3,
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
])
</script>

<template>
  <main>
    <h1>Meine Bewerbungen</h1>

    <ul class="application-list">
      <li v-for="application in applications" :key="application.id" class="application-item">
        <span class="company">{{ application.company }}</span>
        <span class="position">{{ application.position }}</span>
        <span class="status">{{ application.status }}</span>
      </li>
    </ul>
  </main>
</template>

<style scoped>
h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.application-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.application-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background-soft);
}

.company {
  font-weight: 600;
  color: var(--color-heading);
}

.status {
  font-size: 0.875rem;
  text-transform: capitalize;
  color: var(--color-text);
}
</style>
