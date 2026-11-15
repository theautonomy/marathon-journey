<script setup lang="ts">
import { RACES } from '../races'
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useNav } from '@slidev/client'

const { go, slides, currentSlideRoute } = useNav()
const open = ref(false)
const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const root = ref<HTMLElement | null>(null)

function onDocClick(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node))
    open.value = false
}

watch(open, (val) => {
  if (val) document.addEventListener('click', onDocClick)
  else document.removeEventListener('click', onDocClick)
})

onBeforeUnmount(() => document.removeEventListener('click', onDocClick))

// Race slides are found by their frontmatter, so their position in the deck doesn't matter.
function raceOf(route: { meta?: any }): number | null {
  const fm = route.meta?.slide?.frontmatter
  return fm?.layout === 'marathon' ? Number(fm.n) : null
}

const currentRace = computed(() => raceOf(currentSlideRoute.value))

function fmtDate(d: string): string {
  if (!d || d === 'TBD') return '—'
  const [m, day, y] = d.split('/')
  try {
    return new Date(+y, +m - 1, +day).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return d }
}
const races = RACES

watch(open, async (val) => {
  if (val) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    query.value = ''
  }
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return races.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.location.toLowerCase().includes(q)
  )
})

const isSearching = computed(() => query.value.trim().length > 0)

function raceName(name: string) {
  return name.replace(/^\d{4}\s*/, '')
}

function goToRace(n: number) {
  const route = slides.value.find(s => raceOf(s) === n)
  if (route) go(route.no)
  open.value = false
  nextTick(() => (document.activeElement as HTMLElement)?.blur())
}

function isFinished(n: number): boolean {
  const race = races.find(r => r.id === n)
  if (!race || !race.date || race.date === 'TBD') return false
  const [m, day, y] = race.date.split('/')
  return new Date(+y, +m - 1, +day) < new Date()
}
</script>

<template>
  <div class="mnav" ref="root">
    <button class="mnav-toggle" :class="{ 'is-open': open }" @click="open = !open" title="Race navigator">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="0" y="1" width="14" height="1.8" rx="0.9" fill="currentColor"/>
        <rect x="0" y="6.1" width="14" height="1.8" rx="0.9" fill="currentColor"/>
        <rect x="0" y="11.2" width="14" height="1.8" rx="0.9" fill="currentColor"/>
      </svg>
    </button>

    <Transition name="mnav-fade">
      <div v-if="open" class="mnav-panel">

        <!-- Search input -->
        <div class="mnav-search-wrap">
          <svg class="mnav-search-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.2"/>
            <line x1="7.8" y1="7.8" x2="10.5" y2="10.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
          <input
            ref="searchInput"
            v-model="query"
            class="mnav-search"
            placeholder="Search races…"
            autocomplete="off"
          />
          <button v-if="query" class="mnav-clear" @click="query = ''">✕</button>
        </div>

        <!-- Search results -->
        <template v-if="isSearching">
          <div v-if="filtered.length === 0" class="mnav-empty">No matches</div>
          <div v-else class="mnav-results">
            <button
              v-for="r in filtered"
              :key="r.id"
              class="mnav-result"
              :class="{ 'is-current': currentRace === r.id }"
              @click="goToRace(r.id)"
            >
              <span class="mnav-result-num">#{{ String(r.id).padStart(3, '0') }}</span>
              <span class="mnav-result-info">
                <span class="mnav-result-name">{{ raceName(r.name) }}</span>
                <span class="mnav-result-loc">{{ r.location }}</span>
              </span>
              <span class="mnav-result-time" :class="{ 'is-tbd': r.date === 'TBD' }">{{ fmtDate(r.date) }}</span>
            </button>
          </div>
        </template>

        <!-- Number grid -->
        <template v-else>
          <div class="mnav-header">Jump to Race</div>
          <div class="mnav-grid">
            <button
              v-for="n in races.map(r => r.id)"
              :key="n"
              class="mnav-cell"
              :class="{ 'is-current': currentRace === n, 'is-finished': isFinished(n) }"
              @click="goToRace(n)"
            >{{ n }}</button>
          </div>
        </template>

      </div>
    </Transition>
  </div>
</template>

<style scoped>
.mnav {
  position: absolute;
  top: 1.5rem;
  right: 1.75rem;
  z-index: 50;
}

.mnav-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.75);
  color: rgba(0, 0, 0, 0.55);
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.mnav-toggle:hover,
.mnav-toggle.is-open {
  background: #e06800;
  border-color: #e06800;
  color: #fff;
}

.mnav-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  padding: 0.5rem;
  backdrop-filter: blur(8px);
  width: fit-content;
  min-width: 16rem;
}

/* Search */
.mnav-search-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 0.35rem 0.6rem;
  margin-bottom: 0.6rem;
}

.mnav-search-icon {
  color: rgba(0, 0, 0, 0.35);
  flex-shrink: 0;
}

.mnav-search {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.72rem;
  color: #1a1a1a;
  outline: none;
  font-family: inherit;
}

.mnav-search::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

.mnav-clear {
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  font-size: 0.65rem;
  padding: 0;
  line-height: 1;
}

.mnav-clear:hover { color: rgba(0, 0, 0, 0.6); }

/* Results */
.mnav-results {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 16rem;
  overflow-y: auto;
}

.mnav-result {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.45rem 0.5rem;
  border-radius: 5px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background 0.1s;
}

.mnav-result:hover { background: rgba(224, 104, 0, 0.08); }

.mnav-result.is-current { background: rgba(224, 104, 0, 0.12); }

.mnav-result-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  color: #e06800;
  font-weight: 700;
  flex-shrink: 0;
}

.mnav-result-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.mnav-result-name {
  font-size: 0.7rem;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mnav-result-loc {
  font-size: 0.62rem;
  color: rgba(0, 0, 0, 0.4);
}

.mnav-result-time {
  font-size: 0.62rem;
  color: rgba(0, 0, 0, 0.38);
  flex-shrink: 0;
  margin-left: auto;
  white-space: nowrap;
}

.mnav-result-time.is-tbd {
  color: rgba(0, 0, 0, 0.2);
}

.mnav-empty {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.35);
  padding: 0.5rem 0.25rem;
}

/* Number grid */
.mnav-header {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
  margin-bottom: 0.5rem;
}

.mnav-grid {
  display: grid;
  grid-template-columns: repeat(10, 1.5rem);
  gap: 2px;
}

.mnav-cell {
  height: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.52rem;
  font-weight: 500;
  border-radius: 3px;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.55);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.mnav-cell:hover {
  background: #bfdbfe;
  color: #1e40af;
}

.mnav-cell.is-finished {
  background: rgba(224, 104, 0, 0.13);
  color: #c05500;
}

.mnav-cell.is-finished:hover {
  background: #bfdbfe;
  color: #1e40af;
}

.mnav-cell.is-current {
  background: #e06800;
  color: #fff;
  font-weight: 700;
}

.mnav-fade-enter-active,
.mnav-fade-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.mnav-fade-enter-from,
.mnav-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
