<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// Module-level quotes cache
let quotesCache: string[] | null = null
async function loadQuotes(base: string): Promise<string[]> {
  if (quotesCache) return quotesCache
  const r = await fetch(`${base}marathon/data/quotes.json`)
  quotesCache = await r.json()
  return quotesCache!
}

const props = defineProps<{ n: number }>()

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

// Per-marathon photo overrides (by race id). Takes priority over location map.
const marathonPhotos: Record<number, string> = {
  19: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
  23: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&fit=crop',
  24: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
  33: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
  39: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&q=80&fit=crop',
  40: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
  47: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
}

// Unsplash photos keyed by race location.
// Used only when a race has no unique photo (picture === 'marathon.jpg').
const locationPhotos: Record<string, string> = {
  // ── Indiana cities ───────────────────────────────────────────────────────
  'Indianapolis, IN':    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80&fit=crop',
  'Carmel, IN':          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80&fit=crop',
  'South Bend, IN':      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80&fit=crop',
  'Columbus, IN':        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80&fit=crop',
  'Columbia, IN':        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80&fit=crop',
  'Brownstown, IN':      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
  'Nashville, IN':       'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80&fit=crop',
  'Albion, IN':          'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1920&q=80&fit=crop',
  // ── Other US cities ──────────────────────────────────────────────────────
  'Chicago, IL':         'https://images.unsplash.com/photo-1494522358652-f30e61a60313?w=1920&q=80&fit=crop',
  'Brownstown, IL':      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
  'Champaign-Urbana, IL':'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&fit=crop',
  'Cincinnati, OH':      'https://images.unsplash.com/photo-1502899576159-f224dc2349fa?w=1920&q=80&fit=crop',
  'Dayton, OH':          'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1920&q=80&fit=crop',
  'Louisville, KY':      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&fit=crop',
  'Boston, MA':          'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1920&q=80&fit=crop',
  'Minneapolis, MN':     'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&fit=crop',
  'St. Louis, MO':       'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80&fit=crop',
  // ── International ────────────────────────────────────────────────────────
  'Ottawa, Canada':      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1920&q=80&fit=crop',
  'Beijing, China':      'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1920&q=80&fit=crop',
  'Shanghai, China':     'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?w=1920&q=80&fit=crop',
  'Tianjin, China':      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80&fit=crop',
  'Zhejiang, China':     'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=1920&q=80&fit=crop',
}

const marathon = ref<MarathonData | null>(null)

onMounted(async () => {
  const base = import.meta.env.BASE_URL
  const [data, quotes] = await Promise.all([
    fetch(`${base}marathon/data/marathon${props.n}.json`).then(r => r.json()),
    loadQuotes(base),
  ])
  marathon.value = data
  quote.value = parseQuote(quotes[Math.floor(Math.random() * quotes.length)])
})

const isTBD = computed(() => !marathon.value || marathon.value.time === 'TBD')

const raceYear = computed(() => {
  if (!marathon.value) return ''
  const m = marathon.value.name.match(/^\d{4}/)
  if (m) return m[0]
  if (marathon.value.date !== 'TBD') return marathon.value.date.split('/')[2] || ''
  return ''
})

const raceName = computed(() =>
  marathon.value ? marathon.value.name.replace(/^\d{4}\s*/, '') : ''
)

const formattedDate = computed(() => {
  if (!marathon.value?.date || marathon.value.date === 'TBD') return '—'
  const [mo, d, y] = marathon.value.date.split('/')
  try {
    return new Date(+y, +mo - 1, +d).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    })
  } catch {
    return marathon.value.date
  }
})

const photoUrl = computed(() => {
  const base = import.meta.env.BASE_URL
  if (!marathon.value) return `${base}marathon/img/marathon.jpg`
  // Race has its own unique photo — use it
  if (marathon.value.picture !== 'marathon.jpg') {
    return `${base}marathon/img/${marathon.value.picture}`
  }
  // Per-race override, then location map, then generic fallback
  return marathonPhotos[marathon.value.id]
    ?? locationPhotos[marathon.value.location]
    ?? `${base}marathon/img/marathon.jpg`
})

const padded = computed(() => String(props.n).padStart(3, '0'))

const isMilestone = computed(() =>
  props.n === 1 || props.n === 10 || props.n === 25 ||
  props.n === 50 || props.n === 75 || props.n === 100
)

const photoCredit = computed(() =>
  photoUrl.value.startsWith('https://images.unsplash.com') ? 'Unsplash' : null
)

function ultraMiles(distance: string): number | null {
  const d = distance.toUpperCase()
  if (d.includes('100K')) return 62.1371
  if (d.includes('50K'))  return 31.0686
  if (d.includes('50 MILE') || d === '50M') return 50
  return null
}

const isUltra = computed(() =>
  !!marathon.value && ultraMiles(marathon.value.distance) !== null
)

interface Quote { text: string; author: string }
const quote = ref<Quote | null>(null)

function parseQuote(raw: string): Quote {
  const idx = raw.lastIndexOf(' - ')
  return idx === -1
    ? { text: raw, author: '' }
    : { text: raw.slice(0, idx), author: raw.slice(idx + 3) }
}
</script>

