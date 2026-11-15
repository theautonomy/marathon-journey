<script setup lang="ts">
import { RACE_COUNT } from '../races'

const base = import.meta.env.BASE_URL

defineProps<{
  image?: string
  subtitle?: string
  author?: string
}>()
</script>

<template>
  <div class="layout-cover">
    <MarathonNav />

    <div class="cover-bg">
      <img :src="image || `${base}marathon/img/marathon.jpg`" class="cover-img" />
      <div class="cover-overlay" />
    </div>

    <div class="cover-ui">
      <div class="cover-eyebrow">
        <span class="eyebrow-line" />
        <span>Marathon Journey</span>
      </div>

      <div class="cover-body">
        <slot />
      </div>

      <div class="cover-footer">
        <span v-if="author" class="cover-author">{{ author }}</span>
        <div class="cover-badge">
          <span class="badge-number">{{ RACE_COUNT }}</span>
          <span class="badge-label">Marathons</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-cover {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f7f5f2;
}

.cover-bg {
  position: absolute;
  inset: 0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  filter: saturate(0.1) brightness(1.2);
  opacity: 0.1;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(247, 245, 242, 0.88) 0%,
    rgba(247, 245, 242, 0.60) 40%,
    rgba(247, 245, 242, 0.28) 100%
  );
}

.cover-ui {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem 3rem;
}

.cover-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--m-orange, #e06800);
}

.eyebrow-line {
  display: inline-block;
  width: 2rem;
  height: 2px;
  background: var(--m-orange, #f97316);
  border-radius: 1px;
}

.cover-body :deep(h1) {
  font-size: 4.2rem;
  font-weight: 800;
  line-height: 1.0;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
}

.cover-body :deep(h2) {
  font-size: 1.4rem;
  font-weight: 300;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  letter-spacing: 0.02em;
}

.cover-body :deep(p) {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.4);
  margin-top: 1rem;
  letter-spacing: 0.04em;
}

.cover-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.cover-author {
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.4);
}

.cover-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1;
}

.badge-number {
  font-family: var(--font-mono, monospace);
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--m-orange, #e06800);
  line-height: 1;
}

.badge-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
  margin-top: 0.1rem;
}
</style>
