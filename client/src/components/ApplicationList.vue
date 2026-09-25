<script setup>
import StatusBadge from './StatusBadge.vue'

// Reine "Präsentations"-Komponente: bekommt die (bereits gefilterte) Liste als Prop
// und weiß nichts vom Store oder vom Filter.
defineProps({
  applications: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <!-- v-if / v-else: genau einer der beiden Zweige landet im DOM -->
  <p v-if="applications.length === 0" class="empty">Keine Bewerbungen gefunden.</p>

  <ul v-else class="application-list">
    <li v-for="application in applications" :key="application.id" class="application-item">
      <div class="main">
        <span class="company">{{ application.company }}</span>
        <span class="position">{{ application.position }}</span>
        <span v-if="application.ort" class="ort">{{ application.ort }}</span>
      </div>
      <StatusBadge :status="application.status" />
    </li>
  </ul>
</template>

<style scoped>
.empty {
  padding: 2rem 1rem;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
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
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background-soft);
}

.main {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.company {
  font-weight: 600;
  color: var(--color-heading);
}

.ort {
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>
