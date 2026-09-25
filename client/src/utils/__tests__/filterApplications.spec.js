import { describe, it, expect } from 'vitest'

import { filterApplications } from '../filterApplications'

// Kleines eigenes Fixture statt der Seed-Daten, damit der Test unabhängig vom Store bleibt.
const applications = [
  {
    id: '1',
    company: 'SAP SE',
    position: 'Junior Frontend Developer',
    ort: 'Walldorf',
    status: 'beworben',
  },
  {
    id: '2',
    company: 'Zalando SE',
    position: 'Werkstudent Web',
    ort: 'Berlin',
    status: 'interview',
  },
  { id: '3', company: 'Telekom IT', position: 'Vue Developer', ort: 'Bonn', status: 'gespeichert' },
  {
    id: '4',
    company: 'Berliner Sparkasse',
    position: 'IT-Trainee',
    ort: 'Berlin',
    status: 'absage',
  },
]

const ids = (list) => list.map((a) => a.id)

describe('filterApplications', () => {
  it('returns everything for an empty query and status "alle"', () => {
    expect(ids(filterApplications(applications, { query: '', status: 'alle' }))).toEqual([
      '1',
      '2',
      '3',
      '4',
    ])
  })

  it('searches case-insensitively in company', () => {
    expect(ids(filterApplications(applications, { query: 'sap', status: 'alle' }))).toEqual(['1'])
    expect(ids(filterApplications(applications, { query: 'ZALANDO', status: 'alle' }))).toEqual([
      '2',
    ])
  })

  it('searches in position', () => {
    expect(ids(filterApplications(applications, { query: 'developer', status: 'alle' }))).toEqual([
      '1',
      '3',
    ])
  })

  it('searches in ort', () => {
    expect(ids(filterApplications(applications, { query: 'bonn', status: 'alle' }))).toEqual(['3'])
  })

  it('ignores surrounding whitespace in the query', () => {
    expect(ids(filterApplications(applications, { query: '  zalando ', status: 'alle' }))).toEqual([
      '2',
    ])
    // nur Leerzeichen = kein Filter
    expect(filterApplications(applications, { query: '   ', status: 'alle' })).toHaveLength(4)
  })

  it('filters by status', () => {
    expect(ids(filterApplications(applications, { query: '', status: 'interview' }))).toEqual(['2'])
    expect(filterApplications(applications, { query: '', status: 'zusage' })).toEqual([])
  })

  it('combines query and status', () => {
    // "berlin" trifft 2 (ort) und 4 (company + ort), Status schränkt auf 4 ein
    expect(ids(filterApplications(applications, { query: 'berlin', status: 'alle' }))).toEqual([
      '2',
      '4',
    ])
    expect(ids(filterApplications(applications, { query: 'berlin', status: 'absage' }))).toEqual([
      '4',
    ])
  })

  it('handles entries without ort', () => {
    const withoutOrt = [{ id: 'x', company: 'Remote GmbH', position: 'Dev', status: 'beworben' }]
    expect(filterApplications(withoutOrt, { query: 'remote', status: 'alle' })).toHaveLength(1)
    expect(filterApplications(withoutOrt, { query: 'berlin', status: 'alle' })).toHaveLength(0)
  })

  it('does not mutate the input array and returns a new array', () => {
    const copy = structuredClone(applications)
    const result = filterApplications(applications, { query: 'berlin', status: 'alle' })

    expect(result).not.toBe(applications)
    expect(applications).toEqual(copy)
    expect(applications).toHaveLength(4)
    // die Elemente selbst werden nicht kopiert, nur das Array
    expect(result[0]).toBe(applications[1])
  })
})
