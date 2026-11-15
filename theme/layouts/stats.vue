<script setup lang="ts">
const base = import.meta.env.BASE_URL
</script>

<template>
  <div class="layout-stats">
    <MarathonNav />

    <div class="stats-bg">
      <img :src="`${base}marathon/img/marathon.jpg`" class="stats-bg-img" />
      <div class="stats-overlay" />
    </div>
    <div class="stats-ui">
      <div class="stats-eyebrow">
        <span class="eyebrow-line" />By the Numbers
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.layout-stats {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f7f5f2;
}

.stats-bg {
  position: absolute;
  inset: 0;
}

.stats-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.1) brightness(1.2);
  opacity: 0.1;
}

.stats-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(247, 245, 242, 0.88) 0%, rgba(247, 245, 242, 0.62) 50%, rgba(247, 245, 242, 0.32) 100%);
}

.stats-ui {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.65rem;
  font-weight: 600;
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
</style>
