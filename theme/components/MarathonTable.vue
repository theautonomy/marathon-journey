<script setup lang="ts">
import { racesOnPage } from '../races'
import { computed } from 'vue'

const props = defineProps<{ page: number }>()

interface Row {
  id: number
  name: string
  date: string
  location: string
  time: string
  pace: string
}

const rows = computed<Row[]>(() => racesOnPage(Number(props.page)))

function fmt(d: string) {
  if (!d || d === 'TBD') return '—'
  const [m, day, y] = d.split('/')
  try {
    return new Date(+y, +m - 1, +day).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  } catch { return d }
}

function raceName(name: string) {
  return name.replace(/^\d{4}\s*/, '')
}
</script>

<template>
  <div class="mt-root" v-if="rows.length">
    <table class="mt-table">
      <thead>
        <tr>
          <th class="col-num">#</th>
          <th class="col-name">Race</th>
          <th class="col-date">Date</th>
          <th class="col-loc">Location</th>
          <th class="col-time">Time</th>
          <th class="col-pace">Pace</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.id" :class="{ 'row-tbd': r.time === 'TBD' }">
          <td class="col-num">{{ String(r.id).padStart(3, '0') }}</td>
          <td class="col-name">{{ raceName(r.name) }}</td>
          <td class="col-date">{{ fmt(r.date) }}</td>
          <td class="col-loc">{{ r.location }}</td>
          <td class="col-time mono">{{ r.time }}</td>
          <td class="col-pace mono">{{ r.pace }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="mt-loading">Loading…</div>
</template>

<style scoped>
.mt-root {
  flex: 1;
  overflow: hidden;
}

.mt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}

thead tr {
  border-bottom: 1px solid #e06800;
}

th {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #e06800;
  padding: 0 0.75rem 0.5rem;
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: background 0.15s;
}

tbody tr:hover {
  background: rgba(0, 0, 0, 0.03);
}

tbody tr.row-tbd td {
  color: rgba(0, 0, 0, 0.2);
}

td {
  padding: 0.48rem 0.75rem;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-num {
  font-family: 'JetBrains Mono', monospace;
  color: rgba(0, 0, 0, 0.25) !important;
  width: 3rem;
}

.col-name { max-width: 260px; }
.col-date { width: 9rem; }
.col-loc  { width: 10rem; }

.col-time {
  font-family: 'JetBrains Mono', monospace;
  color: #e06800 !important;
  width: 6rem;
}

.col-time.mono.row-tbd,
.row-tbd .col-time {
  color: rgba(0, 0, 0, 0.2) !important;
}

.col-pace {
  font-family: 'JetBrains Mono', monospace;
  color: rgba(0, 0, 0, 0.35) !important;
  width: 7rem;
}

.mono { font-family: 'JetBrains Mono', monospace; }

.mt-loading {
  color: rgba(0,0,0,0.25);
  font-size: 0.85rem;
}
</style>
