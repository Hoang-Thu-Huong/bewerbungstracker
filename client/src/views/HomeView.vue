<script setup>
import { storeToRefs } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'

// Die Bewerbungen leben im Pinia-Store (persistiert in localStorage).
// storeToRefs statt Destructuring, damit `applications` reaktiv bleibt.
const store = useApplicationsStore()
const { applications } = storeToRefs(store)
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
