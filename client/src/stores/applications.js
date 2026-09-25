import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { seedApplications } from './seedApplications'

export const STATUSES = ['gespeichert', 'beworben', 'interview', 'zusage', 'absage']
export const STORAGE_KEY = 'bewerbungstracker.applications'

// Liest die Liste aus localStorage. Gibt null zurück, wenn nichts (Brauchbares) da ist,
// damit der Store dann mit den Seed-Daten startet.
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    // ungültiges JSON oder localStorage nicht verfügbar (z. B. Private Mode)
    return null
  }
}

function saveToStorage(applications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch {
    // z. B. Speicher voll oder blockiert – App läuft dann ohne Persistenz weiter
  }
}

export const useApplicationsStore = defineStore('applications', () => {
  // structuredClone, damit Änderungen im Store nicht das Seed-Array selbst verändern
  const applications = ref(loadFromStorage() ?? structuredClone(seedApplications))

  // deep: true, damit auch Änderungen an einzelnen Feldern (z. B. status) gespeichert werden,
  // nicht nur das Ersetzen des ganzen Arrays.
  // immediate: true, weil watch sonst lazy ist: beim ersten Start (leerer localStorage)
  // würde der Key erst nach der ersten Änderung angelegt.
  watch(applications, saveToStorage, { deep: true, immediate: true })

  function addApplication(data) {
    const now = new Date().toISOString()
    const application = {
      status: 'gespeichert',
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    }
    applications.value.push(application)
    // Den reaktiven Proxy aus dem Array zurückgeben (nicht das rohe Objekt),
    // damit Änderungen durch den Aufrufer ebenfalls Reaktivität + Watch auslösen.
    return applications.value.at(-1)
  }

  function updateApplication(id, changes) {
    const application = getApplicationById(id)
    if (!application) return undefined
    Object.assign(application, changes, { id, updatedAt: new Date().toISOString() })
    return application
  }

  function removeApplication(id) {
    applications.value = applications.value.filter((application) => application.id !== id)
  }

  function getApplicationById(id) {
    return applications.value.find((application) => application.id === id)
  }

  return {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
    getApplicationById,
  }
})
