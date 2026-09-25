// Reine Funktion ohne Vue-Abhängigkeit: gleiche Eingabe → gleiche Ausgabe, keine Seiteneffekte.
// Dadurch ist die Filterlogik ohne Komponente/Store direkt mit Vitest testbar,
// und HomeView muss sie nur noch in ein computed einhängen.

const SEARCH_FIELDS = ['company', 'position', 'ort']

export function filterApplications(applications, { query = '', status = 'alle' } = {}) {
  const q = query.trim().toLowerCase()

  // Array.prototype.filter erzeugt immer ein neues Array, das Original bleibt unverändert.
  return applications.filter((application) => {
    if (status !== 'alle' && application.status !== status) return false
    if (!q) return true

    return SEARCH_FIELDS.some((field) =>
      String(application[field] ?? '')
        .toLowerCase()
        .includes(q),
    )
  })
}
