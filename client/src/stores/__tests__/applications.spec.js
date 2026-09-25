import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'

import { useApplicationsStore, STATUSES, STORAGE_KEY } from '../applications'
import { seedApplications } from '../seedApplications'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('applications store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('exports the five German status values', () => {
    expect(STATUSES).toEqual(['gespeichert', 'beworben', 'interview', 'zusage', 'absage'])
  })

  it('starts with the seed data when localStorage is empty', () => {
    const store = useApplicationsStore()

    expect(store.applications).toHaveLength(3)
    expect(store.applications.map((a) => a.company)).toEqual([
      'SAP SE',
      'Zalando SE',
      'Deutsche Telekom IT GmbH',
    ])
    // Gehalt ist Jahresbrutto
    const zalando = store.getApplicationById('seed-2')
    expect(zalando.gehaltMin).toBe(21600)
    expect(zalando.gehaltMax).toBe(26400)
  })

  it('does not mutate the seed module when the store changes', () => {
    const store = useApplicationsStore()
    store.updateApplication('seed-1', { company: 'Geändert' })

    expect(seedApplications[0].company).toBe('SAP SE')
  })

  it('loads existing data from localStorage instead of the seed', () => {
    const stored = [{ ...seedApplications[0], id: 'x-1', company: 'Aus dem Speicher' }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))

    const store = useApplicationsStore()

    expect(store.applications).toHaveLength(1)
    expect(store.applications[0].company).toBe('Aus dem Speicher')
  })

  it('falls back to the seed when localStorage contains invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')

    const store = useApplicationsStore()

    expect(store.applications).toHaveLength(3)
  })

  it('falls back to the seed when localStorage does not contain an array', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }))

    const store = useApplicationsStore()

    expect(store.applications).toHaveLength(3)
  })

  it('addApplication adds an entry with id, default status and timestamps', () => {
    const store = useApplicationsStore()

    const created = store.addApplication({
      company: 'Neue Firma',
      position: 'Vue Developer',
      link: 'https://example.com',
    })

    expect(store.applications).toHaveLength(4)
    expect(store.applications.at(-1)).toBe(created)
    expect(created.id).toMatch(UUID_RE)
    expect(created.status).toBe('gespeichert')
    expect(created.company).toBe('Neue Firma')
    expect(created.createdAt).toBe(created.updatedAt)
    expect(new Date(created.createdAt).toISOString()).toBe(created.createdAt)
  })

  it('addApplication keeps an explicitly given status', () => {
    const store = useApplicationsStore()

    const created = store.addApplication({ company: 'X', position: 'Y', status: 'beworben' })

    expect(created.status).toBe('beworben')
  })

  it('updateApplication changes fields, refreshes updatedAt and keeps the id', () => {
    const store = useApplicationsStore()
    const before = store.getApplicationById('seed-1')
    const oldUpdatedAt = before.updatedAt

    const updated = store.updateApplication('seed-1', { status: 'interview', id: 'hack' })

    expect(updated).toBe(before)
    expect(updated.id).toBe('seed-1')
    expect(updated.status).toBe('interview')
    expect(updated.company).toBe('SAP SE')
    expect(updated.updatedAt).not.toBe(oldUpdatedAt)
    expect(new Date(updated.updatedAt) > new Date(oldUpdatedAt)).toBe(true)
  })

  it('updateApplication returns undefined for an unknown id', () => {
    const store = useApplicationsStore()

    expect(store.updateApplication('nope', { status: 'absage' })).toBeUndefined()
    expect(store.applications).toHaveLength(3)
  })

  it('removeApplication removes the entry', () => {
    const store = useApplicationsStore()

    store.removeApplication('seed-2')

    expect(store.applications).toHaveLength(2)
    expect(store.getApplicationById('seed-2')).toBeUndefined()
    expect(store.getApplicationById('seed-1')).toBeDefined()
  })

  it('speichert die Seed-Daten beim ersten Start in localStorage', () => {
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()

    useApplicationsStore()

    // immediate: true → Watcher läuft sofort synchron, kein nextTick nötig
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(3)
    expect(stored.map((a) => a.id)).toEqual(['seed-1', 'seed-2', 'seed-3'])
  })

  it('persists to localStorage after addApplication', async () => {
    const store = useApplicationsStore()
    const created = store.addApplication({ company: 'Persist GmbH', position: 'Dev' })

    // watch() läuft asynchron (flush: 'pre') → auf den nächsten Tick warten
    await nextTick()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(4)
    expect(stored.at(-1)).toEqual(created)
  })

  it('persists nested changes (deep watch) after updateApplication', async () => {
    const store = useApplicationsStore()
    store.updateApplication('seed-3', { status: 'zusage' })

    await nextTick()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored.find((a) => a.id === 'seed-3').status).toBe('zusage')
  })
})
