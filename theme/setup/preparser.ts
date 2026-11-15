import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { PreparserSetup } from '@slidev/types'
import { RACE_FILE, RACES_PER_TABLE_PAGE } from '../race-config'

// Expands a slide whose whole frontmatter is `marathon: races` into the
// race-log table pages plus one `layout: marathon` slide per data file.
const MARKER = 'marathon: races'

const setup: PreparserSetup = ({ filepath }) => [{
  name: 'marathon-races',
  transformRawLines(lines) {
    const i = lines.findIndex((line, idx) =>
      line.trim() === MARKER && lines[idx - 1]?.trim() === '---' && lines[idx + 1]?.trim() === '---')
    if (i < 0) return

    const dir = join(dirname(filepath), 'data')
    const ids = readdirSync(dir)
      .filter(f => RACE_FILE.test(f))
      .map(f => JSON.parse(readFileSync(join(dir, f), 'utf-8')).id as number)
      .sort((a, b) => a - b)

    const out: string[] = []
    const pages = Math.ceil(ids.length / RACES_PER_TABLE_PAGE)
    for (let p = 1; p <= pages; p++)
      out.push('---', 'layout: table', `page: ${p}`, '---', '')
    for (const id of ids)
      out.push('---', 'layout: marathon', `n: ${id}`, '---', '')
    out.pop() // the blank line that follows the marker slide is kept

    lines.splice(i - 1, 3, ...out)
  },
}]

export default setup
