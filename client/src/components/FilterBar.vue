<script setup>
import { STATUSES } from '@/stores/applications'

// defineModel erzeugt pro Aufruf eine "modelValue"-Prop + "update:…"-Event und gibt
// einen schreibbaren Ref zurück. Mit Namen ('query', 'status') kann der Parent zwei
// getrennte v-model binden: <FilterBar v-model:query="…" v-model:status="…" />.
// Die Komponente selbst hält keinen eigenen State – Source of Truth bleibt der Parent.
const query = defineModel('query', { type: String, default: '' })
const status = defineModel('status', { type: String, default: 'alle' })
</script>

<template>
  <form class="filter-bar" @submit.prevent>
    <div class="field">
      <label for="filter-query">Suche</label>
      <input
        id="filter-query"
        v-model="query"
        type="search"
        placeholder="Firma, Position, Ort"
        autocomplete="off"
      />
    </div>

    <div class="field">
      <label for="filter-status">Status</label>
      <select id="filter-status" v-model="status">
        <option value="alle">Alle</option>
        <option v-for="s in STATUSES" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>
  </form>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1 1 12rem;
}

label {
  font-size: 0.875rem;
  color: var(--color-heading);
}

input,
select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-background);
  color: var(--color-text);
  font: inherit;
}

input:focus,
select:focus {
  outline: 2px solid hsla(160, 100%, 37%, 0.5);
  outline-offset: 1px;
  border-color: var(--color-border-hover);
}

select option {
  text-transform: capitalize;
}
</style>
