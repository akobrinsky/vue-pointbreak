# pointbreak
![pointbreak](https://shmaryeh.s3.amazonaws.com/opensource/pointbreak.png)
A simple plugin for Vue 3 that uses [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) for when css media queries won't give you enough. 

## Registering the plugin: 

```js
import { createApp } from 'vue';
import pointbreak from 'pointbreak';
import App from './App.vue';

createApp(App).use(pointbreak).mount('#app');
```

## Consuming pointbreak in children components
```js
<script setup lang="ts">
import { usePointbreak } from 'pointbreak';

const pointbreak = usePointbreak();
</script>
```

## inclusive = true
By default, the plugin uses

```js
config.inclusive = true
```

Inclusive means that pointbreak will keep track of all active breakpoints (matches = true on the MediaQueryListEvent). This is intended for true mobile-first approaches. 

For instance, using the lookup with the following breakpoints: 
```js
const TAILWIND_BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};
```

`pointbreak.xs` will return true for all breakpoints

`pointbreak.md` will only return true for breakpoints >= 768

## inclusive = false
When you opt in for `!inclusive`, the plugin creates specific breakpoints with min and max values. 
```json
{
  "xs": "(min-width: 0px) and (max-width: 639px)",
  "sm": "(min-width: 640px) and (max-width: 767px)",
  "md": "(min-width: 768px) and (max-width: 1023px)",
  "lg": "(min-width: 1024px) and (max-width: 1279px)",
  "xl": "(min-width: 1280px) and (max-width: 1535px)",
  "xxl": "(min-width: 1536px)"
}
```

pointbreak in `!inclusive` mode, will also have an `active` property with the current breakpoint as the value.

For instance if the viewport is `769`, `pointbreak.active` will be `md`

If it is `767` it will be `sm`

## Project Setup

```sh
npm install
```

### Run example app

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test
```
