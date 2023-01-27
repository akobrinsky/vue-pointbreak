<template>
  <div class="active-breakpoints">
    <strong>{{ breakpointTitleText }}</strong>
    <span
      v-for="breakpoint in breakpointsShown"
      :key="breakpoint"
      class="breakpoint"
    >
      {{ breakpoint }}
    </span>
  </div>
  <div class="active-breakpoints">
    <strong>Current width:</strong><span>{{ clientWidth }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePointbreak } from '@/lib'

const pointbreak = usePointbreak();
const breakpointTitleText = computed(() => (pointbreak.active ? 'Current Breakpoint: ' : 'Active Breakpoints: '));
const clientWidth = ref<null | number>(null)

const breakpointsShown = computed(() => {
  return Object.keys(pointbreak).filter((pb) => pointbreak[pb]);
});

const handleResize = (e: Event) => {
  const target = e.target as Window
  clientWidth.value = target.innerWidth
};

onMounted(() => {
  window.addEventListener('resize', handleResize)
  clientWidth.value = window.innerWidth
});

</script>
<style scoped>
.breakpoint {
  margin-right: 4px;
  color: #732a73;
}
.active-breakpoints {
  font-size: 1.5em;
  margin-bottom: 0.5em;
}
</style>
