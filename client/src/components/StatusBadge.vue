<script setup>
import { STATUSES } from '@/stores/applications'

// validator: Vue warnt in der Konsole (nur im Dev-Modus), wenn ein unbekannter Status
// hereinkommt – z. B. ein Tippfehler. Der Import von STATUSES aus dem Store-Modul
// instanziiert keinen Store, es ist nur die exportierte Konstante.
defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => STATUSES.includes(value),
  },
})
</script>

<template>
  <span class="status-badge" :class="`status-badge--${status}`">{{ status }}</span>
</template>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.5;
  text-transform: capitalize;
  white-space: nowrap;
}

/* Farben kommen aus base.css (hell/dunkel), damit sie zentral bleiben. */
.status-badge--gespeichert {
  background-color: var(--status-gespeichert-bg);
  color: var(--status-gespeichert-text);
}

.status-badge--beworben {
  background-color: var(--status-beworben-bg);
  color: var(--status-beworben-text);
}

.status-badge--interview {
  background-color: var(--status-interview-bg);
  color: var(--status-interview-text);
}

.status-badge--zusage {
  background-color: var(--status-zusage-bg);
  color: var(--status-zusage-text);
}

.status-badge--absage {
  background-color: var(--status-absage-bg);
  color: var(--status-absage-text);
}
</style>
