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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePointbreak } from '../pointbreak';

const pointbreak = usePointbreak();
const breakpointTitleText = computed(() => (pointbreak.active ? 'Current Breakpoint: ' : 'Active Breakpoints: '));

const breakpointsShown = computed(() => {
  if (pointbreak.active) return [pointbreak.active];
  return Object.keys(pointbreak).filter((pb) => pointbreak[pb]);
});

</script>
<style scoped>
.breakpoint {
  margin-right: 4px;
  color: #732a73;
}
.active-breakpoints {
  font-size: 1.5em;
}
</style>
