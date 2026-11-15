import { RACE_FILE, RACES_PER_TABLE_PAGE } from './race-config'

export { RACES_PER_TABLE_PAGE }

export interface Race {
  id: number
  name: string
  date: string
  location: string
  distance: string
  time: string
  pace: string
  picture: string
}

// Every data/marathon<N>.json, bundled at build time. Adding or removing a
// file is all it takes to change the race list and count.
const files = import.meta.glob<Race>('../data/marathon*.json', { eager: true, import: 'default' })

export const RACES: Race[] = Object.entries(files)
  .filter(([path]) => RACE_FILE.test(path.split('/').pop()!))
  .map(([, race]) => race)
  .sort((a, b) => a.id - b.id)

export const RACE_COUNT = RACES.length

export function raceById(id: number): Race | undefined {
  return RACES.find(r => r.id === id)
}

export function racesOnPage(page: number): Race[] {
  return RACES.slice((page - 1) * RACES_PER_TABLE_PAGE, page * RACES_PER_TABLE_PAGE)
}
