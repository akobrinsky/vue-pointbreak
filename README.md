# vue-pointbreak
![pointbreak](https://shmaryeh.s3.amazonaws.com/opensource/pointbreak.png)
A simple plugin for Vue 3 that uses [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) for when css media queries won't give you enough. Named after one of Keanu Reeves' finest films, [Pointbreak](https://www.imdb.com/title/tt0102685/) 

### Install plugin
```sh
npm install vue-pointbreak
```
## Registering the plugin: 

```js
import { createApp } from 'vue';
import pointbreak from 'vue-pointbreak';
import App from './App.vue';

createApp(App).use(pointbreak).mount('#app');
```

## Consuming pointbreak in children components
Composition API:  
```js
<script setup lang="ts">
import { usePointbreak } from 'vue-pointbreak';

const pointbreak = usePointbreak();
</script>
```

Options API: 
```js
inject: ['pointbreak']
```
## Config
```ts
app.use(pointbreak, config: {
  inclusive: Boolean,
  breakpoints: BreakpointObject
})
```
By default, the plugin uses

```js
// Default config
const config = {
  inclusive: true,
  breakpoints: TAILWIND_BREAKPOINTS
}
// const TAILWIND_BREAKPOINTS = {
//   xs: 0,
//   sm: 640,
//   md: 768,
//   lg: 1024,
//   xl: 1280,
//   xxl: 1536,
// };
```
### inclusive 
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

### inclusive = false
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

pointbreak in `!inclusive` mode, will create a lookup with the current breakpoint as `true`, the rest of the breakpoints will be `false`

For instance if the viewport is `769`, `pointbreak.md` will be `true`, and at `767` it will be `sm`
```js
pointbreak = {
  xs: false,
  sm: false,
  md: true,
  lg: false,
  xl: false,
  xxl: false
}
```
