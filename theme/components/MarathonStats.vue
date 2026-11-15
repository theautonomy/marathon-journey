<script setup lang="ts">
import { RACES } from '../races'
import { computed } from 'vue'

interface MarathonData {
  id: number
  name: string
  date: string
  location: string
  distance: string
  time: string
  pace: string
  picture: string
}

const MARATHON_MILES = 26.2188

function ultraMiles(distance: string): number | null {
  const d = distance.toUpperCase()
  if (d.includes('100K'))    return 62.1371
  if (d.includes('50K'))     return 31.0686
  if (d.includes('50 MILE') || d === '50M') return 50
  return null
}

function parsePaceSecs(pace: string): number {
  const m = pace.match(/^(\d+):(\d+)/)
  return m ? +m[1] * 60 + +m[2] : 0
}

function secsToTime(s: number): string {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.round(s % 60)
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// Returns marathon-equivalent seconds for any race distance
function equivSeconds(m: MarathonData): number {
  if (m.time === 'TBD') return Infinity
  if (ultraMiles(m.distance)) {
    const secs = parsePaceSecs(m.pace)
    return secs ? Math.round(secs * MARATHON_MILES) : Infinity
  }
  const parts = m.time.split(':').map(Number)
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return Infinity
}

const marathons = computed<MarathonData[]>(() => RACES)

const completed = computed(() =>
  marathons.value.filter(m => m.time !== 'TBD')
)

const best = computed(() => {
  if (!completed.value.length) return null
  const r = completed.value.reduce((a, b) =>
    equivSeconds(a) <= equivSeconds(b) ? a : b
  )
  return { ...r, equivTime: secsToTime(equivSeconds(r)) }
})

const worst = computed(() => {
  if (!completed.value.length) return null
  const r = completed.value.reduce((a, b) =>
    equivSeconds(a) >= equivSeconds(b) ? a : b
  )
  return { ...r, equivTime: secsToTime(equivSeconds(r)) }
})

const avgTime = computed(() => {
  if (!completed.value.length) return '—'
  const total = completed.value.reduce((sum, m) => sum + equivSeconds(m), 0)
  return secsToTime(Math.round(total / completed.value.length))
})

const totalMiles = computed(() =>
  (completed.value.length * 26.2).toFixed(1)
)

// Most common location
const topLocation = computed(() => {
  const counts: Record<string, number> = {}
  for (const m of completed.value) {
    counts[m.location] = (counts[m.location] || 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ['—', 0]
})

const firstYear = computed(() => {
  const m = marathons.value.find(m => m.date !== 'TBD')
  return m ? m.date.split('/')[2] : '—'
})

const ultraCount = computed(() =>
  completed.value.filter(m => ultraMiles(m.distance) !== null).length
)
</script>

<template>
  <div class="ms-root" v-if="completed.length">

    <!-- Left hero panel -->
    <div class="ms-hero">
      <div class="ms-hero-num">{{ completed.length }}</div>
      <div class="ms-hero-label">Marathons<br>Finished</div>
      <div class="ms-hero-since">since {{ firstYear }}</div>
      <div class="ms-hero-miles">{{ totalMiles }} mi total</div>
    </div>

    <!-- Right stats grid -->
    <div class="ms-grid">
      <div class="ms-stat">
        <div class="ms-val mono">{{ best?.equivTime }}</div>
        <div class="ms-label">Personal Best</div>
        <div class="ms-sub">{{ best?.name }}</div>
      </div>
      <div class="ms-stat">
        <div class="ms-val mono">{{ avgTime }}</div>
        <div class="ms-label">Average Time</div>
      </div>
      <div class="ms-stat">
        <div class="ms-val mono">{{ worst?.equivTime }}</div>
        <div class="ms-label">Slowest Time</div>
        <div class="ms-sub">Every finish is a win</div>
      </div>
      <div class="ms-stat">
        <div class="ms-val location">{{ topLocation[0] }}</div>
        <div class="ms-label">Favourite City</div>
        <div class="ms-sub">{{ topLocation[1] }}× races</div>
      </div>
    </div>

  </div>
  <div v-if="completed.length && ultraCount" class="ms-footnote">
    * {{ ultraCount }} ultra races (50K / 50 Miles / 100K) converted to marathon-equivalent times
  </div>
  <div v-if="!completed.length" class="ms-loading">Loading stats…</div>
</template>

<style scoped>
.ms-root {
  display: flex;
  gap: 0;
  flex: 1;
  overflow: hidden;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(0, 0, 0, 0.06);
}

/* ── Hero panel ── */
.ms-hero {
  width: 38%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 2.5rem;
  background: rgba(255, 255, 255, 0.72);
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  position: relative;
}

.ms-hero::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #e06800;
}

.ms-hero-num {
  font-size: 7rem;
  font-weight: 800;
  line-height: 1;
  color: #e06800;
  letter-spacing: -0.04em;
}

.ms-hero-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  margin-top: 0.35rem;
  letter-spacing: -0.01em;
}

.ms-hero-since {
  font-size: 0.7rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.35);
  margin-top: 0.75rem;
  letter-spacing: 0.08em;
}

.ms-hero-miles {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 0.2rem;
  letter-spacing: 0.04em;
}

/* ── Stats grid ── */
.ms-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1px;
  background: rgba(0, 0, 0, 0.06);
}

.ms-stat {
  background: rgba(255, 255, 255, 0.68);
  padding: 1.4rem 1.6rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.2rem;
}

.ms-val {
  font-size: 1.9rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  letter-spacing: -0.02em;
}

.ms-val.mono {
  font-family: 'JetBrains Mono', monospace;
  color: #e06800;
  font-size: 1.7rem;
}

.ms-val.location {
  font-size: 1.15rem;
  font-weight: 700;
}

.ms-label {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
  margin-top: 0.3rem;
}

.ms-sub {
  font-size: 0.68rem;
  color: rgba(0, 0, 0, 0.28);
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ms-loading {
  color: rgba(0, 0, 0, 0.25);
  font-size: 0.85rem;
  padding: 2rem;
}

.ms-footnote {
  font-size: 0.58rem;
  color: rgba(0, 0, 0, 0.28);
  letter-spacing: 0.04em;
  margin-top: 0.5rem;
  padding: 0 0.25rem;
}
</style>
