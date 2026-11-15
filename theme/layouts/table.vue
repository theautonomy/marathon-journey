<script setup lang="ts">
import { RACE_COUNT, RACES_PER_TABLE_PAGE } from '../races'
const base = import.meta.env.BASE_URL
defineProps<{ page: number }>()
</script>

<template>
  <div class="layout-table">
    <MarathonNav />

    <div class="tbl-bg">
      <img :src="`${base}marathon/img/marathon.jpg`" class="tbl-bg-img" />
      <div class="tbl-overlay" />
    </div>

    <div class="tbl-ui">
      <div class="tbl-header">
        <div class="tbl-eyebrow">
          <span class="eyebrow-line" />Race Log
        </div>
        <div class="tbl-page">
          {{ (page - 1) * RACES_PER_TABLE_PAGE + 1 }}–{{ Math.min(page * RACES_PER_TABLE_PAGE, RACE_COUNT) }} of {{ RACE_COUNT }}
        </div>
      </div>

      <MarathonTable :page="page" />
    </div>
  </div>
</template>

<style scoped>
.layout-table {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f7f5f2;
}

.tbl-bg {
  position: absolute;
  inset: 0;
}

.tbl-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.1) brightness(1.2);
  opacity: 0.1;
}

.tbl-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(247, 245, 242, 0.88) 0%, rgba(247, 245, 242, 0.62) 50%, rgba(247, 245, 242, 0.32) 100%);
}

.tbl-ui {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  padding: 1.75rem 2.5rem;
}

.tbl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.tbl-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #e06800;
}

.eyebrow-line {
  display: inline-block;
  width: 1.5rem;
  height: 2px;
  background: #e06800;
  border-radius: 1px;
}

.tbl-page {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(0, 0, 0, 0.3);
  letter-spacing: 0.08em;
}
</style>
