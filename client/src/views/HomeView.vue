<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useApplicationsStore } from '@/stores/applications'
import { filterApplications } from '@/utils/filterApplications'
import FilterBar from '@/components/FilterBar.vue'
import ApplicationList from '@/components/ApplicationList.vue'

// Die Bewerbungen leben im Pinia-Store (persistiert in localStorage).
// storeToRefs statt Destructuring, damit `applications` reaktiv bleibt.
const store = useApplicationsStore()
const { applications } = storeToRefs(store)

// Filterzustand gehört zur View, nicht in den Store: er ist nur hier relevant
// und soll nicht persistiert werden.
const query = ref('')
const status = ref('alle')

// computed statt Methode: das Ergebnis wird gecacht und nur neu berechnet, wenn
// applications, query oder status sich ändern – nicht bei jedem Re-Render.
const filteredApplications = computed(() =>
  filterApplications(applications.value, { query: query.value, status: status.value }),
)
</script>

<template>
  <main>
    <div class="heading">
      <h1>Meine Bewerbungen</h1>
      <p class="count">
        {{ filteredApplications.length }} von {{ applications.length }} Bewerbungen
      </p>
    </div>

    <FilterBar v-model:query="query" v-model:status="status" />

    <ApplicationList :applications="filteredApplications" />
  </main>
</template>

<style scoped>
.heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
}

.count {
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>