<template>
  <div class="layout-marathon" :class="{ 'is-tbd': isTBD, 'is-milestone': isMilestone }">

    <MarathonNav />

    <!-- Background photo -->
    <div class="race-bg">
      <img :src="photoUrl" class="race-bg-img" />
      <div class="race-overlay" />
    </div>

    <!-- Content -->
    <div class="race-ui" v-if="marathon">

      <!-- Top bar -->
      <div class="race-top">
        <div class="race-bib" :class="{ 'bib-milestone': isMilestone }">
          <div class="race-bib-row">
            <span class="bib-sup">MARATHON</span>
            <span class="bib-num">#{{ padded }}</span>
          </div>
          <div class="progress-label">{{ n }} / 100</div>
        </div>
      </div>

      <div class="progress-bar-track">
        <div class="progress-bar-fill" :style="{ width: (n / 100 * 100) + '%' }" />
        <div class="progress-bar-icon" :style="{ left: (n / 100 * 100) + '%' }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
          </svg>
        </div>
      </div>

      <!-- Main -->
      <div class="race-main">
        <div class="race-main-content">
          <div class="race-year-row">
            <div class="race-year" v-if="raceYear">{{ raceYear }}</div>
            <div v-if="isUltra" class="ultra-badge">ULTRA · {{ marathon.distance }}</div>
          </div>
          <h1 class="race-name">{{ raceName }}</h1>

          <div v-if="quote" class="race-quote">
            <span class="quote-mark">"</span>{{ quote.text }}<span v-if="quote.author" class="quote-author"> — {{ quote.author }}</span>
          </div>

          <div class="race-time-block" :class="{ 'time-block-tbd': isTBD }">
            <div class="race-time" :class="{ 'time-tbd': isTBD }">
              {{ marathon.time }}
            </div>
            <div class="race-time-meta" v-if="!isTBD">
              <div class="race-pace-label">pace</div>
              <div class="race-pace">{{ marathon.pace }}</div>
            </div>
            <div class="race-pace coming-soon" v-else>Coming soon</div>
          </div>

          <div v-if="isMilestone && !isTBD" class="milestone-badge">
            ★ Milestone Race
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="race-bottom">
        <div class="race-meta">
          <span class="race-date">{{ formattedDate }}</span>
          <span class="race-dot" v-if="!isTBD">·</span>
          <span class="race-location">{{ marathon.location }}</span>
        </div>
        <span v-if="photoCredit" class="photo-credit">Photo: {{ photoCredit }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="race-loading">
      <div class="loading-num">#{{ padded }}</div>
    </div>

  </div>
</template>

<style scoped>
.layout-marathon {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f7f5f2;
}

.race-bg {
  position: absolute;
  inset: 0;
}

.race-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: saturate(0.5) brightness(1.1);
}

.race-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(247, 245, 242, 0.88) 0%,
    rgba(247, 245, 242, 0.65) 35%,
    rgba(247, 245, 242, 0.38) 65%,
    rgba(247, 245, 242, 0.22) 100%
  );
}

.race-ui {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.75rem 2.5rem;
}

.race-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.race-bib {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.race-bib-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.bib-sup {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--m-orange, #f97316);
}

.bib-num {
  font-family: var(--font-mono, monospace);
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.bib-milestone .bib-num {
  color: var(--m-orange, #f97316);
}

.progress-label {
  font-family: var(--font-mono, monospace);
  font-size: 0.6rem;
  color: rgba(0, 0, 0, 0.35);
  letter-spacing: 0.06em;
  margin-top: 0.35rem;
}

.progress-bar-track {
  position: relative;
  margin-top: 0.5rem;
  height: 3px;
  background: rgba(37, 99, 235, 0.45);
  border-radius: 2px;
  flex-shrink: 0;
}

.progress-bar-fill {
  height: 100%;
  background: var(--m-orange, #e06800);
  border-radius: 2px;
  min-width: 2px;
  transition: width 0.3s ease;
}

.progress-bar-icon {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -100%);
  color: var(--m-orange, #e06800);
  pointer-events: none;
  line-height: 1;
}

.race-main {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 1.25rem;
  padding-bottom: 0.5rem;
}


.race-main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.race-year-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.25rem;
}

.ultra-badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
  background: var(--m-orange, #e06800);
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
}

.race-year {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(60, 35, 10, 0.5);
}

.race-name {
  font-size: 2.6rem;
  font-weight: 800;
  line-height: 1.05;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
  max-width: 700px;
}

.race-time-block {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 0.65rem 1.25rem;
}

.time-block-tbd {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.08);
}

.race-time {
  font-family: var(--font-mono, monospace);
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--m-orange, #e06800);
  letter-spacing: -0.02em;
}

.time-tbd {
  font-size: 2rem;
  color: rgba(0, 0, 0, 0.2);
}

.race-time-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.race-pace-label {
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.3);
}

.race-pace {
  font-family: var(--font-mono, monospace);
  font-size: 1.05rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
  letter-spacing: 0.03em;
}

.coming-soon {
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.25);
}

.milestone-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--m-orange, #e06800);
  background: rgba(224, 104, 0, 0.1);
  border: 1px solid rgba(224, 104, 0, 0.25);
  padding: 0.2rem 0.65rem;
  border-radius: 2px;
}

.race-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1rem;
}

.race-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.photo-credit {
  font-size: 0.58rem;
  color: rgba(0, 0, 0, 0.25);
  letter-spacing: 0.06em;
}

.race-date,
.race-location {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(80, 45, 10, 0.7);
  letter-spacing: 0.04em;
}

.race-dot {
  color: var(--m-orange, #f97316);
  opacity: 0.5;
}

.race-loading {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-num {
  font-family: var(--font-mono, monospace);
  font-size: 2rem;
  color: rgba(0, 0, 0, 0.15);
}

.race-quote {
  font-style: italic;
  font-size: 0.62rem;
  line-height: 1.5;
  color: rgba(60, 35, 10, 0.7);
  margin-bottom: 0.75rem;
  max-width: 680px;
}

.quote-mark {
  font-size: 1rem;
  color: var(--m-orange, #e06800);
  font-family: Georgia, serif;
  opacity: 0.8;
  margin-right: 0.1rem;
}

.quote-author {
  font-style: normal;
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--m-orange, #e06800);
  opacity: 0.85;
}
</style>
