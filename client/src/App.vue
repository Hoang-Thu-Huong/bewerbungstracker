<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/" class="brand">Bewerbungstracker</RouterLink>

    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

nav a {
  display: inline-block;
  padding: 0 0.75rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border-left: 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: 600;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>
